# Limelight Yardstick - Prototype V4 Design Clarifications

## Context
This document addresses design questions for the V4 prototype using **dummy/sample data** living in-memory. No authentication, persistence, or external APIs required.

---

## 1. Demo User & Sample Data Structure

**Questions**:
- How many demo users should we create? (3-5 suggested for "Most Similar Users" feature)
- How many movies in the demo dataset? (30-50 recommended for variety)
- Should some users have public profiles, some private?
- Should some movies have heavy rating overlap (for commonality testing)?

**Proposed Setup**:
- **5 demo users**: User1 (you), User2 (public), User3 (public), User4 (private), User5 (public)
- **40 sample movies**: With metadata (title, year, genres, directors, writers, actors, studio, poster URL)
- **Ratings distribution**: 
  - User1 (current): 15 ratings (to populate dashboard)
  - User2-3: 25+ ratings each (public profiles, for recommendations)
  - User4: 20 ratings (private, should NOT be visible)
  - User5: 18 ratings (public)
- **Overlap matrix**: Ensure several movies are rated by multiple users (for similarity calculations)

---

## 2. Rule #1 Interpretation: "Top 5 / Bottom 5" on Public User Profiles

**Question**: When viewing another user's PUBLIC profile and seeing "Top 5 / Bottom 5" (their highest/lowest scored movies), is this showing rating data for movies you haven't rated?

**Interpretation**: 
- **YES, this is allowed** because it's showing:
  - Movies that OTHER user rated
  - But NOT showing YOU the scores/ratings (thumbnails only, no stars visible)
  - You can click to Movie Profile, but will only see your own Scorecard (not their rating)

**This respects Rule #1 because**: You don't see rating DATA for movies you haven't rated. You see the *existence* of the movie (it's in their library), but no scoring/ranking information.

**Implementation**:
- Render Top 5 / Bottom 5 as thumbnails
- Show movie title on hover only
- Clicking → Movie Profile (which shows Scorecard for you, not their rating)

---

## 3. "Most Similar Public Users" Feature - Safe Display

**Question**: Is showing recommendations from "Most Similar Users" a Rule #1 violation?

**Interpretation**:
- **NO, this is safe** because "Recommendations by Taste" shows:
  - Movies the viewed user rated highly (4.0+)
  - Movies that YOU haven't rated
  - Displayed as thumbnails without rating data
  - Rationale: These are *suggestions based on similarity*, not raw rating data

**BUT**: When you click a recommended movie's thumbnail → Movie Profile shows Scorecard (your opportunity to rate), NOT their rating

**Implementation**:
- "Recommendations by Taste" = thumbnails, no stars, no scores visible
- Hover shows "<Title> (<year>)" only
- Click → Movie Profile (shows your Scorecard)

---

## 4. Recommendation Algorithm - Empty State

**Question**: What if current user has rated 0 movies? How do recommendations work?

