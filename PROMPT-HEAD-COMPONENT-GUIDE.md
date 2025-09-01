# Universal Prompt Head Component System

## Overview

The Universal Prompt Head Component is a modular, reusable header component that replaces the static HTML implementation across all pages. It provides consistent branding, navigation controls, and AI service links.

## Implementation Options

### **Option A: Replace Existing Implementation (Recommended)**

For pages that already have `<div class="universal-prompt-head">` with content:

1. **Add component scripts to HTML head:**
```html
<script src="../js/prompt-head-component.js" type="text/javascript"></script>
<script src="../js/prompt-head-loader.js" type="text/javascript"></script>
```

2. **Replace existing HTML with empty container:**
```html
<!-- Replace entire existing universal-prompt-head div with: -->
<div class="universal-prompt-head"></div>
```

3. **Component auto-loads and renders the complete UI**

### **Option B: Keep Existing Implementation**

For pages where you want to keep the current static HTML:
- Simply don't include the component scripts
- Existing implementation will continue to work unchanged

### **Option C: Progressive Enhancement**

Add component scripts but keep existing HTML:
- Component loader detects existing content and preserves it
- Provides fallback if JavaScript fails

## Files Created

### **Core Component Files:**
- `js/prompt-head-component.js` - Main component class
- `js/prompt-head-loader.js` - Auto-loading system  
- `css/components/_prompt-head.css` - Component styles

### **Enhanced Main CSS:**
- Updated `css/main.css` to import component styles

## Features Included

### **Component Functionality:**
- ✅ Logo with home link
- ✅ Sidebar toggle controls  
- ✅ Copy success feedback
- ✅ AI service quick links (ChatGPT, Claude)
- ✅ Services dropdown menu
- ✅ Mobile responsive behavior
- ✅ Webflow integration
- ✅ Animation support

### **Developer Features:**
- ✅ Auto-path detection based on page location
- ✅ Fallback to existing HTML if component fails
- ✅ Theme variable support
- ✅ Event integration with page functionality
- ✅ Mobile menu synchronization

## Implementation Steps

### **Step 1: Choose Pages to Update**
Identify which pages should use the component:
```bash
# Find pages with existing universal-prompt-head
grep -r "universal-prompt-head" prompts-site-webflow-export/*.html
grep -r "universal-prompt-head" prompts-site-webflow-export/work/*.html
grep -r "universal-prompt-head" prompts-site-webflow-export/personal/*.html
```

### **Step 2: Add Scripts to HTML Head**
For each page, add before closing `</head>`:
```html
<!-- Universal Prompt Head Component System -->
<script src="../js/prompt-head-component.js" type="text/javascript"></script>
<script src="../js/prompt-head-loader.js" type="text/javascript"></script>
```

### **Step 3: Update HTML Structure**
Replace existing `<div class="universal-prompt-head">` content with:
```html
<div class="universal-prompt-head">
  <!-- Component will auto-populate this container -->
</div>
```

### **Step 4: Test Implementation**
- Load page in browser
- Verify component renders correctly
- Test sidebar toggle functionality
- Test AI service links
- Check mobile responsive behavior

## Customization Options

### **Update Service Links:**
```javascript
// Customize main service links
const component = new PromptHeadComponent();
component.updateServices([
  {
    name: 'Custom AI',
    url: 'https://custom-ai.com',
    icon: '../images/custom-icon.svg',
    iconAlt: 'Custom AI Logo'
  }
]);
```

### **Add Dropdown Services:**
```javascript
// Add new service to dropdown
component.addDropdownService({
  name: 'New Service',
  url: 'https://new-service.com'
});
```

### **Theme Customization:**
```css
/* Override component theme variables */
:root {
  --prompt-head-bg: #custom-color;
  --prompt-head-text: #custom-text;
  --prompt-head-accent: #custom-accent;
  --prompt-head-hover: #custom-hover;
}
```

## Migration Strategy

### **Recommended Approach:**

1. **Test Single Page First**
   - Choose one page (e.g., `work/jira.html`)
   - Implement component system
   - Verify full functionality

2. **Batch Process by Directory**
   - Work directory: 12 pages
   - Personal directory: 17 pages  
   - Root pages with headers

3. **Automated Script Option**
   - Create script to bulk-update HTML files
   - Replace existing markup with component container
   - Add script tags to head sections

### **Testing Checklist:**
- [ ] Logo links to correct home page
- [ ] Sidebar toggle works properly
- [ ] AI service links open correctly
- [ ] Dropdown menu functions
- [ ] Copy feedback displays
- [ ] Mobile responsive layout
- [ ] Webflow animations work
- [ ] No JavaScript errors in console

## Rollback Plan

If issues occur:
1. **Remove component scripts** from HTML head
2. **Restore original HTML markup** for universal-prompt-head
3. **Component styles are non-breaking** - can remain in CSS

## Benefits

### **Maintainability:**
- Single source of truth for header component
- Easy to update service links across all pages
- Centralized functionality management

### **Performance:**
- Lazy-loaded component system
- Cached JavaScript and CSS
- No duplicate HTML markup

### **Consistency:**
- Identical behavior across all pages
- Synchronized mobile menu integration
- Unified theming system

### **Developer Experience:**
- Auto-detection and fallbacks
- Clear component architecture
- Extensible service configuration

## Next Steps

1. **Choose implementation approach** (A, B, or C above)
2. **Select pages for initial testing**
3. **Run pilot implementation** on 2-3 pages
4. **Scale to remaining pages** once verified
5. **Optional: Create bulk update script** for efficiency

This modular system maintains all existing functionality while providing a cleaner, more maintainable architecture for future updates.