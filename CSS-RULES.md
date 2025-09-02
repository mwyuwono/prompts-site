# CSS Rules and Guidelines

## ❌ FORBIDDEN CSS PRACTICES

### Never Use `!important`
- **Rule**: Never use `!important` in any CSS declarations
- **Reason**: Creates specificity conflicts and makes styles unmaintainable
- **Alternative**: Use proper CSS specificity, more specific selectors, or inline styles
- **Examples**:
  ```css
  /* ❌ NEVER DO THIS */
  .element { display: flex !important; }
  
  /* ✅ DO THIS INSTEAD */
  .element { display: flex; }
  element.style.display = 'flex'; // JavaScript
  ```

## ✅ PREFERRED CSS PRACTICES

### CSS Architecture
- **External CSS files**: Always use separate CSS files for styling
- **CSS classes**: Use semantic class names for styling
- **Avoid inline styles**: Inline styles make maintenance difficult and override CSS cascade
- **Component-based CSS**: Create dedicated CSS for components

### CSS Specificity Management
- Use natural CSS cascade and specificity
- Write more specific selectors when needed
- Organize CSS with proper architectural patterns
- Use CSS custom properties (variables) for theming

### When JavaScript Style Management is Acceptable
- **Only for dynamic/computed values**: Width/height calculations, positions based on user interaction
- **Temporary state changes**: Show/hide elements, loading states
- **Never for static styling**: Colors, fonts, layouts should be in CSS files

## Memory Checkpoint
**Date**: 2025-09-02
**Context**: Working on prompt head component layout issues
**Reminder**: User explicitly forbids `!important` usage - removed from component code and documented here