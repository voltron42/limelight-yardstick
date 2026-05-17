# Similarity Algorithm Brainstorm: Analysis & Elaboration

**Purpose**: Evaluate the brainstorm's `diffRatings` approach against the analysis options  
**Date**: May 1, 2026  
**Context**: Connecting [similarityAlgorithmBrainstorm.md](./similarityAlgorithmBrainstorm.md) to [SIMILARITY_ALGORITHM_ANALYSIS.md](./SIMILARITY_ALGORITHM_ANALYSIS.md)

---

## Overview: The Brainstorm Approach

The brainstorm proposes a **pairwise distance metric** that combines three dimensions:

```javascript
diffRatings(userA_film, userB_film) = 
  SUM over [daring, ambition, engagement, satisfaction]:
    max(weightA, weightB) × |ratingA - ratingB| × (1 + |weightA - weightB|)
```

This is a **three-part hybrid distance measure** that:
1. **Amplifies by priority**: `max(weightA, weightB)` ensures disagreements on important categories matter more
2. **Penalizes sentiment differences**: `|ratingA - ratingB|` captures how differently they rated the category
3. **Further penalizes priority disagreement**: `(1 + |weightA - weightB|)` adds extra penalty if they prioritized it differently

---

## Comparison to Analysis Options

### How the Brainstorm Relates to Previous Analysis

**Updated Algorithm**: The brainstorm now includes a `max(weight)` multiplier that amplifies rating differences in highly-prioritized categories. A disagreement on a 1st-priority category (weight 4) is penalized more heavily than a disagreement on a 4th-priority category (weight 1).

| Analysis Option | Brainstorm Approach | Relationship |
|-----------------|-------------------|-------------|
| **Option 2A (Euclidean Distance)** | Similar conceptually | Both compute pairwise distance; brainstorm adds weight modulation |
| **Option 2B (Cosine Similarity)** | Related but different direction | Cosine works on full user vectors; brainstorm works on single-film pairs |
| **Option 3A (Weighted Hybrid)** | Complementary | Analysis uses aggregate vectors; brainstorm fine-tunes per-film differences |

### Key Insight: Film-by-Film vs. Aggregate

**Brainstorm approach** (pairwise):
- Compares specific films: "How differently did User A and User B rate *this film*?"
- Useful for understanding individual recommendation compatibility
- Provides granular data

**Analysis approach** (aggregate):
- Compares overall patterns: "Do these users share similar taste *across all films*?"
- Useful for finding Similar Users on dashboard
- Provides holistic view

**Recommendation**: **Use brainstorm for validation; use analysis for discovery**

---

## Question 1: Efficiency?

### Computational Complexity

```
Brainstorm diffRatings() on single film pair:
  - Parse taxonomic ratings: O(4) = O(1) [fixed 4 categories]
  - Reduce loop: O(4) = O(1)
  - Total: O(1) per film pair

Aggregate similarity (from analysis):
  - Collect all films per user: O(n) [n = # films rated by user]
  - Compute vectors: O(4) = O(1)
  - Cosine similarity: O(4) = O(1)
  - Total: O(n) per user pair
```

**Brainstorm is more efficient for single comparisons; analysis is more efficient for batch processing.**

### Practical Efficiency Analysis

#### Scenario 1: Find similar users to User A (dashboard load)
```
User A has rated: 50 films
All other users: 500 users
Shared films per user: avg 5-10

Option A (Brainstorm - per-film pairwise):
  FOR each of 500 users:
    FOR each of 5-10 shared films:
      diffRatings() = O(1)
  Total: 500 × 7 × O(1) = 3,500 operations
  
Option B (Analysis - aggregate vectors):
  FOR each of 500 users:
    Compute user vector: O(50) [aggregate all their ratings]
    Compute similarity: O(1) [cosine on 4 dimensions]
  Total: 500 × (50 + 1) = 25,500 operations
  
Winner: **Brainstorm is 7x more efficient for similar user discovery**
```

