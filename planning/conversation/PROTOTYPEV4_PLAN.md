# Limelight Yardstick - Prototype V4 Plan

## Issues from V3

### 🔴 Critical Issues
1. **Privacy Violation** - Scoring data visible when it shouldn't be (RULE #1: No rankings/scores visible for unmated movies)
2. **Broken Drag-and-Drop** - Categories drop to bottom instead of inserting between items
3. **Missing Page Content** - Pages don't match `pagesDraft.md` specifications
4. **No Navigation** - Can't move between pages smoothly

### 🟡 Design Issues
1. No header/branding from original prototype
2. Scorecard layout doesn't match specification
3. Missing Dashboard content structure
4. Empty search/profile pages

---

## V4 Objectives

### 1. Fix Privacy System
**Rule #1 Implementation**: Don't show rating/scoring data for movies user hasn't rated (to avoid bias)

**Privacy Model**:

| Context | Visible Data | Hidden Data |
|---------|--------------|-------------|
| **Dashboard** (own profile) | Profile status (Private/Public), own queue, own ratings | N/A - user sees everything about themselves |
| **User Profile** (other user) | Only if OTHER user's profile is PUBLIC: their ratings, taste diff | Their rating data if profile is Private |
| **Movie Profile** (unrated by logged-in user) | Metadata (title, year, genres, cast, poster) | Ratings, scores, aggregate statistics |
| **Movie Profile** (rated by logged-in user) | All metadata + their rating + Movie Scoreboard aggregate stats | Individual other users' ratings (only summary) |
| **User Scoreboard** (User Profile) | Only movies that BOTH logged-in user AND viewed user have rated | Movies viewed user rated that logged-in user hasn't |

**Implementation**:
- Track current user ID + their profile visibility status
- Track which users have public profiles
- Filter: Movie scoreboard only shows if current user has rated
- Filter: User profiles only visible if that user's profile is public
- Filter: User Scoreboard (on User Profile) only shows overlapping rated movies

### 2. Fix Drag-and-Drop
**Problem**: Categories drop to bottom instead of positioning between items  
**Solution**: 
- Implement proper position-based insertion (see `idiosynced.github.io` pattern)
- Calculate drop position relative to other panels
- Insert at correct index, not append

**Technical**:
```javascript
// Instead of: taskTops.splice(draggedIndex, 1); taskTops.push()
// Do: Calculate position, splice at that index
const insertIndex = taskTops.filter(t => t.top < dropTop).length;
taskTops.splice(draggedIndex, 1);
taskTops.splice(insertIndex, 0, draggedItem);
```

### 3. Implement Page Content from pagesDraft.md

#### Dashboard (Logged-in User's Own Profile)
Should include:
- [ ] **Profile Status Toggle** - "Private" | "Public" 
- [ ] **Movie Queue** - Unrated movies logged-in user is tracking
- [ ] **Current User Ratings** - User Scoreboard of movies they've rated
- [ ] **Search Bar** - Find movies to add to queue
- [ ] **Most Similar Public Users** - Other users with overlapping rated movies

#### Movie Profile
Should show (different content based on whether user has rated):

**If NOT rated by logged-in user:**
- [ ] Movie metadata (title, year, genres, directors, writers, actors, studio, poster)
- [ ] "Add to Queue" button
- [ ] Scorecard interface (to rate)

**If rated by logged-in user:**
- [ ] All metadata (as above)
- [ ] **Their Rating** (prominently)
- [ ] "Edit Rating" button (returns to Scorecard)
- [ ] **Movie Scoreboard** - Aggregate ratings (taxonomic rating, score, count, percent)
- [ ] Score distribution graph

#### User Profile (Other Users' Public Profiles)
Only visible if that user has set profile to "Public"

Should show:
- [ ] Username, date joined
- [ ] **Taste Diff / Count** - Commonality vs logged-in user (count of overlapping rated movies)
- [ ] **User Scoreboard** - Only movies BOTH users have rated
- [ ] **Recommendations by Taste** - Other user's high-rated movies that logged-in user hasn't rated
- [ ] **Top 5 / Bottom 5** - Thumbnails without ratings of other user's highest/lowest rated movies that logged-in user hasn't rated

#### Search Pages
- [ ] Movies search
- [ ] Users search (by name, by shared movie, etc.)
- [ ] Advanced filters

---

## 4. Advanced Search (Currently Missing)

### Movie Search
**Functionality**:
- Plex-style advanced filter interface
- Filter by: genre(s), year range, director, writer, actor, studio
- Keyword search across titles and descriptions
- Results link to Movie Profile

### Artist Search
**Functionality**:
- Search by artist name (actors, directors, writers)
- Results show artist thumbnail and bio
- From Artist Profile: see all movies they've contributed to
- Special: "Movie Overlap" search — select multiple movies, find all overlapping contributors

**Artist Profile Page** (Currently Missing):
- [ ] Artist thumbnail/gallery link (modal)
- [ ] Name, DOB, bio
- [ ] Contribution table:
  | Movie | Year | Role(s) |
  |-------|------|--------|
  | < Title > (< Year >) | Year | "Director", "Writer", or < character name > |

