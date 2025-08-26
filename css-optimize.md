# CSS Refactoring Guide: Modularizing `gptp.css`

This guide provides a step-by-step process for refactoring the monolithic `gptp.css` stylesheet into a modern, modular, and more maintainable structure. 

By breaking the single large file into smaller, component-based files, we can improve readability, make future edits easier, and organize the codebase more logically.

---

## Safety First: Backup Your Files

Before making any changes, it is critical to back up your existing CSS files. This provides a safety net and allows you to instantly restore the site if anything goes wrong.

1.  **Create a Backup Directory**: In the `prompts-site-webflow-export/` folder, create a new folder named `css_backup`.
2.  **Copy the Files**: Copy the following files from `prompts-site-webflow-export/css/` into your new `prompts-site-webflow-export/css_backup/` folder:
    *   `gptp.css`
    *   `normalize.css`
    *   `components.css`
    *   `hamburger-menu.css`

If you need to revert your changes, you can simply copy these files back into the `css/` directory and undo the `<link>` tag changes in your HTML files.

## The Goal: A Component-Based Structure

Our goal is to transform the current CSS structure into one that looks like this:

```
prompts-site-webflow-export/css/
├── base/
│   ├── _reset.css         # (Existing normalize.css content)
│   ├── _variables.css     # (:root variables for colors, fonts, etc.)
│   └── _typography.css    # (Global styles for h1, p, a, etc.)
├── components/
│   ├── _buttons.css
│   ├── _cards.css
│   ├── _forms.css
│   ├── _hamburger-menu.css # (Existing hamburger-menu.css content)
│   ├── _layout.css         # (Main page structure like .page-wrap)
│   ├── _sidebar.css
│   └── _popups.css
└── main.css               # The single entry point that imports all other files
```

---

## Step-by-Step Refactoring Instructions

### Step 1: Set Up the New File Structure

1.  Inside `prompts-site-webflow-export/css/`, create two new folders: `base` and `components`.
2.  Create a new, empty file named `main.css` inside the `css/` directory.

### Step 2: Create the `main.css` Import Hub

This file will act as a central hub, importing all the smaller CSS "partials" in the correct order. This ensures that dependencies are met (e.g., variables are defined before they are used).

Open `css/main.css` and add the following `@import` rules. We will create these files in the next steps.

```css
/*
 * ===================================================================
 * MAIN.CSS - The single source of truth for all site styles.
 * Imports all partials in the correct order.
 * ===================================================================
 */

/* 1. Base & Global Styles
   - Reset/normalize styles
   - Global variables
   - Base typography
   - Core layout structure
*/
@import url("base/_reset.css");
@import url("base/_variables.css");
@import url("base/_typography.css");
@import url("components/_layout.css");

/* 2. Reusable Components
   - Individual, self-contained components
*/
@import url("components/_buttons.css");
@import url("components/_forms.css");
@import url("components/_sidebar.css");
@import url("components/_cards.css");
@import url("components/_popups.css");
@import url("components/_hamburger-menu.css");

/* 3. Page-Specific or Other Styles (if any)
   - Add any other specific stylesheets here
*/
```

### Step 3: Migrate Existing Stylesheets

1.  **Reset**: Rename `css/normalize.css` to `css/base/_reset.css`.
2.  **Hamburger Menu**: Move `css/hamburger-menu.css` to `css/components/_hamburger-menu.css`.

### Step 4: Extract Partials from `gptp.css`

This is the core of the refactoring process. Open `gptp.css` and systematically cut sections of code and paste them into new, focused partial files.

**1. `_variables.css`**
   - Create `css/base/_variables.css`.
   - Cut the entire `:root { ... }` block from the top of `gptp.css` and paste it into this new file.

**2. `_typography.css`**
   - Create `css/base/_typography.css`.
   - Cut the global element styles from `gptp.css` and paste them here. This includes:
     - `body`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `a`, `ul`, `label`, `strong`

**3. `_layout.css`**
   - Create `css/components/_layout.css`.
   - Move layout-related selectors:
     - `.w-layout-layout`, `.w-layout-cell`, `.page-wrap`, `.right-panel`, `.left-panel`

