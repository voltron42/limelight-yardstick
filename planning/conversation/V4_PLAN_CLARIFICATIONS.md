# PROTOTYPEV4_PLAN.md - Clarifications & Ambiguities

**Status**: Review phase  
**Purpose**: Document areas of ambiguity, contradictions, and design gaps discovered during comprehensive plan review  
**Based on**: sortable-demo implementation insights + full document analysis

---

## 🔴 Critical Issues (Must Resolve Before Implementation)

### 1. Duplicate Section 8 - Structure Error
**Problem**: Document has TWO sections labeled "8. UI Implementation Details"
- First occurrence: Scorecard Implementation Example (with sortable-demo code)
- Second occurrence: UI Implementation Details (with phase breakdown)

**Impact**: Confusing section numbering makes referencing plan sections ambiguous

**Resolution**:
- Rename second "Section 8" to "Section 9: Implementation Phases"
- Update all subsequent section numbers accordingly
- Update table of contents if one exists

---

### 2. Vocabulary Scale Contradiction - 4 Values vs 9 Values
**Problem**: Conflicting specifications for taxonomy scoring scale

**Locations**:
- **Section 6 (Scoring Algorithm)**: Shows 9-level scale
  ```
  Scores: 0.0, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0
  ```
- **Section 7 (Algorithm Details)**: References 4-value map
  ```javascript
  termValues: {0: 1.0, 1: 2.0, 2: 3.0, 3: 4.0}
  ```
- **sortable-demo implementation**: Uses 4-value scale (working correctly)

**Impact**: Developers implementing scoring will create incompatible versions

**Recommendation**:
- **Standardize on 4-value scale** (1.0, 2.0, 3.0, 4.0)
- Rationale: 
  - Cleaner, already implemented in sortable-demo
  - Maps to 4 terms per category
  - Stars still display as half-increments (0.0–5.0 range from averaging 4 terms)
  - `FinalVocabularySelection.md` confirms 4 terms per category
- Update Section 6 to remove the 9-value scale reference

> review the algorithm from sortable demo. The 9-level scale is a recognizable context related standard, while the 4 value scale is used explicitly for the scoring algorithm. The one cannot be substituted for the other, as they bare no relation to each other. Follow the precedent set by the sortable-demo

---

### 3. Score Calculation Algorithm Contradiction - Averaging vs Weighted
**Problem**: TWO incompatible algorithms described in same plan

**Locations**:
- **Section 6**: "Final score = average of the 4 selected terms' scores"
  - Formula: `(term1 + term2 + term3 + term4) / 4`
  - Result: Always 0.0–5.0 range, no priority distinction
  
- **Section 7 (sortable-demo reference)**: Weighted sum with priority multipliers
  - Formula: `((4×term1 + 3×term2 + 2×term3 + 1×term4) - minScore) / (maxScore - minScore) × 100`
  - Result: 0–100% range, priority order matters significantly

**Impact**: Core scoring logic is ambiguous; implementations will diverge

**sortable-demo Verdict**: Weighted algorithm is **correct** because:
- Priority-based weighting makes sense (category rank matters)
- Produces 0–100% scale (better for UI percentages)
- Already tested and working
- Matches intuitive "most important category weighted highest" design

**Recommendation**:
- **Replace Section 6 entire scoring description** with weighted algorithm
- Remove all references to simple averaging
- Clarify: "Category order (priority) matters — first category is 4× weight, last is 1× weight"
- Add note: "This incentivizes thoughtful prioritization, not just term selection"

> as stated above, the sortable demo should be the source of truth for the scoring algorithm. Follow the recommendation to remove all references to simple averaging and follow the weighted algorithm

---

### 4. "Edit Rating" Functionality Unclear
**Problem**: Section 3 (Movie Profile) mentions "Edit Rating" button but flow is undefined

**Current Text**: 
> "Clicking 'Edit Rating' button returns user to Scorecard"

**Questions**:
- Does editing replace the old rating entirely?
- Is rating history kept (for analytics/trending)?
- Can user see their previous rating before editing?
- Does edit trigger re-calculation of all dependent scoreboards?

**Impact**: UX flow undefined; affects data model (do we store history?)

**Recommendation**:
- Add explicit workflow: "Edit Rating replaces the previous rating entirely. Previous rating is discarded. (Note: A future version could store history for analytics.)"
- OR confirm you want history stored, then update data model schema
- Specify: "After saving edited rating, return to Movie Profile (not dashboard)"