#### Scenario 2: Recommend films to User A (full batch)
```
User A wants recommendations
Need to find top 100 similar users first

Option A (Brainstorm - sequential):
  Find 500 candidates: 3,500 ops (as above)
  Rank by avg diffRatings: 500 × 7 = 3,500 ops
  Total: 7,000 ops

Option B (Analysis - vectorized):
  Compute all user vectors: 500 × 50 = 25,000 ops [one-time]
  Find similarities: 500 × 1 = 500 ops
  Total: 25,500 ops (first run); then 500 ops for subsequent runs
  
Winner (first run): **Brainstorm** (7,000 vs. 25,500)
Winner (cached): **Analysis** (500 vs. 7,000)
```

### Efficiency Recommendation

✅ **Use Brainstorm for MVP** (efficient per-film comparisons, no caching overhead)  
→ Add Analysis optimization later if real-time performance bottlenecks appear

---

## Question 2: When Do We Do This?

### Timing Strategy

#### Option A: Eager Computation (Pre-compute all similarities)

**When**: Background job, runs nightly or weekly

```
1. Every night at 2 AM:
   - Collect all user pairs with ≥3 shared films
   - Compute diffRatings for each shared film
   - Aggregate into similarity score
   - Store in `user_similarity` table
   - Index by (user_a, user_b, similarity_score)

2. Dashboard load (user views "Similar Users"):
   - Query: SELECT * FROM user_similarity WHERE user_a = ? ORDER BY similarity_score DESC LIMIT 10
   - Return: ~10 ms (indexed lookup)
```

**Pros**: ✅ Dashboard loads instantly  
**Cons**: ❌ Computationally intensive at scale; ❌ Stale data until next refresh

**Cost**: 500 users → 500 choose 2 = 124,750 pairs; avg 7 shared films = 873,250 operations ≈ 2-3 seconds nightly

---

#### Option B: Lazy Computation (Compute on-demand, cache result)

**When**: First time someone views "Similar Users"; cache for 24 hours

```
1. User views "Similar Users" on dashboard:
   - Check cache for (user_id, timestamp)
   - IF cache miss OR cache age > 24 hours:
     a. Query all users with ≥3 shared films
     b. Compute diffRatings for each pair
     c. Rank by similarity
     d. Store in cache with TTL = 24 hours
   - Return top 10 from cache

2. Second load (user refreshes):
   - Return from cache (~10 ms)
```

**Pros**: ✅ Computed only when needed; ✅ Fresh data on first load  
**Cons**: ❌ First load takes 2-5 seconds; ❌ Users see loading spinner

**Cost**: Only computed when users actively browse (not all users daily)

---

#### Option C: Hybrid - Both (Eager + Lazy with validation)

**When**: Nightly eager job + lazy refresh on-demand if cache stale

```
1. Nightly: Compute similarities for all users (as Option A)
2. On dashboard load: Use cache if age < 24 hours
3. If user clicks "Refresh": Force recompute (background job) and return fresh data
```

**Pros**: ✅ Fast dashboard loads (pre-computed); ✅ Optional fresh data; ✅ Handles new ratings elegantly  
**Cons**: ⚠️ More complex; requires scheduled task + cache layer

---

#### Option D: Incremental Background Worker (Triggered on Scorecard Submission) ✅ **RECOMMENDED**

**When**: Background worker thread processes scorecard submissions asynchronously; updates only affected user pairs

```
1. User submits scorecard for Film X:
   a. Persist rating to database
   b. Queue event: {user_id, film_id, rating}
   c. Return success immediately to user (no waiting)

2. Background worker (async):
   a. Consume event from queue
   b. Query users who have also rated Film X
   c. For each such user pair (≥3 shared films total):
      - Compute diffRatings for all shared films (including new one)
      - Update similarity score in cache + database
   d. Invalidate both users' "Similar Users" cache entries

3. Dashboard load (user views "Similar Users"):
   - Query cache (likely pre-computed)
   - If cache miss (very unlikely), lazy-compute (still fast due to smaller scope)
   - Return: ~50 ms (mostly cache lookups)

Example timing:
  User A rates "Dune": 200 ms (request)
  Background worker updates:
    - Users B, C, D (who also rated "Dune"): 50 ms total
    - Updates their similarity scores in cache/DB
  User A refreshes dashboard 5 seconds later: ~50 ms (cache hit)
  User B refreshes dashboard 5 seconds later: ~50 ms (freshly updated cache)
```

