# Demo Setup & Testing Guide

Complete setup and testing instructions for the dnd-kit demo application.

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
cd dnd-kit-demo
npm install
```

### Running the Application

```bash
# Start dnd-kit demo (runs on http://localhost:5173)
cd dnd-kit-demo
npm run dev
```

> Note: If port 5173 is already in use, Vite will automatically use the next available port (5174, 5175, etc.)

---

## Testing the Application

### Install Playwright (Optional but Recommended)

```bash
cd dnd-kit-demo
npm exec playwright install
```

### Running Tests

```bash
# Run tests with headless browser
npm test

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npx playwright test --headed
```

---

## Verification Checklist

### dnd-kit Demo
- [ ] Application loads without console errors
- [ ] Header shows "🎯 dnd-kit Demo" title
- [ ] Sortable list displays framework items
- [ ] Can drag items to reorder
- [ ] Add button works and creates new items
- [ ] Remove button (✕) works
- [ ] Current order updates in info box
- [ ] Keyboard navigation works (arrow keys)
- [ ] Features list is visible

---

## Common Issues & Solutions

### Issue: "Cannot find module" Error

**Cause:** Dependencies not installed

**Solution:**
```bash
cd dnd-kit-demo
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Port Already in Use

**Cause:** Another process is using port 5173

**Solution:**
1. Vite will automatically try 5174, 5175, etc.
2. Or manually change in `vite.config.js`:
```js
export default defineConfig({
  server: {
    port: 3000  // Change to any available port
  }
})
```

---

### Issue: Blank White Page

**Cause:** 
- Script path incorrect (was relative, now fixed)
- Module not loading
- React root element not found

**Diagnosis:**
1. Open browser dev tools (F12)
2. Check Console tab for errors
3. Check Network tab to see if modules load

**Solution:**
- Ensure `index.html` has correct script path: `<script src="/src/main.jsx">`
- Ensure `div id="root"` exists in HTML
- Clear browser cache: Ctrl+Shift+Delete

---

### Issue: Drag and Drop Not Working

**Cause:**
- JavaScript not loaded
- Missing dependencies
- Incorrect event handlers

**Solution:**
```bash
# Reinstall all dependencies
npm install

# Check that dnd libraries are installed
npm list @dnd-kit/core
npm list react-beautiful-dnd
```

---

### Issue: Tests Fail with "Connection Refused"

**Cause:** Dev server not running when running tests

**Solution:**
- Playwright config auto-starts the dev server
- Make sure no process is blocking the port
- The first test run may take longer as it starts the server

---

## Project Structure

```
dnd-kit-demo/
├── src/
│   ├── App.jsx          # Main component (sortable list logic)
│   ├── main.jsx         # React entry point
│   ├── styles.css       # Component styles
├── tests/
│   ├── app.spec.js      # Playwright tests
│   └── README.md        # Testing guide
├── index.html           # ✨ FIXED: Now uses /src/main.jsx
├── vite.config.js       # Vite configuration
├── playwright.config.js # Playwright configuration
├── package.json         # ✨ ADDED: test scripts & playwright
├── .gitignore           # ✨ NEW: Test artifacts
└── README.md            # Library documentation

react-beautiful-dnd-demo/
├── src/
│   ├── App.jsx          # Main component (kanban logic)
│   ├── main.jsx         # React entry point
│   ├── styles.css       # Component styles
├── tests/
│   ├── app.spec.js      # Playwright tests
│   └── README.md        # Testing guide
├── index.html           # ✨ FIXED: Now uses /src/main.jsx
├── vite.config.js       # Vite configuration
├── playwright.config.js # Playwright configuration
├── package.json         # ✨ ADDED: test scripts & playwright
├── .gitignore           # ✨ NEW: Test artifacts
└── README.md            # Library documentation
```

---

## What Was Fixed

### Files Modified
1. **index.html (both demos)** - Fixed script path from `./src/main.jsx` to `/src/main.jsx`
2. **package.json (both demos)** - Added test scripts and Playwright dev dependency

### Files Created
1. **playwright.config.js (both demos)** - Playwright test configuration
2. **tests/app.spec.js (both demos)** - Comprehensive test suites
3. **tests/README.md (both demos)** - Testing documentation
4. **.gitignore (both demos)** - Ignore test artifacts

---

## Verification Commands

```bash
# Verify dnd-kit demo
cd dnd-kit-demo
npm install
npm run dev
# Open http://localhost:5173 in browser

# In another terminal, run tests
npm test

# For react-beautiful-dnd demo
cd ../react-beautiful-dnd-demo
npm install
npm run dev
# Open http://localhost:5173 in browser (or next available port)

# In another terminal, run tests
npm test
```

---

## Next Steps

1. **Install dependencies**: `npm install` in each demo folder
2. **Run the app**: `npm run dev` to start the dev server
3. **Test it out**: Open browser and interact with the demo
4. **Run tests**: `npm test` or `npm run test:ui` for interactive testing
5. **Compare**: Try both demos to understand the differences

---

## Support

For issues:
1. Check the troubleshooting section above
2. Review the test output: `npm run test:ui`
3. Check browser console: F12 in the browser
4. Review Playwright report: `npm test` generates `playwright-report/index.html`

---

## Summary

✅ **Root cause:** Relative script paths in HTML files  
✅ **Solution:** Changed to absolute paths (`/src/main.jsx`)  
✅ **Testing:** Added comprehensive Playwright test suite  
✅ **Documentation:** Added troubleshooting and testing guides  
✅ **Status:** Both demos should now load and run correctly  
