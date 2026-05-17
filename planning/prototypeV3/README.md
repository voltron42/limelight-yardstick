# Limelight Yardstick - Prototype V3

## Overview

Prototype V3 combines the best of all previous iterations:

- **Fonts & Theming** from `prototype`: Bebas Neue + Inter, dark blue color scheme (#16213e, #0f3460, #e94560)
- **Architecture & Resources** from `prototypeV2`: Zero-build React, vocabulary system, scorecard scoring
- **Drag-and-Drop** from `dnd-kit-demo-v2`: jQuery UI with Touch support

## Key Features

### ✅ Zero-Build Architecture
- React 18 + Bootstrap 5.3.2 via CDN
- No npm, webpack, or build pipeline
- importNamespace module system
- Deploy directly to GitHub Pages

### ✅ Taxonomy-Based Scoring
- 4 categories × 4 vocabulary levels = 16 unique terms
- **Categories**: Daring, Ambition, Engagement, Satisfaction
- **Levels**: Extremely Negative → Moderately Negative → Moderately Positive → Extremely Positive
- Real-time score calculation (0-5 stars, 0.5 increments)

### ✅ Drag-and-Drop Scorecard
- Draggable category panels (reorderable)
- jQuery UI for smooth drag-and-drop
- Touch support via jQuery Touch-Punch
- Visual feedback during interactions

### ✅ Professional Theming
- Google Fonts: **Bebas Neue** (headings) + **Inter** (body)
- Dark theme with accent red (#e94560)
- Bootstrap 5.3.2 color utilities

## Project Structure

```
prototypeV3/
├── index.html                 # Main entry point
├── styles.css                 # Minimal custom CSS
├── scripts/
│   ├── main.js               # Main app component
│   ├── components/
│   │   ├── Navigation.js      # Navigation bar
│   │   ├── Dashboard.js       # Movie queue view
│   │   └── Scorecard.js       # Rating interface with drag-drop
│   └── utils/
│       ├── dataService.js     # Mock data
│       └── scoreCalculator.js # Score calculation logic
```

## Vocabulary System

| Category    | Extremely Negative | Moderately Negative | Moderately Positive | Extremely Positive |
|-------------|-------------------|-------------------|-------------------|-----------------|
| Daring      | Dogmatic          | Formulaic         | Creative          | Provocative     |
| Ambition    | Lazy              | Rushed            | Aspiring           | Masterful       |
| Engagement  | Punishing         | Uneven            | Engaging           | Irresistible    |
| Satisfaction| Contemptible      | Unremarkable      | Rewarding          | Unforgettable   |

## Score Calculation

Each category contributes equally (25% weight). Levels map to scores:
- Extremely Negative = 0 stars
- Moderately Negative = 1 star
- Moderately Positive = 3 stars
- Extremely Positive = 5 stars

Final score is rounded to nearest 0.5 increment (half-star).

## Usage

1. Open `index.html` in a browser
2. Navigate between Dashboard and New Scorecard
3. Drag category panels to reorder them
4. Click vocabulary terms to select them
5. Watch the real-time score update
6. Submit rating

## Technologies

- **React 18** (JSX via Babel standalone)
- **Bootstrap 5.3.2** (CDN)
- **jQuery UI** (drag-and-drop)
- **Google Fonts** (Bebas Neue + Inter)
- **Font Awesome** (icons)
- **importNamespace** (module system)

## References

- Zero-Build Architecture: `../claude/skills/zero-build-react-architecture`
- Prototype V2 Plan: `../PROTOTYPEV2_PLAN.md`
- Vocabulary: `../FinalVocabularySelection.md`
- DnD Kit Demo V2: `../dnd-kit-demo-v2`

---

**Status**: Active Development  
**Last Updated**: May 8, 2026
