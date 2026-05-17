# Limelight Yardstick: Similarity Algorithm Analysis

**Purpose**: Find users with compatible movie tastes to enable recommendations and community discovery  
**Status**: Pre-implementation design  
**Date**: May 1, 2026

---

## Core Insight: Two Dimensions of Taste

The Limelight Yardstick rating system has a unique duality that enables nuanced similarity matching:

### Dimension 1: PRIORITIES (Taxonomic Rating)
The order in which users rank categories reveals their **taste philosophy**:
- User A prioritizes: **Provocative** → Masterful → Engaging → Memorable
  - *"Bold stories with perfect execution are what matter to me"*
- User B prioritizes: **Ambitious** → Daring → Rewarding → Captivating
  - *"Production quality and emotional payoff are what matter to me"*

Even if both users gave the same film a **78% score**, their reasoning differs fundamentally.

### Dimension 2: INTENSITY (Numeric Rating)
The numeric score (0–100%) reveals **how strongly** a user felt about a film:
- Score = (sum of weighted category sentiments - 10) / 30 × 100%
  - Each category valued at 1-4 points, weighted by user's priority ranking
  - Minimum: all 1s (extremely negative) → 0%
  - Maximum: all 4s (extremely positive) → 100%

---

## Algorithm Options: Matching Strategy

### Option A: Prioritize Priorities (Taxonomic Alignment First)

**Philosophy**: Users with similar **taste philosophies** will recommend good movies to each other, even if specific scores differ.

#### Approach 1A: Exact Taxonomic Match

**Calculation**: Count films where both users assigned the **same category ranking**.

```
Similarity = (films with identical rankings) / (shared films) × 100%
```

**Example**:
- User A rates 5 films with ranking: Daring(1st) > Ambition(2nd) > Engagement(3rd) > Satisfaction(4th)
- User B rates 3 of those 5 films with the SAME ranking order
- Similarity = 3/5 = **60%**

**Pros**:
- ✅ Simple to compute
- ✅ Semantic meaning: "We prioritize things the same way"
- ✅ Reveals ideological compatibility (philosophy of film taste)
- ✅ Immune to score inflation/deflation (one user rates 90% average, other 60%)

**Cons**:
- ❌ Brittle: one different ranking order = total mismatch
- ❌ Requires high overlap to be meaningful
- ❌ Doesn't account for strength of feeling (both users could score film 5% or 95%)

**MVP Viability**: ⭐⭐ (Too strict; will rarely find matches)

---

#### Approach 1B: Category Weighting Correlation

**Calculation**: Compare how users weight categories across their ratings.

```
For each user, calculate average ranking position per category:
  User A: Daring(avg pos 1.2) > Satisfaction(avg pos 2.1) > Ambition(avg pos 2.8) > Engagement(avg pos 3.9)
  User B: Daring(avg pos 1.3) > Satisfaction(avg pos 2.0) > Ambition(avg pos 2.7) > Engagement(avg pos 3.8)

Similarity = Spearman/Pearson correlation of rank orderings
```

**Pros**:
- ✅ Flexible: allows variation in individual ratings
- ✅ Captures taste philosophy without requiring exact matches
- ✅ Works with fewer shared films (5-10 can show pattern)
- ✅ Reveals consistent user priorities across diverse films

**Cons**:
- ❌ More complex; requires statistical library
- ❌ Still primarily taxonomic (ignores score intensity)
- ❌ Correlation less intuitive to explain to users

**MVP Viability**: ⭐⭐⭐⭐ (Recommended for "Similar Users" discovery widget)

---

### Option B: Prioritize Intensity (Score Alignment First)

**Philosophy**: Users who consistently rate films similarly (high when others rate high, low when others rate low) will reliably recommend films.

#### Approach 2A: Simple Euclidean Distance on Scores

**Calculation**: For shared films, calculate distance between score vectors.

```
For each shared film, compute score difference:
  Film X: User A = 75%, User B = 78% → diff = 3%
  Film Y: User A = 42%, User B = 40% → diff = 2%
  Film Z: User A = 88%, User B = 85% → diff = 3%

Euclidean Distance = sqrt(3² + 2² + 3²) = sqrt(22) ≈ 4.69%
Similarity = 100% - distance = **95.3%**
```

**Pros**:
- ✅ Intuitive: "Our scores are close"
- ✅ Easy to compute and explain
- ✅ Captures score reliability (whether both users agree on film quality)

**Cons**:
- ❌ Doesn't reveal **why** scores align (both loved it, or both hated it?)
- ❌ Two users could have identical scores but opposite reasons:
  - User A: Film is Provocative+Masterful (high Daring, high Ambition)
  - User B: Film is Engaging+Rewarding (high Engagement, high Satisfaction)