**Pros**: 
- ✅ Near real-time similarity updates (computed within seconds of new rating)
- ✅ Only computes affected pairs (efficient; 50-100 ops vs. 873k for full matrix)
- ✅ Dashboard loads fast (~50 ms cached) without 2-5 second spinner
- ✅ No scheduled nightly jobs needed
- ✅ Data is always fresh (updated immediately on new ratings)
- ✅ Scales well to 10k+ users (only recomputes per-film pairs, not full matrix)
- ✅ Simple to understand conceptually

**Cons**: 
- ⚠️ Requires message queue + background worker infrastructure
- ⚠️ Slightly more complex than lazy-on-demand
- ⚠️ Must handle queue failures gracefully (dead-letter queue, retries)

**Cost**: 
- Per scorecard: 50-100 similarity updates (per film)
- Total: Minimal load; spreads work across time (not batch)
- Monthly (500 users × 50 ratings each): ~1.25M updates, spread across month

**Architecture**:
```
┌─────────────┐
│   Frontend  │
│ "Rate Film" │
└──────┬──────┘
       │ POST /api/ratings
       ▼
┌──────────────────┐
│  Backend API     │
│  Ring + Compojure│
│  - Validate      │
│  - Persist       │
│  - Queue event   │
│  - Return 200 OK │
└──────┬───────────┘
       │ Rating persisted instantly
       │ User sees success immediately
       ▼
┌──────────────────┐
│  core.async      │
│  Channel         │
│  (Buffered: 100) │
│  Event: {user_id,│
│   film_id}       │
└──────┬───────────┘
       │ Async consumption
       ▼
┌──────────────────────┐
│ Background Worker    │
│ (Long-running thread)│
│ - Find affected users│
│ - Compute diffs      │
│ - Update cache/DB    │
│ - Invalidate caches  │
└──────────────────────┘
       │ Updates happen within 1-5 seconds
       ▼
┌──────────────────┐
│   Redis Cache    │
│ {similar-users:  │
│  user_a,         │
│  user_b, ...}    │
└────┬─────────────┘
     │ Pre-computed when user views dashboard
     ▼
┌──────────────────┐
│   Frontend       │
│ "Similar Users"  │
│ Loads ~50 ms     │
└──────────────────┘
```

**Implementation** (Clojure with core.async):
```clojure
(require '[clojure.core.async :as async])

; Create channel at app startup (buffered for backpressure)
(def similarity-updates-chan (async/chan 100))

; Main API endpoint (fast, non-blocking)
(defn create-rating [user-id film-id rating]
  (db/create-rating user-id film-id rating)
  (async/put! similarity-updates-chan
              {:user_id user-id :film_id film-id})
  {:status 200 :body "Rating saved"})

; Background worker (single go-loop for simplicity)
(defn start-similarity-worker []
  (async/go-loop []
    (when-let [{:keys [user-id film-id]} 
               (async/<! similarity-updates-chan)]
      ; Find all users who rated this same film
      (let [other-users (db/find-users-with-film film-id)]
        ; Update only affected pairs (≥3 shared films)
        (doseq [other-user other-users]
          (when (>= (db/count-shared-films user-id other-user) 3)
            (let [new-similarity (compute-similarity user-id other-user)]
              (db/upsert-similarity user-id other-user new-similarity)
              ; Invalidate both users' caches
              (cache/delete (str "similar-users:" user-id))
              (cache/delete (str "similar-users:" other-user))))))
      (recur))))

; Optional: Start multiple go-loops for parallelism (if needed)
(defn start-workers []
  (dotimes [i 1]  ; Single worker thread sufficient for MVP
    (start-similarity-worker)))

; Dashboard fetch (cache-aware)
(defn get-similar-users [user-id]
  (or (cache/get (str "similar-users:" user-id))
      (let [similar (compute-similar-users user-id)]
        (cache/set (str "similar-users:" user-id) similar :ttl 48-hours)
        similar)))
```

