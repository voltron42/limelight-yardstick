# dnd-kit Demo - Quick Start Guide

Complete, working demonstration of the dnd-kit React drag-and-drop library.

## 📦 What's Included

### **dnd-kit Demo** (`dnd-kit-demo/`)
A minimal, customizable sortable list demonstrating:
- Basic drag and drop
- Keyboard navigation
- Add/remove items
- ~10KB bundle size
- Modern React hooks-based
- Mobile-friendly touch support

**Best For:** MVP implementation of ranking UI, custom UIs, performance-critical apps

## 🚀 Quick Start

### Run dnd-kit Demo

```bash
cd dnd-kit-demo
npm install
npm run dev
```

**What you'll see:**
- A sortable list of frameworks
- Drag items to reorder
- Use arrow keys for keyboard navigation
- Add/remove buttons to modify the list
- Real-time order display

## � Documentation

### Project Structure

```
dnd-kit-demo/
├── src/
│   ├── App.jsx          # Main component (sortable list logic)
│   ├── main.jsx         # React entry point
│   ├── styles.css       # Component styles
├── tests/
│   ├── app.spec.js      # Playwright tests
│   └── README.md        # Testing guide
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── playwright.config.js # Playwright configuration
├── package.json         # Dependencies
├── .gitignore           # Exclude test artifacts
└── README.md            # Library documentation
```

### Key Files

- `src/App.jsx` - Main component with all drag-drop logic
- `src/styles.css` - Component styling
- `README.md` - dnd-kit library information

## 🔧 Customization Ideas

For dnd-kit demo:
- Add multiple lists
- Add categories/sections
- Implement persistence (localStorage)
- Add animations
- Create a multi-column layout
- Integrate with your Limelight Yardstick ranking system

## � Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3000  // Change to different port
}
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot Module Replacement Not Working
```bash
# Restart dev server
npm run dev
```

## 📖 External Resources

### dnd-kit
- **Docs:** https://docs.dndkit.com/
- **GitHub:** https://github.com/clauderic/dnd-kit
- **Discord:** Official Discord community

## ✨ Next Steps

1. **Run the demo** - Get hands-on experience with dnd-kit
2. **Read the code** - Inspect `src/App.jsx` to understand the pattern
3. **Experiment** - Modify the demo, try adding features
4. **Integrate** - Use as a template for your Limelight Yardstick ranking component
5. **Test** - Run `npm test` or `npm run test:ui` for interactive testing

---

**Happy Dragging! 🎉**

Have questions? Check the README.md file or refer to the official dnd-kit documentation.
