(ns limelight-yardstick.tmdb-test
  (:require [clojure.test :refer :all]
            [limelight-yardstick.tmdb-client :as tmdb]))

(deftest credentials-test
  (testing "Credentials should be available from environment variables"
    (is (tmdb/credentials-available?)
        "TMDB_API_KEY and TMDB_READ_ACCESS_TOKEN must be set")))

(deftest v3-api-configuration-test
  (testing "v3 API configuration request"
    (when (tmdb/credentials-available?)
      (let [response (tmdb/get-configuration-v3)]
        (if (:error response)
          (println "Error:" (:error response))
          (do
            (is (map? response) "Response should be a map")
            (println "v3 Configuration retrieved successfully")
            (println "Response keys:" (keys response))))))))

(deftest v4-api-configuration-test
  (testing "v4 API configuration request"
    (when (tmdb/credentials-available?)
      (let [response (tmdb/get-configuration-v4)]
        (if (:error response)
          (println "Error:" (:error response))
          (do
            (is (map? response) "Response should be a map")
            (println "v4 Configuration retrieved successfully")
            (println "Response keys:" (keys response))))))))

(deftest search-movie-test
  (testing "Search for a movie using v3 API"
    (when (tmdb/credentials-available?)
      (let [response (tmdb/search-movie "Inception")]
        (if (:error response)
          (println "Error:" (:error response))
          (do
            (is (map? response) "Response should be a map")
            (is (:body response) "Response should have body")
            (println "Movie search completed successfully")))))))

(deftest get-movie-test
  (testing "Get movie details by ID using v3 API"
    (when (tmdb/credentials-available?)
      (let [response (tmdb/get-movie 550)]  ;; Fight Club (ID: 550)
        (if (:error response)
          (println "Error:" (:error response))
          (do
            (is (map? response) "Response should be a map")
            (println "Movie details retrieved successfully")))))))

(deftest get-account-test
  (testing "Get account information using v4 API"
    (when (tmdb/credentials-available?)
      (let [response (tmdb/get-account)]
        (if (:error response)
          (println "Error:" (:error response))
          (do
            (is (map? response) "Response should be a map")
            (println "Account information retrieved successfully")))))))
