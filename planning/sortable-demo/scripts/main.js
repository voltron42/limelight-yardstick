/**
 * Namespace: sortableapp.Main
 * Purpose: Main app component (stateful)
 * 
 * Single namespace per file pattern:
 * - This file contains ONLY the Main component
 * - Imports all components as dependencies
 * - Manages app state and orchestration
 * - Class-based component for consistency
 */

namespace('sortableapp.Main', {
  'sortableapp.components.Header': 'Header',
  'sortableapp.components.Scorecard': 'Scorecard'
}, ({ Header, Scorecard }) => {
  
  return class Main extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    
    componentDidMount() {
      console.log('Sortable Demo initialized');
    }
    
    render() {
      return (
        <div className="app-container">
          <Header />
          <Scorecard />
        </div>
      );
    }
  };
});
