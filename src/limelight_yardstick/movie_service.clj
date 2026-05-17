(ns limelight-yardstick.movie-service
  (:require [limelight-yardstick.tmdb-client :as client]))

;; =============================================================================
;; Search Functions
;; =============================================================================

(defn search-movies
  "Search for movies by title and return simplified results
   
   Returns: Map with :results (list of basic movie info) or :error"
  [query]
  (let [response (client/search-movie query)]
    (if (:error response)
      response
      {:results (map #(select-keys % [:id :title :release_date :poster_path :overview])
                     (get-in response [:body :results]))})))

(defn search-people
  "Search for people by name and return simplified results
   
   Returns: Map with :results (list of basic person info) or :error"
  [query]
  (let [response (client/search-person query)]
    (if (:error response)
      response
      {:results (map #(select-keys % [:id :name :profile_path])
                     (get-in response [:body :results]))})))

;; =============================================================================
;; Helper Functions for Credits Structuring
;; =============================================================================

(defn- combine-person-roles
  "Combine cast and crew roles for a single person
   
   Returns: {:name, :roles} where roles is a list of role descriptions"
  [person-id cast-entries crew-entries]
  (let [cast-roles (map #(str "\"" (:character %) "\"" " (cast)")
                        (filter #(= (:id %) person-id) cast-entries))
        crew-roles (map #(str (:job %) " (" (:department %) ")")
                        (filter #(= (:id %) person-id) crew-entries))
        all-roles (concat cast-roles crew-roles)
        person-name (or (-> (first (filter #(= (:id %) person-id) cast-entries)) :name)
                        (-> (first (filter #(= (:id %) person-id) crew-entries)) :name))]
    (when person-name
      {:name person-name
       :roles all-roles})))

(defn- restructure-movie-credits
  "Restructure movie credits by person with all their roles
   
   Returns: List of {:name :roles} maps grouped by person"
  [cast crew]
  (let [all-person-ids (distinct (concat (map :id cast) (map :id crew)))
        people-with-roles (map #(combine-person-roles % cast crew) all-person-ids)]
    (filter some? people-with-roles)))

(defn- combine-movie-roles
  "Combine cast and crew roles for a single movie
   
   Returns: {:title :year :roles} where roles is a list of role descriptions"
  [movie-id cast-entries crew-entries]
  (let [cast-roles (map #(str "\"" (:character %) "\"" " (cast)")
                        (filter #(= (:id %) movie-id) cast-entries))
        crew-roles (map #(str (:job %) " (" (:department %) ")")
                        (filter #(= (:id %) movie-id) crew-entries))
        all-roles (concat cast-roles crew-roles)
        movie-info (or (first (filter #(= (:id %) movie-id) cast-entries))
                       (first (filter #(= (:id %) movie-id) crew-entries)))]
    (when movie-info
      {:title (:title movie-info)
       :year (subs (or (:release_date movie-info) "0000") 0 4)
       :roles all-roles})))

(defn- restructure-person-credits
  "Restructure person credits by movie with all their roles
   
   Returns: List of {:title :year :roles} maps grouped by movie"
  [cast crew]
  (let [all-movie-ids (distinct (concat (map :id cast) (map :id crew)))
        movies-with-roles (map #(combine-movie-roles % cast crew) all-movie-ids)]
    (filter some? movies-with-roles)))

;; =============================================================================
;; Movie Service Functions
;; =============================================================================

(defn get-movie-data
  "Get all required movie data
   
   Returns: Map with extracted fields:
   - :title, :year, :synopsis, :genres, :studio, :poster_path
   - :credits (list of {:name :roles} grouped by person)
   - :images (list of poster paths)"
  [movie-id]
  (let [details (client/get-movie movie-id)
        images (client/get-movie-images movie-id)
        credits (client/get-movie-credits movie-id)]
    (if (or (:error details) (:error images) (:error credits))
      {:error "Failed to retrieve movie data"}
      (let [movie-body (:body details)
            images-body (:body images)
            credits-body (:body credits)]
        {:title (:title movie-body)
         :year (subs (:release_date movie-body "") 0 4)
         :synopsis (:overview movie-body)
         :genres (map :name (:genres movie-body))
         :studio (-> (:production_companies movie-body) first :name)
         :poster_path (:poster_path movie-body)
         :credits (restructure-movie-credits (:cast credits-body) (:crew credits-body))
         :images (map :file_path (:posters images-body))}))))

(defn get-movie-by-search
  "Search for a movie and return the first result with full data
   
   Returns: Full movie data or :error"
  [query]
  (let [search-response (client/search-movie query)
        first-result (-> search-response :body :results first)]
    (if (or (:error search-response) (nil? first-result))
      {:error "Movie not found"}
      (get-movie-data (:id first-result)))))

;; =============================================================================
;; Person Service Functions
;; =============================================================================

(defn get-person-data
  "Get all required person data
   
   Returns: Map with extracted fields:
   - :name, :date_of_birth, :biography, :profile_path
   - :images (list of profile image paths)
   - :credits (list of {:title :year :roles} grouped by movie)"
  [person-id]
  (let [details (client/get-person person-id)
        images (client/get-person-images person-id)
        credits (client/get-person-movie-credits person-id)]
    (if (or (:error details) (:error images) (:error credits))
      {:error "Failed to retrieve person data"}
      (let [person-body (:body details)
            images-body (:body images)
            credits-body (:body credits)]
        {:name (:name person-body)
         :date_of_birth (:birthday person-body)
         :biography (:biography person-body)
         :profile_path (:profile_path person-body)
         :images (map :file_path (:profiles images-body))
         :credits (restructure-person-credits (:cast credits-body) (:crew credits-body))}))))

(defn get-person-by-search
  "Search for a person and return the first result with full data
   
   Returns: Full person data or :error"
  [query]
  (let [search-response (client/search-person query)
        first-result (-> search-response :body :results first)]
    (if (or (:error search-response) (nil? first-result))
      {:error "Person not found"}
      (get-person-data (:id first-result)))))


