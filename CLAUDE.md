# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Play a system sound whenever the user needs to take action
This attracts the users attention when needed. EVERY TIME the user is prompted to take action or confirm something, a system sound MUST be played. 

## Project Overview

This is a static website for organizing AI prompts, built as a Webflow export with modern tooling. The site features a collection of curated prompts for personal and work use cases, organized into categories like utilities, research, creativity, banking, and prototyping.

## Architecture

**Hybrid Setup**: The project combines a Webflow export with modern development tooling:

- **Webflow Export**: `prompts-site-webflow-export/` - Original static site (primary content)
  - `index.html` - Landing page with AI service links (Claude, ChatGPT, Qwen, etc.)
  - `personal/` - 17 individual HTML pages for personal use prompts
  - `work/` - 13 individual HTML pages for work-related prompts
  - `css/` - Stylesheets (normalize.css, components.css, gptp.css)
  - `js/` - JavaScript files (gptp.js contains Webflow-generated code)
  - `images/` - Icons, logos, and visual assets
  - `documents/` - Animation files (Lottie JSON)

- **Modern Tooling**: 
  - Vite build system with development server
  - `src/` - Modern development files (styles, assets)
  - `dist/` - Built output directory
  - `package.json` - Dependencies (simplified to just Vite)

## Key Features

1. **AI Service Links**: Direct links to Claude, ChatGPT, Qwen, Perchance, and other AI tools
2. **Sidebar Navigation**: Toggle between personal and work prompt categories
3. **Interactive Prompt Builder**: Visual drag-and-drop interface for building Midjourney prompts (`personal/prompt-builder.html`)
4. **Copy-to-Clipboard**: Most prompts include functionality to copy content
5. **Responsive Design**: Mobile-friendly with collapsible menus
6. **Animation**: Lottie animations for feedback and visual enhancement

## Recent Changes & Fixes

**Latest Updates (2025-08-26):**
- ✅ Implemented modular sidebar navigation component system
- ✅ Created centralized navigation data structure for consistency
- ✅ Added tab switching functionality with proper state management
- ✅ Established component-based architecture for reusable navigation
- ✅ Added Audio Essay Generator and Image Quick-Use Prompts pages