> maintain a history
 
---

### 5. Movie Metadata Source Undefined
**Problem**: Section 4 (Advanced Search) requires extensive movie metadata but origin is unclear

**Required Metadata**:
- Title, Year, Genre, Director, Writer, Actor, Studio, Poster URL

**Questions**:
- Where does this data come from? (Hardcoded JSON? External API? Simulated?)
- For V4 demo, will you use IMDb API? Embedded mock data?
- What's the source of truth for data consistency?
- How many movies will demo dataset include?

**Impact**: Search feature implementation blocked until data source defined

**Recommendation**:
- Add new section: "Data Sources & Datasets"
  - Specify: "V4 uses mock dataset (40–50 movies, hardcoded in `data/movies.json`)"
  - If using external API: Document rate limits, fallback strategy, data freshness
  - Define movie fields schema:
    ```json
    {
      "id": "movie-123",
      "title": "Inception",
      "year": 2010,
      "genres": ["Sci-Fi", "Thriller"],
      "director": ["Christopher Nolan"],
      "writers": ["Christopher Nolan"],
      "actors": ["Leonardo DiCaprio", "Marion Cotillard"],
      "studio": "Warner Bros",
      "posterUrl": "https://..."
    }
    ```

> this data will come from an external datasource that we will define for the full implementation, but for the prototype we will only use dummy data.

---

### 6. Artist Profile Contribution Data Model Unclear
**Problem**: Section 4 (Artist Profile) shows contribution examples but schema is undefined

**Example from Plan**:
```
Artist: Christopher Nolan
| Movie | Role |
| Inception | Director |
| The Dark Knight | Director |
| Interstellar | Writer, <character creator> |
```

**Questions**:
- How are character names stored? Separate field? Part of role string?
- What's the complete list of contribution types? (Director, Writer, Actor, Producer, Composer, Cinematographer, etc.)
- Does "Character Creator" map to which real profession?
- How are these associations created/maintained?

**Impact**: Artist Profile page implementation blocked; search by character unclear

**Recommendation**:
- Define contribution schema:
  ```json
  {
    "contributions": [
      { "movieId": "movie-123", "type": "director" },
      { "movieId": "movie-456", "type": "writer" },
      { "movieId": "movie-789", "type": "actor", "character": "Bruce Wayne" }
    ]
  }
  ```
- Clarify: For V4 demo, support: Director, Writer, Actor (ignore Producer, Composer for now)
- Note: "Character Creator" → future feature (skip for V4)

> the above model will need to account for the fact that a contributor may have multiple roles in a given movie

---

### 7. Recommendation Algorithm Vague - "Most-Used Terms"
**Problem**: Section 8 (Recommendation Engine) uses undefined term "most-used terms"

**Current Text**:
> "Calculate taxonomic overlap with current user's most-used terms"

