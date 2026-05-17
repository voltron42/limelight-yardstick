/**
 * Score Calculator - Converts taxonomic ratings to numeric scores
 * 
 * Taxonomy Levels (each worth points):
 * - Extremely Positive (level 4): +5 points
 * - Moderately Positive (level 3): +3 points
 * - Moderately Negative (level 1): -3 points
 * - Extremely Negative (level 0): -5 points
 */

namespace('lyapp.utils.ScoreCalculator', {}, () => {
    const VOCABULARY = {
        'Dogmatic': 0, 'Formulaic': 1, 'Creative': 3, 'Provocative': 4,
        'Lazy': 0, 'Rushed': 1, 'Aspiring': 3, 'Masterful': 4,
        'Punishing': 0, 'Uneven': 1, 'Engaging': 3, 'Irresistible': 4,
        'Contemptible': 0, 'Unremarkable': 1, 'Rewarding': 3, 'Unforgettable': 4
    };

    const LEVEL_MAP = {
        0: 'danger', 1: 'warning', 3: 'info', 4: 'success'
    };

    return {
        calculateScore(taxonomic) {
            if (!taxonomic || taxonomic.length === 0) return 0;
            const total = taxonomic.reduce((sum, term) => sum + (VOCABULARY[term] ?? 0), 0);
            return (total / taxonomic.length / 4) * 5;
        },
        formatHalfStars(score) { return Math.round(score * 2) / 2; },
        getStarHTML(score) {
            const halfStars = Math.round(score * 2);
            const fullStars = Math.floor(halfStars / 2);
            const hasHalf = halfStars % 2 === 1;
            const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
            let html = '';
            for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star"></i>';
            if (hasHalf) html += '<i class="fas fa-star-half-alt"></i>';
            for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star"></i>';
            return html;
        },
        getLevel(term) { return VOCABULARY[term] ?? 0; },
        getLevelColor(term) { return LEVEL_MAP[VOCABULARY[term] ?? 0] ?? 'secondary'; },
        getButtonClass(term) { return `btn-outline-${this.getLevelColor(term)}`; },
        getVocabulary() { return { ...VOCABULARY }; },
        getVocabularyByCategory() {
            return {
                'Daring': ['Dogmatic', 'Formulaic', 'Creative', 'Provocative'],
                'Ambition': ['Lazy', 'Rushed', 'Aspiring', 'Masterful'],
                'Engagement': ['Punishing', 'Uneven', 'Engaging', 'Irresistible'],
                'Satisfaction': ['Contemptible', 'Unremarkable', 'Rewarding', 'Unforgettable']
            };
        }
    };
});