### User Search
**Functionality**:
- Search by username
- Option to sort by "Most Similar" (users with highest overlap in rated movies)
- Results show User Profile link (if profile is public)

---

## 5. "Most Similar Public Users" Feature (Currently Missing)

**Location**: Dashboard - shows top N users with most movie overlap

**Algorithm**:
1. For current user, identify all movies they've rated
2. For each OTHER user whose profile is PUBLIC:
   - Count movies both have rated (intersection)
   - Calculate "Taste Diff" (average absolute difference in their scores for overlapping movies)
3. Sort by: count DESC, then by Taste Diff ASC
4. Display top 5-10 users

**UI**:
- List showing: [Avatar] Username | Movies in Common: N | Taste Diff: X.XX
- Click to visit User Profile

**"Taste Diff" Calculation**:
```javascript
// For all overlapping rated movies between two users:
// Taste Diff = Average absolute difference between their scores
const tastes = overlappingMovies.map(movie => {
  const user1Score = getScoreFromTaxonomy(user1Ratings[movie]);
  const user2Score = getScoreFromTaxonomy(user2Ratings[movie]);
  return Math.abs(user1Score - user2Score);
});
const tasteDiff = tastes.reduce((a, b) => a + b, 0) / tastes.length;
```

---

## 6. Scoring Algorithm (Currently Missing)

### Vocabulary Scales (TWO SEPARATE SYSTEMS)

**Recognition Scale** (from `FinalVocabularySelection.md`) - 9 levels for semantic/cultural context:
- **Extremely Negative**: 0.0
- **Very Negative**: 1.0
- **Negative**: 1.5
- **Slightly Negative**: 2.0
- **Neutral/Ambivalent**: 2.5
- **Slightly Positive**: 3.0
- **Positive**: 3.5
- **Very Positive**: 4.0
- **Extremely Positive**: 5.0

**NOTE**: This is NOT the same as the 4-level scoring scale. These two scales serve different purposes and should not be confused or interchanged.

### Multi-Category Rating System

**User selects one term per category** (4 draggable categories):
- Each category has 4 vocabulary options (Level 0–3, mapped to scores 1.0–4.0)
- E.g., Category 1: [Dogmatic, Formulaic, Creative, Provocative] | Select one
- User DRAGS categories to set priority order (most important first)

**Score Calculation (Weighted, based on priority order)**:
```javascript
// Weighted calculation using priority-based multipliers
const termValues = {0: 1.0, 1: 2.0, 2: 3.0, 3: 4.0}; // 4-level scale
const priorityWeights = [4, 3, 2, 1]; // First category = 4x weight

let weightedSum = 0;
priorityOrder.forEach((categoryId, index) => {
  const termIndex = selections[categoryId]; // 0–3
  const termValue = termValues[termIndex]; // 1.0–4.0
  const weight = priorityWeights[index];
  weightedSum += termValue * weight;
});

// Min possible: all 1.0 values = 10
// Max possible: all 4.0 values = 40
const percent = Math.round(((weightedSum - 10) / 30) * 100);
const halfStars = Math.round((percent / 10) * 2) / 2; // 0–5 stars in 0.5 increments
```

**Why Weighted, Not Averaging**:
- **Priority matters**: User's first choice (most important category) has 4x impact on score
- **Incentivizes thoughtfulness**: Category ordering is consequential, not just term selection
- **Better scaling**: Produces 0–100% range, easier for UI display and comparisons
- **Proven**: sortable-demo implementation validates this approach

**Display**: Convert to half-stars (0-5 stars in 0.5 increments)
- 0.0-0.5 → 0 stars
- 0.5-1.5 → 1 star
- 1.5-2.5 → 1.5 stars
- 2.5-3.5 → 2.5 stars
- etc.

### Movie Scoreboard Statistics

**For each movie**, aggregate all user ratings:

| Taxonomic Rating | Score | Count | Percent | Visual |
|------------------|-------|-------|---------|---------|
| < 4 selected terms > | < avg stars > | < count of this combo > | < % of total reviews > | [Bar in graph] |

**Display Order**: Highest percent first

**Bar Graph**: 
- X-axis: Taxonomic rating combinations (or score values)
- Y-axis: Count of reviews
- Use Font Awesome stars for score display

---

## 7. Scorecard & Category Priority (CLARIFIED)

### Scorecard Location & Workflow
**CRITICAL**: Scorecard is NOT a separate page—it appears **inline on Movie Profile**

1. User on Movie Profile (unrated) → clicks "Rate This Movie" 
2. Scorecard form **replaces button** in same location
3. User selects ONE term per category (4 categories, drag to prioritize by importance)
4. **User arranges categories in Priority order** - this ranking determines weight multipliers:
   - 1st priority (most important): 4x multiplier
   - 2nd priority: 3x multiplier
   - 3rd priority: 2x multiplier
   - 4th priority (least important): 1x multiplier
5. User clicks "Submit Rating"
6. Scorecard simply renders: Their rating + Movie Scoreboard (no animation, just React state change)

