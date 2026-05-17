/**
 * Movie Scoreboard Component - Displays aggregate ratings for a movie from all users
 */

namespace('lyapp.components.MovieScoreboard', { 'lyapp.utils.ScoreCalculator': 'ScoreCalculator' }, ({ ScoreCalculator }) => {
    return function MovieScoreboard({ ratings }) {
        if (!ratings || ratings.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="fas fa-chart-bar"></i>
                    </div>
                    <p>No ratings yet</p>
                </div>
            );
        }

        // Group ratings by taxonomic rating combination
        const ratingGroups = {};
        ratings.forEach(rating => {
            const key = rating.taxonomic.sort().join('|');
            if (!ratingGroups[key]) {
                ratingGroups[key] = {
                    taxonomic: rating.taxonomic,
                    score: rating.score,
                    count: 0
                };
            }
            ratingGroups[key].count += 1;
        });

        const groupArray = Object.values(ratingGroups).sort((a, b) => b.count - a.count);
        const total = ratings.length;

        return (
            <div className="movie-scoreboard">
                <h3 className="mb-3">Community Ratings</h3>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Rating</th>
                                <th>Score</th>
                                <th>Count</th>
                                <th>Percent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupArray.map((group, idx) => {
                                const formattedScore = ScoreCalculator.formatHalfStars(group.score);
                                const percent = Math.round((group.count / total) * 100);

                                return (
                                    <tr key={idx}>
                                        <td>
                                            <div className="tags">
                                                {group.taxonomic.map(term => (
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
                                        <td>{group.count}</td>
                                        <td>{percent}%</td>
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
