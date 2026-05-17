# "Limelight Yardstick" Review & Suggestions

## Understanding of the Specification

### Overview
You're building a **nuanced movie rating system** that captures qualitative dimensions of film appreciation, not just a simple numeric score. The core insight is that different films matter for different reasons—one might excel at being *daring*, another at *engagement*—and users should be able to express this.

### How It Works

**Rating Process:**
1. For each of 4 categories (daring, ambition, engagement, satisfaction), user selects one of 4 sentiment levels
2. User ranks these 4 categories by personal importance
3. System generates:
   - **Taxonomical rating**: A memorable phrase built from the 4 category-level term pairs, ordered by rank
   - **Numerical rating**: Weighted score normalized to 0-100%, converted to half-stars

**Example:** A film rated "Provocative, Masterful, Irresistible, Unforgettable" (with ranking Daring > Engagement > Ambition > Satisfaction) would have a numerical rating based on those terms' 1-4 scores, weighted by the ranking (4×, 3×, 2×, 1×).

### Strengths of This Approach
- **Expressiveness**: Captures *why* you rated something, not just *that* you rated it
- **Transparency**: The taxonomical rating is both human-readable and filterable
- **Flexibility**: Different users value different qualities; ranking accommodates this
- **Community value**: Aggregated metrics reveal what films excel at (e.g., "highest engagement scores")

---

## Final Vocabulary Selection

After extensive refinement, the following 16 terms were selected for the Limelight Yardstick scoring system:

| | Daring | Ambition | Engagement | Satisfaction |
|---|---|---|---|---|
| **Extremely Negative** | Dogmatic | Lazy | Punishing | Contemptible |
| **Moderately Negative** | Formulaic | Rushed | Uneven | Unremarkable |
| **Moderately Positive** | Creative | Aspiring | Engaging | Rewarding |
| **Extremely Positive** | Provocative | Masterful | Irresistible | Unforgettable |

### Vocabulary Scope Clarifications

- **Daring** (Story & Subject Matter): How bold, unconventional, or risk-taking is the narrative?
- **Ambition** (Production Quality & Craft): How much care, effort, and skill went into the execution? What did the filmmakers aim for and did they achieve it?
- **Engagement** (Pacing & Attention): How well does the film hold attention and maintain momentum?
- **Satisfaction** (Lasting Impact): Did the film stay with you? Do you want to experience it again?

### Example Taxonomical Ratings

- "Provocative, Masterful, Irresistible, Unforgettable" — Excellent execution across all dimensions
- "Creative, Aspiring, Engaging, Rewarding" — Genuine effort and moderate success
- "Formulaic, Rushed, Uneven, Unremarkable" — No risks taken, no care given
- "Dogmatic, Lazy, Punishing, Contemptible" — Active disregard for craft and audience

---

## Suggestions & Considerations

### 1. **Terminology System**
✓ **COMPLETE** — The 16-term vocabulary has been finalized and documented in `VocabularySpecification.md`.

**Key design decisions made:**
- **Daring** evaluates story/subject matter boldness (resource-agnostic)
- **Ambition** evaluates effort/care with available resources (not budget constraints)
- **Engagement** evaluates pacing and attention-holding
- **Satisfaction** evaluates lasting emotional impact and rewatchability
- Each level represents a distinct scope: extremely negative = active disregard; moderately negative = passive neglect; moderately positive = genuine effort; extremely positive = successful execution

**Implementation notes:**
- Load vocabulary as configuration data for flexibility
- Ensure consistent tone across all 16 terms
- Consider storing term definitions alongside terms for user tooltips

### 2. **Ranking UI Challenge**
jQuery drag-and-drop (2010s tech) might feel clunky on mobile. Consider:
- Native React drag libraries: `react-beautiful-dnd`, `dnd-kit`
- Touch-friendly ranking: swipe to reorder, or up/down buttons
- Visual feedback showing multipliers (4x, 3x, 2x, 1x) as items are ranked
- **Test with mobile users early**—this is the most complex interaction

