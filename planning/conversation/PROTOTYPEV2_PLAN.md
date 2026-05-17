# Limelight Yardstick - Prototype V2 Plan

## Overview
This document outlines the plan to address all issues identified in `prototypeRemarks.md` and create a second prototype that properly implements the architecture, page structure, and content from `pagesDraft.md`.

---

## Issues Addressed

### 1. Architecture
**Issue**: Current prototype uses Vite build pipeline  
**Solution**: Switch to **zero-build CDN-based architecture**
- React 18 + Bootstrap 5 via CDN
- importNamespace module system for organization
- Class-based components for stateful logic
- No npm/build pipeline required
- Deploy directly to GitHub Pages

**Reference**: `../claude/skills/zero-build-react-architecture`

### 2. Page Structure
**Issue**: Current page structure doesn't match requirements  
**Solution**: Implement pages from `pagesDraft.md`:
- ✅ Dashboard (logged-in user view)
- ✅ User Profile (other user's profile)
- ✅ Movie Profile (movie details)
- ✅ Artist Profile (director/actor details)
- ✅ Advanced Search (movies, artists, users)

### 3. Content & Vocabulary
**Issue**: Wrong vocabulary and score values in prototype  
**Solution**: Use correct vocabulary from `FinalVocabularySelection.md`

**Vocabulary Table** (4 categories × 4 levels):
```
                    | Daring      | Ambition   | Engagement   | Satisfaction
Extremely Negative  | Dogmatic    | Lazy       | Punishing    | Contemptible
Moderately Negative | Formulaic   | Rushed     | Uneven       | Unremarkable
Moderately Positive | Creative    | Aspiring   | Engaging     | Rewarding
Extremely Positive  | Provocative | Masterful  | Irresistible | Unforgettable
```

**Scorecard UI** (from `pagesDraft.md`):
- Each category as a draggable panel (bg-primary)
- Option buttons as button groups (radio style)
- Color-coded by level (danger/warning/info/success)
- Category icon (:::) for drag-and-drop

### 4. Metrics
**Issue**: Metrics based on individual categories instead of taxonomic rating  
**Solution**: Metrics based on:
1. **Taxonomic Rating** = The set of selected vocabulary terms for a movie
2. **Calculated Score** = Half-star rating derived from the taxonomic rating (0-5 stars)
3. **Scoreboards** show taxonomic rating + calculated score, never individual category values

**User Scoreboard** (from `pagesDraft.md`):
```
| Movie              | Rating (Taxonomic)                    | Score (½ stars) |
| The Matrix (1999)  | Unforgettable, Masterful, ...        | ★★★★★          |
```

**Movie Scoreboard** (aggregate):
```
| Rating (Taxonomic)                | Score | Count | Percent |
| Unforgettable, Masterful, ...     | ★★★★★ | 43/78 | 55%     |
```

---

## Architecture Structure

### Directory Layout
```
prototypeV2/
├── index.html              # Main entry point
├── styles.css              # Global styles (minimal, mostly Bootstrap)
├── app.js                  # Main app initialization
├── components/             # React component namespaces
│   ├── Navigation.js
│   ├── Dashboard.js
│   ├── UserProfile.js
│   ├── MovieProfile.js
│   ├── ArtistProfile.js
│   ├── AdvancedSearch.js
│   ├── Scorecard.js
│   ├── UserScoreboard.js
│   └── MovieScoreboard.js
├── utils/                  # Utility functions
│   ├── dataService.js      # Mock data service
│   ├── scoreCalculator.js  # Score calculation logic
│   └── filters.js          # Filter and search utilities
└── lib/                    # Third-party library references
```

### Key Technologies
- **React 18** (CDN via JSX Babel transpilation)
- **Bootstrap 5** (CDN for styling)
- **Font Awesome** (CDN for star icons)
- **importNamespace** (module system, see gizmo-atheneum.github.io)
- **Vanilla JS** (for state management in main app)

---

## Implementation Phases

### Phase 1: Setup & Foundation
- [ ] Create `prototypeV2/` directory structure
- [ ] Set up `index.html` with CDN dependencies (React, Bootstrap, Babel, Font Awesome)
- [ ] Create `app.js` main application entry point
- [ ] Implement Navigation component
- [ ] Implement mock data service

### Phase 2: Core Components
- [ ] Implement Dashboard page (user queue, search, similar users, ratings)
- [ ] Implement Navigation & routing
- [ ] Create basic page structure and styling

### Phase 3: Scorecard System
- [ ] Implement Scorecard component with vocabulary buttons
- [ ] Add dnd-kit integration for drag-and-drop category prioritization
- [ ] Style with Bootstrap button groups and color classes
- [ ] Implement score calculation from taxonomic rating

### Phase 4: User & Movie Pages
- [ ] Implement User Profile page
- [ ] Implement Movie Profile page
- [ ] Implement Artist Profile page
- [ ] Create User Scoreboard and Movie Scoreboard components

### Phase 5: Search & Discovery
- [ ] Implement Advanced Search pages (movies, artists, users)
- [ ] Implement search functionality
- [ ] Add filters

### Phase 6: Polish & Testing
- [ ] Verify all metrics display taxonomic rating + score only
- [ ] Test drag-and-drop functionality
- [ ] Cross-browser testing
- [ ] Performance optimization

---

## Key UI Components

### Scorecard Layout
```
┌─────────────────────────────────────────┐
│ ::: Daring                              │  <- Draggable header
├─────────────────────────────────────────┤
│ [Dogmatic] [Formulaic] [Creative] [...]│  <- Button group (radio)
└─────────────────────────────────────────┘
```

### Color Scheme (Bootstrap Classes)
- Extremely Negative (Dogmatic) → `btn-outline-danger`
- Moderately Negative (Formulaic) → `btn-outline-warning`
- Moderately Positive (Creative) → `btn-outline-info`
- Extremely Positive (Provocative) → `btn-outline-success`
- Category panel bg → `bg-primary text-light`

### Scoreboard Table
```
| Movie Title (Year) | Rating: [Taxonomic Terms] | Score: ★★★★★ |
```

---

## Data Model

### Movie Object
```javascript
{
  id: 'ttXXXXXXXX',
  title: 'The Matrix',
  year: 1999,
  genres: ['Sci-Fi', 'Action'],
  directors: [{ name: 'Lana Wachowski', id: '...' }],
  writers: [{ name: 'Lana Wachowski', id: '...' }],
  actors: [{ name: 'Keanu Reeves', id: '...' }],
  studio: 'Warner Bros'
}
```

### Rating Object
```javascript
{
  userId: 'user123',
  movieId: 'ttXXXXXXXX',
  taxonomic: ['Provocative', 'Masterful', 'Irresistible', 'Unforgettable'],
  // Score calculated from taxonomic rating (0-5 stars)
  score: 5
}
```

### User Object
```javascript
{
  id: 'user123',
  username: 'johndoe',
  dateJoined: '2024-01-15',
  private: false,
  ratings: [/* Rating objects */]
}
```

---

## Validation Checklist

- [ ] No Vite/npm build pipeline
- [ ] All dependencies from CDN
- [ ] Metrics display **only** taxonomic rating + calculated score
- [ ] Page structure matches `pagesDraft.md`
- [ ] Vocabulary matches `FinalVocabularySelection.md`
- [ ] Scorecard UI matches mockups
- [ ] Color coding applied correctly
- [ ] Drag-and-drop for category prioritization works
- [ ] Bootstrap 5 styling used throughout
- [ ] Font Awesome icons for stars
- [ ] Can deploy to GitHub Pages as-is (no build)

---

## References

- `prototypeRemarks.md` - Issues to address
- `pagesDraft.md` - Desired page structure and layouts
- `FinalVocabularySelection.md` - Vocabulary terms
- `BRAINSTORM_ANALYSIS_AND_ELABORATION.md` - Concept documentation
- `../claude/skills/zero-build-react-architecture` - Architecture reference
- `https://gizmo-atheneum.github.io/structure/importnamespace/SKILL.md` - Module system
