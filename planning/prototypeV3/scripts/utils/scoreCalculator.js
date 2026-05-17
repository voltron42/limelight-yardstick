/**
 * Namespace: ly.prototypeV3.utils.ScoreCalculator
 * Purpose: Calculate scores from taxonomic ratings
 * 
 * Reference: PROTOTYPEV2_PLAN.md - Metrics section
 * - Taxonomic Rating = The set of selected vocabulary terms
 * - Calculated Score = Half-star rating derived from taxonomic rating (0-5 stars)
 */

namespace('ly.prototypeV3.utils.ScoreCalculator', {}, () => {
  
  const levelScores = {
    'Extremely Negative': 0,
    'Moderately Negative': 1,
    'Moderately Positive': 3,
    'Extremely Positive': 5
  };
  
  const categoryWeights = {
    'Daring': 0.25,
    'Ambition': 0.25,
    'Engagement': 0.25,
    'Satisfaction': 0.25
  };
  
  return {
    /**
     * Calculate a score (0-5 stars) from taxonomic rating
     * @param {Object} taxonomicRating - { Daring: 'Provocative', Ambition: 'Masterful', ... }
     * @returns {number} Score from 0 to 5 in 0.5 increments
     */
    calculateScore: function(taxonomicRating) {
      if (!taxonomicRating || Object.keys(taxonomicRating).length === 0) {
        return 0;
      }
      
      let totalScore = 0;
      let count = 0;
      
      Object.entries(taxonomicRating).forEach(([category, term]) => {
        const termData = this.getTermData(term);
        if (termData) {
          totalScore += levelScores[termData.level] * (categoryWeights[category] || 0.25);
          count++;
        }
      });
      
      // Convert to 0-5 scale with 0.5 increments
      const score = (totalScore / 5) * 5;
      return Math.round(score * 2) / 2;
    },
    
    /**
     * Get term metadata (level, category)
     * @param {string} term - Vocabulary term
     * @returns {Object|null} { term, level, category }
     */
    getTermData: function(term) {
      const vocabulary = {
        'Dogmatic': { level: 'Extremely Negative', category: 'Daring' },
        'Lazy': { level: 'Extremely Negative', category: 'Ambition' },
        'Punishing': { level: 'Extremely Negative', category: 'Engagement' },
        'Contemptible': { level: 'Extremely Negative', category: 'Satisfaction' },
        
        'Formulaic': { level: 'Moderately Negative', category: 'Daring' },
        'Rushed': { level: 'Moderately Negative', category: 'Ambition' },
        'Uneven': { level: 'Moderately Negative', category: 'Engagement' },
        'Unremarkable': { level: 'Moderately Negative', category: 'Satisfaction' },
        
        'Creative': { level: 'Moderately Positive', category: 'Daring' },
        'Aspiring': { level: 'Moderately Positive', category: 'Ambition' },
        'Engaging': { level: 'Moderately Positive', category: 'Engagement' },
        'Rewarding': { level: 'Moderately Positive', category: 'Satisfaction' },
        
        'Provocative': { level: 'Extremely Positive', category: 'Daring' },
        'Masterful': { level: 'Extremely Positive', category: 'Ambition' },
        'Irresistible': { level: 'Extremely Positive', category: 'Engagement' },
        'Unforgettable': { level: 'Extremely Positive', category: 'Satisfaction' }
      };
      
      return vocabulary[term] || null;
    },
    
    /**
     * Get all vocabulary organized by category and level
     * @returns {Object} Vocabulary structure
     */
    getVocabulary: function() {
      return {
        'Daring': {
          'Extremely Negative': 'Dogmatic',
          'Moderately Negative': 'Formulaic',
          'Moderately Positive': 'Creative',
          'Extremely Positive': 'Provocative'
        },
        'Ambition': {
          'Extremely Negative': 'Lazy',
          'Moderately Negative': 'Rushed',
          'Moderately Positive': 'Aspiring',
          'Extremely Positive': 'Masterful'
        },
        'Engagement': {
          'Extremely Negative': 'Punishing',
          'Moderately Negative': 'Uneven',
          'Moderately Positive': 'Engaging',
          'Extremely Positive': 'Irresistible'
        },
        'Satisfaction': {
          'Extremely Negative': 'Contemptible',
          'Moderately Negative': 'Unremarkable',
          'Moderately Positive': 'Rewarding',
          'Extremely Positive': 'Unforgettable'
        }
      };
    },
    
    /**
     * Format score as star display
     * @param {number} score - Score from 0 to 5
     * @returns {string} Star display (e.g., "★★★★☆")
     */
    formatStars: function(score) {
      const fullStars = Math.floor(score);
      const hasHalfStar = (score % 1) !== 0;
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
      
      return '★'.repeat(fullStars) + 
             (hasHalfStar ? '½' : '') + 
             '☆'.repeat(emptyStars);
    }
  };
});