### 3. **Database Schema**
For Clojure + document DB (MongoDB? Firestore?):
```
scorecard: {
  movieUrl,         // full URL (e.g., https://www.themoviedb.org/movie/550)
  userId,
  ratings: { 
    daring: 3,           // index (0-3) into constant vocabulary for each category
    ambition: 3,
    engagement: 3,
    satisfaction: 3
  },
  ranking: ["daring", "engagement", "ambition", "satisfaction"],  // user's importance ordering
  createdDate,
  lastModified
}
```
**Notes:**
- **Movie URL format**: Store full URL (e.g., `https://www.themoviedb.org/movie/550`) instead of just ID. Enables future integration with IMDb, Rotten Tomatoes, or other databases without schema changes
- **Vocabulary as constants**: The 16 terms are defined as application constants (e.g., `VOCAB = {daring: ["Dogmatic", "Formulaic", "Creative", "Provocative"], ...}`); `ratings` stores only indices (0-3) into these constants
- **Computed values**: `taxonomical`, `numerical` (percent), `outOf10`, `outOf5` are all generated on-the-fly from indices and ranking—never stored
- `ranking` is user's priority order (determines 4x, 3x, 2x, 1x weight multipliers during calculation)
- To get taxonomical rating: look up each rating index in constants, join terms in ranking order
- To get numerical: map each index to 1-4 value, multiply by weight, sum, normalize to 0-100
- Consider storing version history if allowing re-ratings of the same film
- Index on `userId` and `movieUrl` for queries

### 4. **TheMovieDB Integration**

**API Key Management:**
- **Server-side only**: Never expose API key to client. Route all TMDB requests through backend
- Store key as environment variable (`.env` file, never committed)
- For production: Use secret management (e.g., GitHub Secrets, AWS Secrets Manager, HashiCorp Vault)
- Backend exposes `/api/movies/search?q=title` endpoint that internally calls TMDB

**Caching Strategy:**
- **Query cache** (Redis/Memcached): Cache search results for 30 days (TMDB data changes rarely)
  - Key: `tmdb:search:{query_hash}` → List of movie summaries
  - Value: `[{id, title, year, poster, genres}, ...]`
- **Detail cache**: Cache full movie details (poster URL, genres, budget, runtime) for 90 days
  - Key: `tmdb:movie:{tmdb_id}` → Full movie object
  - This prevents redundant lookups when same movie is rated by multiple users
- **Invalidation**: Manual refresh endpoint for old movies or periodic refresh every N days
- **Local first**: Check cache before hitting TMDB API; fall back to fresh request if missing

**Rate Limiting:**
- TMDB free tier: 40 requests/10 seconds
- Implement queue/backoff: If hitting limit, queue request and retry after 10s delay
- Monitor usage; cache will dramatically reduce requests

**Movie Lookup & Display:**
- Client calls backend search endpoint with title
- Backend searches TMDB (or returns cached result)
- Return full movie URL (e.g., `https://www.themoviedb.org/movie/550`) for storage
- Display: poster, release year, genres for context
- **Error handling**: If movie not found in TMDB, allow manual entry with basic fields (title, year)
- **Multi-site support**: Design backend to accept movie URLs from other sources; extract metadata appropriately

**Alternative/Complementary Movie Database APIs:**

| API | Free Tier | Best For | Key Advantage |
|-----|-----------|----------|---------------|
| **OMDB** | 1,000 req/day | Movies + ratings | Excellent ratings data; IMDb integration; simple API |
| **Wikidata** | Unlimited | Multilingual metadata | Free, linked data; cast/crew details |
| **Trakt TV** | Free (OAuth) | Movie + TV hybrid | Social ratings; community data; streaming availability |
| **TVMaze** | Unlimited | TV shows/episodes | Free, no auth required; episode guides |

**Integration approach:**
- Start with TMDB (comprehensive movie data, caching reduces requests)
- Add OMDB as fallback for movies not in TMDB cache
- Use Wikidata for supplementary data (cast, multilingual titles, awards)
- When storing `movieUrl`, use domain to determine data source (e.g., `https://www.omdbapi.com/i=tt0111161` or `https://www.themoviedb.org/movie/278`)
- Backend normalizes URLs to consistent format regardless of source

