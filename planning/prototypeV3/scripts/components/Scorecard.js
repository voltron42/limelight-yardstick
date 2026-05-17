/**
 * Namespace: ly.prototypeV3.components.Scorecard
 * Purpose: Scorecard with draggable vocabulary categories
 * 
 * Features:
 * - 4 draggable category panels (Daring, Ambition, Engagement, Satisfaction)
 * - Option buttons for each level (Extremely Negative to Extremely Positive)
 * - jQuery UI drag-and-drop for category reordering
 * - Real-time score calculation
 */

namespace('ly.prototypeV3.components.Scorecard', {
  'ly.prototypeV3.utils.ScoreCalculator': 'ScoreCalculator',
}, ({ ScoreCalculator }) => {
  
  const vocabularies = ScoreCalculator.getVocabulary();
  const categories = ['Daring', 'Ambition', 'Engagement', 'Satisfaction'];
  const levels = ['Extremely Negative', 'Moderately Negative', 'Moderately Positive', 'Extremely Positive'];
  const levelColors = {
    'Extremely Negative': 'danger',
    'Moderately Negative': 'warning',
    'Moderately Positive': 'info',
    'Extremely Positive': 'success'
  };
  
  return class Scorecard extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        categoryOrder: [...categories],
        selections: {
          Daring: null,
          Ambition: null,
          Engagement: null,
          Satisfaction: null
        },
        calculatedScore: 0
      };
    }
    
    componentDidMount() {
      this.initializeDragDrop();
    }
    
    componentDidUpdate() {
      this.initializeDragDrop();
    }
    
    initializeDragDrop = () => {
      const me = this;
      
      // Make panels draggable
      $(".scorecard-panel").draggable({
        helper: "clone",
        zIndex: 100,
        start: (event, ui) => {
          const draggable = event.target;
          const helper = ui.helper[0];
          helper.style.width = draggable.clientWidth + 'px';
          helper.style.height = draggable.clientHeight + 'px';
        },
        drag: () => {
          $(".scorecard-zone").addClass("drop-target");
        },
        stop: () => {
          $(".scorecard-zone").removeClass("drop-target");
        }
      });
      
      // Make drop zone droppable
      $(".scorecard-zone").droppable({
        over: (event) => {
          $(event.target).addClass("drop-target");
        },
        out: (event) => {
          $(event.target).removeClass("drop-target");
        },
        drop: (event, { draggable }) => {
          const draggedCategory = draggable[0].id;
          me.reorderCategories(draggedCategory);
        }
      });
    };
    
    reorderCategories = (draggedCategory) => {
      const currentOrder = [...this.state.categoryOrder];
      const draggedIndex = currentOrder.indexOf(draggedCategory);
      
      if (draggedIndex > -1) {
        // Move to end (or implement proper position-based reordering)
        currentOrder.splice(draggedIndex, 1);
        currentOrder.push(draggedCategory);
        
        this.setState({ categoryOrder: currentOrder });
      }
    };
    
    handleSelectTerm = (category, term) => {
      const newSelections = { ...this.state.selections, [category]: term };
      const newScore = ScoreCalculator.calculateScore(newSelections);
      
      this.setState({
        selections: newSelections,
        calculatedScore: newScore
      });
    };
    
    render() {
      const { categoryOrder, selections, calculatedScore } = this.state;
      
      return (
        <div className="scorecard-container">
          <h2 className="mb-4">Rate a Movie</h2>
          
          {/* Score Display */}
          <div className="alert alert-info mb-4">
            <h5>Current Score</h5>
            <div className="rating-display">
              {ScoreCalculator.formatStars(calculatedScore)} 
              <span className="ms-2">({calculatedScore.toFixed(1)} / 5.0)</span>
            </div>
          </div>
          
          {/* Draggable Scorecard Zone */}
          <div className="scorecard-zone droppable-scorecard-zone mb-4">
            {categoryOrder.map((category) => (
              <div key={`panel-${category}`} id={category} className="scorecard-panel">
                <div className="scorecard-panel-header">
                  <span className="scorecard-drag-handle">
                    <i className="fas fa-grip-vertical"></i>
                  </span>
                  <span>{category}</span>
                </div>
                
                <div className="scorecard-options">
                  {levels.map((level) => {
                    const term = vocabularies[category][level];
                    const isSelected = selections[category] === term;
                    const color = levelColors[level];
                    
                    return (
                      <button
                        key={`btn-${category}-${term}`}
                        className={`btn btn-sm btn-${isSelected ? color : 'outline-' + color}`}
                        onClick={() => this.handleSelectTerm(category, term)}
                        title={level}
                      >
                        {term}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Submit Button */}
          <button className="btn btn-primary btn-lg" onClick={() => alert('Submit: ' + JSON.stringify(selections))}>
            <i className="fas fa-check"></i> Submit Rating
          </button>
        </div>
      );
    }
  };
});