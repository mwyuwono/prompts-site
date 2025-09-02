## Systematic Plan for Pop-up Notification Removal

**Preamble: Safety First**
*   **Commit Current State:** Before starting, ensure all current changes are committed to version control. This provides a safe rollback point if anything goes wrong.

**Phase 1: Comprehensive Identification**

1.  **Identify HTML files containing the popup structure:**
    *   **Action:** Use a single search to find both the `popup-notification` class and `close-popup` class within all `.html` files under `prompts-site-webflow-export/`. This ensures we catch all relevant instances.
    *   **Tool:** `search_file_content` with a regex pattern like `(popup-notification|close-popup)` and `include: "**/*.html"`.

2.  **Identify CSS files containing popup styles:**
    *   **Action:** Search for `.popup-notification`, `.close-popup`, and any related animation properties (e.g., `opacity`, `transform`, `transition`, `@keyframes`) that are *exclusively* used by the popup. Be mindful of shared utility classes.
    *   **Tool:** `search_file_content` with relevant patterns across all `.css` files in `prompts-site-webflow-export/css/`.
    *   **Refinement:** Prioritize checking `gptp.css` and `components.css` first, as these are common places for global styles.

3.  **Identify JavaScript files containing popup logic:**
    *   **Action:** Confirm the inline script block in HTML files. Additionally, search all `.js` files within `prompts-site-webflow-export/js/ `for references to `popupNotification`, `fadeInAndScaleUp`, `fadeOutAndMoveDown`, or `localStorage.getItem("visitCount")`.
    *   **Tool:** `search_file_content` with relevant patterns across all `.js` files.
    *   **Note:** If any logic is found within minified files like `gptp.js`, direct removal might be impractical. In such a case, the strategy would shift to overriding its behavior (e.g., using CSS `display: none !important` on the popup element, or a small script to remove the element from the DOM after page load).

**Phase 2: Precise Removal**

1.  **Remove HTML:**
    *   For each identified HTML file, precisely locate and remove the entire `div` element with the class `popup-notification` and all its nested content. Ensure no surrounding or unrelated HTML is accidentally removed.

2.  **Remove CSS:**
    *   For each identified CSS file, remove *only* the CSS rules that specifically target `.popup-notification`, `.close-popup`, and any `@keyframes` or utility classes that are *solely* used by the popup. If a class or property is shared with other elements, do not remove it unless it's part of a larger, popup-specific block.

3.  **Remove JavaScript:**
    *   For each identified HTML file, remove the entire inline `<script>` block that contains the popup's `DOMContentLoaded` listener and its associated `fadeInAndScaleUp` and `fadeOutAndMoveDown` functions.
    *   If any popup-related JavaScript was found in external `.js` files, remove only those specific lines of code.

**Phase 3: Thorough Verification**

1.  **Local Visual Inspection:**
    *   Open `index.html` and several other prompt pages (e.g., `personal/audio-essay.html`, `work/assessments.html`, `personal/midjourney-prompts.html`) directly in a browser.
    *   Verify that the popup no longer appears on any page, and that all other page elements render correctly without layout shifts or missing content.

2.  **Browser Developer Tools Check:**
    *   On each tested page, open the browser's developer console (F12).
    *   Check the "Console" tab for any JavaScript errors (e.g., "Uncaught TypeError: Cannot read properties of null (reading 'style')" or "ReferenceError: fadeInAndScaleUp is not defined").
    *   Check the "Elements" tab to confirm that the `.popup-notification` HTML element is no longer present in the DOM.

3.  **Code Quality Checks:**
    *   **Linting:** Run `npm run lint` to ensure no new linting errors or warnings have been introduced.
    *   **Build:** Run `npm run build` to confirm the project still builds successfully without errors.

4.  **Automated Testing (Optional but Recommended):**
    *   If automated end-to-end tests are in place (e.g., Playwright), consider adding a simple test case to assert that the `.popup-notification` element is not visible or not present on key pages. This provides a robust, repeatable verification.

**Post-Removal: Finalization**

1.  **Final Commit:** Once all verification steps pass, commit the changes with a clear and concise commit message (e.g., "feat: Remove site-wide popup notification").