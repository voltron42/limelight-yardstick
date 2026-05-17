# Limelight Yardstick: Decisions Applied & Requirements Pending

**Status Date**: May 3, 2026
**MVP Target**: Rating + Search + Personal Dashboard  

---

## ✅ DECIDED: High Priority Features (Spec & Implementation Foundation)

### 1. Rating System

| Decision | Requirement | Applied To |
|----------|-------------|-----------|
| **Duplicate Ratings** | Keep version history; store all ratings, flag most recent | Backend data model; rating submission handler |
| **Auto-Ranking** | DISABLED - Manual ranking only (user-selected importance order) | Frontend form validation; no ML suggestion logic |
| **Tied Rankings** | PREVENTED - UI enforces unique ranking via drag-and-drop | Frontend ranking component; form submission validator |
| **Scorecard Calculation** | Score formula: `(sum - min) / (max - min)` with 4x/3x/2x/1x multipliers | Calculation engine; no visual display of multipliers |
| **Deleted Movies** | Assume no deletion; address when problem arises | TMDB API error handling |

**Notes**: The ranking UI is a **drag-and-drop interface** (not buttons). Rankings determine category weighting in the final score calculation but should **not influence vocabulary selection** to avoid user bias.

---

### 2. User Data & Privacy

| Decision | Requirement | Applied To |
|----------|-------------|-----------|
| **Data Ownership** | Users can: export (JSON/CSV), delete ratings individually, delete full account, download raw history | User settings/admin panel; API endpoints |
| **Privacy Model** | Opt-in public profiles (default: private); public profiles show limited shared context only | Database schema; privacy middleware |
| **Authentication** | Google OAuth only (no password storage) | Frontend auth flow; backend OAuth integration |
| **Profile Anonymity** | Users create custom profile name (not linked to Google account details) | User profile creation; display logic |

**Notes**: 

**Default Privacy**: User profiles are **PRIVATE** by default—other users cannot discover or view them.

**Opt-In Public**: Users may voluntarily enable a **PUBLIC profile** in settings. Public profiles display:
  - Custom anonymized username only
  - Scorecards for movies both users have rated (enables direct comparison of taste)
  - Movies (without scorecards) that the profiled user has rated but the viewing user hasn't (enables discovery)
  - **NOT** individual score numerals or raw ratings of unshared movies

**Public User Discovery**: Users' personal dashboards include a **"Similar Users"** section listing public profiles with the highest taste alignment, sorted by similarity. This enables community-driven recommendations without violating privacy of private-profile users.

**Aggregated Stats Remain Public**: Movie profile pages continue to show aggregate statistics (community percentages for taxonomic ratings) for all movies, regardless of user privacy settings. Individual users remain anonymous in these aggregates.

---

### 3. Scaling & Performance

| Decision | Requirement | Applied To |
|----------|-------------|-----------|
| **Rating Pagination** | Lazy-load as needed (no hard limit at MVP) | Frontend infinite-scroll/pagination component |
| **Vocabulary** | FIXED global vocabulary (16 terms across 4 categories × 4 levels) | Database seeding; no per-user customization |
| **TMDB Metadata Caching** | Refresh on access (cache invalidation needed) | Caching layer strategy (Redis/in-memory) |

**Notes**: Global vocabulary consistency is **critical** for cross-user comparisons. Revisit customization only if commonality/recommendation features prove insufficient.

---

## ✅ DECIDED: UI/UX & MVP Scope

### 4. Frontend Technology Stack

| Decision | Requirement | Applied To |
|----------|-------------|-----------|
| **Framework** | React with hooks + React Router | Project bootstrap; component architecture |
| **UI Library** | Bootstrap + Font Awesome (free icons) | Styling; icon selection |
| **State Management** | React Context + useReducer (matching existing projects) | Data flow architecture |
| **Theme** | Dark theme with Bootstrap colors | Global CSS/Tailwind overrides |
| **Mobile Support** | Bootstrap responsive; drag-and-drop works on mobile | Form layout: Bootstrap grid; drag testing required |

**Notes**: User explicitly states this matches their existing project patterns (importNamespace setup). No Material-UI, Chakra, or Redux—keep it minimal.

---

### 5. MVP Feature Set

