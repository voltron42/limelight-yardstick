/**
 * Namespace: ly.prototypeV3.utils.DataService
 * Purpose: Mock data service for development
 * 
 * Provides sample movies, users, and ratings
 */

namespace('ly.prototypeV3.utils.DataService', {}, () => {
  
  const mockMovies = [
    {
      id: 'movie-1',
      title: 'The Matrix',
      year: 1999,
      director: 'Wachowskis',
      taxonomicRatings: [
        { Daring: 'Provocative', Ambition: 'Masterful', Engagement: 'Irresistible', Satisfaction: 'Unforgettable' },
        { Daring: 'Provocative', Ambition: 'Masterful', Engagement: 'Engaging', Satisfaction: 'Unforgettable' }
      ]
    },
    {
      id: 'movie-2',
      title: 'Inception',
      year: 2010,
      director: 'Christopher Nolan',
      taxonomicRatings: [
        { Daring: 'Creative', Ambition: 'Masterful', Engagement: 'Irresistible', Satisfaction: 'Unforgettable' },
        { Daring: 'Provocative', Ambition: 'Aspiring', Engagement: 'Engaging', Satisfaction: 'Rewarding' }
      ]
    },
    {
      id: 'movie-3',
      title: 'Interstellar',
      year: 2014,
      director: 'Christopher Nolan',
      taxonomicRatings: [
        { Daring: 'Creative', Ambition: 'Masterful', Engagement: 'Engaging', Satisfaction: 'Rewarding' }
      ]
    }
  ];
  
  const mockUsers = [
    {
      id: 'user-1',
      name: 'Alice Chen',
      ratings: [
        { movieId: 'movie-1', taxonomicRating: { Daring: 'Provocative', Ambition: 'Masterful', Engagement: 'Irresistible', Satisfaction: 'Unforgettable' } },
        { movieId: 'movie-2', taxonomicRating: { Daring: 'Creative', Ambition: 'Aspiring', Engagement: 'Engaging', Satisfaction: 'Rewarding' } }
      ]
    },
    {
      id: 'user-2',
      name: 'Bob Rodriguez',
      ratings: [
        { movieId: 'movie-1', taxonomicRating: { Daring: 'Provocative', Ambition: 'Masterful', Engagement: 'Engaging', Satisfaction: 'Unforgettable' } }
      ]
    }
  ];
  
  return {
    /**
     * Get all movies
     * @returns {Array} Array of movie objects
     */
    getMovies: function() {
      return JSON.parse(JSON.stringify(mockMovies));
    },
    
    /**
     * Get movie by ID
     * @param {string} movieId
     * @returns {Object|null}
     */
    getMovie: function(movieId) {
      const movie = mockMovies.find(m => m.id === movieId);
      return movie ? JSON.parse(JSON.stringify(movie)) : null;
    },
    
    /**
     * Get all users
     * @returns {Array}
     */
    getUsers: function() {
      return JSON.parse(JSON.stringify(mockUsers));
    },
    
    /**
     * Get user by ID
     * @param {string} userId
     * @returns {Object|null}
     */
    getUser: function(userId) {
      const user = mockUsers.find(u => u.id === userId);
      return user ? JSON.parse(JSON.stringify(user)) : null;
    },
    
    /**
     * Get all taxonomic ratings for a movie
     * @param {string} movieId
     * @returns {Array}
     */
    getMovieRatings: function(movieId) {
      const movie = mockMovies.find(m => m.id === movieId);
      return movie ? movie.taxonomicRatings : [];
    },
    
    /**
     * Add a new rating for a user-movie pair
     * @param {string} userId
     * @param {string} movieId
     * @param {Object} taxonomicRating
     * @returns {boolean}
     */
    addRating: function(userId, movieId, taxonomicRating) {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        // Remove existing rating for this movie
        user.ratings = user.ratings.filter(r => r.movieId !== movieId);
        // Add new rating
        user.ratings.push({ movieId, taxonomicRating });
        return true;
      }
      return false;
    }
  };
});