**4. `_forms.css`**
   - Create `css/components/_forms.css`.
   - Move form-related selectors:
     - `.form`, `.field`, `.field-label-2`, `.input-wrap`

**5. `_buttons.css`**
   - Create `css/components/_buttons.css`.
   - Move button and control selectors:
     - `.page-controls`, `.tab`, `.block-link`, `.show-example`, `.close-example-items`

**6. `_sidebar.css`**
   - Create `css/components/_sidebar.css`.
   - Move all sidebar-related selectors:
     - `.sidebar-all-content-wrap`, `.sidebar-link`, `.sidebar`, `.sidebar-content`, `.sidebar-section`, `.sidebar-category-head`

**7. `_cards.css`**
   - Create `css/components/_cards.css`.
   - Move selectors related to content containers and cards:
     - `.prompt-body`, `.start-page-content-wrap`, `.example-item`, `.example-input-content`

**8. `_popups.css`**
   - Create `css/components/_popups.css`.
   - Move selectors for popups and notifications:
     - `.popup-notification`, `.close-popup`, `.example-section-wrap`, `.tooltip`

Continue this process for other logical groupings you identify.

### Step 5: Update All HTML Files

Now, go into every `.html` file in the project (in the root, `personal/`, and `work/` directories) and replace the old CSS links with the single new one.

**Find and remove this block:**
```html
<link href="../css/normalize.css" rel="stylesheet" type="text/css">
<link href="../css/components.css" rel="stylesheet" type="text/css">
<link href="../css/gptp.css" rel="stylesheet" type="text/css">
<link href="../css/hamburger-menu.css" rel="stylesheet" type="text/css">
<!-- Note: Path may be css/ instead of ../css/ in index.html -->
```

**Replace it with this single line:**
```html
<!-- For pages in root, like index.html -->
<link href="css/main.css" rel="stylesheet" type="text/css">

<!-- For pages in subdirectories like personal/ or work/ -->
<link href="../css/main.css" rel="stylesheet" type="text/css">
```

### Step 6: Test and Verify

Thoroughly test the site to ensure all styles are applied correctly before deleting the old files.

1.  **Clear Your Browser Cache**: This ensures you are seeing the latest changes.
2.  **Desktop Testing**:
    *   Load the `index.html` homepage. Check for correct layout, fonts, and colors.
    *   Navigate to a `personal/` page and a `work/` page. Ensure the sidebar and content are styled correctly.
3.  **Mobile Testing**:
    *   Open your browser's developer tools and switch to a mobile view (e.g., iPhone or Pixel).
    *   Load the homepage. The hamburger menu should be visible.
    *   Click the hamburger menu to open and close the sidebar. Verify it works as expected.
    *   Check the layout on the mobile view for any visual bugs.

### Step 7: Clean Up

**Only after you have tested thoroughly and confirmed everything is working**, you can safely delete the old, now unused, CSS files from the `css/` directory:

*   `gptp.css`
*   `components.css`

(You already moved `normalize.css` and `hamburger-menu.css`, so they don't need to be deleted).

---

## Rollback Plan (If Something Goes Wrong)

If the site is not rendering correctly, follow these steps to restore it to its original state:

1.  **Restore CSS Files**: Copy all the files from your `css_backup/` directory and paste them back into the `css/` directory, overwriting the new files you created.
2.  **Revert HTML Links**: Go back through your HTML files and change the `<link>` tag for `main.css` back to the original set of `<link>` tags.
3.  **Delete New Structure**: You can safely delete the `css/base/`, `css/components/`, and `css/main.css` files.

---

## Final Checklist

- [ ] **Backup created** in `css_backup/`.
- [ ] Created `base` and `components` directories.
- [ ] Created `main.css` with all `@import` rules.
- [ ] Migrated `normalize.css` and `hamburger-menu.css`.
- [ ] Extracted all logical partials (`_variables`, `_typography`, `_sidebar`, etc.) from `gptp.css`.
- [ ] Updated the `<link>` tags in all HTML files to point only to `main.css`.
- [ ] **Verified the site looks and works correctly on desktop and mobile.**
- [ ] Deleted the old `gptp.css` and `components.css` files.

You have now successfully refactored the project's CSS for better maintainability!
