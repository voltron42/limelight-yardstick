/**
 * main.js - Main application component
 * 
 * Manages routing and top-level state for Limelight Yardstick
 */

namespace('lyapp.Main',
    {
        'lyapp.components.Navigation': 'Navigation',
        'lyapp.components.Dashboard': 'Dashboard',
        'lyapp.components.Scorecard': 'Scorecard',
        'lyapp.components.UserScoreboard': 'UserScoreboard',
        'lyapp.components.MovieScoreboard': 'MovieScoreboard',
        'lyapp.utils.DataService': 'DataService',
        'lyapp.utils.ScoreCalculator': 'ScoreCalculator'
    },
    ({ Navigation, Dashboard, Scorecard, UserScoreboard, MovieScoreboard, DataService, ScoreCalculator }) => {
        
        return class Main extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    currentPage: 'dashboard',
                    movies: DataService.getMovies(),
                    users: DataService.getUsers(),
                    ratings: DataService.getRatings(),
                    currentUserId: 'user001',
                    currentMovie: null,
                    selectedRating: null
                };
            }

            handleNavigate = (page, context) => {
                this.setState({ 
                    currentPage: page,
                    ...context 
                });
            };

            handleSelectMovie = (movie) => {
                this.setState({ 
                    currentPage: 'scorecard',
                    currentMovie: movie,
                    selectedRating: this.state.ratings.find(r => r.userId === this.state.currentUserId && r.movieId === movie.id)
                });
            };

            handleSaveRating = (taxonomic) => {
                const { currentMovie, currentUserId } = this.state;
                if (!currentMovie) return;

                const score = ScoreCalculator.calculateScore(Object.values(taxonomic));
                DataService.setRating(currentUserId, currentMovie.id, Object.values(taxonomic), score);
                
                this.setState({ 
                    ratings: DataService.getRatings(),
                    currentPage: 'dashboard'
                });
            };

            renderPage = () => {
                const { currentPage, movies, ratings, currentUserId, currentMovie } = this.state;

                switch (currentPage) {
                    case 'dashboard':
                        return <Dashboard />;

                    case 'scorecard':
                        return (
                            <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <button className="btn btn-secondary mb-3" onClick={() => this.handleNavigate('dashboard')}>
                                            ← Back to Dashboard
                                        </button>
                                        <Scorecard 
                                            taxonomic={this.state.selectedRating?.taxonomic || {}}
                                            onChange={this.handleSaveRating}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h3>Movie</h3>
                                        {currentMovie && (
                                            <div className="card mb-4">
                                                <div className="card-body">
                                                    <h5 className="card-title">{currentMovie.title}</h5>
                                                    <p className="card-text text-muted">{currentMovie.year}</p>
                                                    <p className="card-text"><strong>Genres:</strong> {currentMovie.genres.join(', ')}</p>
                                                    <p className="card-text"><strong>Directors:</strong> {currentMovie.directors.map(d => d.name).join(', ')}</p>
                                                    <p className="card-text"><strong>Studio:</strong> {currentMovie.studio}</p>
                                                </div>
                                            </div>
                                        )}
                                        <MovieScoreboard ratings={ratings.filter(r => r.movieId === currentMovie?.id)} />
                                    </div>
                                </div>
                            </div>
                        );

                    case 'scoreboard':
                        return (
                            <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                                <button className="btn btn-secondary mb-3" onClick={() => this.handleNavigate('dashboard')}>
                                    ← Back to Dashboard
                                </button>
                                <UserScoreboard 
                                    ratings={ratings.filter(r => r.userId === currentUserId)}
                                    movies={movies}
                                />
                            </div>
                        );

                    default:
                        return <Dashboard />;
                }
            };

            render() {
                const { currentPage } = this.state;

                return (
                    <div className="limelight-app">
                        <Navigation 
                            currentPage={currentPage}
                            onNavigate={this.handleNavigate}
                        />
                        <main>
                            {this.renderPage()}
                        </main>
                        <footer className="bg-dark text-light py-4 mt-5">
                            <div className="container-fluid text-center">
                                <p className="mb-0">Limelight Yardstick © 2026 - Movie Rating Social Network</p>
                            </div>
                        </footer>
                    </div>
                );
            }
        };
    }
);
