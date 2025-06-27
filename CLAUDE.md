# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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