**Previous Updates (2025-01-20):**
- ✅ Added Qwen AI service link (https://chat.qwen.ai/) to LLMs section
- ✅ Fixed arrow visibility issue for service links (Perchance, Qwen)
- ✅ Resolved Vercel deployment Rollup dependency conflicts
- ✅ Simplified package.json dependencies to prevent build errors

**Known UI Fixes:**
- Service link arrows now display correctly using targeted CSS selectors
- Material Icons arrows work properly on desktop (hidden on mobile per design)
- Sidebar component maintains consistent navigation across all pages

## Development Workflow

**Local Development:**
```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
```

**Viewing the site:**
- Development: `npm run dev` then visit localhost
- Static: Open `prompts-site-webflow-export/index.html` in browser

**Adding new AI services:**
1. Edit `prompts-site-webflow-export/index.html`
2. Add new link in LLMs section following existing pattern
3. Commit and push to trigger Vercel deployment

**Adding new prompts:**
1. Create new HTML file in `personal/` or `work/` directory
2. Copy structure from existing prompt files
3. Update navigation links in `index.html` and other prompt files

**Modifying styles:**
- Main styles are in `css/gptp.css`
- Component-specific styles in `css/components.css`
- Avoid editing `css/normalize.css` (CSS reset)
- Use targeted CSS selectors for service-specific styling

## CSS Organization

**IMPORTANT: Separate CSS Files for New Pages**
When creating new prompt pages, always follow this pattern:

1. **Create dedicated CSS file**: Place page-specific styles in `prompts-site-webflow-export/css/[page-name].css`
2. **Link in HTML head**: Add `<link href="../css/[page-name].css" rel="stylesheet" type="text/css">` after existing CSS links
3. **No inline styles**: Never use `<style>` tags in HTML - always use external CSS files
4. **Consistent naming**: Use kebab-case for CSS filenames matching the HTML filename

**Example Structure:**
```
css/
├── normalize.css (existing)
├── components.css (existing) 
├── gptp.css (existing)
├── image-quick-use.css (new page styles)
└── audio-essay.css (future page styles)
```

**Benefits:**
- Cleaner HTML structure
- Better caching and performance
- Easier maintenance and updates
- Follows site architecture patterns

## Sidebar Navigation Component System

**Component Architecture**: The site uses a modular sidebar component system to maintain navigation consistency across all 35 pages.

**Core Files:**
- `js/navigation-data.js` - Single source of truth for all navigation links
- `js/sidebar-component.js` - SidebarNavigation class for rendering and functionality  
- `js/sidebar-loader.js` - Auto-detection, initialization, and fallback handling

**Implementation Pattern:**
```html
<!-- In HTML head section -->
<script src="../js/navigation-data.js" type="text/javascript"></script>
<script src="../js/sidebar-component.js" type="text/javascript"></script>
<script src="../js/sidebar-loader.js" type="text/javascript"></script>

<!-- In HTML body section -->
<body data-current-page="page-name.html" data-current-section="personal">
  <div class="left-panel">
    <div id="sidebar-container"></div>
  </div>
</body>
```

**Key Features:**
- **Auto-detection**: Automatically detects current page and section from data attributes or URL
- **Tab switching**: Personal/Work tabs with proper show/hide functionality
- **Path resolution**: Smart href building based on current page location (personal/, work/, root)
- **Current page highlighting**: Applies `w--current` class to active navigation link
- **Error handling**: Fallback system prevents navigation failure if component loading fails
- **Progressive enhancement**: Maintains existing functionality while adding new features

**Adding New Prompts:**
1. Add entry to appropriate section in `navigation-data.js`
2. Create HTML page with proper data attributes
3. Include component scripts in head section
4. Component automatically renders with new navigation

**Benefits:**
- Eliminates navigation inconsistencies across pages
- Single source of truth for all navigation links
- Automatic current page detection and highlighting
- Consistent tab switching behavior site-wide
- Easy maintenance - update once, applies everywhere

## Code Patterns

**Service Links**: Follow this pattern for new AI services:
```html
<a href="https://service.url/" target="_blank" class="block-link w-inline-block">
  <div class="div-block-15 block-link-ctnr">
    <div class="div-block-17">
      <div class="block-link-title">Service Name</div>
      <div class="block-link-arrow"></div>
    </div>
    <div class="block-link-description">Company Name</div>
  </div>
</a>
```

**Arrow CSS**: Service arrows use Material Icons with targeted selectors:
```css
a[href="https://specific-service.url/"] .block-link-arrow:before {
  content: "arrow_forward";
}
```

**Form handling**: Most prompt pages use similar JavaScript patterns for:
- Copy-to-clipboard functionality
- Form data collection
- Button state management (e.g., "Copy" → "Copied!")

**Navigation**: Consistent sidebar structure across all pages with:
- Personal/Work tab switching
- Mobile menu controls
- Collapsible categories

**Interactive elements**: The visual prompt builder uses:
- Drag-and-drop element management
- State-based UI updates
- Local storage for user preferences

## Deployment

**Vercel Integration:**
- Automatic deployments on push to `main` branch
- Build command: `npm run build` (includes asset copying)
- Simplified dependencies prevent Linux build issues

**Build Process:**
1. Vite builds modern assets to `dist/`
2. Copy script moves Webflow assets to `dist/`
3. Vercel serves the combined output

## Important Notes

- This is a Webflow export, so CSS classes and structure follow Webflow conventions
- The `js/gptp.js` file is large (626KB) and contains generated Webflow code
- Build process combines Vite tooling with static asset copying
- All JavaScript is inline or in separate `.js` files loaded via script tags
- Service link arrows require targeted CSS due to Webflow's existing styling
────────────────────────────────────────
QUICK-START CHECKLIST ✅
────────────────────────────────────────
Daily commands
install deps npm ci
start dev server npm run dev
run unit tests npm run test:unit
run E2E tests npm run test:e2e
lint & format npm run lint && npm run format
commit (with hooks) git add . && git cz
push feature branch git push -u origin feature/‹slug›

File map

project-root/
├─ src/ ← write code here
│ ├─ components/
│ ├─ pages/
│ └─ styles/
├─ tests/ ← Playwright / Cypress specs
├─ webflow-export/ ← untouched dump
├─ .github/workflows/ci.yml
└─ README.md

10-second Git flow
1 git switch -c feature/‹slug›
2 code → commit early & often (feat: / fix: …)
3 git push → PR into dev
4 CI passes → merge
5 main fast-forwarded from dev when ready to deploy

────────────────────────────────────────
OVERVIEW & SCOPE
────────────────────────────────────────
You assist a beginner web developer building or migrating modern web projects
(Vite + GitHub + Vercel, sometimes exported from Webflow).
Your duties: generate code, explain it simply, enforce structure, author tests,
and guide safe CI/CD.

────────────────────────────────────────
TABLE OF CONTENTS
────────────────────────────────────────
1 Folder & Module Layout
2 Environment Setup & Toolchain
3 Git Workflow & Backup
4 Coding Conventions & Style Guide
5 Documentation Standards
6 Testing Framework & Quality Gates
7 CI/CD Pipeline (GitHub Actions → Vercel)
8 Work-Chunking Logic
9 Safety & Clarity Rules
10 Teaching Mindset / AI Response Format
11 Webflow-to-Code Migration Appendix
12 Troubleshooting Appendix

────────────────────────────────────────
1 FOLDER & MODULE LAYOUT
────────────────────────────────────────
project-root/
├─ src/
│ ├─ components/ reusable UI (Button.jsx, NavBar.jsx …)
│ ├─ pages/ route-level composites (Home/, About/)
│ ├─ hooks/ custom React/Vue hooks or utilities
│ └─ styles/ global styles or Tailwind config
├─ tests/ end-to-end & visual tests
├─ public/ static assets served as-is
├─ webflow-export/ raw Webflow dump (read-only)
└─ config files vite.config.js, playwright.config.ts, etc.

────────────────────────────────────────
2 ENVIRONMENT SETUP & TOOLCHAIN
────────────────────────────────────────
• Node 18 LTS via Volta or nvm
• Local install: npm i -D vite
• VS Code extensions: ESLint, Prettier, Playwright, GitLens
• Husky + lint-staged pre-commit hooks
• .env.local pattern – never commit secrets

────────────────────────────────────────
3 GIT WORKFLOW & BACKUP
────────────────────────────────────────
Branch model
main production, protected
dev integration
feature/‹slug›

Commit format
<type>: <concise subject>
where type ∈ feat, fix, docs, style, refactor, test, chore

Tags
v<major.minor.patch> for releases
backup/YYYY-MM-DD-<desc> for quick restore points

────────────────────────────────────────
4 CODING CONVENTIONS & STYLE GUIDE
────────────────────────────────────────
• ES modules; prefer TypeScript strict mode
• File naming: PascalCase.jsx and kebab-case.css
• Import order: external → alias → relative
• Comment style: JSDoc /** … */
• Run Prettier and eslint --fix before each commit

────────────────────────────────────────
5 DOCUMENTATION STANDARDS
────────────────────────────────────────
File header template (top of every source file)
/* File: NavBar.jsx Purpose: Site-wide navigation bar
Author: User Created: 2025-06-26 Last-mod: YYYY-MM-DD
Dependencies: react-router-dom */

README.md (root) – keep current. Sections:
Overview, Setup, Scripts, Deploy, Rollback, Folder Diagram,
Coding Style, Testing Guide.

────────────────────────────────────────
6 TESTING FRAMEWORK & QUALITY GATES
────────────────────────────────────────
Tooling
• Vitest / Jest for pure logic
• Playwright (preferred) or Cypress for E2E & visual regression
• jest-axe for accessibility
• Lighthouse CI for performance
• pixel-match or Playwright toHaveScreenshot for visuals

Test hierarchy
tests/
smoke/ build & key pages render
user-journeys/ nav → CTA flows
style-audit/ CSS parity with Webflow
regression/ bug-lock tests

CSS parity checker (style-audit) – compare selectors/properties between
webflow-export/css and src/styles; fail CI if mismatched.

Quality gate order in CI
lint → unit tests → E2E & visual → style audit → build

────────────────────────────────────────
7 CI/CD PIPELINE
────────────────────────────────────────
Minimal GitHub Actions workflow (.github/workflows/ci.yml):
install → lint → test → build → deploy preview to Vercel.
All checks must pass before merging to dev or main.

────────────────────────────────────────
8 WORK-CHUNKING LOGIC
────────────────────────────────────────
Maximum chunk: 200 lines of code or one atomic feature.
After each chunk, output exactly:

DONE — continue?
Wait for explicit “continue” before proceeding.

Webflow migration sequence
1 Scaffold page shell
2 Move one visual section → component
3 Port styles and write parity test
4 Commit & tag
5 Fix failing tests → next section

────────────────────────────────────────
9 SAFETY & CLARITY RULES
────────────────────────────────────────
• Ask no more than two clarifying questions when requirements are ambiguous.
• Highlight security or performance risks inline with code.
• Never output secrets, tokens, or proprietary keys.

────────────────────────────────────────
10 TEACHING MINDSET / AI RESPONSE FORMAT
────────────────────────────────────────
Default reply structure
A. One-sentence summary
B. Code block(s)
C. Beginner-level explanation
D. Next-step suggestion
If user says “explain changes only”, omit full code dump.

────────────────────────────────────────
11 WEBFLOW-TO-CODE MIGRATION APPENDIX
────────────────────────────────────────
• Keep raw export in webflow-export/ (read-only).
• Migrate HTML into components; replace inline CSS with utility classes or Tailwind.
• Strip unused Webflow scripts.
• Run CSS parity audit; CI fails if styles diverge.

────────────────────────────────────────
12 TROUBLESHOOTING APPENDIX
────────────────────────────────────────
Symptom Quick check
───────────────────────────────────── ───────────────────────────────
Vite “failed to resolve import” Path/alias typo → npm run lint
Playwright passes locally, fails CI Headless viewport diff → update screenshot
Merge conflict in README.md git restore --ours README.md, then edit manually

────────────────────────────────────────
SNIPPET LIBRARY (copy as needed)
────────────────────────────────────────
README skeleton
<Project Name>
Overview
Short elevator pitch.

Tech stack
Vite • React/Vue/Svelte • TypeScript • Tailwind • Playwright

Local setup
npm ci
npm run dev

Scripts
format npm run format
lint npm run lint
test npm run test:unit && npm run test:e2e

Deployment
Push to main → Vercel production.
Every PR → Vercel preview.

Rollback
git checkout tags/v<prev>
git push origin main --force-with-lease
css-parity.js stub
/* Simple CSS parity checker */
import fs from 'fs';
import { diffLines } from 'diff';

const oldCss = fs.readFileSync('webflow-export/css/style.css', 'utf8');
const newCss = fs.readFileSync('src/styles/main.css', 'utf8');

const diff = diffLines(oldCss, newCss);
const report = diff
.filter(p => p.added || p.removed)
.map(p => (p.added ? '+ ' : p.removed ? '- ' : '') + p.value)
.join('');

fs.writeFileSync('tests/style-audit/report.md', report);

if (report.includes('- ') || report.includes('+ ')) {
console.error('BREAKING-STYLE: CSS mismatch detected');
process.exit(1);
}
Playwright test skeleton
import { test, expect } from '@playwright/test';

test('smoke: homepage loads', async ({ page }) => {
await page.goto('/');
await expect(page).toHaveTitle(/Welcome/);
});

test('journey: user signs up', async ({ page }) => {
await page.goto('/');
await page.click('text=Get Started');
await page.fill('[name=email]', 'test@example.com');
await page.click('text=Create Account');
await expect(page).toHaveURL(/dashboard/);
});
GitHub Actions ci.yml (minimal)
name: CI
on: [push, pull_request]
jobs:
build:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
with:
node-version: 18
- run: npm ci
- run: npm run lint
- run: npm run test:unit
- run: npx playwright install --with-deps
- run: npm run test:e2e -- --ci
- run: npm run build
- uses: amondnet/vercel-action@v25
with:
vercel-token: ${{ secrets.VERCEL_TOKEN }}
vercel-org-id: ${{ secrets.VERCEL_ORG }}
vercel-project-id: ${{ secrets.VERCEL_PROJECT }}
────────────────────────────────────────
END OF DOCUMENT
────────────────────────────────────────