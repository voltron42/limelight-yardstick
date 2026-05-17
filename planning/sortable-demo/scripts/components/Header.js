/**
 * Namespace: sortableapp.components.Header
 * Purpose: App header with title and instructions
 * 
 * Displays:
 * - Application title
 * - Brief description
 * - Usage instructions
 */

namespace('sortableapp.components.Header', {}, () => {
  return class Header extends React.Component {
    render() {
      return (
        <header className="bg-dark">
          <div className="container-lg">
            <h1 className="text-danger mb-0">Scorecard Priority Sorter</h1>
          </div>
        </header>
      );
    }
  };
});
