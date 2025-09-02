/**
 * Refined Universal Prompt Head Component
 * Pixel-perfect replica of existing static implementation
 * Non-destructive integration with approval system
 */

class RefinedPromptHeadComponent {
  constructor(options = {}) {
    this.mode = options.mode || 'test'; // 'test', 'replace', 'comparison'
    this.preserveExisting = options.preserveExisting !== false;
    this.enableComparison = options.enableComparison !== false;
    this.enableTesting = options.enableTesting !== false;
    
    // Path detection
    this.pathPrefix = this.detectPathPrefix();
    
    // Service configuration (exact match to existing)
    this.services = {
      primary: [
        {
          name: 'ChatGPT',
          url: 'https://chat.openai.com/?model=gpt-4-code-interpreter',
          icon: `${this.pathPrefix}images/GPT-Icon.svg`,
          iconAlt: 'ChatGPT Logo',
          className: 'universal-heading-icon gpt'
        },
        {
          name: 'Claude',
          url: 'https://claude.ai/',
          icon: `${this.pathPrefix}images/claude-logo.svg`,
          iconAlt: 'Claude Logo', 
          className: 'universal-heading-icon gpt'
        }
      ],
      dropdown: [
        { name: 'Claude', url: 'https://claude.ai/chats' },
        { name: 'ChatGPT', url: 'https://chat.openai.com/?model=gpt-4-code-interpreter' },
        { name: 'Perplexity', url: 'https://www.perplexity.ai' },
        { name: 'Copilot', url: 'https://copilot.microsoft.com/' },
        { name: 'Gemini', url: 'https://bard.google.com/' },
        { name: 'Midjourney', url: 'https://www.midjourney.com/imagine' }
      ]
    };
    
    // State tracking
    this.isInitialized = false;
    this.originalElement = null;
    this.componentElement = null;
  }

  /**
   * Detect the correct path prefix based on current page location
   */
  detectPathPrefix() {
    const path = window.location.pathname;
    
    // Special handling for test files in root directory
    if (path.includes('dropdown-interaction-test.html') || path.includes('component-testing.html')) {
      return 'prompts-site-webflow-export/';
    }
    
    if (path.includes('/work/') || path.includes('/personal/')) {
      return '../';
    }
    return './';
  }

  /**
   * Generate exact replica of existing HTML structure
   */
  generateHTML() {
    return `
      <div class="universal-prompt-head">
        ${this.generateLogoSection()}
        ${this.generateSidebarToggle()}
        ${this.generateCopiedFeedback()}
        ${this.generateMobileMenuIcon()}
        ${this.generateServicesSection()}
      </div>
    `;
  }

