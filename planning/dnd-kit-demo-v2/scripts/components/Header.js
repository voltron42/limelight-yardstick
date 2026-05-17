/**
 * Namespace: dndapp.components.Header
 * Purpose: Header component
 * 
 * Single namespace per file pattern:
 * - This file contains ONLY the Header component
 * - Displays title and instructions
 */

namespace('dndapp.components.Header', {}, () => {
  
  return class Header extends React.Component {
    render() {
      return (
        <div className="dnd-header">
          <h1>
            <i className="fas fa-grip-horizontal"></i> Drag and Drop Task Board v2
          </h1>
          <p className="mb-0 mt-2">
            Drag tasks between columns to organize your workflow. jQuery UI powered.
          </p>
        </div>
      );
    }
  };
});
