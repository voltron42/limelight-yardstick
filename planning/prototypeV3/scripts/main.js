/**
 * Namespace: ly.prototypeV3.Main
 * Purpose: Main app component (stateful)
 * 
 * Orchestrates:
 * - Navigation between pages
 * - Overall app state
 * - Page routing
 */

namespace('ly.prototypeV3.Main', {
  'ly.prototypeV3.components.Navigation': 'Navigation',
  'ly.prototypeV3.components.Dashboard': 'Dashboard',
  'ly.prototypeV3.components.Scorecard': 'Scorecard',
}, ({ Navigation, Dashboard, Scorecard }) => {
  
  return class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        currentPage: 'dashboard'
      };
    }
    
    componentDidMount() {
      console.log('Prototype V3 initialized');
    }
    
    handleNavigate = (page) => {
      this.setState({ currentPage: page });
    };
    
    render() {
      const { currentPage } = this.state;
      
      return (
        <div className="app-container">
          <Navigation currentPage={currentPage} onNavigate={this.handleNavigate} />
          
          <main className="container mt-4 mb-4">
            {currentPage === 'dashboard' && <Dashboard />}
            {currentPage === 'scorecard' && <Scorecard />}
          </main>
          
          <footer className="text-center text-muted py-4 border-top mt-5">
            <p className="mb-0">Limelight Yardstick - Prototype V3</p>
            <small>Zero-Build React • jQuery UI Drag-and-Drop • Bootstrap 5.3.2</small>
          </footer>
        </div>
      );
    }
  };
});