/**
 * Namespace: dndapp.components.DroppableContainer
 * Purpose: Droppable container component
 * 
 * Single namespace per file pattern:
 * - This file contains ONLY the DroppableContainer component
 * - Handles drop events and displays items
 */

namespace('dndapp.components.DroppableContainer', {
  'dndapp.components.DraggableItem': 'DraggableItem',
}, ({ DraggableItem }) => {
  
  return class DroppableContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isOver: false,
      };
    }
    
    handleDragOver = (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      this.setState({ isOver: true });
    };
    
    handleDragLeave = (e) => {
      e.preventDefault();
      this.setState({ isOver: false });
    };
    
    handleDrop = (e) => {
      e.preventDefault();
      this.setState({ isOver: false });
      
      try {
        const item = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        // Call parent's onDrop handler
        if (this.props.onDrop) {
          this.props.onDrop(item, this.props.containerId);
        }
      } catch (error) {
        console.error('Error parsing dropped item:', error);
      }
    };
    
    render() {
      const { items, title, containerId, onRemoveItem } = this.props;
      const { isOver } = this.state;
      
      return (
        <div
          className={`droppable-zone ${isOver ? 'drag-over' : ''}`}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDrop}
        >
          <h3>{title}</h3>
          
          {items && items.length > 0 ? (
            <div>
              {items.map((item, index) => (
                <div key={index} className="dropped-item-wrapper">
                  <DraggableItem item={item} />
                  <button
                    className="btn btn-sm btn-link text-danger ms-2"
                    onClick={() => onRemoveItem && onRemoveItem(containerId, index)}
                    title="Remove item"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-arrow-down"></i>
              <p>Drop items here</p>
            </div>
          )}
        </div>
      );
    }
  };
});
