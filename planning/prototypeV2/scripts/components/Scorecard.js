/**
 * Scorecard Component - Draggable rating scorecard with vocabulary buttons
 */

namespace('lyapp.components.Scorecard', { 'lyapp.utils.ScoreCalculator': 'ScoreCalculator' }, ({ ScoreCalculator }) => {
    return function Scorecard({ taxonomic, onChange }) {
        const categories = ScoreCalculator.getVocabularyByCategory();
        const [selected, setSelected] = React.useState(taxonomic || {});
        const [draggedCategory, setDraggedCategory] = React.useState(null);
        const [categoryOrder, setCategoryOrder] = React.useState(Object.keys(categories));

        const handleOptionClick = (category, term) => {
            const newSelected = { ...selected, [category]: term };
            setSelected(newSelected);
            if (onChange) onChange(newSelected);
        };

        const handleDragStart = (e, category) => {
            setDraggedCategory(category);
            e.dataTransfer.effectAllowed = 'move';
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        };

        const handleDrop = (e, targetCategory) => {
            e.preventDefault();
            if (!draggedCategory || draggedCategory === targetCategory) return;

            const newOrder = [...categoryOrder];
            const dragIndex = newOrder.indexOf(draggedCategory);
            const targetIndex = newOrder.indexOf(targetCategory);
            newOrder.splice(dragIndex, 1);
            newOrder.splice(targetIndex, 0, draggedCategory);
            setCategoryOrder(newOrder);
            setDraggedCategory(null);
        };

        return (
            <div className="scorecard-container">
                <h3 className="mb-4">Rate This Movie</h3>
                {categoryOrder.map(category => {
                    const options = categories[category];
                    const selectedTerm = selected[category];
                    return (
                        <div key={category} className="scorecard-panel" draggable onDragStart={(e) => handleDragStart(e, category)} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, category)}>
                            <div className="scorecard-panel-header">
                                <span className="scorecard-drag-handle" title="Drag to reorder">:::</span>
                                <span>{category}</span>
                            </div>
                            <div className="scorecard-options">
                                {options.map(term => (
                                    <button key={term} className={`btn ${ScoreCalculator.getButtonClass(term)} ${selectedTerm === term ? 'active' : ''}`} onClick={() => handleOptionClick(category, term)} title={term}>
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
});
