/**
 * Namespace: limelight.utils.ApiService
 * Purpose: Handle all API communication with backend
 */

namespace('limelight.utils.ApiService', {}, () => {
  const API_BASE = '/api';

  return {
    // Search endpoints
    searchMovies: async (query) => {
      try {
        const response = await fetch(`${API_BASE}/search/movies?q=${encodeURIComponent(query)}`);
        return await response.json();
      } catch (error) {
        console.error('Search movies error:', error);
        return { error: error.message };
      }
    },

    searchPeople: async (query) => {
      try {
        const response = await fetch(`${API_BASE}/search/people?q=${encodeURIComponent(query)}`);
        return await response.json();
      } catch (error) {
        console.error('Search people error:', error);
        return { error: error.message };
      }
    },

    // Movie details
    getMovie: async (movieId) => {
      try {
        const response = await fetch(`${API_BASE}/movies/${movieId}`);
        if (!response.ok) return { error: 'Movie not found' };
        return await response.json();
      } catch (error) {
        console.error('Get movie error:', error);
        return { error: error.message };
      }
    },

    getPerson: async (personId) => {
      try {
        const response = await fetch(`${API_BASE}/people/${personId}`);
        if (!response.ok) return { error: 'Person not found' };
        return await response.json();
      } catch (error) {
        console.error('Get person error:', error);
        return { error: error.message };
      }
    },

    // User authenticated endpoints
    getCurrentUser: async () => {
      try {
        const response = await fetch(`${API_BASE}/user`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error('Get user error:', error);
        return null;
      }
    },
  };
});
