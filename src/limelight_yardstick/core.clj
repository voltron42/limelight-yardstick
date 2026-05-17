(ns limelight-yardstick.core
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.defaults :refer [wrap-defaults site-defaults]]
            [ring.middleware.json :refer [wrap-json-response wrap-json-body]]
            [ring.util.response :refer [response redirect status]]
            [ring.middleware.resource :refer [wrap-resource]]
            [compojure.core :refer [defroutes GET POST PUT routes]]
            [compojure.route :as route]
            [limelight-yardstick.auth :as auth]
            [limelight-yardstick.db :as db]
            [limelight-yardstick.movie-service :as movie-service]
            [clojure.tools.logging :as log])
  (:gen-class))

;; Callback for auth module - handles user persistence
(defn on-user-authenticated [user-data]
  (db/upsert-user! user-data))

;; Routes for public endpoints
(defroutes public-routes
  (GET "/" [] (redirect "/index.html"))
  (GET "/api/health" [] (response {:status "ok"}))
  (GET "/auth/google" [] auth/google-login)
  (GET "/auth/google/callback" {params :params} 
       (auth/google-callback on-user-authenticated params)))

;; Routes for search (public endpoints)
(defroutes search-routes
  (GET "/api/vocabulary" [] 
       (let [vocab (db/get-vocabulary)]
         (response {:vocabulary vocab})))
  
  (GET "/api/search/movies" [q]
       (if q
         (let [results (movie-service/search-movies q)]
           (response results))
         (status (response {:error "Query parameter 'q' required"}) 400)))
  
  (GET "/api/search/people" [q]
       (if q
         (let [results (movie-service/search-people q)]
           (response results))
         (status (response {:error "Query parameter 'q' required"}) 400)))
  
  (GET "/api/movies/:id" [id]
       (try
         (let [movie-id (Integer/parseInt id)
               data (movie-service/get-movie-data movie-id)]
           (if (:error data)
             (status (response data) 404)
             (response data)))
         (catch NumberFormatException _
           (status (response {:error "Invalid movie ID"}) 400))))
  
  (GET "/api/people/:id" [id]
       (try
         (let [person-id (Integer/parseInt id)
               data (movie-service/get-person-data person-id)]
           (if (:error data)
             (status (response data) 404)
             (response data)))
         (catch NumberFormatException _
           (status (response {:error "Invalid person ID"}) 400)))))

;; Routes for authenticated endpoints
(defroutes protected-routes
  ;; User profile
  (GET "/api/user" req 
       (let [user (:user req)
             preferences (db/get-or-create-preferences! (:id user))]
         (response {:user (select-keys user [:id :email])
                    :preferences preferences})))
  
  ;; User preferences
  (GET "/api/user/preferences" req
       (let [user-id (-> req :user :id)
             preferences (db/get-or-create-preferences! user-id)]
         (response preferences)))
  
  (PUT "/api/user/preferences" req
       (let [user-id (-> req :user :id)
             body (:body req)
             updated (db/update-preferences! user-id body)]
         (if updated
           (response updated)
           (status (response {:error "Failed to update preferences"}) 500))))
  
  ;; User ratings
  (GET "/api/user/ratings" req
       (let [user-id (-> req :user :id)
             ratings (db/get-user-ratings user-id)]
         (response {:ratings ratings})))
  
  ;; Save a rating (with term IDs)
  (POST "/api/ratings" req
        (let [user-id (-> req :user :id)
              body (:body req)
              {:keys [movie_id term_ids]} body]
          (if (and movie_id term_ids (seq term_ids))
            (let [rating-id (db/save-rating! user-id movie_id term_ids)]
              (if rating-id
                (response {:id rating-id :status "saved"})
                (status (response {:error "Failed to save rating"}) 500)))
            (status (response {:error "Missing required fields: movie_id, term_ids (array)"}) 400)))))

;; Public user routes
(defroutes public-user-routes
  ;; Get public user profile by username
  (GET "/api/users/:username" [username]
       (let [user (db/get-public-user-by-username username)]
         (if user
           (let [ratings (db/get-user-ratings (:id user))]
             (response {:user user :ratings ratings}))
           (status (response {:error "User not found"}) 404))))
  
  ;; Get list of public users
  (GET "/api/users" []
       (let [users (db/get-public-users)]
         (response {:users users})))
  
  ;; Get ratings for a specific movie
  (GET "/api/ratings/:movie-id" [movie-id]
       (try
         (let [movie-id-int (Integer/parseInt movie-id)
               ratings (db/get-movie-ratings movie-id-int)]
           (response {:movie_id movie-id-int :ratings ratings}))
         (catch NumberFormatException _
           (status (response {:error "Invalid movie ID"}) 400)))))

;; Combine routes with protected middleware
(def app-routes
  (routes
    public-routes
    search-routes
    public-user-routes
    (auth/wrap-authenticated protected-routes db/get-user-by-id)
    (route/not-found (status (response {:error "Not found"}) 404))))

;; Middleware stack (order matters!)
(def app
  (-> app-routes
      (wrap-json-body {:keywords? true})
      wrap-json-response
      (wrap-resource "public")
      (wrap-defaults site-defaults)))

;; Main entry point
(defn -main
  [& args]
  (db/init-db!)
  (let [port (Integer/parseInt (or (System/getenv "PORT") "8080"))]
    (log/info (str "Starting Limelight Yardstick on 0.0.0.0:" port))
    (jetty/run-jetty app {:host "0.0.0.0" :port port :join? false})))
