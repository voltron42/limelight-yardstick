(ns limelight-yardstick.auth
  (:require [clj-http.client :as http]
            [cheshire.core :as json]
            [ring.util.response :refer [redirect response status]]
            [clojure.tools.logging :as log]))

;; Google OAuth Configuration from environment variables
(def google-config
  {:client-id (System/getenv "GOOGLE_CLIENT_ID")
   :client-secret (System/getenv "GOOGLE_CLIENT_SECRET")
   :redirect-uri (System/getenv "OAUTH_REDIRECT_URI")})

(defn- validate-config []
  (if (or (nil? (:client-id google-config))
          (nil? (:client-secret google-config))
          (nil? (:redirect-uri google-config)))
    (log/warn "Google OAuth not fully configured. Missing credentials.")
    true))

;; Step 1: Redirect user to Google login
(defn google-login [req]
  (validate-config)
  (redirect (str "https://accounts.google.com/o/oauth2/v2/auth?"
                 "client_id=" (:client-id google-config)
                 "&redirect_uri=" (java.net.URLEncoder/encode (:redirect-uri google-config))
                 "&response_type=code"
                 "&scope=" (java.net.URLEncoder/encode "openid email profile")
                 "&access_type=offline")))

;; Step 2: Exchange authorization code for tokens
(defn- exchange-code-for-token [code]
  (try
    (let [response (http/post "https://oauth2.googleapis.com/token"
                              {:form-params {:code code
                                            :client_id (:client-id google-config)
                                            :client_secret (:client-secret google-config)
                                            :redirect_uri (:redirect-uri google-config)
                                            :grant_type "authorization_code"}
                               :as :json})]
      (:body response))
    (catch Exception e
      (log/error "Failed to exchange code for token:" (.getMessage e))
      nil)))

;; Step 3: Verify and decode ID token (basic implementation - should use proper JWT validation in production)
(defn- decode-id-token [id-token]
  (try
    ;; In production, use a JWT library to properly verify the signature
    ;; For now, just parse the payload (this is UNSAFE - for demo only)
    (let [parts (clojure.string/split id-token #"\.")
          payload (when (> (count parts) 1)
                    (String. (java.util.Base64/getUrlDecoder)
                             (.getBytes (get parts 1) "UTF-8")))]
      (json/parse-string payload true))
    (catch Exception e
      (log/error "Failed to decode ID token:" (.getMessage e))
      nil)))

;; Step 4: Handle OAuth callback - delegates user persistence to handler
;; on-user-authenticated is a function that receives user data and returns user-id (or nil)
(defn google-callback [on-user-authenticated {:keys [code error state]}]
  (if error
    (status (response {:error error}) 401)
    (try
      (let [tokens (exchange-code-for-token code)]
        (if-let [id-token (:id_token tokens)]
          (let [user-data (decode-id-token id-token)
                user-id (on-user-authenticated user-data)]
            (if user-id
              (do
                (log/info (str "User authenticated: " (:email user-data)))
                (redirect (str "/dashboard?user=" user-id)))
              (status (response {:error "Failed to create/find user"}) 500)))
          (status (response {:error "No ID token received"}) 401)))
      (catch Exception e
        (log/error "Auth callback failed:" (.getMessage e))
        (status (response {:error "Authentication failed"}) 500)))))

;; Middleware: Add :user key to request if session contains user-id
(defn wrap-user [handler user-loader]
  (fn [req]
    (if-let [user-id (get-in req [:session :user-id])]
      (if-let [user (user-loader user-id)]
        (handler (assoc req :user user))
        (status (response {:error "User not found"}) 404))
      (handler req))))

;; Middleware: Require authentication for wrapped handler
(defn wrap-require-auth [handler]
  (fn [req]
    (if (:user req)
      (handler req)
      (status (response {:error "Not authenticated"}) 401))))

;; Middleware: Combined auth + user loading
(defn wrap-authenticated [handler user-loader]
  (-> handler
      (wrap-user user-loader)
      wrap-require-auth))
