(ns limelight-yardstick.db
  (:require [next.jdbc :as jdbc]
            [next.jdbc.sql :as sql]
            [cheshire.core]
            [clojure.tools.logging :as log]
            [clojure.string :as str]))

;; Database connection pool
(def db-config
  {:dbtype "postgresql"
   :dbname (or (System/getenv "DATABASE_NAME") "limelight")
   :host (or (System/getenv "DATABASE_HOST") "localhost")
   :port (Integer/parseInt (or (System/getenv "DATABASE_PORT") "5432"))
   :user (or (System/getenv "DATABASE_USER") "postgres")
   :password (System/getenv "DATABASE_PASSWORD")
   :maximumPoolSize (Integer/parseInt (or (System/getenv "DB_POOL_SIZE") "10"))})

(def ds (delay (jdbc/get-datasource db-config)))

;; Load SQL queries from file
(defn- load-queries []
  (try
    (let [sql-content (slurp (clojure.java.io/resource "sql/queries.sql"))
          lines (str/split sql-content #"\n")
          grouped (reduce (fn [acc line]
                            (if (str/starts-with? line "--")
                              (conj acc {:label (str/trim (subs line 2)) :query ""})
                              (if (empty? acc)
                                acc
                                (let [last-idx (dec (count acc))]
                                  (assoc-in acc [last-idx :query] 
                                    (str (get-in acc [last-idx :query]) "\n" line))))))
                          []
                          lines)]
      (into {} (map (fn [{:keys [label query]}] [(keyword label) (str/trim query)]) grouped)))
    (catch Exception e
      (log/error "Failed to load SQL queries:" (.getMessage e))
      {})))

(defonce queries (load-queries))

;; Initialize database tables
(defn init-db! []
  (try
    ;; Users table (auth)
    (jdbc/execute! @ds [(queries :init-users-table)])
    
    ;; Sessions table (auth)
    (jdbc/execute! @ds [(queries :init-sessions-table)])
    
    ;; User preferences (profile customization and privacy)
    (jdbc/execute! @ds [(queries :init-user-preferences-table)])
    
    ;; Ratings (user ratings for movies with taxonomic data)
    (jdbc/execute! @ds [(queries :init-ratings-table)])
    
    ;; Vocabulary (global, fixed 16 terms across 4 categories × 4 levels)
    (jdbc/execute! @ds [(queries :init-vocabulary-table)])
    
    ;; Seed vocabulary (only if empty)
    (let [count (-> (jdbc/execute-one! @ds [(queries :count-vocabulary)])
                    :cnt)]
      (when (zero? count)
        (jdbc/execute! @ds [(queries :seed-vocabulary)])))
    
    ;; Rating terms (junction table: which vocabulary terms selected for each rating)
    ;; Only one term per category per rating
    (jdbc/execute! @ds [(queries :init-rating-terms-table)])
    (log/info "Database tables initialized successfully")
    true
    (catch Exception e
      (log/error "Failed to initialize database:" (.getMessage e))
      false)))

;; Vocabulary lookup
(defn get-vocabulary []
  (try
    (sql/query @ds [(queries :get-vocabulary)])
    (catch Exception e
      (log/error "Failed to get vocabulary:" (.getMessage e))
      [])))

;; User operations
(defn upsert-user! [google-profile]
  (try
    (let [{:keys [sub email name picture]} google-profile]
      (if-let [existing (sql/query @ds [(queries :upsert-user-check-existing) sub])]
        (do
          (jdbc/execute! @ds [(queries :upsert-user-update) name picture (java.time.Instant/now) sub])
          (:id (first existing)))
        (do
          (sql/insert! @ds :users {:google_id sub :email email :name name :profile_picture picture})
          (:id (first (sql/query @ds [(queries :upsert-user-check-existing) sub]))))))
    (catch Exception e
      (log/error "Failed to upsert user:" (.getMessage e))
      nil)))

(defn get-user-by-id [user-id]
  (try
    (first (sql/query @ds [(queries :get-user-by-id) user-id]))
    (catch Exception e
      (log/error "Failed to get user:" (.getMessage e))
      nil)))

;; User preferences operations
(defn get-or-create-preferences! [user-id]
  (try
    (if-let [existing (first (sql/query @ds [(queries :get-preferences-existing) user-id]))]
      existing
      (do
        (jdbc/execute! @ds [(queries :create-preferences) user-id nil false])
        (first (sql/query @ds [(queries :get-preferences-existing) user-id]))))
    (catch Exception e
      (log/error "Failed to get or create preferences:" (.getMessage e))
      nil)))

(defn update-preferences! [user-id preferences]
  (try
    (jdbc/execute! @ds [(queries :update-preferences) 
                       (:custom_username preferences) 
                       (:is_profile_public preferences)
                       (java.time.Instant/now)
                       user-id])
    (first (sql/query @ds [(queries :get-preferences-existing) user-id]))
    (catch Exception e
      (log/error "Failed to update preferences:" (.getMessage e))
      nil)))

;; Ratings operations
(defn save-rating! [user-id movie-id term-ids]
  (try
    ;; Get or create rating
    (let [rating (first (sql/query @ds [(queries :get-rating-by-id) user-id movie-id]))
          rating-id (if rating
                     (:id rating)
                     (do
                       (jdbc/execute! @ds [(queries :create-rating) user-id movie-id])
                       (:id (first (sql/query @ds [(queries :get-rating-by-id) user-id movie-id])))))]
      ;; Delete old terms for this rating
      (jdbc/execute! @ds [(queries :delete-rating-terms) rating-id])
      ;; Insert new terms (get category from vocabulary)
      (doseq [[idx term-id] (map-indexed vector term-ids)]
        (let [{:keys [category]} (first (sql/query @ds [(queries :get-vocabulary-for-term) term-id]))]
          (jdbc/execute! @ds [(queries :insert-rating-term) rating-id term-id category idx])))
      rating-id)
    (catch Exception e
      (log/error "Failed to save rating:" (.getMessage e))
      nil)))

(defn get-user-ratings [user-id]
  (try
    (let [ratings (sql/query @ds [(queries :get-user-ratings) user-id])]
      (map (fn [rating]
             (let [terms (sql/query @ds [(queries :get-rating-terms) (:id rating)])]
               (assoc rating :terms terms)))
           ratings))
    (catch Exception e
      (log/error "Failed to get user ratings:" (.getMessage e))
      [])))

(defn get-movie-ratings [movie-id]
  (try
    (let [ratings (sql/query @ds [(queries :get-movie-ratings) movie-id])]
      (map (fn [rating]
             (let [terms (sql/query @ds [(queries :get-movie-rating-terms) (:user_id rating) movie-id])]
               (assoc rating :terms terms)))
           ratings))
    (catch Exception e
      (log/error "Failed to get movie ratings:" (.getMessage e))
      [])))

(defn get-public-user-by-username [username]
  (try
    (first (sql/query @ds [(queries :get-public-user-by-username) username]))
    (catch Exception e
      (log/error "Failed to get public user:" (.getMessage e))
      nil)))

(defn get-public-users []
  (try
    (sql/query @ds [(queries :get-public-users)])
    (catch Exception e
      (log/error "Failed to get public users:" (.getMessage e))
      [])))