**Why core.async over external queues**:
- ✅ No external dependencies (included in Clojure)
- ✅ Built-in backpressure (channel buffer of 100)
- ✅ Idiomatic Clojure patterns (go-loops, channels)
- ✅ Perfect for MVP (single process, in-memory)
- ✅ Scales to thousands of events/sec
- ⏸️ Future: Upgrade to SQS/RabbitMQ if multi-instance deployment needed

**Comparison to Options A & B**:

| Aspect | Option A (Eager) | Option B (Lazy) | Option D (Incremental) |
|--------|-----------------|-----------------|----------------------|
| **Computation Timing** | Every 24h nightly | On first dashboard load | On new scorecard submission |
| **Fresh Data** | Up to 24h stale | Instantly fresh (but 2-5s wait) | ~1-5s old (but no wait) |
| **Dashboard Load Time** | ~50 ms (instant) | 2-5 sec (first load) | ~50 ms (always cached) |
| **Scalability at 10k users** | ⚠️ Slow (873k ops nightly) | ✅ Fine (lazy) | ✅ Excellent (incremental) |
| **Infrastructure** | Scheduled job | Lazy cache | core.async channel + go-loop |
| **Implementation Complexity** | Medium | Low | Low |
| **Failure Mode** | Stale data if job fails | Recompute on demand | Stale cache; retries on next rating |
| **Cost** | Fixed (nightly batch) | Variable (per request) | **Minimal** (1-5 sec delay spread) |

---

### MVP Recommendation: **Option D (Incremental Background Worker)**

**Why**:
- ✅ Best user experience: fast dashboard loads + fresh data
- ✅ Best efficiency: only recomputes affected pairs (minimal load)
- ✅ Scales naturally: works same way at 100 or 10,000 users
- ✅ Real-time feel: similarities update as users rate films
- ✅ Simple infrastructure: core.async channels + one go-loop
- ✅ Graceful degradation: if worker fails, similarities just stale; doesn't block rating submission

**When to Pivot**: 
- If queue becomes a bottleneck at 10k+ concurrent users, upgrade to dedicated job queue (RabbitMQ, SQS)
- If worker thread can't keep up, add 3-5 worker threads in parallel (already shown above)

**Implementation Priority**:
1. Week 1: Build rating submission endpoint + initialize core.async channel at startup
2. Week 2: Build similarity-update worker go-loop + cache invalidation
3. Week 3: Add monitoring + error handling for failed updates

**Implementation** (Option D - Incremental Background Worker):
```clojure
; Rating submission endpoint (fast, non-blocking)
(defn create-rating [user-id film-id rating]
  (let [result (db/create-rating user-id film-id rating)]
    ; Queue update event for background worker
    (queue/enqueue :similarity-updates 
                   {:type :new-rating
                    :user_id user-id
                    :film_id film-id})
    {:status 200 :body (assoc result :queued true)}))

; Background worker thread (processes similarity updates)
(defn similarity-update-worker []
  (loop []
    (if-let [event (queue/dequeue :similarity-updates :timeout-ms 1000)]
      (try
        (let [{user-id :user_id film-id :film_id} event
              ; Find all users who have rated this same film
              other-users (db/find-users-with-film film-id)]
          
          ; For each other user, check if we should update similarity
          (doseq [other-user-id other-users]
            (let [shared-count (db/count-shared-films user-id other-user-id)]
              (when (>= shared-count 3)  ; Only update if ≥3 shared films
                (let [shared-films (db/find-shared-films user-id other-user-id)
                      new-similarity (compute-similarity user-id other-user-id shared-films)]
                  ; Persist update
                  (db/upsert-similarity user-id other-user-id new-similarity)
                  ; Invalidate both users' caches (will be recomputed on next dashboard load)
                  (cache/delete (str "similar-users:" user-id))
                  (cache/delete (str "similar-users:" other-user-id)))))))
        (catch Exception e
          (log/error "Similarity update failed" e)
          ; Re-queue failed event to dead-letter queue for retry
          (queue/enqueue :similarity-updates-failed event)))
      (recur))))

; Dashboard fetch (uses cache or computes if invalidated)
(defn get-similar-users [user-id]
  (let [cache-key (str "similar-users:" user-id)]
    (or (cache/get cache-key)
        ; Fallback: compute if cache miss (usually shouldn't happen)
        (let [similar (compute-similar-users user-id)]
          (cache/set cache-key similar :ttl 48-hours)  ; Cache for 48h
          similar))))

(defn compute-similar-users [user-id]
  (let [user-films (db/get-ratings user-id)
        candidates (db/find-users-with-shared-films user-id 3)]  ; ≥3 shared
    (->> candidates
         (map #(similarity-score user-id % user-films))
         (filter #(>= (:similarity %) 0.65))  ; threshold
         (sort-by :similarity >)
         (take 10))))  ; top 10

; Start workers on app startup
(defn start-similarity-workers []
  (log/info "Starting 3 similarity update workers...")
  (dotimes [i 3]  ; 3 parallel workers to handle load
    (future (similarity-update-worker))))
```