- ❌ Doesn't account for shared philosophy differences

**MVP Viability**: ⭐⭐⭐ (Good for validation, but incomplete alone)

---

#### Approach 2B: Cosine Similarity on Category Sentiment Vectors

**Calculation**: Treat each category's average sentiment level as a dimension, compute cosine similarity.

```
For each user, compute average sentiment per category across all films:
  User A: Daring(2.8) Ambition(3.2) Engagement(2.5) Satisfaction(3.1)
  User B: Daring(2.7) Ambition(3.3) Engagement(2.4) Satisfaction(3.0)

Vector A = [2.8, 3.2, 2.5, 3.1]
Vector B = [2.7, 3.3, 2.4, 3.0]

Cosine Similarity = (A·B) / (||A|| × ||B||)
                  = (2.8×2.7 + 3.2×3.3 + 2.5×2.4 + 3.1×3.0) / (sqrt(sum(A²)) × sqrt(sum(B²)))
                  = 31.67 / (5.43 × 5.44)
                  ≈ **1.07 ≈ 0.973 or 97.3% similar**
```

**Pros**:
- ✅ Captures **what users value** (pattern of category sentiments)
- ✅ Robust to scale differences (one user averages 2.0-3.0, other 2.8-3.8)
- ✅ Works with fewer films (10+ films per user sufficient)
- ✅ Mathematically elegant; proven in recommendation systems

**Cons**:
- ❌ Requires more data points per user (at least 10 ratings)
- ❌ Slightly more complex to compute/explain
- ❌ Doesn't account for ranking **order** (priority weighting)

**MVP Viability**: ⭐⭐⭐⭐⭐ (Recommended for score-based matching)

---

### Option C: Hybrid Approach (Combined Taxonomic + Intensity)

**Philosophy**: Combine taste philosophy + score alignment for nuanced matching.

#### Approach 3A: Weighted Combination (Recommended)

**Calculation**: Calculate both dimensions separately, weight them.

```
Similarity = (w₁ × Taxonomic Alignment) + (w₂ × Score Correlation)

Where:
  Taxonomic Alignment = Spearman correlation of category importance rankings
  Score Correlation   = Cosine similarity on average category sentiments
  w₁ + w₂ = 1.0 (typically w₁ = 0.3, w₂ = 0.7 for MVP)
```

**Example with w₁=0.3, w₂=0.7**:
- User A & B have Taxonomic Alignment = 0.85 (fairly similar priorities)
- User A & B have Score Correlation = 0.92 (similar sentiment patterns)
- Combined Similarity = (0.3 × 0.85) + (0.7 × 0.92) = 0.255 + 0.644 = **0.899 or 89.9%**

**Pros**:
- ✅ Captures both dimensions of taste
- ✅ Tunable weights allow priority adjustment
- ✅ Can weight more heavily on score correlation (0.7) for conservative MVP
- ✅ Can later increase weight on philosophy (0.3) as more data accumulates
- ✅ Explains to users: "You rate things similarly AND for similar reasons"

**Cons**:
- ❌ More complex to implement/explain
- ❌ Requires tuning weights (could be done via A/B testing)
- ❌ Two hyperparameters to optimize

**MVP Viability**: ⭐⭐⭐⭐⭐ (Best choice for balanced recommendations)

---

#### Approach 3B: Conditional Hybrid (Advanced)

**Calculation**: Use different weighting based on data availability.

```
IF (shared_films < 5):
  Use only Taxonomic Alignment (philosophy-driven cold start)
ELSE IF (shared_films < 15):
  Use Weighted Hybrid with w₁=0.5, w₂=0.5
ELSE:
  Use Weighted Hybrid with w₁=0.3, w₂=0.7
```

**Pros**:
- ✅ Gracefully handles cold-start users (few ratings)
- ✅ Becomes more score-confident as users rate more
- ✅ Recommends similar-philosophy users early; refines to score-aligned users later

**Cons**:
- ❌ More complex; harder to explain to users
- ❌ Similarity score changes as user rates more (might surprise users)

**MVP Viability**: ⭐⭐⭐ (Good for Phase 2 refinement)

---

## Implementation Strategy: MVP vs. Phase 2

### Phase 1 MVP: Simple & Proven

**Recommended Approach**: **Option 2B (Cosine Similarity on Category Sentiments)** + **Option 1B (Category Weighting Correlation)**

#### Why This Combo?
1. **Cosine Similarity (Score-based)**: 
   - Primary similarity metric (70% of weight conceptually)
   - Easy to compute and explain
   - Works well with modest user bases (100-1000 users)
   - Proven in Netflix/Spotify recommendations