  /**
   * Generate logo section (exact match)
   */
  generateLogoSection() {
    return `
      <div class="logo-lockup-ctnr">
        <div class="w-layout-hflex logo-image-container">
          <a href="${this.pathPrefix}index.html" class="home-link w-inline-block">
            <img src="${this.pathPrefix}images/Fat-Logo.svg" loading="lazy" alt="" class="logo-image">
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Generate sidebar toggle (exact match)
   */
  generateSidebarToggle() {
    return `
      <div class="sidebar-toggle">
        <div class="sb-toggle-state _1">
          <div>Show prompts list</div>
        </div>
        <div class="sb-toggle-state _2">
          <div>Fullscreen</div>
        </div>
      </div>
    `;
  }

  /**
   * Generate copied feedback section (exact match)
   */
  generateCopiedFeedback() {
    return `
      <div class="copied">
        <div class="copied-content">
          <div>Copied!</div>
        </div>
        <div data-w-id="924aa154-11da-880c-f3f5-8b080d169af3" 
             data-animation-type="lottie" 
             data-src="${this.pathPrefix}documents/Animation---1719531472609.json" 
             data-loop="0" 
             data-direction="1" 
             data-autoplay="1" 
             data-is-ix2-target="0" 
             data-renderer="svg" 
             data-default-duration="3" 
             data-duration="2"></div>
      </div>
    `;
  }

  /**
   * Generate mobile menu icon (exact match)
   */
  generateMobileMenuIcon() {
    return `<div class="mobile-menu-icon"></div>`;
  }

  /**
   * Generate services dropdown section (exact match)
   */
  generateServicesSection() {
    return `
      <div class="services-dropdown-trigger">
        ${this.generatePrimaryServices()}
        ${this.generateServicesDropdown()}
      </div>
    `;
  }

  /**
   * Generate primary service icons (exact match)
   */
  generatePrimaryServices() {
    return this.services.primary.map(service => `
      <a href="${service.url}" target="_blank" class="${service.className} w-inline-block">
        <div class="tooltip">
          <div>${service.name}</div>
        </div>
        <div class="icon home">
          <img src="${service.icon}" loading="eager" alt="${service.iconAlt}" class="ai-icon">
        </div>
      </a>
    `).join('');
  }

  /**
   * Generate services dropdown menu (exact match)
   */
  generateServicesDropdown() {
    const dropdownLinks = this.services.dropdown.map(service => `
      <a href="${service.url}" target="_blank" class="block-link w-inline-block">
        <div class="div-block-15 block-link-ctnr">
          <div class="div-block-17">
            <div class="block-link-title">${service.name}</div>
            <div class="block-link-arrow"></div>
          </div>
        </div>
      </a>
    `).join('');

    return `
      <div class="services-dropdown">
        <div class="icon dropdown-trigger"></div>
        <div class="services-popup-menu">
          <div class="ai-menu-heading">Services</div>
          <div class="link-list">
            ${dropdownLinks}
          </div>
          <div data-is-ix2-target="1" 
               class="confetti-animation" 
               data-w-id="a9d48a9e-e0bf-3c36-12a0-da43dae50371" 
               data-animation-type="lottie" 
               data-src="${this.pathPrefix}documents/Animation---1719531472609.json" 
               data-loop="0" 
               data-direction="1" 
               data-autoplay="0" 
               data-renderer="svg" 
               data-default-duration="3" 
               data-duration="0" 
               data-ix2-initial-state="1"></div>
        </div>
      </div>
    `;
  }

  /**
   * Initialize component in specified mode
   */
  initialize(targetElement) {
    if (this.isInitialized) {
      console.warn('RefinedPromptHeadComponent: Already initialized');
      return;
    }

    this.originalElement = targetElement;
    
    switch (this.mode) {
      case 'test':
        this.initializeTestMode();
        break;
      case 'replace':
        this.initializeReplaceMode();
        break;
      case 'comparison':
        this.initializeComparisonMode();
        break;
      case 'replace-safe':
        this.initializeSafeReplaceMode();
        break;
      default:
        console.error('RefinedPromptHeadComponent: Invalid mode');
        return;
    }

    this.attachEventListeners();
    this.initializeWebflowInteractions();
    this.isInitialized = true;
  }

  /**
   * Test mode: Render component hidden for testing
   */
  initializeTestMode() {
    // Create component element
    this.componentElement = document.createElement('div');
    this.componentElement.className = 'prompt-head-component-test';
    this.componentElement.style.cssText = 'display: none; position: absolute; z-index: 9999;';
    this.componentElement.innerHTML = this.generateHTML();

    // Insert after original element
    this.originalElement.parentNode.insertBefore(this.componentElement, this.originalElement.nextSibling);
    
    // Add testing controls if enabled
    if (this.enableTesting) {
      this.addTestingControls();
    }

    console.log('RefinedPromptHeadComponent: Initialized in test mode');
  }

  /**
   * Replace mode: Replace original with component
   */
  initializeReplaceMode() {
    // Store original HTML for rollback
    this.originalHTML = this.originalElement.outerHTML;
    
    // Replace content
    this.originalElement.innerHTML = this.generateHTML().match(/<div class="universal-prompt-head">(.*?)<\/div>/s)[1];
    this.componentElement = this.originalElement;

    console.log('RefinedPromptHeadComponent: Initialized in replace mode');
  }

  /**
   * Safe replace mode: Replace with backup and rollback capabilities
   */
  initializeSafeReplaceMode() {
    // Wait for layout to stabilize before replacing component
    const initDelay = this.detectRefreshType();
    
    setTimeout(() => {
      // Load component testing CSS for safety UI
      this.loadComponentCSS();

      // Backup original content
      this.originalHTML = this.originalElement.innerHTML;
      this.originalClasses = this.originalElement.className;

      // Add safety indicator and controls
      this.addSafetyControls();

      // Replace content with component
      this.originalElement.innerHTML = this.generateHTML();
      this.originalElement.classList.add('component-active-safe');

      // Force layout recalculation to prevent sidebar issues
      this.forceLayoutRecalculation();

      // Monitor for layout issues
      this.startLayoutMonitoring();

      console.log('RefinedPromptHeadComponent: Initialized in safe replace mode');
      console.log('🛡️ Backup created - original content preserved');
    }, initDelay);
  }

  /**
   * Detect refresh type and return appropriate delay
   */
  detectRefreshType() {
    // Check navigation timing to detect hard refresh vs regular refresh
    if (performance.navigation) {
      const navigationType = performance.navigation.type;
      if (navigationType === performance.navigation.TYPE_RELOAD) {
        console.log('🔄 Regular refresh detected - using longer delay');
        return 200; // Longer delay for regular refresh
      }
    }
    
    // Check if page was loaded from cache (regular refresh indicator)
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      const entry = entries[0];
      if (entry.transferSize === 0 || entry.transferSize < entry.encodedBodySize) {
        console.log('📦 Cached resources detected - using longer delay');
        return 200;
      }
    }
    
    console.log('🆕 Fresh load detected - using minimal delay');
    return 50; // Shorter delay for hard refresh/first load
  }

  /**
   * Force layout recalculation to fix sidebar positioning
   */
  forceLayoutRecalculation() {
    // Method 1: Trigger reflow by reading layout properties
    const body = document.body;
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    // Force browser to recalculate layout by reading computed styles
    if (leftPanel) leftPanel.offsetHeight;
    if (rightPanel) rightPanel.offsetHeight;
    body.offsetHeight;
    
    // Method 2: Temporarily trigger a minimal window resize event
    setTimeout(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      
      // Trigger resize event to force layout recalculation
      window.dispatchEvent(new Event('resize'));
      
      // Also trigger on body to ensure all listeners catch it
      document.body.dispatchEvent(new Event('resize', { bubbles: true }));
      
      console.log('🔄 Layout recalculation triggered');
    }, 50);
  }

  /**
   * Add safety controls for easy rollback
   */
  addSafetyControls() {
    // Create safety panel
    const safetyPanel = document.createElement('div');
    safetyPanel.id = 'component-safety-panel';
    safetyPanel.innerHTML = `
      <div style="position: fixed; top: 10px; right: 10px; background: #17a2b8; color: white; padding: 12px 20px; border-radius: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10001; font-family: monospace; font-size: 14px; display: flex; align-items: center; gap: 12px;">
        <span>🛡️ COMPONENT ACTIVE</span>
        <button onclick="window.PromptHeadComponent?.rollback()" style="background: #dc3545; color: white; border: none; padding: 6px 12px; border-radius: 15px; cursor: pointer; font-size: 12px;">↩️ ROLLBACK</button>
        <button onclick="document.getElementById('component-safety-panel')?.remove()" style="background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 15px; cursor: pointer; font-size: 12px;">✕</button>
      </div>
    `;
    
    document.body.appendChild(safetyPanel);

    // Make component globally accessible for rollback
    window.PromptHeadComponent = this;
  }

  /**
   * Monitor layout for issues and auto-rollback if detected
   */
  startLayoutMonitoring() {
    // Check layout health after component loads
    setTimeout(() => {
      const layoutIssues = this.detectLayoutIssues();
      if (layoutIssues.length > 0) {
        console.warn('🚨 Layout issues detected:', layoutIssues);
        console.log('🔄 Auto-rollback triggered for safety');
        this.rollback(layoutIssues);
      }
    }, 1000);
  }

  /**
   * Detect common layout issues
   */
  detectLayoutIssues() {
    const issues = [];
    
    // Check if sidebar is covering page (common issue we found)
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    if (leftPanel && rightPanel) {
      const leftRect = leftPanel.getBoundingClientRect();
      const rightRect = rightPanel.getBoundingClientRect();
      
      // If left panel is covering right panel
      if (leftRect.width > window.innerWidth * 0.7) {
        issues.push('Sidebar covering page content');
      }
      
      // If right panel has no width
      if (rightRect.width < 100) {
        issues.push('Main content area collapsed');
      }
    }
    
    // Check if component has proper dimensions
    const componentRect = this.originalElement.getBoundingClientRect();
    if (componentRect.height < 50) {
      issues.push('Component has insufficient height');
    }
    
    // Check scroll functionality
    const bodyHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    if (bodyHeight > windowHeight && window.scrollY === 0) {
      // Try to scroll and see if it works
      window.scrollTo(0, 10);
      setTimeout(() => {
        if (window.scrollY < 5) {
          issues.push('Scroll functionality may be broken');
        }
        window.scrollTo(0, 0); // Reset
      }, 100);
    }
    
    return issues;
  }

  /**
   * Rollback to original implementation
   */
  rollback(issues = []) {
    if (!this.originalHTML) {
      console.error('No backup available for rollback');
      return;
    }

    // Restore original content
    this.originalElement.innerHTML = this.originalHTML;
    this.originalElement.className = this.originalClasses;

    // Remove safety panel
    const safetyPanel = document.getElementById('component-safety-panel');
    if (safetyPanel) safetyPanel.remove();

    // Clean up global reference
    if (window.PromptHeadComponent === this) {
      delete window.PromptHeadComponent;
    }

    console.log('✅ Rollback completed - original implementation restored');
    
    if (issues.length > 0) {
      console.log('🔍 Issues that triggered rollback:', issues);
      
      // Show user-friendly notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div style="position: fixed; top: 50px; right: 10px; background: #dc3545; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 10002; font-family: system-ui; max-width: 300px; font-size: 14px;">
          <strong>🚨 Auto-Rollback Triggered</strong><br>
          Layout issues detected:<br>
          ${issues.map(issue => `• ${issue}`).join('<br>')}
          <button onclick="this.parentElement.remove()" style="float: right; background: none; border: 1px solid white; color: white; padding: 4px 8px; border-radius: 4px; margin-top: 8px; cursor: pointer;">OK</button>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Auto-remove notification after 10 seconds
      setTimeout(() => notification.remove(), 10000);
    }
  }

  /**
   * Load component testing CSS file
   */
  loadComponentCSS() {
    if (document.getElementById('component-testing-css')) return; // Already loaded
    
    const link = document.createElement('link');
    link.id = 'component-testing-css';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = this.detectPathPrefix() + 'css/component-testing.css';
    document.head.appendChild(link);
  }

  /**
   * Comparison mode: Show both side by side
   */
  initializeComparisonMode() {
    // Load component testing CSS
    this.loadComponentCSS();

    // Create wrapper for comparison
    const wrapper = document.createElement('div');
    wrapper.className = 'component-comparison-wrapper';

    // Create component element
    this.componentElement = document.createElement('div');
    this.componentElement.className = 'prompt-head-component-comparison';
    this.componentElement.innerHTML = this.generateHTML();

    // Create enhanced labels with CSS classes
    const staticLabel = document.createElement('div');
    staticLabel.innerHTML = '📄 STATIC VERSION (Original)';
    staticLabel.className = 'component-label component-label--static';
    
    const componentLabel = document.createElement('div');
    componentLabel.innerHTML = '⚡ NEW COMPONENT (Generated)';
    componentLabel.className = 'component-label component-label--component';

    // Add subtle animation to component version
    const componentIndicator = document.createElement('div');
    componentIndicator.innerHTML = '✨ COMPONENT ACTIVE';
    componentIndicator.className = 'component-indicator';

    // Set up comparison - no inline styles needed, CSS handles it
    this.originalElement.appendChild(staticLabel);
    this.componentElement.appendChild(componentLabel);
    this.componentElement.appendChild(componentIndicator);

    // Add both to wrapper
    wrapper.appendChild(this.originalElement.cloneNode(true));
    wrapper.appendChild(this.componentElement);

    // Insert wrapper
    this.originalElement.parentNode.insertBefore(wrapper, this.originalElement);
    this.originalElement.style.display = 'none';

    // Initialize Webflow interactions for component
    this.initializeWebflowInteractions();

    console.log('🎯 RefinedPromptHeadComponent: Comparison mode active - look for visual indicators!');
  }

  /**
   * Add testing controls interface
   */
  addTestingControls() {
    const controls = document.createElement('div');
    controls.className = 'component-testing-controls';
    controls.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: white;
      border: 2px solid #007bff;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;

    controls.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">Component Testing</div>
      <button onclick="window.refinedPromptHead.showVersion('static')" style="margin-right: 5px; padding: 5px 10px;">Show Static</button>
      <button onclick="window.refinedPromptHead.showVersion('component')" style="margin-right: 5px; padding: 5px 10px;">Show Component</button>
      <button onclick="window.refinedPromptHead.showVersion('comparison')" style="margin-right: 5px; padding: 5px 10px;">Compare</button>
      <br><br>
      <button onclick="window.refinedPromptHead.approve()" style="background: green; color: white; padding: 8px 12px; border: none; border-radius: 4px; margin-right: 5px;">✅ Approve</button>
      <button onclick="window.refinedPromptHead.reject()" style="background: red; color: white; padding: 8px 12px; border: none; border-radius: 4px;">❌ Reject</button>
    `;

    document.body.appendChild(controls);

    // Expose methods globally for testing
    window.refinedPromptHead = {
      showVersion: (version) => this.showVersion(version),
      approve: () => this.approveComponent(),
      reject: () => this.rejectComponent()
    };
  }

