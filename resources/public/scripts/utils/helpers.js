/**
 * Namespace: limelight.utils.Helpers
 * Purpose: Utility helper functions for common tasks
 */

namespace('limelight.utils.Helpers', {}, () => {
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

  return {
    /**
     * Build a complete image URL from TMDB file path
     * 
     * @param {string} filePath - Image path from API (e.g., '/qmDpIHrmpJLSqn482m34Jkmro5.jpg')
     * @param {string} [size='original'] - Image size (default 'original')
     *                  Options: 'w92', 'w154', 'w185', 'w342', 'w500', 'original'
     * @returns {string|null} Full URL string or null if no file path provided
     */
    buildImageUrl: (filePath, size = 'original') => {
      if (!filePath) {
        return null;
      }
      return `${TMDB_IMAGE_BASE}/${size}${filePath}`;
    }
  };
});