**Updated Caching Strategy for Option D**:

```
Level 1: Similar Users List (updated incrementally by worker)
  Key: similar-users:{user_id}
  Value: [{user: 42, similarity: 0.89, name: "alice"}, ...]
  TTL: 48 hours (but invalidated immediately on new rating)
  Update Trigger: Background worker (on new scorecard submission)
  
Level 2: TMDB Metadata (poster, title, description)
  Key: tmdb-movie:{movie_id}
  Value: {title, poster_url, genres, ...}
  TTL: 30 days (stable metadata)
  
Level 3: Similarity Scores (optional persistence for analytics)
  Key: similarity-score:{user_a}:{user_b}
  Value: 0.87
  TTL: Never (updated by worker)
  Storage: Both Redis cache + PostgreSQL for historical tracking
```

**When Cache Gets Invalidated (Option D)**:

```
User submits new rating:
  1. Rating persisted to DB (fast)
  2. Event queued
  3. User sees success immediately
  
Background worker processes event (within 1-5 seconds):
  - Find all users who rated same film
  - For each affected pair (if ≥3 shared films):
    a. Compute new similarity
    b. Update DB
    c. INVALIDATE: cache/similar-users:user_a
    d. INVALIDATE: cache/similar-users:user_b
  
Next dashboard load:
  - Cache miss (was invalidated)
  - Computes similar users (fast, only affected pairs)
  - Stores in cache (TTL: 48 hours)
  - User sees fresh results (~50 ms load time)
```
```

---

## Question 3: Caching? Persist and Update?

### Caching Strategy

#### What to Cache

```
Level 1: Similar Users List (updated incrementally by worker)
  Key: similar-users:{user_id}
  Value: [{user: 42, similarity: 0.89, name: "alice"}, ...]
  TTL: 48 hours (invalidated immediately on new rating by worker)
  Updated by: Background worker (on new scorecard submission)
  
Level 2: TMDB Metadata (poster, title, description)
  Key: tmdb-movie:{movie_id}
  Value: {title, poster_url, genres, ...}
  TTL: 30 days (stable metadata; rarely changes)
  
Level 3: User Ratings (for quick access when computing similarities)
  Key: user-ratings:{user_id}
  Value: [film_id_1, film_id_2, ...]
  TTL: 1 hour (refreshed on new rating)
```

#### When to Invalidate Cache (Option D - Incremental Worker)

```
User submits new rating (immediately):
  1. Rating persisted to database (fast path)
  2. Event queued for background worker
  3. Rating cache invalidated: user-ratings:{user_id}
  4. User sees success immediately (no waiting)

Background worker processes event (within 1-5 seconds):
  a. Find all users who also rated this same film
  b. For each pair with ≥3 shared films:
     - Compute new similarity
     - Persist to database
     - INVALIDATE cache: similar-users:{both_users}
  
Next dashboard load:
  - Cache miss (was invalidated)
  - Compute-on-read: similar users function runs
  - Result stored in cache (TTL: 48h)
  - User sees fresh results (~50 ms)
  
Long-term maintenance:
  - Optional: Weekly orphan cleanup (users with no recent updates)
  - Monitor queue depth (alert if backing up)
