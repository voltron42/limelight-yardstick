# Prototype V4 Plan - Review Issues

## Ambiguities

### 1. **Scorecard Interface for Unrated Movies**
**Location**: Section 3, Movie Profile - "If NOT rated by logged-in user"

The plan lists "Scorecard interface (to rate)" but doesn't clarify:
- Should the Scorecard display reference information (brief metadata, other users' aggregate scores, etc.)?
- Or should it be a "blind" rating interface with minimal context?
- This is unclear in relation to the privacy rules that hide "aggregate statistics" for unrated movies.

**Decision needed**: Define whether the Scorecard is blind or context-aware.

---

### 2. **Search Pages Section Scope**
**Location**: Section 3.4 "Search Pages" and Section 4 "Advanced Search (Currently Missing)"

Section 3.4 just lists checkboxes for Search Pages, while Section 4 elaborates on implementation details.

**Ambiguity**: 
- Is Section 4 meant to expand on Section 3, or is it separate future work?
- Are Advanced Filters (genre, year, director, etc.) part of v4 or post-v4?

**Decision needed**: Clarify whether Advanced Search is in scope for v4 or a future phase.

---

### 3. **Artist Search Scope**
**Location**: Section 4, "Artist Search"

Artist Search appears only in Section 4 but wasn't mentioned in Section 3 page content objectives.

**Ambiguity**: Is Artist Search a v4 requirement or post-v4 feature?

**Decision needed**: Confirm v4 scope includes Artist Search or move to future phases.

---

## Contradictions

### 1. **User Profile Ratings Display Contradiction**
**Location**: Section 3, "User Profile (Other Users' Public Profiles)"

Two statements conflict:
- "**Recommendations by Taste** - Other user's high-rated movies that logged-in user hasn't rated" (implies visibility of their ratings for comparison)
- "**Top 5 / Bottom 5** - Thumbnails **without ratings**" (implies ratings are hidden)

**Contradiction**: Are ratings shown or hidden on User Profile pages?

**Decision needed**: Clarify whether User Profile shows:
- Option A: Other user's ratings visible for all rated movies (enables recommendations by taste)
- Option B: Other user's ratings hidden, only show overlapping movies they both rated (top/bottom 5 shown without scores)

---

### 2. **Privacy Model vs. Design Description Misalignment**
**Location**: Privacy Model table (Section 1) vs. Movie Profile design (Section 3)

The Privacy Model table states for unrated Movie Profiles:
- Hidden Data: "Ratings, scores, aggregate statistics"

But the Movie Profile section "If NOT rated" includes:
- "Scorecard interface (to rate)"

**Contradiction**: If aggregate statistics should be hidden, should the Scorecard show:
- Just a rating interface with no context? 
- Or some reference data to inform the rating decision?

**Decision needed**: Define what context/reference data appears on Scorecard for unrated movies.

---

## Redundancies

### 1. **Inconsistent "Scoreboard" Terminology**
**Locations**: Multiple sections throughout

"User Scoreboard" and "Movie Scoreboard" are used inconsistently depending on context:
- Dashboard: "Current User Ratings - **User Scoreboard** of movies they've rated" = user's ratings list
- User Profile: "**User Scoreboard** - Only movies BOTH users have rated" = comparison/overlap view
- Movie Profile: "**Movie Scoreboard** - Aggregate ratings" = movie's aggregate data

**Redundancy**: Same term "Scoreboard" has different meanings, creating cognitive load.

**Recommendation**: Standardize naming:
- "**My Ratings**" (Dashboard view of movies user rated)
- "**Overlap Ratings**" or "**Shared Ratings**" (User Profile comparison)
- "**Movie Aggregate Scores**" or "**Rating Summary**" (Movie Profile aggregate data)

---

### 2. **Search Functionality Split Across Sections**
**Locations**: Section 3.4 "Search Pages" and Section 4 "Advanced Search"

Both sections describe search features with overlap:
- Section 3.4 just has checkboxes (Movies search, Users search)
- Section 4 elaborates on implementation (Plex-style filters, keyword search, Artist search)

**Redundancy**: Search functionality is defined in two places without clear separation.

**Recommendation**: 
- Consolidate into one "Search & Discovery" section
- Use subsections for each search type (Movie Search, User Search, Artist Search)
- Move implementation details into each subsection
- Clarify which search types are v4 vs. future phases

---

## Summary of Decisions Needed

| Issue | Priority | Status |
|-------|----------|--------|
| Scorecard blind vs. context-aware | 🔴 High | Needs decision |
| Advanced Search v4 scope | 🟡 Medium | Needs decision |
| Artist Search in scope? | 🟡 Medium | Needs decision |
| User Profile ratings visibility | 🔴 High | Needs decision |
| Scorecard context for unrated movies | 🔴 High | Needs decision |
| Standardize "Scoreboard" naming | 🟢 Low | Recommendation |
| Consolidate Search sections | 🟢 Low | Recommendation |
