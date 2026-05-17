/**
 * Namespace: ly.prototypeV3.components.Navigation
 * Purpose: Main navigation bar
 */

namespace('ly.prototypeV3.components.Navigation', {}, () => {
  
  return class Navigation extends React.Component {
    render() {
      const { currentPage, onNavigate } = this.props;
      
      return (
        <nav className="navbar navbar-expand-lg navbar-dark mb-4">
          <div className="container-fluid">
            <a className="navbar-brand" href="#/">
              <i className="fas fa-star"></i> Limelight Yardstick
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a 
                    className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                    href="#/"
                    onClick={() => onNavigate('dashboard')}
                  >
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className={`nav-link ${currentPage === 'scorecard' ? 'active' : ''}`}
                    href="#/scorecard"
                    onClick={() => onNavigate('scorecard')}
                  >
                    New Scorecard
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link"
                    href="#/"
                    onClick={() => alert('Profile coming soon!')}
                  >
                    Profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    }
  };
});