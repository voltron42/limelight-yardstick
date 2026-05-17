/**
 * Namespace: sortableapp.utils.ScoreCalculator
 * Purpose: Calculate scorecard rating and display value
 * 
 * Implements:
 * - Weighted score calculation based on category priority
 * - Percent normalization to 0-100%
 * - Half-star rating display
 * 
 * From: ReviewAndSuggestions.md
 * - Term values: 0=1.0 (Extremely Negative), 1=2.0, 2=3.0, 3=4.0 (Extremely Positive)
 * - Priority weights: [4x, 3x, 2x, 1x]
 * - Score percent: (weighted sum / max possible) * 100
 * - Half-star display: percent / 10, rounded to 0.5
 */

namespace('sortableapp.utils.ScoreCalculator', {}, () => {
  // Term index to value mapping
  const termValues = {
    0: 1.0,  // Extremely Negative
    1: 2.0,  // Moderately Negative
    2: 3.0,  // Moderately Positive
    3: 4.0   // Extremely Positive
  };

  // Priority multiplier weights [1st position, 2nd position, 3rd position, 4th position]
  const priorityWeights = [4, 3, 2, 1];

  // Minimum possible weighted sum: all terms selected as 1.0 (Extremely Negative)
  // (1.0 * 4) + (1.0 * 3) + (1.0 * 2) + (1.0 * 1) = 4 + 3 + 2 + 1 = 10
  const minPossibleScore = termValues[0] * (priorityWeights[0] + priorityWeights[1] + priorityWeights[2] + priorityWeights[3]);

  // Maximum possible weighted sum: all terms selected as 4.0 (Extremely Positive)
  // (4.0 * 4) + (4.0 * 3) + (4.0 * 2) + (4.0 * 1) = 16 + 12 + 8 + 4 = 40
  const maxPossibleScore = termValues[3] * (priorityWeights[0] + priorityWeights[1] + priorityWeights[2] + priorityWeights[3]);

  return {
    /**
     * Calculate score from selections
     * @param {Object} selections - { categoryId: termIndex, ... }
     * @param {Array} priorityOrder - [categoryId, categoryId, ...] in priority order (1st is highest priority)
      @returns {Object} { percent: number, halfStars: number, isComplete: boolean }
     */
    calculateScore: (selections, priorityOrder) => {
      // Validate inputs
      if (!selections || !priorityOrder || priorityOrder.length === 0) {
        return {
          percent: 0,
          halfStars: 0,
          isComplete: false
        };
      }

      // If not all categories selected, return incomplete state
      if (!priorityOrder.every(catId => selections.hasOwnProperty(catId) && selections[catId] !== null && selections[catId] !== undefined)) {
        return {
          percent: 0,
          halfStars: 0,
          isComplete: false
        };
      }

      // Calculate weighted sum
      let weightedSum = 0;
      priorityOrder.forEach((categoryId, index) => {
        const termIndex = selections[categoryId];
        // Ensure termIndex is a valid number (0-3)
        if (typeof termIndex !== 'number' || termIndex < 0 || termIndex > 3) {
          return; // Skip invalid entries
        }
        const termValue = termValues[termIndex] || 1.0;
        const weight = priorityWeights[index];
        weightedSum += termValue * weight;
      });

      // Normalize to percent (0-100%) accounting for min and max possible scores
      const percent = Math.round(((weightedSum - minPossibleScore) / (maxPossibleScore - minPossibleScore)) * 100);

      // Calculate half-star rating (0 to 5 stars, in 0.5 increments)
      const halfStars = Math.round(percent / 10) / 2;

      return {
        percent,
        halfStars,
        isComplete: true
      };
    },

    /**
     * Format half-stars as visual stars
     * @param {number} halfStars - Number of half-stars (0, 0.5, 1, 1.5, ..., 5)
     * @returns {string} Star display string
     */
    formatStars: (halfStars) => {
      // Clamp halfStars to valid range [0, 5]
      const clampedHalfStars = Math.max(0, Math.min(5, halfStars));
      
      const fullStars = Math.floor(clampedHalfStars);
      const hasHalf = clampedHalfStars % 1 !== 0;

      let stars = '★'.repeat(fullStars);
      if (hasHalf) {
        stars += '⯨'; // Half star symbol
      }
      stars += '☆'.repeat(5 - Math.ceil(clampedHalfStars));

      return stars;
    },

    /**
     * Get term value for display/calculation
     * @param {number} termIndex - 0-3
     * @returns {number} Value 1.0-4.0
     */
    getTermValue: (termIndex) => {
      return termValues[termIndex] || 1.0;
    },

    /**
     * Get priority weight for category at given index
     * @param {number} index - Priority position (0 = highest priority)
     * @returns {number} Weight multiplier (4, 3, 2, or 1)
     */
    getPriorityWeight: (index) => {
      return priorityWeights[index] || 1;
    },

    /**
     * Get max possible score for reference
     * @returns {number}
     */
    getMaxScore: () => maxPossibleScore
  };
});