### Score Calculation Details
- **4-level scale** for term values: 1.0 (low) → 2.0 → 3.0 → 4.0 (high)
- **Weighted sum**: `term[priority0] × 4 + term[priority1] × 3 + term[priority2] × 2 + term[priority3] × 1`
- **Bounds**: Min=10 (all 1.0), Max=40 (all 4.0)
- **Percent**: `((weightedSum - 10) / 30) × 100` → produces 0–100% range
- **Half-stars**: `percent / 10` (100% = 10 half-stars = 5 full stars)
- **Defensive checks**: Input validation, bounds clamping to [0–5] stars

---

## 7. Rating History & Edit Workflow

### Storing Rating History
**Decision**: Maintain full history of all ratings for each movie
- Each rating includes: `createdAt`, `updatedAt` timestamps
- Editing a movie's rating REPLACES the previous rating (not creating a new entry)
- History is preserved for future analytics/trending features
- UI shows only the current (most recent) rating

### Edit Rating Workflow
1. User on Movie Profile page sees their current rating displayed
2. Click "Edit Rating" button
3. Navigate to Scorecard with form pre-populated from previous rating
4. Modify term selections and/or category priority order
5. Click "Save Rating"
6. Previous rating replaced in database (old values archived with timestamps)
7. Page shows updated rating immediately

---

## 8. Recommendation Engine & Similarity Algorithm (CLARIFIED)

### "Most Similar Public Users" - Pairwise Comparison (from BRAINSTORM_ANALYSIS_AND_ELABORATION.md)

**Algorithm**: For each public user with ≥ minimum overlap (default: 3 movies):
```javascript
diffRatings(userA, userB) = SUM for each category:
  max(weightA, weightB) × |ratingA - ratingB| × (1 + |weightA - weightB|)
```

- Lower Taste Diff = more similar
- Sort by: Overlap Count DESC, then Taste Diff ASC
- Display top 5–10 on Dashboard

**Minimum Overlap Configuration**: Currently set to 3 movies minimum (configurable). Rationale: 1 overlapping movie isn't statistically meaningful; 3 is minimum threshold for taste pattern.

### "Recommendations by Taste" (on User Profile)

**Feature**: On another user's public profile, show movies they rated highly (80%+/4.0+) that you haven't rated

**Algorithm**:
1. Get all movies viewed user rated above 80% 
2. Remove: any movies current user has already rated
3. Sort by: Score DESC
4. Display: Thumbnails (NO scores) with Movie Profile links

**Note**: Future version will add more sophisticated overlap analysis. For V4 prototype, keep it simple.

### Watchlist Feature
**Definition**: A list of movies the reviewer has not yet seen and/or rated
- **Watchlist** (preferred term): Movies user intends to watch/rate later
- **Purpose**: Track movies of interest without committing to a rating
- **Shown on**: User's Dashboard under "Unrated Watchlist"
- **Interaction**: 
  - Add to watchlist from Movie Profile or Search results
  - Remove from watchlist if user changes mind
  - Rating a watchlisted movie removes it from watchlist, adds to "Rated Movies"
- **Future Enhancement**: Link watchlist movies to streaming availability and physical media sales

---

## 9. Artist Search: Movie Overlap Feature

**Feature**: Separate section on Advanced Search page
- Find all artists who contributed to selected movies
- **Interaction**: 
  1. User selects multiple movies (multi-select dropdown or checkboxes)
  2. Set minimum overlap count to 2 or more
  3. Results: All artists who contributed to 2+ selected movies, ranked by contribution count
  4. Display: Artist name | movies in common | roles

**Example**: User selects [Inception, Dark Knight, Interstellar] → finds Christopher Nolan and other overlapping contributors

**Technical**: Artist contribution schema supports multiple roles per movie (director, writer, actor, etc.)

---

## 10. UI Implementation Details (Currently Missing - Renumbered from 8)

### Scorecard Implementation Example

**Reference Implementation**: See `sortable-demo/` for working example
- Location: `sortable-demo/index.html`
- Features implemented and tested:
  - ✅ jQuery UI Sortable with smooth drag-and-drop (150ms delay, 'pointer' tolerance)
  - ✅ Radio toggle buttons styled with Bootstrap (btn-group pattern)
  - ✅ Bootstrap grid layout (col-auto, col for flexible spacing)
  - ✅ Real-time weighted score calculation (4x, 3x, 2x, 1x multipliers)
  - ✅ Half-star rating display with proper scaling (0% = 0 stars, 100% = 5 stars)
  - ✅ Responsive design with Bootstrap utilities only
  - ✅ jQuery UI state handling (placeholder with dashed border, helper opacity)
  - ✅ Defensive input validation and bounds checking

**Scorecard Layout**
```
┌────────────────────────────────────────────────────────────┐
│  ☰ Daring (Story & Subject)     [Dogmatic] [Formulaic] [Creative] [Provocative] │
├────────────────────────────────────────────────────────────┤
│  ☰ Ambition (Production)        [Lazy] [Rushed] [Aspiring] [Masterful] │
├────────────────────────────────────────────────────────────┤
│  ☰ Engagement (Pacing)          [Punishing] [Uneven] [Engaging] [Irresistible] │
├────────────────────────────────────────────────────────────┤
│  ☰ Satisfaction (Impact)        [Contemptible] [Unremarkable] [Rewarding] [Unforgettable] │
└────────────────────────────────────────────────────────────┘

Score: 85% ★★★★⯨
```

