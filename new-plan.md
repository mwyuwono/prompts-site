# Plan: Final CSS Audit and Reconstruction

## 1. Objective

To ensure the new modular CSS files are a perfect, 1-to-1 functional equivalent of the original CSS files from the `css_backup` directory. All styles, selectors, and rules must be represented without modification in the appropriate new modular file.

## 2. Problem

Despite previous refactoring, styling is still incorrect on pages like `audio-essay.html`. This indicates that the new modular CSS files are not a complete and accurate representation of the original styles. A comprehensive, systematic audit and reconstruction is required to fix this.

## 3. Methodology

A selector-by-selector audit will be performed. Each rule from the old CSS files will be systematically checked and placed into the correct new modular file, as defined by the original refactoring plan. This will be a direct migration of styles, not an interpretation.

## 4. Detailed Action Plan

### Step 1: Preparation

- **Old CSS Files to be Audited:**
  - `css_backup/gptp.css`
  - `css_backup/components.css`
  - `css_backup/normalize.css`
  - `css_backup/hamburger-menu.css`

- **New Modular CSS Files (Targets):**
  - `css/base/_reset.css`
  - `css/base/_variables.css`
  - `css/base/_typography.css`
  - `css/components/_layout.css`
  - `css/components/_buttons.css`
  - `css/components/_forms.css`
  - `css/components/_sidebar.css`
  - `css/components/_cards.css`
  - `css/components/_popups.css`
  - `css/components/_hamburger-menu.css`

### Step 2: Audit and Migration

I will perform the following steps for each old CSS file:

1.  Read the full content of the old CSS file.
2.  Read the full content of the corresponding new modular CSS file(s).
3.  Systematically compare the old file to the new file(s), selector by selector.
4.  Identify any missing selectors or styles.
5.  Append the missing styles to the correct new modular file.

### Step 3: Verification

- **Visual Inspection:** After each file is migrated, I will ask you to perform a hard refresh (`Cmd+Shift+R` or `Ctrl+Shift+R`) and visually inspect `audio-essay.html` for improvements in layout, buttons, and fonts.
- **Developer Tools:** I will ask you to use your browser's developer tools to inspect the styles of the problematic elements and confirm that the correct styles are being applied from the new modular CSS files.

## 5. Checklist

I will use this checklist to track my progress:

- [ ] **`normalize.css` -> `_reset.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_variables.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_typography.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_layout.css`:** Complete migration and verification.
- [ ] **`gptp.css` & `components.css` -> `_buttons.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_forms.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_sidebar.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_cards.css`:** Complete migration and verification.
- [ ] **`gptp.css` -> `_popups.css`:** Complete migration and verification.
- [ ] **`hamburger-menu.css` -> `_hamburger-menu.css`:** Complete migration and verification.
- [ ] **Final Review:** One final review of all new modular files to ensure completeness.