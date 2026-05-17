/**
 * User Scoreboard Component - Displays a user's ratings in table format
 */

namespace('lyapp.components.UserScoreboard', { 'lyapp.utils.ScoreCalculator': 'ScoreCalculator' }, ({ ScoreCalculator }) => {
    return function UserScoreboard({ ratings, movies }) {
        if (!ratings || ratings.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="fas fa-inbox"></i>
                    </div>
                    <p>No ratings yet</p>
                </div>
            );
        }

        return (
            <div className="user-scoreboard">
                <h3 className="mb-3">Your Ratings</h3>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Movie</th>
                                <th>Taxonomic Rating</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.map(rating => {
                                const movie = movies.find(m => m.id === rating.movieId);
                                if (!movie) return null;
                                const formattedScore = ScoreCalculator.formatHalfStars(rating.score);
                                return (
                                    <tr key={rating.movieId}>
                                        <td>
                                            <strong>{movie.title}</strong>
                                            <br />
                                            <small className="text-muted">({movie.year})</small>
                                        </td>
                                        <td>
                                            <div className="tags">
                                                {rating.taxonomic.map(term => (
                                                    <span key={term} className={`badge bg-${ScoreCalculator.getLevelColor(term)} me-1`}>
                                                        {term}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="star-rating">
                                                <i className="fas fa-star"></i> {formattedScore}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
});
