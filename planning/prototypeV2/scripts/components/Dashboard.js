/**
 * Dashboard Component - Main landing page for logged-in users
 */

namespace('lyapp.components.Dashboard', { 'lyapp.utils.DataService': 'DataService' }, ({ DataService }) => {
    return function Dashboard() {
        const [movies] = React.useState(DataService.getMovies());
        const [searchQuery, setSearchQuery] = React.useState('');

        return (
            <div className="container-fluid" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                <div className="row mb-4">
                    <div className="col-md-12">
                        <h2 className="mb-4">Welcome back!</h2>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Quick Search</h5>
                                <div className="search-box">
                                    <i className="fas fa-search"></i>
                                    <input type="text" className="form-control" placeholder="Search movies, actors, users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Your Queue</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Your movie queue will appear here</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Most Similar Users</h5>
                            </div>
                            <div className="card-body">
                                <p className="text-muted">Similar users based on taste will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">Featured Movies</h5>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {movies.slice(0, 3).map(movie => (
                                        <div key={movie.id} className="col-md-4">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h6 className="card-title">{movie.title}</h6>
                                                    <p className="card-text text-muted small">{movie.year} • {movie.genres.join(', ')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
});