2. **Category Weighting Correlation (Philosophy-based)**:
   - Secondary validation (30% of weight conceptually)
   - Catches users with different philosophies who happen to score similarly
   - Helps avoid false matches (e.g., two users both rated a film 6/10 but for opposite reasons)

#### Algorithm (MVP):

```
Step 1: Filter candidates
  - Users with ≥3 shared films (to ensure meaningful overlap)
  
Step 2: Compute Score Similarity (Cosine)
  - Vector = [avg_daring_sentiment, avg_ambition_sentiment, avg_engagement_sentiment, avg_satisfaction_sentiment]
  - Cosine similarity on these 4 dimensions
  - Returns: 0.0 - 1.0 score

Step 3: Compute Philosophy Similarity (Spearman)
  - Rank order of category importance per user (1st, 2nd, 3rd, 4th)
  - Spearman rank correlation
  - Returns: 0.0 - 1.0 score

Step 4: Combine (weighted)
  - Final Similarity = (0.3 × Philosophy) + (0.7 × Score)
  - Returns: 0.0 - 1.0 score
  
Step 5: Filter & Rank
  - Keep users with Similarity ≥ 0.65
  - Sort descending
  - Display top 10 on "Similar Users" dashboard widget
```

#### Thresholds (MVP):
- **Minimum shared films**: ≥3 (can be as low as 1-2 for recommendations)
- **Minimum similarity**: ≥0.65 (65% similar to appear in "Similar Users" widget)
- **Maximum similar users displayed**: Top 10
- **Display rules**: Hide users under threshold; "More similar users will appear as you rate more films"

#### Rationale:
- ≥3 shared films: Ensures statistically meaningful comparison
- 0.65 threshold: 65% similar means users reliably agree on film quality
- Top 10: Large enough to find recommendations; small enough to feel curated
- 0.3/0.7 weights: Favor score alignment (more actionable) while acknowledging philosophy

---

### Phase 2 Refinement: Advanced Matching

After MVP launch with 100+ users:

1. **A/B Test weights**: Try 0.4/0.6, 0.3/0.7, 0.5/0.5 to find optimal
2. **Analyze false positives**: If recommended films consistently disappoint, adjust thresholds
3. **Implement Conditional Hybrid** (Approach 3B): Different thresholds for cold-start users
4. **Semantic enrichment**: Cluster users by both similarity AND shared favorite films
5. **Temporal weighting**: Weight recent ratings more heavily (user taste evolves)

---

## Special Considerations: Taxonomic Nuance

### Gotcha 1: Vocabulary Polarity (Daring vs. Ambition)

Two users might have opposite category priorities but still be compatible:

```
User A: Provocative(1st) > Masterful(2nd) > ... [Values bold stories over perfect craft]
User B: Masterful(1st) > Provocative(2nd) > ... [Values perfect craft over bold stories]

Spearman correlation = -1.0 (perfect negative correlation!)
But they might both enjoy art-house indie films; just for different reasons.
```

**Mitigation**: 
- Don't use Spearman directly; use **absolute correlation** (ignore sign)
- OR: Weight both high-correlation matches (0.9+) AND low-correlation matches (0.1-) differently
- Insight: Complementary philosophy users might make good *recommenders* even if taste differs

### Gotcha 2: Scale Differences (Harsh Critics vs. Optimists)

Two users with identical taste but different rating scales:

```
User A: averages 65% (harsh critic; rarely rates above 75%)
User B: averages 80% (optimist; rarely rates below 70%)

Cosine similarity might miss them (different magnitude vectors).
But they could be perfectly compatible.
```

**Mitigation**:
- **Normalize vectors before computing cosine**: Subtract mean and divide by std deviation
- Or use **Pearson correlation** (already normalizes) instead of cosine
- Result: Detects users who agree on relative ranking even if absolute scores differ

### Gotcha 3: Cold-Start Problem (New Users)

A new user with only 2 ratings should still find similar users:

```
If we require ≥3 shared films, they might only match with 10 other new users.
But they have a philosophy (Daring > Satisfaction) even with 2 films.
```

**Mitigation**:
- Start with **philosophy matching only** for users with <5 ratings
- Require ≥3 shared films only after they hit 5+ ratings
- Display: "Similar users based on your taste priorities" vs. "Similar users based on your ratings"

---

## Recommended MVP Implementation Path