| Feature | Status | Requirement | Notes |
|---------|--------|-------------|-------|
| **Rate Movies** | ✅ Core | Rate film on 4 categories; select 4 sentiment levels; drag-rank importance | Required for launch |
| **Search Movies** | ✅ Core | Query TMDB API; display results; add to collection | Rating wouldn't exist without discovery |
| **Personal Dashboard** | ✅ Core | View rated movies grouped by score; show taxonomic ratings | User profile, collection view |
| **Public Profile Opt-In** | ✅ Core | Users toggle profile visibility; public profiles show shared ratings + unrated discoveries | Privacy control; enables community discovery |
| **Similar Users** | ✅ Core | Dashboard lists public users with highest taste alignment, sorted by similarity | Enables recommendations without full algorithm |
| **Claude Integration** | ❌ Future | Generate review text from scorecard | Post-MVP enhancement |
| **TMDB Review Posting** | ❌ Future | Submit scorecard as review to TMDB | Requires TMDB API write access |
| **Letterboxd Integration** | ❌ Future | Import ratings; sync accounts | Scope creep; out of MVP |
| **Watchlist** | ❌ Future | "To-watch" list; streaming availability integration (JustWatch/Plex) | Next priority after MVP |

---

### 6. Dashboard & Display Rules

| Rule | Requirement | Why |
|------|-------------|-----|
| **User Profile Display** | Movies grouped by score → taxonomic ratings within each group (personal dashboard only) | Enables score-based browsing; taxonomic ratings show primary taste pattern |
| **Public User Profiles** | Only visible if user opted-in; show custom username, shared movie scorecards, unrated movie list | Privacy by default; fosters community discovery without data exposure |
| **Movie Profile Display** | Show unique taxonomic ratings received + % of reviews with each rating (highest % first) | Reveals community taste consensus without individual score bias |
| **Taxonomic Rating NOT a Filter** | No search/query by vocabulary terms; analytical view-only | Would bias users' future ratings if they see aggregates before rating |
| **Rating Data Hidden for Unrated Films** | Users see metadata only (title, poster, description, rating) for movies they haven't rated | Protects rating integrity; prevents anchoring bias |
| **Similar Users Widget** | Dashboard lists public profiles with highest taste similarity score, sorted descending | Enables peer-to-peer recommendations without algorithmic complexity |
| **Recommendations Exception** | [OPEN] Should recommended films show rating data before user rates them? | Recommendation bias vs. user trust trade-off |

---

## ⏳ OPEN QUESTIONS: Still Blocking Implementation

### Priority 1: Ranking UI Technology (Section 4)

**Decision**: ✅ **DECIDED: dnd-kit**

| Aspect | Details |
|--------|---------|
| **Library** | @dnd-kit/core + @dnd-kit/sortable |
| **Rationale** | Modern, lightweight, TypeScript support, proven mobile support, active maintenance |
| **Mobile Handling** | Long-press → drag (built-in, no custom implementation needed) |
| **Alternative** | react-beautiful-dnd if issues arise (fallback available) |
| **Demo Status** | ✅ Both dnd-kit and react-beautiful-dnd demo apps running successfully; dnd-kit demo chosen for implementation |