```

### Persist vs. Cache Decision Matrix

| Data | Cache | Database | Duration | When Access |
|------|-------|----------|----------|-------------|
| **User vectors** | ✅ Redis | ❌ | Until re-rated | Every similarity calc |
| **Similar users list** | ✅ Redis | ❌ | 24 hours | Dashboard load |
| **Per-film diffs** | ✅ Redis | ❌ | 1 hour | Detailed comparison (future) |
| **Computed similarity scores** | ✅ Redis | ✅ | 24h cache; 7d DB | Historical analysis |
| **Ratings** | ❌ | ✅ PostgreSQL | Forever | Every page load |
| **User profiles** | ✅ Redis | ✅ | 1 hour | Profile views |

### Database Persistence Strategy

#### Option A: Don't Persist Similarity (Recompute Always)

```sql
-- Store only: ratings, users, movies
CREATE TABLE ratings (
  id SERIAL,
  user_id INT,
  movie_id INT,
  daring_sentiment INT,    -- 1-4
  ambition_sentiment INT,  -- 1-4
  engagement_sentiment INT,-- 1-4
  satisfaction_sentiment INT, -- 1-4
  daring_rank INT,         -- 1-4 (importance)
  ambition_rank INT,       -- 1-4
  engagement_rank INT,     -- 1-4
  satisfaction_rank INT,   -- 1-4
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Similarity computed on-the-fly from this table
-- No separate similarity table needed
```

**Pros**: ✅ Single source of truth; ✅ Simple schema; ✅ Always up-to-date  
**Cons**: ❌ Recomputes every 24 hours (could be expensive at scale)

---

#### Option B: Persist Similarity in Database (Materialized View)

```sql
CREATE TABLE user_similarities (
  user_a_id INT,
  user_b_id INT,
  similarity_score DECIMAL(3, 2),  -- 0.00 - 1.00
  shared_film_count INT,
  last_updated TIMESTAMP,
  PRIMARY KEY (user_a_id, user_b_id)
);

-- Index for fast lookups
CREATE INDEX idx_similarity ON user_similarities(user_a_id, similarity_score DESC);

-- Updated via nightly batch job:
-- 1. Compute all similarities
-- 2. UPSERT into this table
-- 3. Purge entries < 0.65 similarity
```

**Pros**: ✅ Enables complex analysis (historical trending); ✅ Faster joins; ✅ Auditable  
**Cons**: ❌ Requires ETL job; ❌ Duplicate data (stored in both places)

---

### MVP Recommendation: **Option A (Recompute, Cache in Redis)**

**Why**:
- Simple: no extra database table
- Efficient: cache layer absorbs repeated lookups
- Flexible: can pivot to materialized views later
- Cost-effective: Redis (< $10/month) cheaper than DB complexity

**Architecture**:
```
Request: GET /api/users/{id}/similar
  ↓
Check Redis cache (similar-users:{id})
  ├─ HIT (< 24h): Return immediately (10 ms)
  └─ MISS or STALE: 
      ↓
      Query DB: SELECT ratings WHERE user_id = {id}
      ↓
      Query DB: SELECT user_ids WHERE shared_films >= 3
      ↓
      Compute diffRatings for each pair (Brainstorm algorithm)
      ↓
      Sort by similarity descending
      ↓
      Cache result in Redis (TTL: 24h)
      ↓
      Return top 10 to client (2-5 seconds on first load)
```

---

## Question 4: Suggestions?

### Implementation Recommendations

#### Suggestion 1: Use Brainstorm as Core, Analysis as Wrapper

**For MVP**: Implement `diffRatings` (brainstorm)  
**For Validation**: Wrap it in the aggregate analysis (Option 3A)

```clojure
; Core: Brainstorm's per-film comparison (with max-weight amplifier)
(defn diff-ratings [rating-a rating-b]
  (reduce + 0
    (for [category [:daring :ambition :engagement :satisfaction]]
      (let [rating-a-cat (get rating-a category)
            rating-b-cat (get rating-b category)
            r-diff (Math/abs (- (:rating rating-a-cat)
                                 (:rating rating-b-cat)))
            w-diff (Math/abs (- (:weight rating-a-cat)
                                 (:weight rating-b-cat)))
            max-weight (max (:weight rating-a-cat)
                            (:weight rating-b-cat))]
        (* max-weight r-diff (+ 1 w-diff))))))

; Wrapper: Aggregate to similarity score (normalized 0-1)
(defn similarity-score [user-a user-b shared-films]
  (let [diffs (map #(diff-ratings (get-rating user-a %)
                                  (get-rating user-b %))
                  shared-films)
        avg-diff (/ (apply + diffs) (count diffs))
        ; Maximum possible diff: 3 * (1 + 3) = 12 per category
        ; Total max: 12 * 4 = 48
        max-diff 48
        normalized (/ (- max-diff avg-diff) max-diff)]
    (max 0 (min 1 normalized))))  ; clamp to 0-1
