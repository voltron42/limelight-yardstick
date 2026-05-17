# Limelight Yardstick: Open Questions & Design Decisions

## 🔴 High Priority (Blocks Implementation)

### 1. Specification Gaps
- **Duplicate Ratings**: What happens if a user rates the same film multiple times?
  - [ ] Replace the previous rating
  - [X] Keep version history (store all ratings, flag most recent)
  - [ ] Prevent duplicates (error on re-rate)
  - [ ] Allow both original + rewatch ratings with timestamps

- **Auto-Ranking Suggestion**: Should the system suggest a ranking based on the sentiment levels user selected?
  - [ ] Yes, ML-based suggestion (e.g., if user picks "Provocative," suggest Daring as top priority)
  - [X] No, always manual ranking
  - [ ] Optional checkbox to auto-suggest
> No auto-ranking suggestion, manual only. I don't want users feeling manipulated

- **Tied Rankings**: What if user selects same importance for multiple categories?
  - [ ] Allow ties (break at calculation time: use order of categories)
  - [X] Prevent ties (UI enforces unique ranking)
  - [ ] Warn user but allow
> the ranking will be a drag-and-drop interface for the user to put the categories in their desired order of importance.

- **Deleted Movies**: How do you handle TMDB entries that get deleted or merged?
  - [ ] Keep old data as-is (orphaned records)
  - [ ] Store movie title + year as fallback metadata in scorecard
  - [ ] Archive scorecards referencing deleted movies
  - [ ] Redirect to new TMDB URL
> let's wait for this problem to arise and deal with it then. Assume movies don't get deleted.

- **MVP vs. Full Vision**: What's in the first release?
  - [ ] Just rating + storage (no community features yet)
  - [X] Rating + search + personal dashboard
  - [ ] Full feature list below

---

### 2. User Data & Privacy
- **Data Ownership**: What can users do with their data?
  - [X] Export scorecards (JSON/CSV format?)
  - [X] Delete individual ratings
  - [X] Delete entire account + all ratings
  - [X] Download raw data history

- **Privacy Model**: How do you handle movie preferences?
  - [ ] All scorecards private by default
  - [ ] Public profiles with opt-in privacy settings
  - [X] Aggregate-only (no individual visible, only community stats)
> let's look at adding a layer of anonymity to the user profiles (have them create a profile name so we aren't revealing any personal details from Google), then make all scorecards public. Then users can see if there are other users whose tastes align with theirs to be able to find suggestions.

- **Authentication**: Which provider(s)?
  - [X] Google OAuth only
  - [ ] Google + GitHub
  - [ ] Email/password too?
  - [ ] Anonymous (localStorage-based ratings)?
> I don't want to be storing peoples passwords. I want to keep our security concerns to an absolute minimum

---

### 3. Scaling & Performance
- **Rating Collection Limits**: When does pagination/search become necessary?
  - [ ] After N ratings per user? (e.g., 500+)
  - [ ] From day 1
  - [X] Lazy-load as needed