**Later features:**
- TMDB review API requires careful rate-limiting and review formatting
- Linking back to TMDB page for full movie details
- Potentially aggregate ratings from multiple sources for comparison

### 5. **Claude Integration Ideas**
The spec mentions "Claude assistance in reading reviews to attempt to interpret as scorecards"—this is interesting:
- Parse user's written review → extract sentiment toward each category → suggest scorecard
- Could be useful for migrating existing Letterboxd/TMDB reviews
- Potential: Generate review summaries from scorecard data
- **Risk**: Over-automation could feel like cheating the rating process

### 6. **Google Auth & User Profile**
- What data should users own? (Can they export/delete scorecards?)
- Consider privacy implications of storing movie preferences
- Watchlist integration? (movies rated vs. movies to watch)
- Profile page showing rating patterns/favorite categories?

### 7. **Filtering/Analytics Dashboard**
Examples of queries enabled:
- "Movies rated Daring" (taxonomical filter)
- "My highest-engagement films across all years"
- "Compare how I rated Sci-Fi vs. Comedy"
- Potentially: "Community consensus on The Matrix" (avg score + most common ranking)
- Consider visualization: heat maps of category importance across genres

### 8. **Mobile-First Considerations**
- Screen space on mobile makes 4 radio groups + drag-and-drop tight
- Consider: vertical radio stacks, simplified drag UI, step-based form (one category per screen)?
- Half-star display can be hard to read small—test readability
- Consider collapsible/accordion layout for categories on mobile

### 9. **Scaling Questions**
- How many movies can one user rate before UX degrades? (Pagination/search needed?)
- Should categories/levels be configurable per user, or fixed?
- Will you allow rating the same film multiple times (e.g., "rated after rewatch")?
- How will you handle movie metadata updates from TMDB?

### 10. **Specification Gaps**
- What happens if user rates a film twice? (Replace, version, or allow multiple ratings?)
- How do you handle deleted TMDB entries?
- What's the minimum viable product (MVP) vs. full vision?
- How will you seed the initial term vocabulary?
- Should the system suggest a ranking based on the selected sentiment levels?
- What happens with ties in ranking (if user selects same importance)?

### 11. **Data Validation**
- Ensure formula edge cases are handled: all 1's, all 4's, mixed scores
- Test: (10-10)/(40-10) = 0 → 0%, 0 half-stars ✓
- Test: (40-10)/(40-10) = 1 → 100%, 10 half-stars (5 full stars) ✓
- What about partial stars in the UI? (0.5 star precision?)

### 12. **Community Features (Later)**
- Public/private scorecard sharing
- Compare scorecards with friends
- "Movie clubs" with shared ratings
- Trending categories across all users

---

## Next Steps (If Pursuing This)

1. ✓ **Vocabulary finalized** — 16-term thesaurus complete with scope definitions
   - See `VocabularySpecification.md` for all options and rationale
   - See `FinalVocabularySelection.md` for selected terms
   - Ready for implementation in scoring system
   
2. **Prototype the ranking UI** (probably the riskiest interaction)
   - Test on actual mobile devices
   - A/B test drag-and-drop vs. button-based ranking
   
3. **Define MVP scope** (e.g., scoring + taxonomical rating only, no TMDB yet?)
   - Wireframe the flow: search movie → rate categories → rank → view result
   
4. **Data model validation** (ensure formula works as intended)
   - Implement scoring logic and test edge cases
   
5. **Backend setup** (Clojure + DB choice)
   - Consider: MongoDB vs. Firestore vs. PostgreSQL with JSON support

---

## Overall Assessment

This is a thoughtfully designed system. The weighted ranking approach is clever and solves the "one-dimensional rating" problem elegantly. The idea of combining taxonomical + numerical ratings gives you both human readability and machine filterability. 

**Main risk areas**: 
- UI/UX complexity of ranking on mobile
- Ensuring the 16-term vocabulary feels natural and consistent
- Community building (if that's a goal)

**Main opportunities**: 
- Unique value prop vs. existing rating systems
- AI-assisted rating interpretation
- Community metrics and insights
- Potential for academic interest (film analysis via aggregated ratings)