```

---

#### Suggestion 2: Handle Cold-Start via Hybrid Approach

**Problem**: New users have few ratings; diffRatings might fail

**Solution**: Use categorical alignment for new users, diffRatings for experienced users

```clojure
(defn find-similar-users [user-id min-threshold]
  (let [user-rating-count (count (db/get-ratings user-id))]
    (case (cond
            (< user-rating-count 3) :philosophy-only
            (< user-rating-count 10) :philosophy-weighted
            :else :full-hybrid)
      :philosophy-only
        (philosophy-match user-id)  ; Match by category priorities only
      
      :philosophy-weighted
        (combine-scores 
          :philosophy 0.7
          :scores 0.3
          user-id)
      
      :full-hybrid
        (combine-scores
          :philosophy 0.3
          :scores 0.7
          user-id))))
```

---

#### Suggestion 3: Cache Invalidation Strategy

**Problem**: When user rates new film, caches become stale

**Solution**: Smart invalidation cascade

```clojure
(defn on-new-rating [user-id film-id rating]
  ; 1. Persist the rating
  (db/create-rating user-id film-id rating)
  
  ; 2. Invalidate direct caches
  (cache/delete (str "user-vector:" user-id))
  (cache/delete (str "similar-users:" user-id))
  
  ; 3. Invalidate affected user caches
  ; Find all users who might be similar to this user
  (let [potentially-affected (db/find-users-with-shared-films user-id 2)]
    (doseq [other-user potentially-affected]
      (cache/delete (str "similar-users:" other-user))))
  
  ; 4. Schedule re-compute (debounced)
  ; If user rates multiple films, only refresh once after 5-min idle
  (schedule-refresh-similar-users user-id :debounce-ms 300000))
```

---

#### Suggestion 4: Optimize diffRatings for Edge Cases

**Current formula amplifies weight differences**. Consider if this is always desired:

```javascript
// Updated formula (with max weight amplifier)
diffRatings = max(weight_a, weight_b) × |rating_diff| × (1 + |weight_diff|)

// Examples for a single category:
// Case 1: Both prioritize equally (weight 1), different ratings
//   max(1, 1) × |3 - 1| × (1 + 0) = 1 × 2 × 1 = 2
//   (Low priority disagreement: minimal penalty)

// Case 2: Both prioritize highly (weight 4), same rating
//   max(4, 4) × |0| × (1 + 0) = 4 × 0 × 1 = 0
//   (Agreement on important category: no penalty)

// Case 3: Both prioritize highly (weight 4), different ratings
//   max(4, 4) × |2 - 1| × (1 + 0) = 4 × 1 × 1 = 4
//   (Disagreement on important category: significant penalty)

// Case 4: Different priorities (weight 4 vs 1), different ratings
//   max(4, 1) × |2 - 1| × (1 + |4 - 1|) = 4 × 1 × (1 + 3) = 16
//   (Disagreement on what they prioritize: highest penalty)
```

**Why This Works Better Than Original**:
- **Semantic accuracy**: Disagreements on highly-prioritized categories (weight 3-4) now carry more weight than on lower-priority categories (weight 1-2)
- **Philosophy integration**: The `max(weight)` directly captures: "if both of you care about this category, disagreements matter"
- **Forgiving on low priorities**: Differences in categories neither user prioritized (weight 1) have minimal impact

**Comparison**:
- Original: `|ratingDiff| × (1 + |weightDiff|)` — treats all categories equally
- Updated: `max(weight) × |ratingDiff| × (1 + |weightDiff|)` — emphasizes high-priority disagreements

---

#### Suggestion 5: Monitoring & Feedback Loop

**Track similarity metric health**:

```clojure
; Dashboard analytics
(defn similarity-metrics []
  {:avg-similarity (db/query "SELECT AVG(similarity) FROM similar_users")
   :median-similarity (db/query "SELECT MEDIAN(similarity) FROM similar_users")
   :users-with-no-matches (count (db/query "SELECT user_id FROM users WHERE not exists (select 1 from similar_users where user_a_id = users.id)"))
   :recommendation-acceptance (/ recommended-films-watched
                                recommended-films-shown)})

