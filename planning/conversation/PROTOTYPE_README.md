# Limelight Yardstick - Prototype Static Site

**Status**: ✅ Live and Running on http://localhost:5174/

A fully functional prototype demonstrating all 4 key pages of the Limelight Yardstick MVP using **Bootstrap 5 ONLY** (no custom CSS) and **Dark Theme**.

---

## 🎨 Design Rules Implemented

✅ **Bootstrap 5 ONLY** - No custom CSS, pure Bootstrap utilities  
✅ **Dark Theme** - `bg-dark`, `text-light`, `border-secondary` throughout  
✅ **Sentiment Color Mapping** - Bootstrap semantic colors for feedback:
- 🔴 **Danger** (Red): Unengaging (0 rating)
- 🟡 **Warning** (Yellow): Derivative (1 rating)
- 🔵 **Info** (Cyan): Competent (2 rating)
- 🟢 **Success** (Green): Transcendent (3 rating)

✅ **Font Pairing** - Bebas Neue (headlines) + Inter (body text)  
✅ **Drag-and-Drop** - dnd-kit integration for category ranking

---

## 📄 Pages Implemented

### 1. **Scorecard Survey** (`/scorecard`)
- Movie header card with metadata (title, year, genres, description, directors)
- **4 Sentiment Rating Categories**:
  - Each category displays Button Group with 4 sentiment options
  - Sentiment colors change on selection (danger → warning → info → success)
  - Bootstrap 5 `.btn-group.d-flex.w-100` pattern for responsive layout
- **Drag-and-Drop Ranking Section**:
  - Uses dnd-kit for reordering categories by importance
  - Rank items show position number + category name + current rating
  - Fully functional drag support (tested and working)
- **Form Actions**: Cancel and Submit buttons with native form flow

### 2. **User Dashboard** (`/dashboard`, `/`)
- **User Header Card**:
  - Welcome message with username (cinephile_phoenix)
  - Public/Private profile toggle
  - Privacy status indicator (🔒 Private / ✅ Public)
  - Shows total rated films
- **Scorecard Cards Grid**:
  - Movie poster images (placeholder)
  - Movie title + year
  - Sentiment badges showing ratings per category (color-coded)
  - Score (0-3 scale) and submission date
  - Responsive grid layout (1 col mobile, 2 col tablet+)
- **Similar Users Sidebar**:
  - Sticky sidebar with list of users by taste similarity
  - Username + similarity percentage badge
  - Top 7 similar users displayed

### 3. **Public User Profile** (`/user-profile`)
- **Profile Header Card**:
  - User avatar placeholder (icon in circle)
  - Username (film_connoisseur)
  - Similarity percentage badge (72% similar taste)
- **Shared Movies Table**:
  - Shows movies both users have rated
  - Comparison of their ratings vs. current user's ratings
  - Difference in points (1 pt = 0.25 on scale)
  - Color-coded sentiment badges for ratings
- **Discover Movies Section**:
  - Movies rated by the profile user but not yet by current user
  - Card layout with movie poster, title, genres, score
  - "See More" button for exploration

### 4. **Movie Profile** (`/movie-profile`)
- **Movie Header Card**:
  - Movie cover image (placeholder)
  - Title + year
  - Genres + directors
  - Description
  - Community rating count + alert badge
- **Rating Breakdown Section**:
  - 4 categories (Daring, Ambitious, Engaging, Satisfied)
  - For each category, shows all 4 sentiment options with:
    - Sentiment label (Unengaging, Derivative, Competent, Transcendent)
    - Percentage of community votes
    - Bootstrap 5 progress bars filled with sentiment colors
  - All 4 categories separated by horizontal dividers
  - Responsive layout with clean typography

---

## 🛠 Technology Stack

- **Framework**: React 18.2.0 with React Router v6
- **UI Library**: Bootstrap 5.3.2 (CSS only, no JS dependencies)
- **Drag-and-Drop**: @dnd-kit/core + @dnd-kit/sortable
- **Build Tool**: Vite 5.0.8 (fast HMR)
- **Fonts**: Google Fonts (Bebas Neue + Inter via CDN)

---

## 📁 Project Structure

```
prototype/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Router setup
    ├── components/
    │   ├── Navigation.jsx       # Navigation bar
    │   └── SortableRankingItem.jsx  # Drag-and-drop item
    ├── pages/
    │   ├── Scorecard.jsx        # Rating survey
    │   ├── Dashboard.jsx        # User dashboard
    │   ├── UserProfile.jsx      # Public user profile
    │   └── MovieProfile.jsx     # Movie metrics page
    └── data/
        └── mockData.js          # Mock data for all pages
```

---

## 🚀 Running the Prototype

```bash
cd prototype
npm install
npm run dev
```

The app will start on **http://localhost:5174/**

### Routes:
- `/` - Dashboard (home)
- `/dashboard` - Dashboard (alias)
- `/scorecard` - Scorecard survey
- `/user-profile` - Public user profile
- `/movie-profile` - Movie metrics page
- Navigation menu links all pages together

---

## ✨ Key Features Demonstrated

✅ **Fully Responsive** - Bootstrap grid system handles mobile/tablet/desktop  
✅ **Dark Theme Throughout** - No jarring color switches between pages  
✅ **Sentiment Color Feedback** - Immediate visual feedback matching Bootstrap semantics  
✅ **Drag-and-Drop Ranking** - Works with keyboard (arrow keys) + mouse/touch  
✅ **Navigation Integration** - Sticky navbar with routing to all pages  
✅ **Mock Data Consistency** - All pages reference same movie/user/rating data  
✅ **Bootstrap Components Only** - Cards, tables, badges, progress bars, buttons, forms  
✅ **Accessible HTML** - Proper semantic structure, ARIA labels, form controls  

---

## 🎯 Next Steps (for Production)

1. **Replace Mock Data**: Connect to Clojure/PostgreSQL backend
2. **Form Submission**: Integrate scorecard submission with API
3. **Dynamic Navigation**: Load user data from database
4. **Image Optimization**: Replace placeholder images with TMDB artwork
5. **Privacy Settings**: Implement profile visibility toggle
6. **Search Integration**: Add movie search via TMDB API
7. **Similarity Algorithm**: Implement diffRatings + core.async worker

---

## 📝 Notes

- All styling uses **Bootstrap 5 classes ONLY** ✅ (no custom CSS)
- Color system via Bootstrap semantic colors (danger/warning/info/success) ✅
- Drag-and-drop fully functional with dnd-kit ✅
- No external CSS frameworks beyond Bootstrap ✅
- Dark theme consistent across all pages ✅
- Responsive design tested on mobile/tablet/desktop ✅

**Version**: 1.0  
**Date**: May 3, 2026  
**Status**: Ready for design review and backend integration planning
