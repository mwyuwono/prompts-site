# Universal Prompt Head Component - Refinement Plan

## Overview
Create a pixel-perfect component replica of the existing static implementation with a safe, non-destructive integration system that allows testing and approval before any replacement.

## Phase 1: Complete CSS Analysis ✅

**Status:** COMPLETED
- ✅ **62 CSS rules extracted** from 8 source files
- ✅ **Comprehensive analysis** documented in `prompt-head-css-analysis.md`
- ✅ **Consolidated CSS** generated in `prompt-head-extracted.css`

**Key Findings:**
- Rules distributed across: `_layout.css` (12), `_features.css` (14), `_navigation.css` (15), `_buttons.css` (11), others
- Complex responsive behavior with multiple breakpoints
- Webflow-specific classes and interactions preserved

## Phase 2: Non-Destructive Integration System

### 2.1 Dual-Mode Component Architecture

```javascript
class UniversalPromptHead {
  constructor(options = {}) {
    this.mode = options.mode || 'test'; // 'test' | 'replace'
    this.preserveExisting = options.preserveExisting !== false;
    this.enableComparison = options.enableComparison !== false;
  }
}
```

**Modes:**
- **`test`** - Renders component alongside existing (hidden by default)
- **`replace`** - Replaces existing after approval
- **`comparison`** - Shows both side-by-side for approval

### 2.2 Safe Integration Approach

**Option A: CSS Class Toggle**
```html
<!-- Existing implementation -->
<div class="universal-prompt-head static-version">
  <!-- Current HTML -->
</div>

<!-- Component version (initially hidden) -->
<div class="universal-prompt-head component-version" style="display: none;">
  <!-- Generated HTML -->
</div>
```

**Option B: URL Parameter Testing**
```javascript
// Show component version only when ?test-component=true
const showTestComponent = new URLSearchParams(location.search).has('test-component');
```

**Option C: Progressive Enhancement**
```javascript
// Component enhances existing HTML without replacing it
// Adds functionality while preserving original structure
```

### 2.3 Integration Safety Measures

1. **Fallback Mechanism**
   - If component fails to load, original HTML remains
   - Error handling preserves existing functionality
   - No breaking changes to existing pages

2. **Path Resolution**
   - Automatic detection of page location (work/, personal/, root)
   - Dynamic path adjustment for images and links
   - Consistent behavior across all page types

3. **Event Integration**
   - Preserve existing JavaScript event handlers
   - Maintain Webflow interactions
   - Copy functionality integration

## Phase 3: Pixel-Perfect Component Creation

### 3.1 HTML Structure Generation

Create exact replica using the 62 extracted CSS rules:

```javascript
class PromptHeadHTMLGenerator {
  generateStructure(options = {}) {
    const pathPrefix = this.detectPathPrefix();
    return `
      <div class="universal-prompt-head">
        ${this.generateLogoSection(pathPrefix)}
        ${this.generateSidebarToggle()}
        ${this.generateCopiedFeedback()}
        ${this.generateMobileMenuIcon()}
        ${this.generateServicesSection()}
      </div>
    `;
  }
}
```

### 3.2 CSS Integration Strategy

**Option A: Scoped CSS**
```css
/* Component-specific scope */
.prompt-head-component .universal-prompt-head {
  /* All 62 extracted rules with proper scoping */
}
```

**Option B: CSS-in-JS**
```javascript
// Inject styles dynamically to avoid conflicts
const styleElement = document.createElement('style');
styleElement.textContent = extractedCSS;
document.head.appendChild(styleElement);
```

**Option C: Exact CSS Replication**
```css
/* Import exact CSS without modifications */
@import url('prompt-head-extracted.css');
```

### 3.3 Responsive Behavior Preservation

- Extract and replicate all `@media` queries
- Maintain exact breakpoints and responsive behaviors
- Test across all device sizes

## Phase 4: Testing & Approval Framework

### 4.1 Visual Comparison System

**Screenshot Comparison Tool:**
```javascript
class ComponentComparison {
  async captureScreenshots() {
    // Capture static version
    const staticScreenshot = await this.captureElement('.static-version');
    
    // Capture component version  
    const componentScreenshot = await this.captureElement('.component-version');
    
    // Generate diff image
    return this.createDiffImage(staticScreenshot, componentScreenshot);
  }
}
```

**A/B Testing Interface:**
```html
<!-- Testing interface for approval -->
<div class="component-testing-ui">
  <button onclick="showVersion('static')">Show Static</button>
  <button onclick="showVersion('component')">Show Component</button>
  <button onclick="showVersion('side-by-side')">Compare</button>
  
  <div class="approval-controls">
    <button onclick="approveComponent()">✅ Approve & Replace</button>
    <button onclick="rejectComponent()">❌ Needs Work</button>
  </div>
</div>
```

### 4.2 Automated Testing Checklist

```javascript
const testChecklist = {
  visual: {
    'Logo placement': () => checkLogoPosition(),
    'Button spacing': () => checkButtonSpacing(), 
    'Colors match': () => compareColors(),
    'Typography consistent': () => checkFonts()
  },
  functional: {
    'Sidebar toggle works': () => testSidebarToggle(),
    'Dropdown opens': () => testDropdown(),
    'Copy feedback shows': () => testCopyFeedback(),
    'Links navigate correctly': () => testNavigation()
  },
  responsive: {
    'Mobile layout': () => testMobileBreakpoint(),
    'Tablet layout': () => testTabletBreakpoint(),
    'Desktop layout': () => testDesktopBreakpoint()
  }
};
```

### 4.3 Cross-Page Verification

Test component across representative pages:
- `work/assessments.html` - Standard work page
- `personal/quiz-me.html` - Standard personal page  
- `work/jira.html` - Complex layout page
- `personal/prompt-builder.html` - Interactive page

## Phase 5: Approved Deployment Strategy

### 5.1 Gradual Rollout Plan

1. **Single Page Test** - Deploy to one test page
2. **Directory Test** - Deploy to all work/ pages
3. **Full Deployment** - Deploy to all pages after approval

### 5.2 Rollback Strategy

```javascript
class ComponentRollback {
  rollback() {
    // Restore original HTML from backup
    // Remove component scripts
    // Restore original CSS imports
  }
}
```

## Implementation Timeline

1. **Phase 2-3: Component Creation** (~2-3 hours)
   - Build refined component with extracted CSS
   - Create non-destructive integration system
   - Implement testing framework

2. **Phase 4: Testing & Approval** (~1 hour)
   - Deploy to test pages with approval interface
   - Visual comparison and functional testing
   - User approval process

3. **Phase 5: Deployment** (~30 minutes)
   - Replace static implementation after approval
   - Monitor for any issues
   - Complete rollout verification

## Success Criteria

✅ **Visual Match**: Component identical to static version  
✅ **Functional Match**: All interactions work exactly the same  
✅ **Performance**: No degradation in load time or responsiveness  
✅ **Compatibility**: Works across all browsers and devices  
✅ **Maintainability**: Easier to update and maintain than static version  
✅ **Safety**: Can be rolled back without issues  

**Next Step**: Proceed with Phase 2-3 implementation after plan approval.