/**
 * Filters - Search and filter utilities
 */

namespace('lyapp.utils.Filters', {}, () => {
    return {
        /**
         * Search movies by title, genre, or person
         */
        searchMovies(movies, query) {
            if (!query || query.trim().length === 0) return movies;
            const q = query.toLowerCase();
            return movies.filter(movie => {
                const titleMatch = movie.title.toLowerCase().includes(q);
                const genreMatch = movie.genres.some(g => g.toLowerCase().includes(q));
                const directorMatch = movie.directors.some(d => d.name.toLowerCase().includes(q));
                const writerMatch = movie.writers.some(w => w.name.toLowerCase().includes(q));
                const actorMatch = movie.actors.some(a => a.name.toLowerCase().includes(q));
                return titleMatch || genreMatch || directorMatch || writerMatch || actorMatch;
            });
        },

        /**
         * Search users by username
         */
        searchUsers(users, query) {
            if (!query || query.trim().length === 0) return users;
            const q = query.toLowerCase();
            return users.filter(user => user.username.toLowerCase().includes(q));
        },

        /**
         * Filter movies by genre
         */
        filterByGenre(movies, genre) {
            if (!genre) return movies;
            return movies.filter(m => m.genres.includes(genre));
        },

        /**
         * Filter movies by year range
         */
        filterByYearRange(movies, minYear, maxYear) {
            return movies.filter(m => m.year >= minYear && m.year <= maxYear);
        }
    };
});