### Week 1: Backend Setup
```clojure
; Calculate average sentiment per category per user
(defn user-sentiment-vector [user-ratings]
  {:daring (avg (map :daring user-ratings))
   :ambition (avg (map :ambition user-ratings))
   :engagement (avg (map :engagement user-ratings))
   :satisfaction (avg (map :satisfaction user-ratings))})

; Calculate category ranking (1-4) per user
(defn category-ranking-vector [user-ratings]
  (let [avg-ranks (->> user-ratings
                      (map :rank-order)
                      (apply map vector)
                      (map #(/ (apply + %) (count %))))]
    {:daring (get-rank avg-ranks 0)
     :ambition (get-rank avg-ranks 1)
     :engagement (get-rank avg-ranks 2)
     :satisfaction (get-rank avg-ranks 3)}))

; Cosine similarity (normalized)
(defn cosine-similarity [vec-a vec-b]
  (let [dot-product (+ (* (:daring vec-a) (:daring vec-b))
                       (* (:ambition vec-a) (:ambition vec-b))
                       (* (:engagement vec-a) (:engagement vec-b))
                       (* (:satisfaction vec-a) (:satisfaction vec-b)))
        magnitude-a (sqrt (+ (pow (:daring vec-a) 2) ...))
        magnitude-b (sqrt (+ (pow (:daring vec-b) 2) ...))]
    (/ dot-product (* magnitude-a magnitude-b))))

; Spearman correlation (via rank ordering)
(defn spearman-correlation [rank-vec-a rank-vec-b]
  (let [d-squared (+ (pow (- (:daring rank-vec-a) (:daring rank-vec-b)) 2) ...)]
    (- 1 (/ (* 6 d-squared) (- (* n (pow n 2) 1))))))

; Combined similarity (MVP)
(defn similarity-score [user-a user-b shared-film-count]
  (when (>= shared-film-count 3)
    (let [sentiment-sim (cosine-similarity
                         (user-sentiment-vector user-a)
                         (user-sentiment-vector user-b))
          philosophy-sim (spearman-correlation
                          (category-ranking-vector user-a)
                          (category-ranking-vector user-b))
          combined (+ (* 0.7 sentiment-sim) (* 0.3 philosophy-sim))]
      (when (>= combined 0.65) combined))))
```

### Week 2: Frontend Widget
- Dashboard "Similar Users" widget
- Sort by similarity descending
- Show top 10
- Click to view public profile (if opt-in)
- Lazy-load if >10 similar users exist

### Week 3: Testing & Refinement
- A/B test weights with early users
- Collect feedback on recommendation quality
- Adjust threshold if needed

---

## Comparison Matrix: Algorithm Options

| Option | Complexity | Accuracy | Cold-Start | Interpretability | Tuning |
|--------|-----------|----------|-----------|-----------------|--------|
| **1A: Exact Taxonomic** | Low | Low | ⭐⭐⭐⭐⭐ | High | None |
| **1B: Correlation (Philosophy)** | Medium | Medium | ⭐⭐⭐⭐ | Medium | None |
| **2A: Euclidean Distance** | Low | Medium | ⭐⭐⭐ | High | Distance threshold |
| **2B: Cosine Similarity** | Medium | High | ⭐⭐⭐ | Medium | Similarity threshold |
| **3A: Weighted Hybrid** ✅ | Medium | High | ⭐⭐⭐⭐ | Medium | w₁, w₂ weights |
| **3B: Conditional Hybrid** | High | Very High | ⭐⭐⭐⭐⭐ | Low | Conditional thresholds |

---

## Formula Reference: Score Calculation

For reference when building similarity metrics:

```
Numeric Score Formula:
  score_raw = (d_val × 4) + (a_val × 3) + (e_val × 2) + (s_val × 1)
  where d, a, e, s ∈ {1, 2, 3, 4} (sentiment levels)
  
  score_percent = (score_raw - min) / (max - min) × 100%
  where min = 1×4 + 1×3 + 1×2 + 1×1 = 10 (all extremely negative)
        max = 4×4 + 4×3 + 4×2 + 4×1 = 40 (all extremely positive)
  
  score_percent = (score_raw - 10) / 30 × 100%
  
Range: 0% (all 1s) to 100% (all 4s)
```

---

## Next Steps

1. ✅ Choose **Option 3A (Weighted Hybrid)** for MVP
2. ⏳ Implement Cosine Similarity + Spearman Correlation in backend
3. ⏳ Build "Similar Users" dashboard widget in React
4. ⏳ Set thresholds: ≥3 shared films, ≥0.65 similarity, top 10 display
5. ⏳ A/B test weights (0.3/0.7 vs. alternatives) after 50 users
6. ⏳ Refine for Phase 2 (cold-start handling, temporal weighting)

---

**Document Version**: 1.0  
**Last Updated**: May 1, 2026  
**Owner**: @voltron42  
**Status**: Ready for implementation