**Ambiguity**: What does "most-used" mean?
- Most recent (last 5 ratings)?
- Most frequent (appears in >50% of ratings)?
- Highest-priority selections (always ranked #1)?
- Average across all ratings?

**Impact**: Recommendation accuracy undefined; algorithm implementation unclear

**Recommendation**:
- Specify: "Calculate 'user profile' by averaging their selected terms across all ratings (not by rank). Then find other users with maximum overlap in averaged profile."
- Example: User has rated 10 movies selecting: [Daring, Hopeful, Intellectual, Ambitious]
  - Average term frequency = [40%, 30%, 20%, 10%]
  - Compare to other users' frequency distributions
  - Recommend users with highest overlap
- Document in Algorithm Details:
  ```javascript
  // Pseudo-code
  function getUserProfile(userId) {
    const ratings = user.ratings;
    const termFrequency = {};
    
    ratings.forEach(rating => {
      rating.taxonomicRating.forEach(term => {
        termFrequency[term] = (termFrequency[term] || 0) + 1;
      });
    });
    
    return normalize(termFrequency); // 0.0–1.0 per term
  }
  
  function calculateRecommendations(currentUserId) {
    const userProfile = getUserProfile(currentUserId);
    // Find all public users with overlap >= threshold (e.g., 0.7 similarity)
    // Sort by similarity DESC
    // Return top 5–10
  }
  ```

> let's just drop the "Most used" for now

---

### 8. Queue/Rating Workflow Unclear
**Problem**: Section 5 (Dashboard) mentions queue but behavior is undefined

**Current Text**:
> "Movies in queue can be rated (moves to 'Ratings' section)"

**Questions**:
- After rating a queued movie, is it removed from queue or stays in both sections?
- Can user navigate directly from queue to Scorecard?
- Does "Ratings" section show all-time ratings or just recent?
- What happens if user unqueues a movie? Does rating stay?

**Impact**: Dashboard state management unclear; unclear if queue and ratings are separate or overlapping

**Recommendation**:
- Clarify model: Separate queues for rated/unrated movies
  - **Unrated Queue**: Movies user wants to watch (will rate later)
  - **Rated Movies**: All movies user has rated (newest first)
  - Interaction: Rating a queued movie removes it from Unrated Queue, adds to Rated Movies
- Update Dashboard layout description:
  ```
  Dashboard Structure:
  1. "Most Similar Public Users" (top 5–10, sorted by similarity + overlap count)
  2. "Unrated Queue" (movies to watch)
  3. "Recently Rated" (last 10 ratings, sorted by date DESC)
  4. Link to full "Rated Movies" list
  ```

> The "Queue" is probably better defined as a "Watchlist": a list of movies that the reviewer has not yet seen, much less rated. A future feature will be to link the movie to its streaming availability as well as its availability for physical media sales.

---

### 9. Pagination/Limits Completely Undefined
**Problem**: Multiple sections list items without specifying limits or pagination

**Affected Features**:
- Top 5 / Bottom 5 (Movie Scoreboard, User Scoreboard)
- Top 5–10 similar users (Dashboard)
- Search results (Movie, Artist, User searches)
- Recently rated movies (Dashboard)
- Gallery modal (prev/next navigation)

**Questions**:
- Fixed count (always show exactly 5) or "first N"?
- What happens if fewer results exist?
- Infinite scroll vs pagination?
- Sort order when results tie?
- Any filters for low-quality results? (e.g., min rating count threshold for scoreboards?)

**Impact**: Frontend developers won't know result set sizes, may cause UI bugs

**Recommendation**:
- Add new section: "UI Display Limits & Pagination"
  ```
  Dashboard:
  - Most Similar Users: Top 10 (or fewer if <10 public users exist)
  - Recently Rated: Last 5 most recent
  - Link to view all rated movies
  
  Scoreboards:
  - Top 5 / Bottom 5: Exactly 5 (or fewer if dataset has <5 rated items)
  - Minimum threshold: Movie must have ≥3 ratings to appear
  
  Search Results:
  - Movies: Show first 20 per page, paginated (search can return 100+)
  - Artists: Show all (typically <100)
  - Users: Show first 20 per page (only public users shown)
  
  Gallery Modal:
  - Cycles through all poster images for current movie
  - prev/next buttons disabled at ends
  ```

> I don't want to worry about Pagination for the prototype. We'll make that a future enhancement once the back-end is implemented.

---

### 10. User Scoreboard vs Movie Scoreboard Display Contradiction
**Problem**: Both scoreboards described as showing identical data; distinction unclear

**Current Text** (Section 5):
> Movie Scoreboard: Shows all users' ratings for that movie (top 5 / bottom 5)
> User Scoreboard: Shows a specific user's ratings on movies (with overlapping comparison)

**But**: Both example tables show same format (title + taxonomic rating + score)

**Questions**:
- If displaying same data format, what's the practical difference from user perspective?
- Does User Scoreboard filter to only overlapping movies? (Yes, seems so)
- Does Movie Scoreboard show ALL users or only public users?
- Is there a "taste difference" visualization on User Scoreboard? (Yes, implies different content)

**Impact**: UX design is unclear; could create confusing duplicate pages

**Recommendation**:
- Clarify distinction:
  ```
  Movie Scoreboard (viewing a specific movie):
  - Shows: Top 5 highest-rated by public users, Bottom 5 lowest-rated by public users
  - Data: [UserName] → [Their Rating] → [Their Taxonomic Selection]
  - Purpose: See how different users rated this movie
  - Privacy: Only shows ratings from public users
  
  User Scoreboard (viewing another user's ratings):
  - Shows: Only movies BOTH users have rated (overlapping set)
  - Data: [MovieTitle] → [Their Rating] → [Your Rating] → [Taste Difference Score]
  - Purpose: Compare your taste to another user's taste on shared movies
  - Privacy: Only accessible if target user's profile is public AND you've rated ≥1 overlapping movie
  - Displayed: Side-by-side comparison (your rating vs their rating vs difference metric)
  ```
- Add visual example showing side-by-side layout for User Scoreboard

> the "Movie Scoreboard" and "User Scoreboard" are explicitly defined in `pagesDraft.md`

---

## 🟡 Design Ambiguities (Implementation Guidance Needed)

### 11. Scorecard Return Flow & Transition
**Ambiguity**: After user rates a movie, where do they go?

**Current**: "Scorecard replaced by: Their rating + Movie Scoreboard"

**Options**:
- A) Replace Scorecard entirely (fade out, fade in scoreboard)
- B) Scroll to show rating + scoreboard inline
- C) Navigate back to Movie Profile with scoreboard shown

