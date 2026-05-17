/**
 * Navigation Component - Top navigation bar with page navigation
 */

namespace('lyapp.components.Navigation', {}, () => {
    return function Navigation({ currentPage, onNavigate }) {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#" onClick={() => onNavigate('dashboard')}>
                        <i className="fas fa-film"></i> Limelight Yardstick
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <button className={`nav-link btn btn-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('dashboard')}>
                                    Dashboard
                                </button>
                            </li>
                            <li className="nav-item">
                                <button className={`nav-link btn btn-link ${currentPage === 'search' ? 'active' : ''}`} onClick={() => onNavigate('search')}>
                                    Search
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    };
});