**Technical Stack** (from sortable-demo):
- React 18 UMD (no build step required)
- jQuery UI 1.13.2 Sortable widget
- Bootstrap 5.0.2 (all styling via utility classes)
- Namespace system (importNamespace pattern from gizmo-atheneum)

**Key Code Patterns to Copy**:

1. **jQuery UI Sortable Initialization** (in componentDidMount):
```javascript
$(this.categoriesRef.current).sortable({
  handle: '.drag-handle',
  placeholder: 'category-panel ui-sortable-placeholder',
  tolerance: 'pointer',
  axis: 'y',
  opacity: 0.6,
  delay: 150,
  stop: (event, ui) => {
    const newOrder = Array.from(me.categoriesRef.current.children)
      .map(el => el.getAttribute('data-category-id'));
    me.setState({ priorityOrder: newOrder }, () => {
      me.updateScore();
    });
  }
});
```

2. **React Ref for jQuery Integration**:
```javascript
this.categoriesRef = React.createRef();
// In JSX: <div ref={this.categoriesRef}>
// Access: this.categoriesRef.current
```

3. **Cleanup on Unmount**:
```javascript
componentWillUnmount() {
  if (this.categoriesRef.current) {
    $(this.categoriesRef.current).sortable('destroy');
  }
}
```

4. **Refresh Sortable After State Changes**:
```javascript
componentDidUpdate(prevProps, prevState) {
  if (JSON.stringify(prevState.priorityOrder) !== JSON.stringify(this.state.priorityOrder)) {
    if (this.categoriesRef.current && $(this.categoriesRef.current).data('sortable')) {
      $(this.categoriesRef.current).sortable('refresh');
    }
  }
}
```

5. **Bootstrap Radio Toggle Buttons**:
```jsx
<div className="btn-group" role="group">
  {config.terms.map(term => (
    <React.Fragment key={term.index}>
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
        className={`btn btn-sm ${term.class}`}
        htmlFor={`term-${categoryId}-${term.index}`}
      >
        {term.label}
      </label>
    </React.Fragment>
  ))}
</div>
```

6. **Weighted Score Calculation**:
```javascript
calculateScore: (selections, priorityOrder) => {
  let weightedSum = 0;
  priorityOrder.forEach((categoryId, index) => {
    const termValue = termValues[selections[categoryId]];
    const weight = priorityWeights[index]; // [4, 3, 2, 1]
    weightedSum += termValue * weight;
  });
  
  const percent = Math.round(((weightedSum - 10) / 30) * 100);
  const halfStars = Math.round((percent / 10) * 2) / 2;
  
  return { percent, halfStars, isComplete: true };
}
```

**Bootstrap Utility Classes Used**:
- Layout: `d-flex`, `flex-column`, `gap-*`, `row`, `col-*`, `col-auto`
- Colors: `bg-dark`, `border-info`, `text-success`, `text-warning`
- Spacing: `p-*`, `m-*`, `mb-*`, `py-*`
- Typography: `display-4`, `fw-bold`, `fs-5`, `text-muted`
- Components: `badge`, `btn`, `btn-sm`, `btn-outline-*`, `alert`, `btn-group`, `btn-check`

**CSS Only** (15 lines total):
- jQuery UI Sortable helper state (opacity, shadow, z-index, cursor)
- jQuery UI Sortable placeholder state (dashed border, opacity)
- Drag handle cursor styling

**Avoid**:
- Custom grid or flexbox CSS—use Bootstrap instead
- Inline styles—use Bootstrap utilities
- Animations beyond transition:none for jQuery—can cause glitches
- Re-initializing Sortable on every render—only on mount, refresh on state change
  - Slightly Negative → btn-light
  - Neutral → btn-secondary
  - Slightly Positive → btn-light
  - Positive → btn-outline-info
  - Very Positive → btn-outline-success
  - Extremely Positive → btn-outline-success

### Gallery Modal
**Trigger**: Click on poster thumbnail

**Scope** (per `pagesDraft.md`):
- **On Movie Profile**: Cycles through all available posters/editions for that specific movie
- **On Artist Profile**: Cycles through all available images (photos, portraits, etc.) for that artist

**Technical**:
- Source images: Use `posters/` folder for prototype (will be replaced by external image APIs in full implementation)
- Navigation: prev/next buttons (disabled at ends if only 1 image exists)
- Close: ESC key or close button
- Display: High-res/larger version of thumbnail

### User Scoreboard Display
```
| Movie | Rating | Score |
|-------|--------|-------|
| The Matrix (1999) | Unforgettable, Masterful, Irresistible, Creative | ★★★★★ |
| Inception (2010) | Masterful, Fascinating, Intricate, Artistic | ★★★★☆ |
```
- Stars = Font Awesome icons (solid ★ and outline ☆)
- Half-stars supported (offset display)

