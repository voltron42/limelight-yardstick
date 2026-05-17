# Sortable Demo - Scorecard Category Priority

This is a proof-of-concept demonstration of the **Scorecard interaction** from [Limelight Yardstick](https://github.com/catchpenny-colonnade/limelight-yardstick). It showcases the core functionality of the rating system using jQuery UI Sortable for category prioritization.

## Purpose

The Sortable Demo validates:
1. **jQuery UI Sortable** implementation with placeholder effect
2. **Weighted scoring calculation** based on category priority
3. **Real-time score updates** as users interact with the interface
4. **Bootstrap styling** with color-coded vocabulary terms
5. **Responsive layout** for the Scorecard component

This serves as a prerequisite for Phase 2 of the V4 Prototype implementation (Fix Drag-and-Drop).

## Features

### Category Prioritization
- Drag categories by the ☰ handle to reorder
- Visual placeholder shows insertion point during drag
- Semi-transparent panel (0.6 opacity) while dragging
- Priority positions (1st, 2nd, 3rd, 4th) display current weight (4x, 3x, 2x, 1x)
- Press ESC during drag to cancel the operation

### Term Selection
- 4 vocabulary dimensions:
  - **Daring** (Story & Subject)
  - **Ambition** (Production)
  - **Engagement** (Pacing)
  - **Satisfaction** (Impact)
- 4 terms per category with color-coded buttons:
  - 🔴 **Extremely Negative** (red/danger)
  - 🟠 **Moderately Negative** (orange/warning)
  - ⚪ **Moderately Positive** (light/neutral)
  - 🟢 **Extremely Positive** (green/success)

### Score Calculation
- **Weighted Sum**: Each term value (1.0–4.0) multiplied by its category's weight (4x, 3x, 2x, 1x)
- **Percent Normalization**: Weighted sum normalized to 0–100% (max possible = 30)
- **Half-Star Rating**: Percent ÷ 10, rounded to 0.5 (0, 0.5, 1.0, ..., 5.0)
- Real-time updates as categories are reordered or terms are selected
- Completion indicator when all categories have selections

## Technical Stack

- **React 18** (UMD build from CDN)
- **jQuery UI 1.13.2** (with Sortable widget)
- **Bootstrap 5** (styling framework)
- **Babel Standalone** (JSX transpilation)
- **importNamespace** (module system from gizmo-atheneum)

## File Structure

```
sortable-demo/
├── index.html                          # Main HTML entry point
├── styles.css                          # Custom theme styling
├── README.md                           # This file
└── scripts/
    ├── main.js                         # Main app component (orchestration)
    ├── components/
    │   ├── Header.js                   # App header with instructions
    │   └── Scorecard.js                # Interactive scorecard (main UI)
    └── utils/
        └── scoreCalculator.js          # Score calculation logic
```

## Namespace Structure

The app uses the **importNamespace** module system for clean dependency management:

- `sortableapp.Main` — Root component
- `sortableapp.components.Header` — Header with instructions
- `sortableapp.components.Scorecard` — Main interactive component
- `sortableapp.utils.ScoreCalculator` — Score calculation utilities

## Usage

1. Open `index.html` in a web browser
2. Read the instructions in the header
3. **Drag categories** to adjust priority (grab the ☰ handle)
4. **Click term buttons** to select one per category
5. **Watch the score update** in real-time as you make selections
6. Press **ESC during drag** to cancel the operation

## Design Specification Reference

This demo implements the Scorecard specification from:
- [PROTOTYPEV4_PLAN.md](../PROTOTYPEV4_PLAN.md) — UI Implementation Details (Scorecard Layout)
- [PROTOTYPEV4_DESIGN_CLARIFICATIONS.md](../PROTOTYPEV4_DESIGN_CLARIFICATIONS.md) — jQuery UI Sortable Pattern
- [ReviewAndSuggestions.md](../ReviewAndSuggestions.md) — Weighted scoring formula
- [FinalVocabularySelection.md](../FinalVocabularySelection.md) — Vocabulary terms

## Browser Compatibility

Works in all modern browsers (Chrome, Firefox, Safari, Edge) that support:
- ES6 (const, let, arrow functions)
- jQuery UI 1.13.2
- React 18 UMD builds

## Next Steps

After validating this demo:
1. Integrate Scorecard component into Movie Profile page
2. Add persistence layer (saving ratings to backend)
3. Implement scoring algorithm with multiple movie ratings
4. Build recommendation engine based on similarity scores
