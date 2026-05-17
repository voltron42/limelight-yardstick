/**
 * Namespace: ly.prototypeV3.components.Dashboard
 * Purpose: Main dashboard showing user's movie queue and ratings
 */

namespace('ly.prototypeV3.components.Dashboard', {
  'ly.prototypeV3.utils.DataService': 'DataService',
  'ly.prototypeV3.utils.ScoreCalculator': 'ScoreCalculator',
}, ({ DataService, ScoreCalculator }) => {
  
  return class Dashboard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        movies: [],
        users: []
      };
    }
    
    componentDidMount() {
      const movies = DataService.getMovies();
      const users = DataService.getUsers();
      this.setState({ movies, users });
    }
    
    getAverageScore = (movieId) => {
      const ratings = DataService.getMovieRatings(movieId);
      if (ratings.length === 0) return 0;
      
      const totalScore = ratings.reduce((sum, rating) => {
        return sum + ScoreCalculator.calculateScore(rating);
      }, 0);
      
      return totalScore / ratings.length;
    };
    
    render() {
      const { movies } = this.state;
      
      return (
        <div className="dashboard-container">
          <h2 className="mb-4">
            <i className="fas fa-film"></i> Movie Queue
          </h2>
          
          <div className="row">
            {movies.map((movie) => {
              const avgScore = this.getAverageScore(movie.id);
              
              return (
                <div key={movie.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{movie.title}</h5>
                      <p className="card-text text-muted">
                        <small>{movie.year} • {movie.director}</small>
                      </p>
                      
                      {movie.taxonomicRatings.length > 0 ? (
                        <div>
                          <div className="mb-2">
                            <small className="text-muted">Average Rating:</small>
                            <div className="rating-display">
                              {ScoreCalculator.formatStars(avgScore)}
                            </div>
                          </div>
                          <small className="text-muted d-block">
                            {movie.taxonomicRatings.length} rating{movie.taxonomicRatings.length !== 1 ? 's' : ''}
                          </small>
                        </div>
                      ) : (
                        <div className="empty-state">
                          <small>No ratings yet</small>
                        </div>
                      )}
                      
                      <button className="btn btn-sm btn-primary mt-3 w-100">
                        <i className="fas fa-star"></i> Rate This Movie
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {movies.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>No movies in queue</p>
            </div>
          )}
        </div>
      );
    }
  };
});