- **Configurable Vocabulary**: Should users customize the 16 terms?
  - [X] No, fixed global vocabulary
  - [ ] Yes, per-user custom terms (but can't cross-compare)
  - [ ] Shared custom vocabulary sets (communities define their own)
> let's start with fixed, but stay open to expanding later. Part of the point is to be able to maintain comparable metrics across films and across reviewers. If the vocabulary isn't consistant, the whole larger idea breaks down.

- **Metadata Updates**: How to handle TMDB data changes (poster URL, genres, etc.)?
  - [ ] Cache indefinitely (as-is)
  - [X] Refresh on access (cache invalidation strategy?)
  - [ ] Manual admin refresh endpoint
> Suggest cache invalidation strategies? keep it simple...
---

## 🟡 Medium Priority (UI/UX Decisions)

### 4. Ranking UI Component
- **Technology**: Which drag-and-drop solution?
  - [ ] `react-beautiful-dnd` (rich, well-documented)
  - [ ] `dnd-kit` (modern, lightweight)
  - [ ] Up/Down buttons instead of drag (mobile-friendly)
  - [ ] Custom implementation
> I'm not familiar with the suggestions, I've only ever used the jQuery Drag-and-drop. We need something that will work both on mobile and desktop, and look clean. I don't want to just use up/down buttons, because that feels cheap. Suggestions?

- **Visual Feedback**: How to show multipliers (4x, 3x, 2x, 1x)?
  - [ ] Display next to each item
  - [ ] Show in tooltip on hover
  - [ ] Show in sidebar with live calculation
  - [ ] Animation when ranking changes
> we don't need to show multipliers. I don't think I want to show the calculation, because I don't want it skewing the vocabulary they choose. As it is, there will be users who will figure out how the scorecard works and engage with it explicitly to get a desired score, but I want to do whatever I can to discourage that. The numeric score calculation is there just to give something familiar.

---

### 5. Mobile UX
- **Form Layout**: How to handle tight screen space?
  - [ ] Vertical radio stacks (all on one page)
  - [ ] Step-based form (one category per screen)
  - [ ] Accordion/collapsible sections
  - [ ] Horizontal swipe between categories
> we'll use Bootstrap and experiment with it.

- **Drag on Mobile**: Ranking with drag-and-drop on touch?
  - [ ] Swipe-to-reorder
  - [ ] Up/Down buttons (no dragging)
  - [ ] Dedicated reorder mode (tap to toggle then arrange)
  - [ ] Hybrid (long-press to drag)
> not sure. lets decide after a decision is made on #4

---

### 6. Dashboard & Filtering
- **User Profile Display** (Primary Feature):
  - [X] List rated movies grouped by score
  - [X] Show taxonomic ratings per movie in user profile
  - [ ] Which taxonomic rating should be primary sort vs. secondary?
  - [ ] How many taxonomic ratings per movie to display in profile view?
> Per metricsFeatures.md: User profiles list each movie rated with grouping by score, then taxonomic rating within each score group

- **Movie Profile Display** (Primary Feature):
  - [X] Show unique taxonomic ratings received
  - [X] Display percentage of reviews with each rating (highest first)
  - [ ] Minimum review threshold before showing percentages?
> Per metricsFeatures.md: Movie profile shows each unique taxonomic rating paired with percentage of reviews, sorted by highest percentage first (only for movies that the user has reviewed)

- **Taxonomic Rating as Filter/Search**:
  - [X] Taxonomic rating is NOT a search/filter mechanism
  - [X] It's purely analytical (view-only, not for querying)
  - [ ] Should we prevent users from searching by vocabulary terms?
> Per metricsFeatures.md: Don't use taxonomic rating as filter or search feature—it would bias the rating collection

- **Recommendations & Commonality** (Future Vision):
  - [ ] Show "Similar Users" based on rating commonalities
  - [ ] Recommend unwatched films rated by similar users
  - [ ] Watch list integration with recommendations
  - [ ] Community taste clustering/analytics
> Per metricsFeatures.md: Develop commonality analysis to find users with similar tastes; recommend movies they've rated but current user hasn't

- **Privacy for Unrated Content**:
  - [X] Hide all rating data for movies user hasn't rated (no percentages, no community stats)
  - [X] Allow viewing movie metadata only (title, poster, description, content rating)
  - [ ] Should recommendations be an exception (show data for recommended films)?
> Per metricsFeatures.md: Users shouldn't see specific rating data for movies they haven't rated to avoid biasing future ratings

---

## 🟠 Architectural Decisions

### 7. Backend Tech Stack
- **Database Choice**: 
  - [ ] MongoDB (document store, flexible schema)
  - [ ] Firestore (managed, real-time)
  - [ ] PostgreSQL (relational, structured)
  - [ ] Other?
> if we're deploying to fly.io, does that affect considerations?

- **Caching**:
  - [ ] Redis
  - [ ] Memcached
  - [ ] In-memory (for small scale)
> I need more information about each of these options. Please provide comparison guide

- **Language/Framework** (assuming Clojure for backend):
  - [ ] Ring + Compojure (minimal)
  - [ ] Luminus (full framework)
  - [ ] Re-frame (frontend)
  - [ ] Shadow-cljs (ClojureScript bundler)
> keep it simple, keep it clean. brevity is the point of clojure, so minimal code.

---

### 8. Frontend Framework
- **UI Library**:
  - [ ] React (hooks, component library)
  - [ ] Vue (simpler learning curve)
  - [ ] Svelte (lightweight)
  - [ ] Web Components (framework-agnostic)
> React, Bootstrap, Font Awesome, importNamespace (just like all my other projects)

- **Component Library**:
  - [ ] Material-UI (comprehensive)
  - [ ] Chakra UI (accessible, modern)
  - [ ] Tailwind + custom (minimal)
  - [ ] Build custom (lightweight)
> see above

- **State Management**:
  - [ ] React Context + useReducer
  - [ ] Redux
  - [ ] Zustand (lightweight)
  - [ ] Pinia (if Vue)
> see above
---

### 9. Additional Features (In/Out)
- **Claude Integration**: 
  - [X] MVP: Not included
  - [ ] MVP: Simple parse-review-to-scorecard suggestion
  - [X] Future: Generate review from scorecard
> show suggestions in "roadmap.md"

- **TMDB Review Integration**:
  - [X] Not in MVP
  - [ ] Allow posting review summaries back to TMDB
  - [ ] Import existing TMDB reviews
> not MVP, but include suggestions / details in "roadmap.md"

- **Letterboxd Integration**:
  - [X] Not included
  - [ ] Import past ratings
  - [ ] Sync/link accounts
> not MVP, but include suggestions / details in "roadmap.md"

- **Watchlist**:
  - [X] Not in MVP
  - [ ] Simple "to-watch" list
  - [ ] Integration with streaming availability
> not in mvp, but next priority. look into how this is done by "JustWatch" and "Plex", and see about integrating with them. Put as top priority in "roadmap.md"

---

## 📋 Checklist: Answers to Fill In

- [ ] Duplicate rating behavior decided
- [ ] Auto-ranking suggestion decided
- [ ] Tied ranking behavior decided
- [ ] Deleted movie handling decided
- [ ] MVP scope defined
- [ ] User data ownership/privacy model decided
- [ ] Authentication provider(s) chosen
- [ ] Collection scaling strategy decided
- [ ] Vocabulary customization approach decided
- [ ] Ranking UI technology chosen
- [ ] Mobile form layout decided
- [ ] Dashboard priority features decided
- [ ] Backend database chosen
- [ ] Frontend framework chosen
- [ ] Scope of additional features decided
