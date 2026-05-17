/**
 * Namespace: sortableapp.components.Scorecard
 * Purpose: Interactive scorecard with draggable categories, term selection, and real-time scoring
 * 
 * Implements:
 * - jQuery UI Sortable for category prioritization (with placeholder effect)
 * - Radio button group for term selection per category
 * - Real-time score calculation
 * - Bootstrap button styling with color-coded terms
 */

namespace('sortableapp.components.Scorecard', {
  'sortableapp.utils.ScoreCalculator': 'ScoreCalculator'
}, ({ ScoreCalculator }) => {
  
  // Vocabulary terms from ReviewAndSuggestions.md
  const vocabularyMatrix = {
    'daring': {
      label: 'Daring (Story & Subject)',
      terms: [
        { index: 0, label: 'Dogmatic', class: 'btn-outline-danger' },
        { index: 1, label: 'Formulaic', class: 'btn-outline-warning' },
        { index: 2, label: 'Creative', class: 'btn-outline-info' },
        { index: 3, label: 'Provocative', class: 'btn-outline-success' }
      ]
    },
    'ambition': {
      label: 'Ambition (Production)',
      terms: [
        { index: 0, label: 'Lazy', class: 'btn-outline-danger' },
        { index: 1, label: 'Rushed', class: 'btn-outline-warning' },
        { index: 2, label: 'Aspiring', class: 'btn-outline-info' },
        { index: 3, label: 'Masterful', class: 'btn-outline-success' }
      ]
    },
    'engagement': {
      label: 'Engagement (Pacing)',
      terms: [
        { index: 0, label: 'Punishing', class: 'btn-outline-danger' },
        { index: 1, label: 'Uneven', class: 'btn-outline-warning' },
        { index: 2, label: 'Engaging', class: 'btn-outline-info' },
        { index: 3, label: 'Irresistible', class: 'btn-outline-success' }
      ]
    },
    'satisfaction': {
      label: 'Satisfaction (Impact)',
      terms: [
        { index: 0, label: 'Contemptible', class: 'btn-outline-danger' },
        { index: 1, label: 'Unremarkable', class: 'btn-outline-warning' },
        { index: 2, label: 'Rewarding', class: 'btn-outline-info' },
        { index: 3, label: 'Unforgettable', class: 'btn-outline-success' }
      ]
    }
  };

  const categoryOrder = ['daring', 'ambition', 'engagement', 'satisfaction'];

  return class Scorecard extends React.Component {
    constructor(props) {
      super(props);
      
      this.state = {
        // Selected term index per category (null = not selected)
        selections: {
          daring: null,
          ambition: null,
          engagement: null,
          satisfaction: null
        },
        // Priority order of categories (determines weighting)
        priorityOrder: ['daring', 'ambition', 'engagement', 'satisfaction'],
        // Score calculation result
        score: {
          percent: 0,
          halfStars: 0,
          isComplete: false
        }
      };

      this.categoriesRef = React.createRef();
    }

    componentDidMount() {
      // Initialize Sortable only once on mount
      this.initializeSortable();
    }

    componentDidUpdate(prevProps, prevState) {
      // Only refresh Sortable if the priorityOrder changed (items were reordered)
      // Don't refresh during drag operations to avoid corrupting jQuery's state
      if (JSON.stringify(prevState.priorityOrder) !== JSON.stringify(this.state.priorityOrder)) {
        if (this.categoriesRef.current && $(this.categoriesRef.current).data('sortable')) {
          $(this.categoriesRef.current).sortable('refresh');
        }
      }
    }

    componentWillUnmount() {
      // Clean up jQuery UI Sortable on unmount
      if (this.categoriesRef.current) {
        $(this.categoriesRef.current).sortable('destroy');
      }
    }

    /**
     * Initialize jQuery UI Sortable on category panels
     * Only called once on component mount to avoid reinitializing
     */
    initializeSortable = () => {
      const me = this;
      
      if (this.categoriesRef.current) {
        // Check if already initialized to prevent duplicate instances
        if ($(this.categoriesRef.current).data('sortable')) {
          return;
        }

        $(this.categoriesRef.current).sortable({
          handle: '.drag-handle',
          placeholder: 'category-panel ui-sortable-placeholder',
          tolerance: 'pointer',
          axis: 'y',
          opacity: 0.6,
          delay: 150,
          
          // Update order after sorting completes
          stop: (event, ui) => {
            // Get new order from DOM
            const newOrder = Array.from(me.categoriesRef.current.children)
              .map(el => el.getAttribute('data-category-id'));
            
            // Only update if order actually changed
            if (JSON.stringify(newOrder) !== JSON.stringify(me.state.priorityOrder)) {
              me.setState({ priorityOrder: newOrder }, () => {
                me.updateScore();
              });
            }
          }
        });
      }
    };

    /**
     * Handle term selection for a category
     */
    handleTermSelect = (categoryId, termIndex) => {
      // Prevent selection if a drag is currently happening
      if ($('.ui-sortable-helper').length > 0) {
        return;
      }

      const selections = { ...this.state.selections };
      selections[categoryId] = termIndex;
      
      this.setState({ selections }, () => {
        this.updateScore();
      });
    };

    /**
     * Calculate and update score
     */
    updateScore = () => {
      const score = ScoreCalculator.calculateScore(
        this.state.selections,
        this.state.priorityOrder
      );
      
      this.setState({ score });
    };

    /**
     * Render a single category panel with term selection
     */
    renderCategoryPanel = (categoryId, priority) => {
      const config = vocabularyMatrix[categoryId];
      const selectedTerm = this.state.selections[categoryId];
      const weight = ScoreCalculator.getPriorityWeight(priority);

      return (
        <div 
          key={categoryId} 
          className="category-panel border border-2 border-info p-3 mb-2 bg-secondary rounded"
          data-category-id={categoryId}
        >
          <div className="row g-3 align-items-center">
            <div className="col-4">
              <span className="drag-handle fs-5" title="Drag to reorder">☰</span>
              <span className="mx-2"/>
              <span className="fw-bold">{config.label}</span>
            </div>
            <div className="col-8">
              <div className="btn-group w-100" role="group">
                {config.terms.map(term => (
                  <div key={term.index} className="w-25 bg-dark rounded">
                    <input
                      type="radio"
                      className="btn-check"
                      name={`term-${categoryId}`}
                      id={`term-${categoryId}-${term.index}`}
                      checked={selectedTerm === term.index}
                      onChange={() => this.handleTermSelect(categoryId, term.index)}
                      autoComplete="off"
                    />
                    <label
                      className={`btn w-100 ${term.class}`}
                      htmlFor={`term-${categoryId}-${term.index}`}
                    >
                      {term.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    };

    render() {
      const { priorityOrder, score } = this.state;

      return (
        <div className="container-lg mt-5 mb-5">
          {/* Sortable categories */}
          <div className="d-flex w-75">
            <div ref={this.categoriesRef} className="w-100">
              {priorityOrder.map((categoryId, priority) => 
                this.renderCategoryPanel(categoryId, priority)
              )}
            </div>
          </div>

          {/* Score display */}
          <div className="alert alert-success mt-3 rounded">
            <div className="mb-1 fs-5 fw-bold">
              {score.isComplete ? '✓ Scorecard Complete' : '○ Select all terms to calculate score'}
            </div>
            
            {score.isComplete ? (
              <div className="row text-center g-4">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="display-3 fw-bold text-success mb-2">{score.percent}%</div>
                </div>
                
                <div className="col-md-6 d-flex flex-column justify-content-center">
                  <div className="display-5 text-warning mb-3">
                    {ScoreCalculator.formatStars(score.halfStars)}
                  </div>
                  <div className="text-muted small fw-normal">
                    {score.halfStars} / 5.0 Stars
                  </div>
                </div>
              </div>
            ) : (
              <p className="mb-0 text-muted fs-6">
                Select at least one term in each category above to see your score.
              </p>
            )}
          </div>
        </div>
      );
    }
  };
});