**Proposed Behavior**:
- **On Dashboard**: "Most Similar Public Users" section shows message: "Rate some movies to discover similar users!"
- **On User Profile** (viewed user's recommendations): "You haven't rated any movies yet, so personalized recommendations aren't available. Start rating to see suggestions!"
- Once user rates 1+ movie, similarity calculations can begin

**For demo**: Make sure User1 (current user) has ≥5 ratings to show working recommendations

---

## 5. Search: Simple vs. Advanced

**Question**: `pagesDraft.md` mentions both "Search" and "Advanced Search" — are these different?

**Proposed Solution**:
- **Simple Search** (Dashboard): Single text input, searches across:
  - Movie titles & descriptions
  - User usernames
  - Artist names
  - Shows combined results with icons indicating type
  - Link at bottom: "Advanced Search →"

- **Advanced Search** (separate page):
  - Movie Search: Filters by genre, year, director, writer, actor, studio
  - Artist Search: Find by name, then toggle "Movie Overlap" mode
  - User Search: Find by username, sort by "Most Similar"

**Implementation**:
- Dashboard search = text-only, global
- Advanced Search = separate page with filter UI per content type

---

## 6. Queue vs. Watch List - Position Management

**Question**: When a movie is in the queue, should UI show position (e.g., "#3 of 7") or just "In Queue" with reorder capability?

**Proposed Solution**:
- **On Movie Profile**: Show "In Queue (#3 of 7)" 
- **On Dashboard Queue section**: Display as draggable list (reorderable)
- **Rationale**: Users might want to prioritize which movies to watch next

**Drag-drop for Queue**:
- Similar to Scorecard drag-drop (position-based insertion)
- Moving a movie up/down updates its position
- Positions persist during demo session

**Demo Data**: User1's queue has 8 movies in specific order

---

## 7. Scorecard → Scoreboard Update Flow

**Question**: What's the exact flow when user rates a movie?

**Proposed Flow**:
1. User on Movie Profile (unrated) → clicks "Rate This Movie"
2. Scorecard page loads with movie preselected
3. User selects terms for 4 categories (or adjusts if editing)
4. User clicks "Submit Rating"
5. System updates:
   - User's ratings list
   - Movie's ratings aggregation
   - "Most Similar Public Users" recalculates (if changes affect overlap)
   - User returned to Movie Profile (now shows their rating + Movie Scoreboard)

> adjustments to proposed flow: Scorecard appears on Movie Profile page, not as a separate page
> 1. User on Movie Profile (unrated) → clicks "Rate This Movie"
> 2. Scorecard form appears in Movie Profile where button had been
> 3. User selects terms for 4 categories AND arranges categories in Priority order
> 4. User clicks "Submit Rating", which submits the taxonomic rating for the user for the movie
> 5. System updates:
>   - User's ratings list
>   - Movie's ratings aggregation
>   - "Most Similar Public Users" recalculates (if changes affect overlap)
> 6. Scorecard form now replaced by their rating + Movie Scoreboard

**For demo**: Support both "New rating" and "Edit rating" flows (if User1 rates a movie twice)

---

## 8. Profile Status Toggle - Default & Behavior

**Question**: Is profile Public or Private by default? Immediate effect?

**Proposed Solution**:
- **Default**: User1 (current user) starts as PUBLIC (for demo purposes, show all features)
- **Toggle location**: Dashboard header or profile section
- **Toggle behavior**: 
  - Instant update (no confirmation needed)
  - Visual indicator shows current state
  - Text: "Profile: [PUBLIC] [PRIVATE]" (with one highlighted)
  
**For demo**: User1 = PUBLIC, User2 = PUBLIC, User3 = PUBLIC, User4 = PRIVATE, User5 = PUBLIC
- This lets you visit different profile pages and see both public/private filtering

> Having User1 start as PUBLIC for the sake of the demo is fine, but when a user first creates a new profile, their profile should default to PRIVATE.

---

## 9. "Commonality Analysis" vs. "Most Similar Public Users"

**Question**: Are these the same feature at different scales?

**Proposed Interpretation**:
- **"Most Similar Public Users"** (V4, MVP): Simple pairwise comparison
  - Compare current user's ratings with each public user
  - Calculate: Overlap count + Taste Diff
  - Display top 5-10 on Dashboard

- **"Commonality Analysis"** (Future analytics): Cluster-based analysis
  - Find taste groups across ALL users
  - Identify common rating patterns
  - Show in analytics dashboard (not V4 scope)

**For V4 demo**: Implement "Most Similar Public Users" only (set up data so User1 has clear similarity to User2 & User3)

> The proposed interpretation is correct - the Cluster-based analysis is a large group analysis that would be presented to a user classification that has not yet been defined ....
> Remember that the pairwise comparisons are using the comparison specificied in "BRAINSTORM_ANALYSIS_AND_ELABORATION.md"

---

## 10. Star Rating Display Precision

**Question**: How to display scores with precision? (Half-stars, decimals, tooltips?)

**Proposed Solution**:
- **Display**: Half-stars (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
- **Calculation**: 
  - Taxonomy terms have scores (0.0 to 5.0)
  - Average the 4 selected terms
  - Round to nearest 0.5
  
  ```javascript
  const avgScore = (term1Score + term2Score + term3Score + term4Score) / 4;
  const displayStars = Math.round(avgScore * 2) / 2; // Round to 0.5 increments
  ```

- **Hover Tooltip**: Show exact score (e.g., "3.375 avg") to explain the rounding
- **Visual**: Font Awesome solid stars (★) + outline stars (☆)
  - 3.5 stars = ★★★½☆

**For demo**: Ensure some ratings come out to half-stars to test the display

> this math is incorrect. the calculation for the actual score is specified in "ReviewAndSuggestions.md". The actual score is calculated as a percent. To get the number of half-stars out of five, divide the percent by 10, then round, then divide by 2.

---

## 11. "Reading" vs. "Rating" in Metrics Document

**Question**: In `metricsFeatures.md`, it says "Adding new readings updates my commonalities" — is this a typo or different term?

**Proposed Clarification**:
- **"Reading" is a typo** — should be "rating"
- Context: "Adding new **ratings** updates my commonalities [with other users]"
- Meaning: Every time you rate a movie, the system recalculates which users are most similar to you

**For demo**: No special handling needed — treat "reading" as "rating"

> "reading" is a typo

---

## 12. Movie Metadata Structure for Dummy Data

**Question**: What metadata fields should each movie have?

**Proposed Structure**:
```javascript
{
  id: 'movie-1',
  title: 'The Matrix',
  year: 1999,
  genres: ['Sci-Fi', 'Action', 'Thriller'],
  directors: ['Lana Wachowski', 'Lilly Wachowski'],
  writers: ['Lana Wachowski', 'Lilly Wachowski'],
  actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
  studio: 'Warner Bros.',
  posterUrl: '/images/posters/the-matrix.jpg',
  description: 'A computer hacker learns about the true nature of reality...',
  contentRating: 'R',
  ratings: [
    { userId: 'user-1', taxonomicRating: {/* terms */}, score: 4.5 },
    { userId: 'user-2', taxonomicRating: {/* terms */}, score: 4.0 }
  ]
}
```

**For demo**: Create ~40 movies with real/plausible metadata (use IMDb-style data)

> let's have this be the body that is returned by the "DataService.js" namespace, but inside the namespace, let's more closely simulate the database and have the rating data as it's own json array so that we have consistent data across the demo

---

## 13. Artist Profile → Movie Profile Navigation

**Question**: From Artist Profile contribution table, can you click movie titles to go to Movie Profile?

**Proposed Solution**:
- **YES** — Movie titles in contribution table are clickable links
- Link color: Distinct from body text (e.g., text-primary)
- Clicking → Movie Profile for that movie
- If you haven't rated that movie → Scorecard
- If you have → Your rating + Movie Scoreboard

**For demo**: Ensure at least one artist appears in multiple movies (to test navigation)

> Yes. In the future, I would like to add a toggle to the contribution table to toggle between a table view and a thumbnail gallery view.

---

## 14. Search Results Filter Application - Real-Time vs. Submit

**Question**: In Advanced Search, do filters apply in real-time or on "Search" button click?

**Proposed Solution**:
- **Movie Search**: Real-time filtering
  - As you select genre → results update instantly
  - Multiple selections = AND logic (movies matching all selected filters)
  
- **Artist Search (Overlap mode)**: Click-based
  - Select multiple movies from a list
  - Click "Find Overlapping Contributors"
  - Shows artists in a new results section

**Rationale**: Movie filters are simple enough for real-time; Artist overlap requires deliberate multi-select

**For demo**: Implement real-time for movies, click-based for artist overlap

> this looks good

---

## 15. Queue Display on Public Profiles

**Question**: When viewing another user's PUBLIC profile, should their queue (movies they haven't rated) be visible?

**Proposed Solution**:
- **NO** — Queue is not displayed on public profiles
- **Rationale**: Queue represents "private watching intent" — similar to undisclosed ratings
- **Visible on public profile**: Only their completed ratings + Top 5/Bottom 5 recommendations

**For demo**: On User2/User3 (public) profiles, don't show their queues. Only show on User1 (own dashboard)

> this is correct; queues are ALWAYS private, regardless of profile visibility

---

## 16. Conditional UI: Own vs. Other User Profiles

**Question**: When viewing own profile vs. another user's profile, what UI elements change?

**Proposed Solution**:

| Element | Own Profile (Dashboard) | Other Public Profile | Other Private Profile |
|---------|------------------------|----------------------|----------------------|
| Profile Status toggle | ✅ Show | ❌ Hide | ❌ N/A |
| Edit Rating buttons | ✅ Show | ❌ Hide | ❌ N/A |
| Queue section | ✅ Show | ❌ Hide | ❌ N/A |
| Current Ratings | ✅ Show all | ❌ Hide | ❌ N/A |
| User Scoreboard | ✅ Show all | ✅ Show (if public) | ❌ Show "Profile is Private" |
| Top 5 / Bottom 5 | ✅ Show | ✅ Show (if public) | ❌ Hide |
| Recommendations | ✅ Show | ✅ Show (if public) | ❌ Hide |

**For demo**: Test navigation to User1 (own), User2 (public), User4 (private) to verify UI changes

---

## 17. "Date Joined" Sample Data

**Question**: For demo, what dates should users have?

**Proposed Solution**:
- **User1**: Today's date (you just joined)
- **User2**: 30 days ago (oldest, lots of ratings)
- **User3**: 15 days ago
- **User4**: 20 days ago
- **User5**: 5 days ago (newest)

**Display format**: "Joined May 8, 2026" or "Member since Mar 9, 2026"

**For demo**: Show this on User Profile pages to test date display

> I like "Member since ..."

---

## 18. Movie Scoreboard - Graph Details

**Question**: What should the bar graph show on Movie Scoreboard?

**Proposed Solution**:
- **X-axis**: Score values (0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5)
- **Y-axis**: Count of ratings at each score
- **Bar height**: Proportional to count
- **Color**: Gradient from red (0) → yellow (2.5) → green (5)
- **Hover tooltip**: Show exact count + percent

**Example**:
```
Count
  5  |     ▓
  4  |  ▓  ▓  ▓
  3  |  ▓  ▓  ▓  ▓
  2  |  ▓  ▓  ▓  ▓  ▓
  1  |  ▓  ▓  ▓  ▓  ▓
  0  |__▓__▓__▓__▓__▓_____
     0  1  2  3  4  5 (scores)
```

**For demo**: Ensure at least one movie has 5-10 ratings for a visible distribution

> this is exactly what I want! Nice!

---

## 19. Artist Search - Movie Overlap Special Mode

**Question**: In Artist Search, "Movie Overlap" mode — how does the user specify which movies?

**Proposed Solution**:
1. User navigates to Artist Search
2. Toggle appears: "Find by name" | "Movie Overlap" (default: name)
3. If "Movie Overlap" selected:
   - Show list of YOUR rated movies (from your ratings)
   - Multi-select with checkboxes
   - Below: "Find Overlapping Contributors" button
4. Results show artists who worked on ≥2 of your selected movies
5. Results sorted by: count DESC, then alphabetically

**Rationale**: Only searches within movies user has rated (respects privacy)

**For demo**: User1 has rated 15 movies — test selecting 3-4 and finding overlapping artists

> the movie dropdown for Movie Overlap should be lazy loaded, and search with a type-ahead (require at least 1 character). It should search ALL movies (not just the user's rated movies). The movies should display in the dropdown as "<title> (<year>)". the dropdown should be a multi-select with checkboxes.
> for the demo, lets just start with the full list of demo movies.

---

## 20. Recommendation Algorithm - Taxonomic Similarity Scoring

**Question**: How exactly is "taxonomic similarity" calculated for recommendations?

**Proposed Algorithm**:

```javascript
// For each rated movie by viewed user (scored 4.0+):
// Calculate similarity to current user's rating preferences

function getSimilarityScore(viewedMovieRating, currentUserRatings) {
  // viewedMovieRating = 4 selected terms
  // currentUserRatings = all current user's ratings with terms
  
  // Find most frequent terms in current user's ratings
  const currentUserTermFreq = {};
  currentUserRatings.forEach(rating => {
    rating.terms.forEach(term => {
      currentUserTermFreq[term] = (currentUserTermFreq[term] || 0) + 1;
    });
  });
  
  // Calculate overlap
  const viewedTerms = new Set(viewedMovieRating.terms);
  let overlap = 0;
  viewedTerms.forEach(term => {
    if (currentUserTermFreq[term]) overlap += currentUserTermFreq[term];
  });
  
  // Score = overlap count (0-4 possible)
  return overlap;
}

// Recommendations = movies scored 4.0+ sorted by similarity DESC, then score DESC
const recommendations = viewedUserMovies
  .filter(m => m.score >= 4.0 && !currentUserRatedMovieIds.has(m.id))
  .sort((a, b) => {
    const simA = getSimilarityScore(a.rating, currentUserRatings);
    const simB = getSimilarityScore(b.rating, currentUserRatings);
    if (simA !== simB) return simB - simA; // High similarity first
    return b.score - a.score; // Then high score
  });
```

**For demo**: 
- User1 rates movies with terms emphasizing "Creative", "Thoughtful", "Artistic"
- User2 has high ratings on movies with similar terms
- "Recommendations by Taste" shows User2's movies matching this pattern

> The formula for taxonomic similarity is specified in the "BRAINSTORM_ANALYSIS_AND_ELABORATION.md" file. Please review and update.

---

## 21. Scorecard - Category Dragging Interaction Details

**Question**: Beyond position-based insertion, what should the drag interaction feel like?

**Proposed Behavior**:
- **Drag zone**: Anywhere on the category panel (not just the ::: handle)
- **Hover state**: Category panel shows cursor:move, slight highlight
- **Dragging state**: Panel becomes semi-transparent (0.6 opacity), follows cursor
- **Drop zone**: Full height of panel below all others (valid drop targets)
- **Feedback**: Smooth reflow of other panels to make room
- **Undo**: Pressing ESC during drag cancels the operation

**For demo**: Test dragging all 4 categories to verify insertion works correctly

> Actually, what I'm looking for is this: `https://jqueryui.com/sortable/#placeholder`. Let's create a `sortable-demo` before the full prototype to try it out...

---

## 22. Scorecard Button Selection Behavior

**Question**: In each category, can user select multiple buttons or just one (radio)?

**Proposed Solution**:
- **One selection per category** (radio button behavior, not checkbox)
- **Visual**: When term is selected, button shows:
  - Pressed/active state (darker background or border highlight)
  - On unselect, shows normal state
- **Validation**: Submit button only enabled if ALL 4 categories have selection

**For demo**: Verify that selecting in one category doesn't deselect in another

> this is correct

---

## 23. Movie Poster Gallery Modal

**Question**: When clicking poster on Movie Profile, what's the gallery experience?

**Proposed Solution**:
- **Modal opens** with high-res poster centered
- **Navigation**: Prev/Next buttons (if available)
  - If on first movie's profile, "Prev" is disabled
  - If on last in results, "Next" is disabled
- **Keyboard**: ESC to close, Arrow keys to navigate
- **Context**: Show "Movie Title (Year)" and "1 of X" counter
- **Close button**: X in top-right corner

**For demo**: 
- Create poster image URLs (can be placeholder)
- Test navigation on a movie detail page

---

## Summary: Priority Questions to Resolve First

1. ✅ **Rule #1 Interpretation** → Thumbnails OK, no scores on unrated movies
2. ✅ **Recommendation Safety** → Safe because no scores shown
3. ✅ **Empty State** → Show placeholder messages
4. ✅ **Search Scope** → Simple text + Advanced page
5. ✅ **Scorecard Flow** → Update cascades through scoreboards
6. ✅ **Profile Toggle** → Instant, show current state
7. ✅ **Queue Management** → Reorderable list on dashboard
8. ✅ **Conditional UI** → Own profile shows edit/queue, public shows read-only
9. ✅ **Data Structure** → Store by userId with ratings array
10. ✅ **Algorithm Details** → Overlap counting + term frequency

**Not in V4 scope**:
- ❌ Authentication
- ❌ Persistence/Backend
- ❌ External APIs
- ❌ Cluster analytics

> General note - Since there are numerous movies with the same title, the standard convention when displaying a movie title is to display the year after it in parentheses.