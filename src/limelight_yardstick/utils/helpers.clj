(ns limelight-yardstick.utils.helpers)

;; =============================================================================
;; Image URL Helper
;; =============================================================================

(defn build-image-url
  "Build a complete image URL from file path
   
   Args:
   - file-path: Image path from API (e.g., '/qmDpIHrmpJLSqn482m34Jkmro5.jpg')
   - size: Image size (default 'original')
             Options: 'w92', 'w154', 'w185', 'w342', 'w500', 'original'
   
   Returns: Full URL string"
  ([file-path]
   (build-image-url file-path "original"))
  ([file-path size]
   (if file-path
     (str "https://image.tmdb.org/t/p/" size file-path)
     nil)))
