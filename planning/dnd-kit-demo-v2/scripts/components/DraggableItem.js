/**
 * Namespace: dndapp.components.DraggableItem
 * Purpose: Individual draggable item component
 * 
 * Single namespace per file pattern:
 * - This file contains ONLY the DraggableItem component
 * - Handles drag events and visual feedback
 */

namespace('dndapp.components.DraggableItem', {}, () => {
  
  return class DraggableItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isDragging: false,
      };
    }
    
    handleDragStart = (e) => {
      this.setState({ isDragging: true });
      
      // Store the item ID in the dataTransfer
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(this.props.item));
      
      // Call parent's onDragStart if provided
      if (this.props.onDragStart) {
        this.props.onDragStart(this.props.item);
      }
    };
    
    handleDragEnd = (e) => {
      this.setState({ isDragging: false });
      
      // Call parent's onDragEnd if provided
      if (this.props.onDragEnd) {
        this.props.onDragEnd(this.props.item);
      }
    };
    
    render() {
      const { item } = this.props;
      const { isDragging } = this.state;
      
      return (
        <div
          draggable
          onDragStart={this.handleDragStart}
          onDragEnd={this.handleDragEnd}
          className={`draggable-item ${isDragging ? 'dragging' : ''}`}
        >
          <div className="draggable-item-content">
            <span className="draggable-item-text">{item.label}</span>
            <span className="draggable-item-icon">
              <i className={item.icon}></i>
            </span>
          </div>
        </div>
      );
    }
  };
});