; Log queries to detect failures
(defn log-similarity-query [user-id candidates-found top-results]
  (log/info "similarity-query"
    {:user_id user-id
     :candidates_found candidates-found
     :threshold_met (count top-results)
     :top_score (:similarity (first top-results))}))
```

---

## Comparison: Brainstorm vs. Analysis in MVP

| Aspect | Brainstorm Approach | Analysis Approach | MVP Choice |
|--------|-------------------|-------------------|-----------|
| **Core Algorithm** | Per-film diffRatings | Aggregate vectors + cosine | ✅ Brainstorm (simpler) |
| **Efficiency** | O(1) per comparison | O(n) per user | ✅ Brainstorm (faster) |
| **Timing** | Lazy on-demand | Batch nightly | ✅ Brainstorm (no jobs) |
| **Caching** | Redis (optional) | Redis (required) | ✅ Brainstorm (flexible) |
| **Validation** | Manual testing | Statistical | ✅ Combine both (best) |
| **Scale to 10K users** | Needs optimization | Already optimized | Analysis for Phase 2 |

---

## Recommended MVP Implementation Path

### Week 1: Core Implementation
1. ✅ Parse taxonomic rating → category objects (weight + rating)
2. ✅ Implement `diffRatings` function (brainstorm)
3. ✅ Implement `similarity-score` wrapper (analysis validation)
4. ✅ Unit tests for edge cases

### Week 2: Integration & Caching
5. ✅ Add Redis caching (similar-users, user-vectors)
6. ✅ Lazy computation on dashboard load
7. ✅ Cache invalidation on new rating
8. ✅ Integration tests with 100+ mock users

### Week 3: Deployment & Monitoring
9. ✅ Deploy to fly.io with Redis add-on
10. ✅ Add similarity metrics dashboard
11. ✅ Monitor recommendation acceptance rate
12. ✅ Collect user feedback for Phase 2 tuning

---

## Summary: Answers to Brainstorm Questions

| Question | Answer | Details |
|----------|--------|---------|
| **Efficiency?** | ✅ Very efficient | O(1) per film pair; 7x faster than aggregate approach for discovery |
| **When do this?** | **Incremental background worker** (Option D) | Triggered on new scorecard submission; updates only affected user pairs within 1-5 seconds |
| **Caching?** | **Redis cache + worker invalidation** | Similarities cached in Redis; invalidated incrementally by worker; no batching needed |
| **Suggestions?** | **Option D recommended for MVP** | Use incremental worker thread; triggered on new ratings; provides fast dashboard + fresh data without batching overhead |

### Why Option D is Superior for MVP

| Criteria | Option A (Eager) | Option B (Lazy) | **Option D (Worker)** |
|----------|------------------|-----------------|----------------------|
| User Experience | ✅ Fast (~50ms) | ❌ Slow first load (2-5s) | ✅✅ Fast (~50ms) + fresh |
| Scalability | ❌ Breaks at 10k users | ✅ Acceptable | ✅✅ Scales naturally |
| Data Freshness | ⚠️ Up to 24h stale | ✅ Instant (but after wait) | ✅✅ ~1-5s old (no wait) |
| Infrastructure | Medium (scheduled job) | Low (lazy) | **Medium (queue + worker)** |
| Cost | Fixed batch | Variable per request | **Minimal (distributed work)** |

**Verdict**: Option D provides **best of both worlds**—fresh data and fast loads without expensive batch processing.

---

**Document Version**: 1.1  
**Last Updated**: May 1, 2026  
**Owner**: @voltron42  
**Status**: Ready for implementation (Option D recommended)
