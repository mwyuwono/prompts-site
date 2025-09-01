# Universal Prompt Head Component Analysis

## Current Implementation Analysis

### 1. HTML Structure Documentation

#### Sample from work/assessments.html:
```html
<div class="universal-prompt-head">
  <div class="logo-lockup-ctnr">
    <div class="w-layout-hflex logo-image-container">
      <a href="../index.html" class="home-link w-inline-block">
        <img src="../images/Fat-Logo.svg" loading="lazy" alt="" class="logo-image">
      </a>
    </div>
  </div>
  <div class="sidebar-toggle">
    <div class="sb-toggle-state _1">
      <div>Show prompts list</div>
    </div>
    <div class="sb-toggle-state _2">
      <div>Fullscreen</div>
    </div>
  </div>
  <div class="copied">
    <div class="copied-content">
      <div>Copied!</div>
    </div>
    <div data-w-id="..." data-animation-type="lottie" ...></div>
  </div>
  <div class="mobile-menu-icon"></div>
  <div class="services-dropdown-trigger">
    <a href="https://chat.openai.com/..." class="universal-heading-icon gpt w-inline-block">
      <div class="tooltip"><div>ChatGPT</div></div>
      <div class="icon home">
        <img src="../images/GPT-Icon.svg" loading="eager" alt="ChatGPT Logo" class="ai-icon">
      </div>
    </a>
    <a href="https://claude.ai/" class="universal-heading-icon gpt w-inline-block">
      <div class="tooltip"><div>Claude</div></div>
      <div class="icon home">
        <img src="../images/claude-logo.svg" loading="eager" alt="Claude Logo" class="ai-icon">
      </div>
    </a>
    <div class="services-dropdown">
      <div class="icon dropdown-trigger"></div>
      <div class="services-popup-menu">
        <div class="ai-menu-heading">Services</div>
        <div class="link-list">
          <!-- Multiple service links -->
        </div>
        <div data-is-ix2-target="1" class="confetti-animation" ...></div>
      </div>
    </div>
  </div>
</div>
```

### 2. CSS Sources to Analyze

Based on previous findings, CSS rules are scattered across:
- `css/components/_layout.css` (main universal-prompt-head rules)
- `css/components/_features.css` 
- `css/hamburger-menu.css`
- `css/components/_navigation.css` (services dropdown, tooltips)
- Any responsive rules in media queries

### 3. Variations Analysis Needed

Need to check for differences between:
- Work directory pages vs Personal directory pages
- Different service configurations
- Mobile vs Desktop layouts
- Path variations (../ vs relative paths)

### 4. Interactive Elements to Preserve

- Sidebar toggle functionality
- Services dropdown menu behavior  
- Copy feedback animations
- Tooltip hover states
- Mobile menu integration
- Lottie animations (confetti, copied feedback)

### 5. Component Requirements

**Must Match Exactly:**
- Visual appearance (spacing, colors, typography)
- Interactive behaviors
- Responsive breakpoints
- Animation timing and effects
- Accessibility attributes
- Path resolution for different page locations

**Must Not Break:**
- Existing JavaScript functionality
- Webflow interactions  
- CSS cascade and specificity
- Page layout and positioning