### Movie Scoreboard Display
```
| Rating | Score | Count | Percent |
|--------|-------|-------|---------|
| Unforgettable, Masterful, Irresistible, Creative | ★★★★★ | 43 / 78 | 55% |
| Masterful, Fascinating, Intricate, Artistic | ★★★★☆ | 12 / 78 | 15% |
```
- Below table: Horizontal bar graph showing score distribution
- Graph x-axis = scores (stars), y-axis = count
- Tooltip on hover: Show exact count and percent

### Public Profile Visibility Rules

**When viewing another user's PUBLIC profile, visible sections**:
- [ ] Username, date joined
- [ ] Taste Diff / Count (vs. current user)
- [ ] User Scoreboard — only movies BOTH users have rated
- [ ] Recommendations by Taste — other user's high-rated movies current user hasn't rated (thumbnails, no scores)
- [ ] Top 5 / Bottom 5 — thumbnails without ratings of other user's highest/lowest scored movies (that current user hasn't rated)

**Hidden from public profiles**:
- Other user's queue/watchlist
- Individual ratings for movies current user hasn't rated
- Any scoring data for unmated movies

---

## 11. Scorecard Page Content (Complete Spec - Renumbered from 9)

**Current**: Basic vocabulary buttons  
**Updated**:
- [ ] Movie selector/dropdown with search
- [ ] Movie title + poster thumbnail
- [ ] 4 draggable category panels (as specified in #8)
- [ ] Fixed position-based insertion (not append-to-bottom)
- [ ] Real-time score preview (shows calculated stars)
- [ ] Confirm/submit button
- [ ] Cancel button (returns to previous page)
- [ ] Update success notification

---

## 12. Restore Header & Branding (Renumbered from 10)

- [ ] Use header layout from original prototype
- [ ] Keep Bebas Neue + Inter fonts
- [ ] Maintain color scheme (#16213e primary, #0f3460 dark, #e94560 accent)
- [ ] Add logo/branding element (from original prototype)
- [ ] Header should include: Logo | Title | Navigation links | User menu (Profile, Settings, Logout)

---

## 13. Architecture Changes

### Data Model & Schemas

#### Movie Data (movies.json)
```javascript
{
  "id": "movie-123",
  "title": "Inception",
  "year": 2010,
  "genres": ["Sci-Fi", "Action", "Thriller"],
  "director": ["Christopher Nolan"],
  "writers": ["Christopher Nolan"],
  "actors": ["Leonardo DiCaprio", "Marion Cotillard", "Ellen Page"],
  "studio": "Warner Bros",
  "posterUrl": "https://...",
  "synopsis": "..."
}
```

#### Rating Data (ratings.json)
```javascript
{
  "id": "rating-456",
  "userId": "user-1",
  "movieId": "movie-123",
  "taxonomicRating": {
    "daring": 3,        // 0–3 index into term array
    "ambition": 2,
    "intellectual": 1,
    "magical": 0
  },
  "categoryOrder": ["daring", "ambition", "intellectual", "magical"],  // Priority order (1st to 4th)
  // score is calculated, NOT stored
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-02-20T14:45:00Z"
}
```

**NOTE**: Category order (priority ranking) must be stored to reproduce score calculation. Score itself is calculated on-the-fly, not persisted.

#### User Data (users.json)
```javascript
{
  "id": "user-1",
  "username": "dajoh",
  "isPublic": true,
  "ratings": [
    { "movieId": "movie-123", "ratingId": "rating-456" }
  ],
  "watchlist": [
    "movie-789", "movie-456"
  ]
}
```

#### Artist Data (artists.json)
```javascript
{
  "id": "artist-789",
  "name": "Christopher Nolan",
  "contributions": [
    { "movieId": "movie-123", "types": ["director"] },
    { "movieId": "movie-456", "types": ["director", "writer"] },
    { "movieId": "movie-789", "types": ["writer"], "character": null }
  ]
}
```

**NOTE**: A contributor can have **multiple roles** in a single movie (e.g., director AND writer). Use `types` array to support this.

### Prototype Data Strategy
- **V4 Prototype**: Use dummy/mock JSON files in `data/` folder (~40–50 movies, 5 test users)
- **Full Implementation**: Will replace with external data source (API to be determined)
- For prototype images: Use local `posters/` folder
- For full implementation: Will integrate image APIs

### Current User Context
```javascript
{
  currentUserId: 'user-1',
  currentUser: { id, name, ratings: [] },
  
  // Track which user rated what
  movies: [
    {
      id,
      title,
      ratings: [
        { userId: 'user-1', taxonomicRating: {...}, score: 4.5 },
        { userId: 'user-2', taxonomicRating: {...}, score: 4.0 }
      ]
    }
  ]
}
```

### Privacy Filter Utility
```javascript
// Check if user's profile is public
canViewUserProfile(viewingUserId, currentUserId) {
  if (viewingUserId === currentUserId) {
    return true; // Always see your own dashboard
  }
  return users[viewingUserId].isPublic; // Only if their profile is public
}

// Get visible ratings for a movie
getMovieRatingsForUser(movieId, currentUserId) {
  const allRatings = movies[movieId].ratings;
  
  const userHasRated = allRatings.find(r => r.userId === currentUserId);
  if (userHasRated) {
    return allRatings; // Can see all ratings after rating themselves
  }
  return []; // Can't see ratings until they rate
}

// Get overlapping ratings for User Scoreboard
getOverlappingRatings(viewedUserId, currentUserId) {
  const viewedUserRatings = users[viewedUserId].ratings;
  const currentUserRatedMovies = new Set(users[currentUserId].ratings.map(r => r.movieId));
  
  // Only return movies both users have rated
  return viewedUserRatings.filter(r => currentUserRatedMovies.has(r.movieId));
}
```

### Improved Drag-Drop Logic (CLARIFIED - Use jQuery UI Sortable)

**IMPORTANT**: Replace the current drag-drop logic with **jQuery UI Sortable with placeholder effect**

Reference: https://jqueryui.com/sortable/#placeholder

**Before full V4 prototype**: Create a `sortable-demo` page to test jQuery UI Sortable behavior

**Interaction**:
- Category panel being dragged becomes semi-transparent (0.6 opacity)
- Placeholder (empty space) shows where it will be inserted
- Other panels smooth-reflow to make room
- Panel snaps into position on drop
- ESC cancels drag (returns to original position)

---

## File Structure

```
prototypeV4/
├── index.html                    # Main entry (updated header)
├── styles.css                    # Minimal CSS (same as v3)
├── scripts/
│   ├── main.js                   # Main app (routing + user context)
│   ├── components/
│   │   ├── Header.js             # NEW - Restored branding
│   │   ├── Navigation.js         # Updated with all pages
│   │   ├── Dashboard.js          # Redesigned with content
│   │   ├── MovieProfile.js       # NEW - Movie details + scorecard
│   │   ├── UserProfile.js        # NEW - User details + recommendations
│   │   ├── ArtistProfile.js      # NEW - Artist details + contributions
│   │   ├── Scorecard.js          # Fixed drag-drop + multi-category
│   │   ├── MovieSearch.js        # NEW - Advanced movie filters
│   │   ├── ArtistSearch.js       # NEW - Artist search + overlap
│   │   ├── UserSearch.js         # NEW - User search + similarity
│   │   ├── MovieScoreboard.js    # NEW - Movie scoreboard + graph
│   │   └── UserScoreboard.js     # NEW - User ratings display
│   └── utils/
│       ├── dataService.js        # Updated with ratings by user
│       ├── scoreCalculator.js    # NEW - Taxonomy to score mapping
│       ├── privacyFilter.js      # NEW - Privacy rules enforcement
│       ├── dragDropHelper.js     # NEW - Position-based insertion
│       ├── similarityCalculator.js # NEW - Taste diff calculation
│       └── recommendationEngine.js # NEW - Taste-based recommendations
├── data/
│   ├── vocabulary.json           # Reference to FinalVocabularySelection.md
│   ├── movies.json               # Movie metadata (NO ratings here)
│   ├── ratings.json              # Ratings array (separate from movies)
│   └── users.json                # User data + profile settings
```

**DataService** should simulate database more realistically:
- **Internal data layer**: movies, ratings, users stored as separate arrays
- **Public API**: DataService.getMovie(), getMovieRatings(), getUserRatings(), getMovieTitle() - returns "Title (Year)" format
- **For demo**: ~40 movies, 5 users, strategic rating distribution

---

## Implementation Phases

### Phase 1: Foundation & Privacy (HIGH PRIORITY)
- [ ] Add current user context to state
- [ ] Implement privacy filter utility
- [ ] Update dataService with ratings by user
- [ ] Update Dashboard to respect privacy rules
- [ ] Implement similarity calculator for "Most Similar Public Users"

### Phase 2: Fix Drag-Drop (HIGH PRIORITY)
- [ ] Implement position-based insertion logic
- [ ] Test with 4 categories
- [ ] Verify drop positioning works correctly
- [ ] Update Scorecard with multi-category support

### Phase 3: Core Pages
- [ ] Restore/redesign Header from original prototype
- [ ] Implement Movie Profile page (with conditional content based on rating status)
- [ ] Implement User Profile page (with privacy checks)
- [ ] Implement Dashboard with "Most Similar Public Users"
- [ ] Implement Scoreboard components (Movie + User display)

### Phase 4: Search & Artist Features
- [ ] Implement Advanced Movie Search (filters)
- [ ] Implement Artist Search + Artist Profile page
- [ ] Implement User Search
- [ ] Implement recommendation engine ("Recommendations by Taste")
- [ ] Add gallery modal for posters/images

### Phase 5: Score Calculations & Analytics
- [ ] Implement taxonomy-to-score converter
- [ ] Implement score distribution graph for Movie Scoreboard
- [ ] Implement Taste Diff calculation algorithm
- [ ] Implement Top 5 / Bottom 5 filtering and display

### Phase 6: Navigation & Integration
- [ ] Full routing between all pages
- [ ] Scorecard update integration with all scoreboards
- [ ] Movie Profile → Scorecard flow
- [ ] User Profile → UserScoreboard → Movie Profile flow
- [ ] Search results → Detail pages flow

### Phase 7: Polish & Testing
- [ ] Privacy audit - verify rule #1 everywhere
- [ ] Cross-browser testing
- [ ] Mobile/touch testing
- [ ] Visual consistency with original theme
- [ ] Verify all links and navigation flows
- [ ] Test recommendation engine accuracy
- [ ] Test search functionality across all types

---

## Key Implementation Notes

### Privacy Rule #1 - Correct Interpretation

**The rule**: Don't expose rating/scoring data for movies the user hasn't rated (to avoid bias)

**Examples:**

❌ **Wrong**: Show Movie Scoreboard when user hasn't rated the movie  
✅ **Right**: Only show Movie Scoreboard AFTER user rates the movie

❌ **Wrong**: Show all users' profiles publicly by default  
✅ **Right**: Only show User Profile if that user toggled "Public"

❌ **Wrong**: Show all of another user's ratings in User Scoreboard  
✅ **Right**: In User Scoreboard, only show movies both users have rated

✅ **Correct**: User can always see their own Dashboard (all their ratings)

✅ **Correct**: User Scoreboard shows ratings for movies user HAS rated + other user's taste on those overlapping movies

### Drag-Drop Positioning
- Must calculate drop position from offsets (not just swap)
- Must handle insertion between items (not just append)
- Reference: `idiosynced.github.io/scripts/taskBoard.js` - use their algorithm

### Header Restoration
- Study original prototype header styling
- Restore branding/logo area
- Keep Bebas Neue font treatment
- Maintain dark blue + accent red colors

### Scoring Algorithm Clarification
- Each user selects ONE vocabulary term per category (4 categories total)
- Final score = average of the 4 selected terms' scores
- Scores range 0.0–5.0, displayed as half-stars (0–5 stars in 0.5 increments)
- Must match vocabulary scale in `FinalVocabularySelection.md`

### Similarity Algorithm ("Most Similar Public Users")
- Identify all PUBLIC profiles with >= 1 movie in common with current user
- Calculate: Count of overlapping movies + Average Taste Diff
- Sort by count DESC, then Taste Diff ASC
- Display top 5–10 on Dashboard

### Recommendation System
- "Recommendations by Taste" shows other user's high-scored movies (4.0+)
- Filter to movies current user hasn't rated
- Prioritize by taxonomic similarity to current user's previous ratings
- Display as thumbnails (no scoring data)

### Queue / Watch List
- These terms are interchangeable
- Queue = movies user has marked but not yet rated
- Movie → AddToQueue button or RemoveFromQueue button
- Queue items appear on Dashboard "Current User Queue" section
- Rating a queue item moves it to "Current User Ratings"

---

## Success Criteria

### Privacy & Rules
- ✅ Privacy Rule #1 enforced: No Movie Scoreboard visible until user rates that movie
- ✅ Profile visibility: User Profile pages only accessible if profile is "Public"
- ✅ User Scoreboard: Only shows overlapping rated movies (not all of viewed user's ratings)
- ✅ Dashboard: User sees only their own data (own ratings, own queue, own recommendations)
- ✅ Movie Profile: Hides ratings for unrated movies; shows Movie Scoreboard only after rating

### Page Implementation
- ✅ Dashboard: Includes Profile Status toggle, Queue, Current Ratings, "Most Similar Public Users"
- ✅ Movie Profile: Shows metadata + Scorecard (if unrated) or Rating + Scoreboard (if rated)
- ✅ User Profile: Shows Username, DateJoined, TasteDiff, UserScoreboard, Recommendations, Top 5/Bottom 5
- ✅ Artist Profile: Shows bio, contributions table, thumbnail gallery
- ✅ Scorecard: Multi-category (4 draggable), real-time score preview, submit functionality
- ✅ Movie Search: Advanced filters (genre, year, director, writer, actor, studio)
- ✅ Artist Search: By name + movie overlap search
- ✅ User Search: By username, sortable by similarity

### Functionality
- ✅ Drag-drop positioning: Categories insert between items (not append to bottom)
- ✅ Most Similar Public Users: Algorithm correctly calculates overlap + taste diff
- ✅ Recommendations by Taste: Filters to 4.0+ scored, unrated movies with taxonomic priority
- ✅ Score calculation: Vocabulary terms → average score → half-stars (0–5)
- ✅ Movie Scoreboard: Shows all unique ratings with counts, percents, distribution graph
- ✅ User Scoreboard: Shows overlapping movies with star ratings
- ✅ Queue functionality: Add/remove movies, moves to ratings on scoring
- ✅ Gallery modal: Poster/image zoom + prev/next navigation

### UI/UX
- ✅ All pages from pagesDraft.md implemented with correct content
- ✅ Navigation works smoothly between all pages
- ✅ Original prototype theming/header restored
- ✅ Scorecard uses specified button colors (danger→warning→light→info→success)
- ✅ Font Awesome stars display correctly in scoreboards
- ✅ Bar graph displays score distribution
- ✅ Mobile/touch-friendly drag-and-drop
- ✅ Responsive design (or mobile-optimized if SPA)

### Data & Persistence
- ✅ Scorecard updates are persisted and visible in all scoreboards
- ✅ User profile settings (Public/Private) are saved
- ✅ Queue items persist across sessions
- ✅ Rating history accessible and aggregated correctly

---

## Remaining Ambiguities to Resolve During Development

1. **Score Distribution Graph Details**
   - X-axis: Should it show score values (0–5) or taxonomic rating combinations?
   - Y-axis scale: Linear or log?
   - Hover tooltip: Show exact numbers or percentages?

2. **Top 5 / Bottom 5 Sorting**
   - Should "Top 5" be highest *score* or highest *count of ratings*?
   - Same question for "Bottom 5"

3. **"Most Similar Public Users" - Tie Breaking**
   - If multiple users have same movie count and taste diff, what's the sort order?
   - Should we limit to top 5 or top 10?

4. **Recommendation Algorithm - Taxonomic Similarity**
   - How is "taxonomic similarity" calculated exactly?
   - If user rated Movie A with (Term1, Term2, Term3, Term4), and viewed user rated Movie B with (Term1, Term2, Term5, Term6), are they "similar"?
   - Does matching on 2/4 terms constitute "high similarity"?

5. **Artist Contribution Roles**
   - How are character names stored vs. profession titles?
   - Should search distinguish "Director" vs. "Actor" roles in results?

6. **Search Result Pagination**
   - How many results per page?
   - Infinite scroll or paginated?

7. **Movie Profile - "Add to Queue" Button Placement**
   - Should it appear prominently in header, or with metadata?
   - Should position in queue be editable (drag to reorder)?

8. **User Profile - Private Profile Text**
   - When profile is Private, should other users see "Profile is Private" message, or no profile link at all?

9. **Header User Menu**
   - Should current user's profile picture appear?
   - Should there be a notification badge?

10. **Mobile View - Navigation**
    - Should navigation be hamburger menu or bottom tabs?

---

## References

- Privacy Rules: See notes in `prototypeV3remarks.md`
- Page Content: `pagesDraft.md`
- Vocabulary: `FinalVocabularySelection.md`
- Metrics & Features: `metricsFeatures.md`
- Drag-Drop Pattern: `idiosynced.github.io/scripts/taskBoard.js`
- Original Theming: `prototype/` directory (V3)
- Architecture Notes: `PROTOTYPEV2_PLAN.md`
- Analysis: `BRAINSTORM_ANALYSIS_AND_ELABORATION.md` (for commonality logic)

---

## CLARIFICATIONS FROM DESIGN REVIEW (May 8, 2026)

### Scorecard & Scoring
- ✅ **Scorecard is inline on Movie Profile**, not separate page
- ✅ **User arranges categories by priority** (affects 4x/3x/2x/1x weight multipliers)
- ✅ **Score formula**: Weighted sum normalized to 0-100%, displayed as half-stars
- ✅ **Movie titles always display as "Title (Year)"** everywhere (e.g., "The Matrix (1999)")

### Profile & Privacy
- ✅ **New profiles default to PRIVATE** (User1 demo starts PUBLIC for testing)
- ✅ **Profile Status toggle is instant** (no confirmation needed)
- ✅ **Queue is ALWAYS private** (never shown on public profiles)
- ✅ **Format "Member since [Date]"** for profile date display

### Drag & Drop
- ✅ **Use jQuery UI Sortable with placeholder** (not custom position-based logic)
- ✅ **Create sortable-demo first** to test before full V4 prototype
- ✅ **Show priority numbers/badges** (1, 2, 3, 4) with weight multipliers (4x, 3x, 2x, 1x)

### Similarity & Recommendations
- ✅ **Pairwise comparison uses diffRatings formula** (from BRAINSTORM_ANALYSIS_AND_ELABORATION.md)
- ✅ **"Most Similar Public Users"** sorted by: Overlap Count DESC, then Taste Diff ASC
- ✅ **"Recommendations by Taste"** shows 80%+ scored movies, prioritized by taxonomic overlap

### Artist Search
- ✅ **Movie Overlap mode searches ALL movies** (not just user's rated)
- ✅ **Display format: "Title (Year)"** in multi-select dropdown
- ✅ **Type-ahead with lazy-loading** (requires ≥1 character)
- ✅ **Multi-select with checkboxes** for movie selection

### Data Structure
- ✅ **DataService simulates DB with separate arrays**: movies.json, ratings.json, users.json
- ✅ **Ratings stored separately** from movies for better data organization
- ✅ **Public API returns "Title (Year)" format** for all movie titles

### Terminology
- ✅ **"Reading" is a typo** → use "rating"
- ✅ **Queue and Watch List are same feature** → prefer "Queue"

---

**Status**: Planning Complete - Ready for Phase 1 Implementation  
**Target**: Complete implementation of all pages with privacy rules  
**Created**: May 8, 2026  
**Updated**: May 8, 2026 (Design Review Clarifications Applied)