  /**
   * Show different versions for comparison
   */
  showVersion(version) {
    switch (version) {
      case 'static':
        this.originalElement.style.display = 'flex';
        if (this.componentElement) this.componentElement.style.display = 'none';
        break;
      case 'component':
        this.originalElement.style.display = 'none';
        if (this.componentElement) this.componentElement.style.display = 'flex';
        break;
      case 'comparison':
        if (this.mode !== 'comparison') {
          this.mode = 'comparison';
          this.initializeComparisonMode();
        }
        break;
    }
  }

  /**
   * Approve component and switch to replace mode
   */
  approveComponent() {
    if (confirm('Are you sure you want to replace the static version with the component?')) {
      this.mode = 'replace';
      this.initializeReplaceMode();
      
      // Remove testing controls
      const controls = document.querySelector('.component-testing-controls');
      if (controls) controls.remove();
      
      alert('✅ Component approved and activated!');
    }
  }

  /**
   * Reject component and clean up
   */
  rejectComponent() {
    if (confirm('Reject the component and keep static version?')) {
      this.cleanup();
      alert('❌ Component rejected. Static version preserved.');
    }
  }

  /**
   * Attach event listeners (preserve existing functionality)
   */
  attachEventListeners() {
    if (!this.componentElement) return;

    // Sidebar toggle functionality
    const sidebarToggle = this.componentElement.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.handleSidebarToggle.bind(this));
    }

    // Dropdown functionality - fallback if Webflow doesn't handle it
    this.setupDropdownFunctionality();
    
    // Ensure dropdown starts with correct initial state
    this.ensureDropdownInitialState();
  }

  /**
   * Setup dropdown functionality with fallback approach
   */
  setupDropdownFunctionality() {
    const dropdown = this.componentElement.querySelector('.services-dropdown');
    const menu = this.componentElement.querySelector('.services-popup-menu');
    
    if (!dropdown || !menu) return;

    // First try to let Webflow handle it by waiting a bit
    setTimeout(() => {
      // Check if Webflow is handling the dropdown
      if (typeof Webflow !== 'undefined' && Webflow.require) {
        console.log('RefinedPromptHeadComponent: Webflow available, should handle dropdown');
        return; // Let Webflow handle it
      }

      // Fallback: Add our own dropdown handler
      console.log('RefinedPromptHeadComponent: Adding fallback dropdown handler');
      dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown();
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          this.hideDropdown();
        }
      });
    }, 200);
  }

  /**
   * Toggle dropdown menu visibility
   */
  toggleDropdown() {
    const menu = this.componentElement.querySelector('.services-popup-menu');
    if (!menu) return;

    const isVisible = menu.style.display === 'flex';
    if (isVisible) {
      this.hideDropdown();
    } else {
      this.showDropdown();
    }
  }

  /**
   * Show dropdown menu
   */
  showDropdown() {
    const menu = this.componentElement.querySelector('.services-popup-menu');
    if (!menu) return;

    menu.style.display = 'flex';
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    menu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Animate in
    requestAnimationFrame(() => {
      menu.style.opacity = '1';
      menu.style.transform = 'translateY(0)';
    });
  }

  /**
   * Hide dropdown menu
   */
  hideDropdown() {
    const menu = this.componentElement.querySelector('.services-popup-menu');
    if (!menu) return;

    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      menu.style.display = 'none';
    }, 300);
  }

  /**
   * Ensure dropdown starts with proper initial state for Webflow
   */
  ensureDropdownInitialState() {
    const dropdownMenu = this.componentElement.querySelector('.services-popup-menu');
    if (dropdownMenu) {
      // Ensure dropdown starts hidden (Webflow will control visibility)
      dropdownMenu.style.display = 'none';
      
      // Ensure all Webflow interaction attributes are preserved
      // (These are already included in the generated HTML)
    }
  }

  /**
   * Handle sidebar toggle (match existing behavior)
   */
  handleSidebarToggle() {
    // Integrate with existing sidebar system
    const sidebar = document.querySelector('.left-panel');
    if (sidebar) {
      sidebar.classList.toggle('visible');
    }
  }

  /**
   * Handle dropdown toggle - REMOVED
   * Webflow handles dropdown interactions automatically via its IX2 system
   * Our component just needs to provide the correct HTML structure with data attributes
   */

  /**
   * Initialize Webflow interactions for new content
   */
  initializeWebflowInteractions() {
    // Give a small delay to ensure DOM is ready
    setTimeout(() => {
      if (typeof Webflow !== 'undefined') {
        try {
          // Re-initialize Webflow interactions for the new component content
          console.log('RefinedPromptHeadComponent: Re-initializing Webflow interactions');
          
          // Destroy existing interactions
          Webflow.destroy();
          
          // Re-initialize
          Webflow.ready();
          
          // Re-initialize IX2 interactions (for animations and dropdowns)
          if (Webflow.require && Webflow.require('ix2')) {
            Webflow.require('ix2').init();
            console.log('RefinedPromptHeadComponent: Webflow IX2 re-initialized successfully');
          }
          
        } catch (error) {
          console.warn('RefinedPromptHeadComponent: Webflow re-initialization failed:', error.message);
          console.log('RefinedPromptHeadComponent: Dropdown may need to be clicked twice or may not animate');
        }
      } else {
        console.warn('RefinedPromptHeadComponent: Webflow not found - dropdown animations may not work');
      }
    }, 100);
  }

  /**
   * Clean up component and restore original
   */
  cleanup() {
    if (this.componentElement && this.componentElement !== this.originalElement) {
      this.componentElement.remove();
    }
    
    if (this.originalElement) {
      this.originalElement.style.display = '';
    }

    const controls = document.querySelector('.component-testing-controls');
    if (controls) controls.remove();

    const wrapper = document.querySelector('.component-comparison-wrapper');
    if (wrapper) wrapper.remove();

    if (window.refinedPromptHead) {
      delete window.refinedPromptHead;
    }

    this.isInitialized = false;
  }

  /**
   * Rollback to original implementation
   */
  rollback() {
    if (this.originalHTML && this.mode === 'replace') {
      this.originalElement.outerHTML = this.originalHTML;
    }
    this.cleanup();
  }
}

// Auto-initialization (only in test mode by default for safety)
document.addEventListener('DOMContentLoaded', function() {
  // Only auto-initialize if URL parameter is present
  const urlParams = new URLSearchParams(window.location.search);
  const testMode = urlParams.get('test-component');
  
  if (testMode) {
    const targetElement = document.querySelector('.universal-prompt-head');
    if (targetElement) {
      const options = {
        mode: testMode === 'replace' ? 'replace' : testMode === 'comparison' ? 'comparison' : 'test',
        enableTesting: true
      };
      
      const component = new RefinedPromptHeadComponent(options);
      component.initialize(targetElement);
    }
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RefinedPromptHeadComponent;
}