**Recommendation**: Option A (cleanest UX) — "Scorecard smoothly transitions to Movie Scoreboard via fade animation"

> I don't even care about a transition - just render the rating and the scoreboard instead. We're using React, so keep it simple. We can add bells and whistles later

---

### 12. Artist Search: "Movie Overlap" Feature Unclear
**Ambiguity**: Section 4 mentions "Movie Overlap" search but interaction undefined

**Example**: "Select Inception, Dark Knight, Interstellar → Find all artists who contributed to 2+ of these"

**Questions**:
- Is this a separate search type or an advanced filter?
- Can user select multiple artists then find movies they overlap on?
- UI: Checkboxes for multiple movie selection? Typeahead?

**Recommendation**: Document as "Overlap Analysis" sub-feature:
```
Artist Search → Advanced Filters → "Find artists who contributed to:"
- Select multiple movies (multi-select dropdown)
- Set minimum overlap count (≥2, ≥3)
- Returns all artists matching criteria, ranked by contribution count
```

> this should be a section of its own on the advanced search page. Minimum overlap should always be "2 or more", otherwise the recommendation is solid.

---

### 13. Gallery Modal Navigation Scope
**Ambiguity**: When viewing gallery, what images are shown?

**Questions**:
- All posters from all movies in database?
- All posters from current search results?
- All posters for current movie only (different editions)?
- Navigate between movies (movie1 poster → arrow → movie2 poster)?

**Assumption**: Most likely — "Gallery shows poster variants for current movie only" (e.g., theatrical release vs blu-ray cover)

**Recommendation**: Clarify: "Gallery modal cycles through poster variants for the current movie. If only 1 poster exists, prev/next buttons are disabled."

> review `pagesDraft.md`. The Gallery modal is only used on the Artist profile and Movie profile pages. For the Movie profile, it should be all available posters for that movie. For the Artist profile, it should be all available images for that artist. Again, these links will be provided by external apis to be determined for the full implementation, but for the time being, just use the images in the "posters" folder for the prototype.

---

### 14. Most Similar Users: Minimum Overlap Threshold
**Ambiguity**: Algorithm sorts by "Count DESC" but doesn't specify minimum

**Current**: "Identify all PUBLIC profiles with >= 1 movie in common"

**Problem**: User with 1 overlapping movie could rank equally with user with 10 overlaps (if both have same Taste Diff)