**Implementation Notes**:
- dnd-kit is already integrated into the workspace (dnd-kit-demo/ running on http://localhost:5173)
- Use `@dnd-kit/sortable` for the ranking component (items drag to reorder)
- Use `@dnd-kit/modifiers` for snap-to-grid/alignment if needed
- CSS transforms for smooth animations (no heavy libraries)
- Mobile drag works out-of-the-box; no additional configuration needed

**Next Steps**: 
1. Extract dnd-kit ranking component from demo into reusable module
2. Integrate with scorecard form (4 categories, each with 4-level radio buttons)
3. Test mobile touch on iOS/Android during QA phase

---

### Priority 2: Mobile Drag Experience (Section 5)

**Question**: How should ranking work on touch devices?

| Option | Interaction | Mobile-Friendly | Performance |
|--------|-------------|-----------------|-------------|
| **Swipe-to-reorder** | Swipe left/right to move items | ✅ Intuitive | Smooth if implemented |
| **Up/Down Buttons** | Tap buttons to reorder | ✅ Easy | Simple but tedious |
| **Dedicated Reorder Mode** | Tap to activate, then arrange | ✅ Clear UX | Extra tap overhead |
| **Hybrid (long-press to drag)** | Long-press activates drag | ✅ Good | Library-dependent |

**User Note**: "Not sure. Let's decide after choosing drag-and-drop library in #4."

**Suggestion**: Use library's built-in touch handling (both `dnd-kit` and `react-beautiful-dnd` support long-press → drag). No need for custom swipe logic; standard drag gesture suffices on modern phones.

---

### Priority 3A: UI Style Rules & Constraints

**Source**: Integrated from `styleRulesDraft.md` to guide form layout prototypes and overall component design.

#### Core Style Rules

| Rule | Details | Application |
|------|---------|-------------|
| **CSS Framework** | Bootstrap 5 only (no custom styles) | All components inherit Bootstrap utilities + theme variables |
| **Theme** | Dark theme throughout | Apply Bootstrap dark mode; override default colors as needed |
| **Color Coding System** | Sentiment scale mapped to semantic colors | Radio buttons, badges, category indicators |
| **Font Selection** | Cinematic marquee or vintage video store aesthetic; avoid web-safe fonts | Google Fonts integration; headline + body font pairing |
| **Movie Metadata Display** | Always show: title, year, genres, description, directors | Search results, movie profile page, rating form |

#### Sentiment-to-Bootstrap Color Mapping

| Sentiment | Bootstrap Class | Use Case | Example |
|-----------|-----------------|----------|---------|
| **Extremely Negative** | `danger` (red) | Low ratings (0 on scale) | "Unengaging", 0-star indicator |
| **Moderately Negative** | `warning` (amber) | Below-average ratings (1 on scale) | "Derivative", mixed sentiment |
| **Moderately Positive** | `info` (cyan/blue) | Above-average ratings (2 on scale) | "Competent", solid performance |
| **Extremely Positive** | `success` (green) | High ratings (3 on scale) | "Transcendent", excellence |

**Implementation**: 
- Radio button groups: Highlight selected sentiment with color badge
- Movie profile percentages: Show as colored pills (`danger`, `warning`, `info`, `success`)
- Ranking category cards: Color-code based on selected importance level (optional visual enhancement)
- Public user profiles: Highlight shared movie agreements in `success` green

#### Font Strategy

**Goal**: Create cinematic, vintage aesthetic (video store marquee vibe)

**Recommended Google Font Pairing**:
- **Headline Font**: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue), [Righteous](https://fonts.google.com/specimen/Righteous), or [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (dramatic, serif flourish)
- **Body Font**: [Inter](https://fonts.google.com/specimen/Inter) or [Roboto](https://fonts.google.com/specimen/Roboto) (clean, readable in dark theme)

**CSS Implementation**:
```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600&display=swap');

:root {
  --headline-font: 'Bebas Neue', serif;
  --body-font: 'Inter', sans-serif;
  --bg-dark: #1a1a1a;  /* Bootstrap dark background */
  --text-light: #e9ecef;  /* Bootstrap light text */
}

h1, h2, h3, .display-title { font-family: var(--headline-font); letter-spacing: 0.05em; }
body, p, .form-control { font-family: var(--body-font); }
```

---

### Priority 3B: Form Layout Prototypes (Refined with Style Scope)

**Question**: How to display 4 category radio groups on small screens while maintaining visual hierarchy and theme consistency?

#### Prototype Options with Styling

| Option | Layout | Mobile Space | Visual Style | Implementation Notes |
|--------|--------|---|---|---|
| **Vertical Stack** (RECOMMENDED) | All 4 categories on one page | ✅ Fits! | Each category as compact card section; Button Group buttons; consistent spacing | Scroll if needed on very small devices; all info visible; native feel |
| **Accordion/Collapsible** | All 4 categories; expand on tap | ✅ Compact | Collapsible headers in headline font; colored left border matching sentiment; smooth animations | Bootstrap collapse component; color-coded category headers |
| **Step-Based (One/Page)** | One category per "screen"; swipe/next | ✅ Compact | Large headline font; full-width cards; prominent Next button | Modal or carousel with Bootstrap progress indicator; more friction (unnecessary) |
| **Horizontal Swipe (Carousel)** | Swipe between categories | ✅ Compact | Swipe indicator dots; large category name; navigation arrows | dnd-kit integration opportunity; modern feel but non-standard pattern |

#### Recommended Prototype: Vertical Stack Form (All Categories on One Screen)

**Visual Layout**:
```
┌──────────────────────────────────────────────┐
│  Limelight Yardstick               │ (Bebas Neue)
│  Rate: Oppenheimer (2023)          │ (Title + year)
├──────────────────────────────────────────────┤
│                                   │
│  How DARING is this film?          │ (Category 1)
│  [ Unengaging ] [ Derivative ]     │
│  [ Competent ] [ Transcendent ]    │
│                                   │
│  How AMBITIOUS is it?              │ (Category 2)
│  [ Unengaging ] [ Derivative ]     │
│  [ Competent ] [ Transcendent ]    │
│                                   │
│  How ENGAGING is it?               │ (Category 3)
│  [ Unengaging ] [ Derivative ]     │
│  [ Competent ] [ Transcendent ]    │
│                                   │
│  How SATISFIED are you?            │ (Category 4)
│  [ Unengaging ] [ Derivative ]     │
│  [ Competent ] [ Transcendent ]    │
│                                   │
├──────────────────────────────────────────────┤
│     [ CANCEL ]        [ SUBMIT ]   │ (Action buttons)
└──────────────────────────────────────────────┘
```

**Bootstrap 5 Toggle Button Details**:
- All 4 categories visible on one screen (scroll if needed on very small devices)
- Each category uses Button Group Toggle Buttons with sentiment colors
- Selection highlights button in full color (danger/warning/info/success)
- Large touch targets for mobile UX
- No navigation friction (traditional form flow)

**Dark Theme Bootstrap Implementation**:
- Background: `bg-dark` (#212529)
- Cards: `card-dark` with `border-secondary`
- Text: `text-light` for contrast
- Buttons: `btn-outline-primary` or `btn-success` (for Next)
- Radio buttons: Custom styling with sentiment colors (danger/warning/info/success)

**Styling Benefits**:
- ✅ All 4 categories on one screen = no navigation friction
- ✅ Large headline font (Bebas Neue) = cinematic feel maintained
- ✅ Button Group Toggle Buttons = larger touch targets, all sentiment options visible
- ✅ Sentiment color-coded = visual feedback matches Bootstrap semantic system
- ✅ Consistent spacing = organized form layout
- ✅ Dark theme = maintains user preference
- ✅ Simple Cancel/Submit = traditional form pattern

**CSS/Bootstrap Patterns**:
```html
<!-- Vertical stack form - all categories on one screen -->
<div class="container bg-dark text-light py-4">
  <div class="card bg-dark border-secondary">
    <div class="card-header border-secondary">
      <h2 class="display-6 mb-0" style="font-family: var(--headline-font);">Rate: Oppenheimer (2023)</h2>
      <small class="text-muted">Select your sentiment for each category</small>
    </div>
    <form class="card-body">
      <!-- Category 1: Daring -->
      <div class="mb-4">
        <label class="form-label fw-bold">How DARING is this film?</label>
        <div class="btn-group d-flex w-100" role="group" aria-label="Daring sentiment">
          <input type="radio" class="btn-check" name="daring" id="daring_0" value="0">
          <label class="btn btn-outline-danger flex-grow-1" for="daring_0">Unengaging</label>
          <input type="radio" class="btn-check" name="daring" id="daring_1" value="1">
          <label class="btn btn-outline-warning flex-grow-1" for="daring_1">Derivative</label>
          <input type="radio" class="btn-check" name="daring" id="daring_2" value="2">
          <label class="btn btn-outline-info flex-grow-1" for="daring_2">Competent</label>
          <input type="radio" class="btn-check" name="daring" id="daring_3" value="3">
          <label class="btn btn-outline-success flex-grow-1" for="daring_3">Transcendent</label>
        </div>
      </div>

      <!-- Category 2: Ambition -->
      <div class="mb-4">
        <label class="form-label fw-bold">How AMBITIOUS is it?</label>
        <div class="btn-group d-flex w-100" role="group" aria-label="Ambition sentiment">
          <input type="radio" class="btn-check" name="ambition" id="ambition_0" value="0">
          <label class="btn btn-outline-danger flex-grow-1" for="ambition_0">Unengaging</label>
          <input type="radio" class="btn-check" name="ambition" id="ambition_1" value="1">
          <label class="btn btn-outline-warning flex-grow-1" for="ambition_1">Derivative</label>
          <input type="radio" class="btn-check" name="ambition" id="ambition_2" value="2">
          <label class="btn btn-outline-info flex-grow-1" for="ambition_2">Competent</label>
          <input type="radio" class="btn-check" name="ambition" id="ambition_3" value="3">
          <label class="btn btn-outline-success flex-grow-1" for="ambition_3">Transcendent</label>
        </div>
      </div>

      <!-- Category 3: Engagement -->
      <div class="mb-4">
        <label class="form-label fw-bold">How ENGAGING is it?</label>
        <div class="btn-group d-flex w-100" role="group" aria-label="Engagement sentiment">
          <input type="radio" class="btn-check" name="engagement" id="engagement_0" value="0">
          <label class="btn btn-outline-danger flex-grow-1" for="engagement_0">Unengaging</label>
          <input type="radio" class="btn-check" name="engagement" id="engagement_1" value="1">
          <label class="btn btn-outline-warning flex-grow-1" for="engagement_1">Derivative</label>
          <input type="radio" class="btn-check" name="engagement" id="engagement_2" value="2">
          <label class="btn btn-outline-info flex-grow-1" for="engagement_2">Competent</label>
          <input type="radio" class="btn-check" name="engagement" id="engagement_3" value="3">
          <label class="btn btn-outline-success flex-grow-1" for="engagement_3">Transcendent</label>
        </div>
      </div>

      <!-- Category 4: Satisfaction -->
      <div class="mb-4">
        <label class="form-label fw-bold">How SATISFIED are you?</label>
        <div class="btn-group d-flex w-100" role="group" aria-label="Satisfaction sentiment">
          <input type="radio" class="btn-check" name="satisfaction" id="satisfaction_0" value="0">
          <label class="btn btn-outline-danger flex-grow-1" for="satisfaction_0">Unengaging</label>
          <input type="radio" class="btn-check" name="satisfaction" id="satisfaction_1" value="1">
          <label class="btn btn-outline-warning flex-grow-1" for="satisfaction_1">Derivative</label>
          <input type="radio" class="btn-check" name="satisfaction" id="satisfaction_2" value="2">
          <label class="btn btn-outline-info flex-grow-1" for="satisfaction_2">Competent</label>
          <input type="radio" class="btn-check" name="satisfaction" id="satisfaction_3" value="3">
          <label class="btn btn-outline-success flex-grow-1" for="satisfaction_3">Transcendent</label>
        </div>
      </div>

      <!-- Form actions -->
      <div class="d-flex justify-content-between mt-5">
        <button type="button" class="btn btn-outline-secondary">Cancel</button>
        <button type="submit" class="btn btn-success">Submit Scorecard</button>
      </div>
    </form>
  </div>
</div>
```

**Bootstrap 5 Toggle Button Benefits**:
- ✅ Color-coded sentiment: Each button inherits Bootstrap color (`danger`, `warning`, `info`, `success`)
- ✅ Large touch targets: Full button area is clickable (better mobile UX)
- ✅ Visual feedback: Selected button fills with color (not just outline)
- ✅ Native Bootstrap: No custom styling needed; uses semantic colors
- ✅ All categories visible: No friction navigating between screens
- ✅ Responsive: `flex-grow-1` ensures equal width on all screens
- ✅ Accessible: Proper ARIA labels and semantic HTML

---

### Priority 4: Movie Profile Visibility Thresholds (Section 6)

**Question**: Minimum reviews before showing rating percentages?

**Current Behavior**: Show all taxonomic ratings + percentages regardless of review count.

**Scenarios**:
- Movie with 1 review: "Provocative, Ambitious" (100%, 0%) - misleading as "community consensus"
- Movie with 500 reviews: Data is robust

**Suggestion**: 
- Show percentages only if ≥5 reviews (or ≥10% of total user base)
- Below threshold, show "Insufficient data" or brief disclaimer
- Use tooltip to explain: "Based on X ratings from Y users"

**Decision Needed**: What's the minimum threshold? (Propose: **5 reviews** for MVP, revisit after first 100 users)

---

### Priority 5: Similarity Algorithm & Similar Users Feature (Section 6, MVP Core Feature)

✅ **DECIDED: Incremental Background Worker Pattern with core.async**

**Problem**: Calculate which users have similar taste so dashboard can show "Similar Users" widget (community recommendations without full algorithm).

**Solution**: Compute pairwise similarity using **diffRatings** metric on shared films, updated incrementally as users rate movies.

#### Algorithm: diffRatings (Three-Part Penalty System)

```javascript
diffRatings(userA, userB) = 
  SUM over [daring, ambition, engagement, satisfaction]:
    max(weightA, weightB) × |ratingA - ratingB| × (1 + |weightA - weightB|)
```

**Three components**:
1. **`max(weightA, weightB)`**: Amplifies disagreements in high-priority categories (weight 4 much worse than weight 1)
2. **`|ratingA - ratingB|`**: Penalizes sentiment mismatches (how differently they rated on 0-3 scale)
3. **`(1 + |weightA - weightB|)`**: Further penalty if they prioritized it differently

**Example**:
- Both prioritize "Daring" (weight 4) and disagree slightly (rating diff = 1): penalty = 4 × 1 × 1 = **4**
- Both deprioritize "Satisfaction" (weight 1) and disagree on same diff (rating = 1): penalty = 1 × 1 × 1 = **1**
- Asymmetric priorities (User A: weight 4, User B: weight 1; rating diff = 1): penalty = 4 × 1 × 3 = **12** (high)

**Similarity Score**: Lower diffRatings = more similar. Normalize to 0-1 scale or threshold at ≥0.65 similarity.

#### MVP Implementation: Option D (Incremental Background Worker)

**Timing**: Triggered on new scorecard submission; updates only affected user pairs within 1-5 seconds.

**Flow**:
1. **User submits rating** → API endpoint persists to DB + queues event (returns 200 OK immediately)
2. **Background worker** (core.async go-loop) → Processes queue events asynchronously
3. **Worker finds affected pairs** → Users who rated the same film
4. **Updates only relevant pairs** → Only if ≥3 shared films (minimum threshold)
5. **Invalidates caches** → Both users' "Similar Users" caches cleared
6. **Dashboard loads fast** → Cache hit or quick re-compute (~50ms)

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
       │ Rating persisted instantly (no wait)
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
│ (go-loop)            │
│ - Find affected users│
│ - Compute diffs      │
│ - Update cache/DB    │
│ - Invalidate caches  │
└──────┬───────────────┘
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

**Clojure Implementation**:
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

#### Performance & Comparison

| Aspect | Option A (Nightly) | Option B (Lazy) | **Option D (Incremental)** |
|--------|------------------|-----------------|--------------------------|
| **Computation Timing** | Every 24h nightly | On first dashboard load | On new scorecard submission |
| **Fresh Data** | Up to 24h stale ❌ | Instantly fresh (but 2-5s wait) | ~1-5s old (but no wait) ✅ |
| **Dashboard Load** | ~50 ms ✅ | 2-5 sec ❌ | ~50 ms ✅ |
| **Scalability at 10k users** | Breaks ❌ | Fine | Excellent ✅ |
| **Infrastructure** | Scheduled job | Lazy cache | core.async channel + go-loop |
| **Cost** | Fixed batch | Variable | **Minimal** (spread over time) |

**Why Option D wins for MVP**:
- ✅ Best user experience: fast (~50ms) dashboard + fresh data without waiting
- ✅ Best efficiency: only recomputes affected pairs (50-100 ops per rating)
- ✅ Scales naturally: same pattern works at 100 or 10,000 users
- ✅ Minimal infrastructure: just core.async (no Redis/RabbitMQ needed)
- ✅ Non-blocking: rating submission returns immediately; work spreads asynchronously

#### MVP Thresholds

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Minimum Shared Films** | ≥3 | Prevents spurious similarity from 1-2 coincidental matches |
| **Similarity Score Threshold** | ≥0.65 | Moderate alignment; excludes casual matches |
| **Top Users Displayed** | Top 10 | Small enough for dashboard; large enough for discovery |
| **Cache TTL** | 48 hours | Balanced freshness; prevents thrashing |
| **Channel Buffer** | 100 events | Handles 100 concurrent ratings before backpressure |

#### MVP Cost Analysis

```
Monthly (500 users × 50 ratings each):
  - Total updates: ~1.25M (500 × 50 × 50 ops per rating)
  - Computation: Spread across month (no batch spike)
  - Per-operation: O(1) per film pair
  - Storage: Similarities table (500 × 500 = 250K rows, sparse)
  - Cache: 500 similar-users lists × ~10KB = ~5MB
  
Result: Minimal load; scales smoothly to 10k+ users
```

#### Implementation Priority

1. **Week 1**: Build rating submission endpoint + initialize core.async channel at startup
2. **Week 2**: Build similarity-update worker go-loop + cache invalidation
3. **Week 3**: Add monitoring + error handling for failed updates

**Decision Needed**: Confirm Option D (incremental worker) is approved for MVP. (Propose: **YES, proceed with core.async implementation**.)

---


### Priority 6: Backend Technology Stack (Section 7)

| Layer | Options | Constraints | Decision Status |
|-------|---------|-------------|-----------------|
| **Language** | Clojure (preferred) | "Minimal, clean code" | ✅ DECIDED |
| **Web Framework** | Ring + Compojure vs. Luminus | Minimal = Ring; Full-stack = Luminus | ⏳ OPEN |
| **Database** | PostgreSQL, MongoDB, Firestore | "If deploying to fly.io, does this matter?" | ⏳ OPEN |
| **Caching** | Redis, Memcached, In-memory | "Need comparison guide" | ⏳ OPEN |
| **Frontend Bundler** | Shadow-cljs (for ClojureScript) | React in JS or Clojure? | ⏳ OPEN |

**User Notes**: 
- Clojure for brevity + expressiveness
- Unsure about fly.io implications
- Needs caching comparison guide

**Suggestions**:
1. **Web Framework**: Use **Ring + Compojure** (minimal, composable). Add Liberator or Reitit only if REST complexity grows.
2. **Database**: 
   - **fly.io supports PostgreSQL natively** (managed PostgreSQL add-on). Choose **PostgreSQL** for relational structure + strong typing.
   - MongoDB if flexibility needed; Firestore if serverless appeal matters. (PostgreSQL recommended for this project's structured data.)
3. **Caching**:
   - **In-memory cache** (Clojure `core.cache` or simple map) for MVP (~1K users)
   - **Redis** if > 10K users or cross-process caching needed
   - Memcached rarely chosen for new projects (Redis dominates)
4. **Frontend Bundler**: Use **Vite + React** (no ClojureScript needed). Keep backend/frontend separated for simplicity.

---

### Priority 7: Minimum Review Threshold & UI Behavior (Section 6)

**Question**: What happens when movie has very few ratings?

| Scenario | Current Behavior | Proposed Behavior |
|----------|------------------|-------------------|
| Movie with 1 rating | Show "Provocative: 100%" | Show "1 rating—insufficient for community stats" |
| Movie with 2-4 ratings | Show all percentages | Show partial disclaimer: "Based on X ratings" |
| Movie with 5+ ratings | Show normal stats | Show normal stats |

**Decision Needed**: Implement threshold warning? (Propose: **Yes, add minimum of 5 ratings** with dismissible tooltip explaining why.)

---

## 🔄 Comparison Matrix: Decision Dependencies

```
Authentication (Google OAuth)
    ↓
User Profiles (anonymized names, public scorecards)
    ↓
Privacy Rules (hide rating data for unrated films)
    ↓
Dashboard Display (grouped by score, taxonomic ratings)
    ↓
Future: Recommendations (commonality analysis)

---

Vocabulary (fixed, 16 terms)
    ↓
Ranking UI (drag-and-drop, enforces uniqueness)
    ↓
Score Calculation (4x/3x/2x/1x multipliers)
    ↓
Movie Profiles (show taxonomic rating percentages)

---

TMDB Integration
    ↓
Movie Search
    ↓
Rating Collection
    ↓
Rating History (versioning)
    ↓
Export/Download Data
```

---

## 📋 Implementation Priority & Blockers

### Phase 1: MVP Launch (Next 4-6 weeks)
- [x] Choose Ranking UI library: **dnd-kit** ✅
- [x] Finalize Form Layout: **Vertical stack (all 4 categories on one screen)** ✅
- [ ] Choose Web Framework (Ring + Compojure / Luminus)
- [ ] Choose Database (PostgreSQL recommended)
- [ ] Implement Core Rating Flow (movie search → scorecard → dashboard)
- [ ] Implement Public Profile Opt-In (toggle privacy, display rules)
- [ ] Implement Similar Users Widget (calculate similarity, display top 10)
- [ ] Deploy to fly.io with PostgreSQL

**Blockers**: None—ready to proceed with implementation

### Phase 2: Enhanced Community Features (Weeks 11-14)
- [ ] Implement Movie Profile + percentages view
- [ ] Finalize Recommendation Algorithm (weighted similarity × movie popularity)
- [ ] Test "Similar Users" with 50+ active users
- [ ] Refine similarity thresholds based on user feedback

**Blockers**: Minimum review threshold + similarity metric finalization

### Phase 3: Future Enhancements (Post-MVP)
- [ ] Claude Integration (review generation)
- [ ] TMDB Review Posting
- [ ] Watchlist + Streaming Integration
- [ ] Advanced Analytics (taste clustering)

---

## 🎯 Recommendations Summary

| Question | Recommendation | Confidence | Effort |
|----------|-----------------|-----------|--------|
| Drag-and-drop library | ✅ **dnd-kit (DECIDED)** | High | Medium |
| Mobile drag | Use library's built-in long-press → drag | High | Low |
| **CSS Framework & Theme** | **Bootstrap 5 + Dark theme**; sentiment color coding (danger/warning/info/success) | High | Low |
| **Font Pairing** | **Bebas Neue (headlines) + Inter (body)**; cinematic vintage vibe | High | Low |
| Form layout | **Vertical stack (all 4 categories on one screen)**; Bootstrap 5 Button Group Toggle Buttons (sentiment-colored); native form flow | Medium | Medium |
| Form styling | Bootstrap 5 dark theme; Button Group Toggle Buttons (sentiment-colored); Bebas Neue headlines; mb-4 spacing between categories; responsive layout | Medium | Low |
| Database | **PostgreSQL on fly.io** (structured data, managed service) | High | Low |
| Caching | **In-memory** for MVP; **Redis** if > 10K users | High | Low |
| Web Framework | **Ring + Compojure** (minimal Clojure setup) | High | Low |
| Review Threshold | **≥5 reviews** before showing percentages + disclaimer | Medium | Low |
| Privacy Model | **Private by default, opt-in public**; show username + shared ratings only | High | Medium |
| **Similarity Algorithm** | **diffRatings (3-part penalty) + Incremental Background Worker** with core.async | **High** | **Medium** |
| **Similarity Metric** | `max(weight) × |rating diff| × (1 + |weight diff|)` per film pair | **High** | **High** |
| **Timing Strategy** | **Option D**: Triggered on new rating; updates only affected pairs within 1-5s | **High** | **Medium** |
| **Worker Implementation** | **core.async go-loop** (no external queue needed) | **High** | **Low** |
| **Similarity Thresholds** | ≥3 shared films, ≥0.65 similarity, top 10 users displayed | **High** | **Low** |
| Similar Users Display | **Top 10 users on dashboard**, sorted by similarity descending | High | Low |

---

## 📝 Next Steps

1. ✅ **Ranking UI Decision**: dnd-kit chosen for MVP implementation
   - Extract ranking component from dnd-kit-demo
   - Integrate with scorecard form
   - Test mobile drag on iOS/Android

2. **UI Style Foundation**: Establish consistent dark theme with sentiment color coding
   - Set up Google Font pairing (Bebas Neue + Inter)
   - Define Bootstrap color mappings for sentiment scale
   - Create reusable CSS/SCSS module for dark theme variables
   - Document movie metadata display patterns

3. **Form Layout Prototype**: Build vertical stack form with all 4 categories on one screen
   - Implement all categories visible with consistent vertical spacing (mb-4 between sections)
   - Use Bootstrap 5 Button Group with Radio Toggle Buttons (sentiment-colored: danger/warning/info/success)
   - Test with Bootstrap dark theme + Bebas Neue headlines + responsive layout
   - Mobile test: ensure buttons stack properly and don't wrap on small screens
   - Validate form submission and error handling

4. **Privacy Settings UI**: Implement profile privacy toggle + public profile view

5. **Similarity Algorithm** ✅ **DECIDED**: Implement diffRatings + Incremental Background Worker with core.async
   - Week 1: Rating submission + core.async channel setup
   - Week 2: Background worker go-loop + similarity updates
   - Week 3: Monitoring + error handling

6. **Backend Scaffolding**: Set up Ring + Compojure + PostgreSQL on fly.io

7. **TMDB Integration**: Verify API access for movie search + metadata retrieval

8. **Update README.md**: Reflect MVP scope + tech stack + privacy model + similarity algorithm + style guidelines + dnd-kit choice

---

**Document Version**: 1.1  
**Last Updated**: May 3, 2026 (integrated styleRulesDraft; expanded form layout prototypes with styling scope)  
**Owner**: @voltron42  
**Status**: Ready for implementation planning
