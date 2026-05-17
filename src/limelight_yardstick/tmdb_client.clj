(ns limelight-yardstick.tmdb-client
  (:require [clj-http.client :as http]
            [clojure.data.json :as json]))

;; =============================================================================
;; Configuration & Base API Functions
;; =============================================================================

(def ^:private BASE_URL "https://api.themoviedb.org/3")
(def ^:private API_KEY (System/getenv "TMDB_API_KEY"))
(def ^:private READ_ACCESS_TOKEN (System/getenv "TMDB_READ_ACCESS_TOKEN"))

(defn credentials-available?
  "Returns true if both API_KEY and READ_ACCESS_TOKEN are set"
  []
  (and API_KEY READ_ACCESS_TOKEN))

(defn request-v3
  "Make a v3 API request using the API key"
  [endpoint & {:keys [query-params method] :or {method :get query-params {}}}]
  (try
    (if-not API_KEY
      {:error "TMDB_API_KEY environment variable not set"}
      (let [params (assoc query-params :api_key API_KEY)
            url (str BASE_URL endpoint)
            response (http/request (merge {:method method
                                           :url url
                                           :query-params params
                                           :as :json}
                                          (when (= method :post)
                                            {:form-params params})))]
        response))
    (catch Exception e
      {:error (str "Request failed: " (.getMessage e))})))

(defn request-v4
  "Make a v4 API request using the Bearer token"
  [endpoint & {:keys [query-params method body] :or {method :get query-params {}}}]
  (try
    (if-not READ_ACCESS_TOKEN
      {:error "TMDB_READ_ACCESS_TOKEN environment variable not set"}
      (let [url (str BASE_URL endpoint)
            headers {"Authorization" (str "Bearer " READ_ACCESS_TOKEN)
                     "Content-Type" "application/json;charset=utf-8"}
            response (http/request {:method method
                                    :url url
                                    :query-params query-params
                                    :headers headers
                                    :body (when body (json/write-str body))
                                    :as :json})]
        response))
    (catch Exception e
      {:error (str "Request failed: " (.getMessage e))})))

;; =============================================================================
;; Configuration Endpoints
;; =============================================================================

(defn get-configuration-v3
  "Get API configuration using v3 API"
  []
  (request-v3 "/configuration"))

(defn get-configuration-v4
  "Get API configuration using v4 API"
  []
  (request-v4 "/configuration"))

(defn get-account
  "Get account details (v4 API)"
  []
  (request-v4 "/account"))
;; =============================================================================
;; Movie Client Functions
;; =============================================================================

(defn get-movie
  "Get movie details by ID (v3 API)
   
   Returns: Full API response with movie details including title, year, 
   synopsis, genres, and production companies"
  [movie-id]
  (request-v3 (str "/movie/" movie-id)))

(defn get-movie-images
  "Get posters and backdrops for a movie by ID
   
   Returns: Full API response with posters and backdrop images"
  [movie-id]
  (request-v3 (str "/movie/" movie-id "/images")))

(defn get-movie-credits
  "Get cast and crew for a movie by ID
   
   Returns: Full API response with cast and crew details"
  [movie-id]
  (request-v3 (str "/movie/" movie-id "/credits")))

;; =============================================================================
;; People Client Functions
;; =============================================================================

(defn get-person
  "Get person details by ID
   
   Returns: Full API response with name, biography, and birth date"
  [person-id]
  (request-v3 (str "/person/" person-id)))

(defn get-person-images
  "Get profile images for a person by ID
   
   Returns: Full API response with profile image paths and metadata"
  [person-id]
  (request-v3 (str "/person/" person-id "/images")))

(defn get-person-movie-credits
  "Get movie credits for a person by ID (movies only)
   
   Returns: Full API response with cast and crew movie credits"
  [person-id]
  (request-v3 (str "/person/" person-id "/movie_credits")))

;; =============================================================================
;; Search Functions
;; =============================================================================

(defn search-movie
  "Search for movies by title (v3 API)
   
   Returns: Full API response with search results"
  [query]
  (request-v3 "/search/movie" :query-params {:query query}))

(defn search-person
  "Search for people by name (v3 API)
   
   Returns: Full API response with search results"
  [query]
  (request-v3 "/search/person" :query-params {:query query}))
