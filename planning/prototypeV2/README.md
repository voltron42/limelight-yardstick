# Limelight Yardstick - Prototype V2

A **zero-build, CDN-based** prototype using **React 18**, **Bootstrap 5**, and the **importNamespace** module system. No npm, webpack, or build pipeline required.

## What's New in V2

### ✅ Fixed Issues from Prototype V1

1. **Architecture** - Proper zero-build CDN architecture following [skill guidelines](https://github.com/gizmo-atheneum/gizmo-atheneum.github.io/blob/gh-pages/structure/importnamespace/SKILL.md)
   - React 18 + Bootstrap 5 via CDN
   - importNamespace module system for organization
   - Initialization in `<head>` via try/catch wrapper
   - Deploy directly to GitHub Pages (no build step)

2. **Page Structure** - Implements pages from `pagesDraft.md`
   - Dashboard (main landing page)
   - Navigation system
   - Scorecard (draggable category panels)
   - User Scoreboard (user's ratings)
   - Movie Scoreboard (community ratings)

3. **Correct Vocabulary** - Uses vocabulary from `FinalVocabularySelection.md`
   - 4 categories: Daring, Ambition, Engagement, Satisfaction
   - 4 levels each: Extremely Negative, Moderately Negative, Moderately Positive, Extremely Positive
   - Color-coded buttons (danger/warning/info/success)

4. **Proper Metrics** - Metrics based on taxonomic rating + calculated score
   - **Taxonomic Rating** = Selected vocabulary terms
   - **Calculated Score** = Half-star rating (0-5) derived from terms
   - Scoreboards display ONLY these metrics, never individual categories

## Directory Structure

```
prototypeV2/
├── index.html                          # CDN-based entry point with initialization
├── styles.css                          # Minimal custom CSS (Bootstrap-first)
├── scripts/
│   ├── main.js                         # Main app component (stateful, single class)
│   ├── utils/                          # Utility namespaces
│   │   ├── dataService.js             # Mock data provider
│   │   ├── scoreCalculator.js         # Score calculation logic
│   │   └── filters.js                 # Search/filter utilities
│   └── components/                     # UI component namespaces (stateless functions)
│       ├── Navigation.js              # Top navigation bar
│       ├── Dashboard.js               # Main landing page
│       ├── Scorecard.js               # Draggable rating scorecard
│       ├── UserScoreboard.js          # User's ratings table
│       └── MovieScoreboard.js         # Community ratings aggregate
└── README.md                           # This file
```

### Each File = One Namespace

Every `.js` file contains exactly one namespace definition:

```javascript
// scripts/utils/dataService.js
namespace('lyapp.utils.DataService', {}, () => {
    return { /* functions */ };
});

// scripts/components/Navigation.js
namespace('lyapp.components.Navigation', {}, () => {
    return function Navigation({ ... }) { /* JSX */ };
});

// scripts/main.js
namespace('lyapp.Main', { 
    'lyapp.components.Navigation': 'Navigation',
    'lyapp.utils.DataService': 'DataService',
    // ... other dependencies
}, ({ Navigation, DataService, ... }) => {
    return class Main extends React.Component { /* ... */ };
});
```

### Script Loading Order (in index.html)

Scripts are listed in **alphabetical order** within each directory for readability. `importNamespace` automatically handles dependency resolution through the dependency object in each namespace definition.

**Alphabetical Ordering:**

1. **Components** (alphabetical)
   - `scripts/components/Dashboard.js`
   - `scripts/components/MovieScoreboard.js`
   - `scripts/components/Navigation.js`
   - `scripts/components/Scorecard.js`
   - `scripts/components/UserScoreboard.js`

2. **Utilities** (alphabetical)
   - `scripts/utils/dataService.js`
   - `scripts/utils/filters.js`
   - `scripts/utils/scoreCalculator.js`

3. **Main** (depends on all)
   - `scripts/main.js`

**Key Point:** Alphabetical order is for readability only. `importNamespace` automatically resolves all dependencies as long as all scripts load before the initialization code runs.

## Running the Prototype

### Option 1: Local Web Server (Recommended)
```bash
cd prototypeV2
python -m http.server 8000
# or
npx http-server
```
Then open `http://localhost:8000` in your browser.

### Option 2: Direct File Opening
Open `prototypeV2/index.html` directly in your browser (may have CORS issues).

### Option 3: GitHub Pages
Deploy the prototypeV2 folder to GitHub Pages - no build step needed!

## Architecture Details

### Zero-Build Philosophy
- All code runs in browser (HTML, JS, CSS)
- Dependencies loaded from CDN
- JSX transpiled at runtime via Babel standalone
- No npm, webpack, or build pipeline

### Module System: importNamespace

All components and utilities are registered as namespaces:

```javascript
// Define a utility
namespace('lyapp.utils.ScoreCalculator', {}, () => {
    return { /* utility functions */ };
});

// Define a component
namespace('lyapp.components.Scorecard', 
    { 'lyapp.utils.ScoreCalculator': 'ScoreCalculator' },
    ({ ScoreCalculator }) => {
        return function Scorecard({ ... }) { /* JSX */ };
    }
);

// Import and use in main app
namespace('lyapp.Main',
    {
        'lyapp.components.Scorecard': 'Scorecard',
        'lyapp.utils.ScoreCalculator': 'ScoreCalculator'
    },
    ({ Scorecard, ScoreCalculator }) => {
        return class Main extends React.Component { /* ... */ };
    }
);
```

### React Components
- **Stateful**: Main class component (Main extends React.Component)
- **Stateless**: Function components (Navigation, Scorecard, Dashboard, etc.)
- All state centralized in Main component
- Props passed down to display-only children

## Key Features

### 1. Scorecard Component
Draggable category panels with vocabulary button groups:
```
┌──────────────────────────────────────┐
│ ::: Daring                           │ <- Draggable
├──────────────────────────────────────┤
│ [Dogmatic] [Formulaic] [Creative] [] │ <- Button group
└──────────────────────────────────────┘
```
- Drag to reorder categories
- Click to select vocabulary term
- Color-coded by level (danger/warning/info/success)

### 2. User Scoreboard
Table showing user's ratings:
```
| Movie | Taxonomic Rating | Score |
| The Matrix | Provocative, Masterful, ... | ★★★★★ |
```

### 3. Movie Scoreboard
Aggregate community ratings:
```
| Taxonomic Rating | Score | Count | Percent |
| Provocative, Masterful, ... | ★★★★★ | 43 | 55% |
```

### 4. Score Calculator
Converts taxonomic ratings to numeric scores:
```javascript
const taxonomic = ['Provocative', 'Masterful', 'Irresistible', 'Unforgettable'];
const score = ScoreCalculator.calculateScore(taxonomic); // 5.0 (5 stars)
```

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
  userId: 'user001',
  movieId: 'ttXXXXXXXX',
  taxonomic: ['Provocative', 'Masterful', 'Irresistible', 'Unforgettable'],
  score: 5
}
```

## Vocabulary Reference

| Category | Extremely Negative | Moderately Negative | Moderately Positive | Extremely Positive |
|----------|-------------------|-------------------|-------------------|-------------------|
| Daring | Dogmatic | Formulaic | Creative | Provocative |
| Ambition | Lazy | Rushed | Aspiring | Masterful |
| Engagement | Punishing | Uneven | Engaging | Irresistible |
| Satisfaction | Contemptible | Unremarkable | Rewarding | Unforgettable |

### Color Mapping
- **Extremely Negative** (0) → `btn-outline-danger` (red)
- **Moderately Negative** (1) → `btn-outline-warning` (yellow)
- **Moderately Positive** (3) → `btn-outline-info` (blue)
- **Extremely Positive** (4) → `btn-outline-success` (green)

## Testing Checklist

- [ ] Open `index.html` in browser - app loads without errors
- [ ] No console errors or warnings
- [ ] Navigation displays correctly (sticky top)
- [ ] Scorecard shows all 4 categories with vocabulary options
- [ ] Can drag category panels to reorder
- [ ] Clicking vocabulary option highlights it
- [ ] User Scoreboard displays ratings with taxonomic terms + scores
- [ ] Movie Scoreboard groups ratings by taxonomic combination
- [ ] All metrics show taxonomic rating + score only
- [ ] Bootstrap styling applied correctly
- [ ] Font Awesome icons display (stars)
- [ ] Responsive design works on mobile
- [ ] No build step needed - works as-is

## Technology Stack

- **React 18** (CDN, UMD build)
- **Bootstrap 5** (CDN)
- **Font Awesome 6** (CDN)
- **Babel Standalone** (Runtime JSX transpilation)
- **importNamespace** (Custom module system)
- **Vanilla JavaScript** (State management in Main)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- No build tools required
- Works offline once loaded (except CDN dependencies)

## Next Steps (Future Phases)

### Phase 1: Additional Pages
- User Profile page
- Movie Profile page
- Artist Profile page
- Advanced Search pages

### Phase 2: Search & Discovery
- Full search implementation
- Filters and sorting
- User recommendations

### Phase 3: Backend Integration
- Connect to real movie API (TMDB)
- User authentication
- Database for ratings persistence

### Phase 4: Polish
- Animations and transitions
- Loading states
- Error handling
- Accessibility improvements (WCAG)

## References

- **Prototype V1 Issues**: [prototypeRemarks.md](../prototypeRemarks.md)
- **Page Designs**: [pagesDraft.md](../pagesDraft.md)
- **Vocabulary**: [FinalVocabularySelection.md](../FinalVocabularySelection.md)
- **Full Implementation Plan**: [../PROTOTYPEV2_PLAN.md](../PROTOTYPEV2_PLAN.md)
- **Zero-Build Architecture Skill**: [../claude/skills/zero-build-react-architecture](../claude/skills/zero-build-react-architecture)
- **importNamespace Reference**: [https://gizmo-atheneum.github.io/structure/importnamespace/](https://gizmo-atheneum.github.io/structure/importnamespace/)

## Anti-Patterns (DO NOT)

❌ Using npm/webpack for this architecture
❌ Functional components with hooks
❌ Complex state management (use Main component state)
❌ Overriding Bootstrap classes
❌ Heavy custom CSS (> 50 lines)
❌ Multiple `importNamespace()` calls in one line (use `imports()` instead)
❌ Stateless class components (use functions instead)

