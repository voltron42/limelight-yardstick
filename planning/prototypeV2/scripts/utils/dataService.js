/**
 * Data Service - Mock data provider for Limelight Yardstick
 * 
 * Provides: Movies, Users, Ratings
 */

namespace('lyapp.utils.DataService', {}, () => {
    const mockMovies = [
        {
            id: 'tt0133093',
            title: 'The Matrix',
            year: 1999,
            genres: ['Sci-Fi', 'Action'],
            directors: [{ name: 'Lana Wachowski', id: 'nm0905154' }],
            writers: [{ name: 'Lana Wachowski', id: 'nm0905154' }],
            actors: [
                { name: 'Keanu Reeves', id: 'nm0000206' },
                { name: 'Laurence Fishburne', id: 'nm0000401' }
            ],
            studio: 'Warner Bros'
        },
        {
            id: 'tt0068646',
            title: 'The Godfather',
            year: 1972,
            genres: ['Crime', 'Drama'],
            directors: [{ name: 'Francis Ford Coppola', id: 'nm0001044' }],
            writers: [{ name: 'Mario Puzo', id: 'nm0700128' }],
            actors: [
                { name: 'Marlon Brando', id: 'nm0000008' },
                { name: 'Al Pacino', id: 'nm0000199' }
            ],
            studio: 'Paramount Pictures'
        },
        {
            id: 'tt0111161',
            title: 'The Shawshank Redemption',
            year: 1994,
            genres: ['Drama'],
            directors: [{ name: 'Frank Darabont', id: 'nm0001104' }],
            writers: [{ name: 'Stephen King', id: 'nm0000175' }],
            actors: [
                { name: 'Tim Robbins', id: 'nm0000209' },
                { name: 'Morgan Freeman', id: 'nm0000151' }
            ],
            studio: 'Columbia Pictures'
        }
    ];

    const mockUsers = [
        { id: 'user001', username: 'filmcritik', dateJoined: '2023-01-15', private: false },
        { id: 'user002', username: 'moviebuff', dateJoined: '2023-06-20', private: false },
        { id: 'user003', username: 'actionjunkie', dateJoined: '2023-09-10', private: true }
    ];

    const mockRatings = [
        {
            userId: 'user001',
            movieId: 'tt0133093',
            taxonomic: ['Provocative', 'Masterful', 'Irresistible', 'Unforgettable'],
            score: 5
        },
        {
            userId: 'user001',
            movieId: 'tt0068646',
            taxonomic: ['Provocative', 'Masterful', 'Irresistible', 'Unforgettable'],
            score: 5
        },
        {
            userId: 'user002',
            movieId: 'tt0133093',
            taxonomic: ['Creative', 'Aspiring', 'Engaging', 'Rewarding'],
            score: 4
        },
        {
            userId: 'user002',
            movieId: 'tt0111161',
            taxonomic: ['Creative', 'Masterful', 'Engaging', 'Unforgettable'],
            score: 5
        }
    ];

    return {
        getMovies() { return [...mockMovies]; },
        getMovie(id) { return mockMovies.find(m => m.id === id); },
        getUsers() { return [...mockUsers]; },
        getUser(id) { return mockUsers.find(u => u.id === id); },
        getRatings() { return [...mockRatings]; },
        getUserRatings(userId) { return mockRatings.filter(r => r.userId === userId); },
        getMovieRatings(movieId) { return mockRatings.filter(r => r.movieId === movieId); },
        getRating(userId, movieId) { return mockRatings.find(r => r.userId === userId && r.movieId === movieId); },
        setRating(userId, movieId, taxonomic, score) {
            const existing = mockRatings.findIndex(r => r.userId === userId && r.movieId === movieId);
            const newRating = { userId, movieId, taxonomic, score };
            if (existing >= 0) {
                mockRatings[existing] = newRating;
            } else {
                mockRatings.push(newRating);
            }
            return newRating;
        }
    };
});