**Recommendation**: Set explicit threshold:
- **Minimum movies in common**: 3 (e.g., only show users who've rated ≥3 of same movies as you)
- Rationale: 1 overlapping movie isn't statistically meaningful for similarity; 3 is minimum for pattern
- Update: "Find all PUBLIC profiles with ≥3 movies in common. Sort by: (1) Count DESC, (2) Taste Diff ASC"

> lets make it configurable and default to a minimum of 3.

---

### 15. Search Results Display: Sorting & Persistence
**Ambiguity**: No specification for search UX details

**Missing**:
- Default sort order (by rating? by date added? by relevance?)
- Are filters sticky if user navigates away?
- Can user save searches?
- Faceted filtering (genre + year + director checkboxes)?

**Recommendation**: "For V4 demo, keep search simple: Results sorted by movie rating (highest first). No filter persistence or saved searches. Single-select or multi-select filters work immediately (no 'Apply' button)."

> let's hold off on the search results for now. for the prototype I just want to get the layout figured out for the page. We'll tackle the search results on the next prototype.

---

## 📋 Recommended Additions to Plan

### Addition 1: Data Model Appendix
Create new section with complete schema definitions:

```markdown
## Data Model & Schema

### movies.json
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

### ratings.json
```javascript
{
  "id": "rating-456",
  "userId": "user-1",
  "movieId": "movie-123",
  "taxonomicRating": {
    "daring": 3,      // 0–3 index
    "ambition": 2,
    "intellectual": 1,
    "magical": 0
  },
  "score": 2.5,       // Calculated 0.0–5.0
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-02-20T14:45:00Z"
}
```
> this is missing the sort order of the categories, and the score is calculated, so it shouldn't need to be stored.


### users.json
```javascript
{
  "id": "user-1",
  "username": "dajoh",
  "isPublic": true,
  "ratings": [
    { "movieId": "movie-123", "ratingId": "rating-456" }
  ]
}
```

### artists.json (NEW)
```javascript
{
  "id": "artist-789",
  "name": "Christopher Nolan",
  "contributions": [
    { "movieId": "movie-123", "type": "director" },
    { "movieId": "movie-456", "type": "writer" },
    { "movieId": "movie-789", "type": "writer", "character": null }
  ]
}
```
> just a reminder that a contributor may have multiple roles in a


### Addition 2: Workflow Diagram (Textual)
```
Happy Path: User Rates a Movie

1. User on Movie Profile page
   └─ Sees: Title, Poster, Metadata, "Rate This Movie" button

2. Click "Rate This Movie"
   └─ Navigate to Scorecard

3. Select 4 terms (daring, ambition, intellectual, magical)
   └─ Real-time score updates (0–100%)

4. Drag categories to set priority order
   └─ Score recalculates

5. Click "Save Rating"
   └─ Rating saved to database

6. Scorecard transitions to Movie Scoreboard
   └─ Display: Top 5 / Bottom 5 ratings from other users
   └─ Show user's own rating highlighted
   └─ Display option to "Edit Rating" or "Back to Movie Profile"


Alternate Path: User Edits Existing Rating

1. User on Movie Profile page
   └─ Sees existing rating displayed

2. Click "Edit Rating"
   └─ Navigate to Scorecard pre-populated with previous selections

3. Modify term selections and/or priority order

4. Click "Save Rating"
   └─ Previous rating replaced, database updated
   └─ Transition to Movie Scoreboard showing updated rating
```

### Addition 3: Vocabulary Scale Standardization
Add to Section 6:
```
### Vocabulary Scale

The application uses a **4-level scale** for vocabulary term selection:

- Level 0 (Low): Score 1.0 (e.g., "Tentative")
- Level 1 (Medium-Low): Score 2.0 (e.g., "Moderate")
- Level 2 (Medium-High): Score 3.0 (e.g., "Significant")
- Level 3 (High): Score 4.0 (e.g., "Profound")

**Scoring**: Final movie score ranges 0.0–5.0 stars, calculated from the 4 selected terms:
- Minimum: All Level 0 selections = 1.0 star
- Maximum: All Level 3 selections = 5.0 stars
- Neutral: Mixed selections average ~2.5–3.5 stars

**Priority Weighting**: The category order (priority) affects score calculation:
- Priority 1 (most important): 4× multiplier
- Priority 2: 3× multiplier
- Priority 3: 2× multiplier
- Priority 4 (least important): 1× multiplier

This means reordering categories to put high-value terms first increases the score.
```

---

## Summary: Before V4 Implementation Begins

**Must Resolve**:
1. Fix section numbering (duplicate Section 8)
2. Standardize on 4-value vocabulary scale
3. Choose ONE scoring algorithm (weighted, not averaging)
4. Define movie metadata source
5. Clarify artist contribution types & schema
6. Specify recommendation algorithm precisely
7. Define pagination/result limits
8. Clarify queue vs ratings workflow
9. Define "edit rating" behavior

**Should Add**:
1. Data Model Appendix with JSON schemas
2. Workflow diagrams (rating flow, edit flow, etc.)
3. UI Display Limits & Pagination section
4. Movie metadata source specification
5. Artist schema definition

**Quick Wins** (already clarified via sortable-demo):
- ✅ Weighted scoring algorithm works correctly
- ✅ 4-value vocabulary scale is optimal
- ✅ Priority-based weighting makes UX sense
- ✅ jQuery UI Sortable provides smooth drag-drop

---

## Next Steps

1. Update PROTOTYPEV4_PLAN.md with clarifications from Section 1–3 above
2. Add new sections: "Data Model Appendix", "UI Display Limits", "Workflow Diagrams"
3. Verify final plan with these questions answered
4. Begin Phase 1 implementation (Foundation & Privacy)

