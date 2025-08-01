# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Play a system sound whenever the user needs to take action
This attracts the users attention when needed. EVERY TIME the user is prompted to take action or confirm something, a system sound MUST be played. 

## Project Overview

This is a static website for organizing AI prompts, built as a Webflow export. The site features a collection of curated prompts for personal and work use cases, organized into categories like utilities, research, creativity, banking, and prototyping.

## Architecture

The project consists of a static HTML/CSS/JavaScript website with the following structure:

- **Main entry**: `prompts-site-webflow-export/index.html` - Landing page with links to AI services
- **Personal prompts**: `prompts-site-webflow-export/personal/` - Individual HTML pages for personal use prompts
- **Work prompts**: `prompts-site-webflow-export/work/` - Individual HTML pages for work-related prompts
- **Assets**: 
  - `css/` - Stylesheets (normalize.css, components.css, gptp.css)
  - `js/` - JavaScript files (gptp.js contains Webflow-generated code)
  - `images/` - Icons, logos, and visual assets
  - `documents/` - Animation files (Lottie JSON)

## Key Features

1. **Sidebar Navigation**: Toggle between personal and work prompt categories
2. **Interactive Prompt Builder**: Visual drag-and-drop interface for building Midjourney prompts (`personal/prompt-builder.html`)
3. **Copy-to-Clipboard**: Most prompts include functionality to copy content
4. **Responsive Design**: Mobile-friendly with collapsible menus
5. **Animation**: Lottie animations for feedback and visual enhancement

## Common Development Tasks

**Viewing the site locally:**
Open `prompts-site-webflow-export/index.html` in a web browser, or serve via a local HTTP server.

**Adding new prompts:**
1. Create new HTML file in `personal/` or `work/` directory
2. Copy structure from existing prompt files
3. Update navigation links in `index.html` and other prompt files

**Modifying styles:**
- Main styles are in `css/gptp.css`
- Component-specific styles in `css/components.css`
- Avoid editing `css/normalize.css` (CSS reset)

## Code Patterns

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

## Important Notes

- This is a Webflow export, so the CSS classes and structure follow Webflow conventions
- The `js/gptp.js` file is large (626KB) and contains generated Webflow code
- No build process or package management - pure static HTML/CSS/JS
- All JavaScript is inline or in separate `.js` files loaded via script tags
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