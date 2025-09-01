/**
 * Universal Prompt Head Component Loader
 * Auto-detects and renders the prompt head component across all pages
 */

(function() {
  'use strict';

  class PromptHeadLoader {
    constructor() {
      this.targetSelector = '.universal-prompt-head';
      this.fallbackTargetSelector = '.right-panel';
      this.component = null;
      this.isInitialized = false;
    }

    /**
     * Initialize the prompt head component loader
     */
    init() {
      if (this.isInitialized) {
        console.log('PromptHeadLoader: Already initialized');
        return;
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.load.bind(this));
      } else {
        this.load();
      }

      this.isInitialized = true;
    }

    /**
     * Load and render the component
     */
    load() {
      try {
        // Check if PromptHeadComponent is available
        if (typeof PromptHeadComponent === 'undefined') {
          console.error('PromptHeadLoader: PromptHeadComponent not found. Make sure prompt-head-component.js is loaded first.');
          this.loadFallback();
          return;
        }

        // Initialize the component
        this.component = new PromptHeadComponent();

        // Find target element
        let targetElement = this.findTarget();
        
        if (!targetElement) {
          console.warn('PromptHeadLoader: No suitable target found');
          return;
        }

        // Check if element already has content (existing implementation)
        if (this.hasExistingContent(targetElement)) {
          console.log('PromptHeadLoader: Element already has content, skipping component injection');
          return;
        }

        // Render the component
        const success = this.component.render(targetElement);
        
        if (success) {
          console.log('PromptHeadLoader: Component loaded successfully');
          this.enhanceComponent();
        } else {
          console.error('PromptHeadLoader: Failed to render component');
          this.loadFallback();
        }

      } catch (error) {
        console.error('PromptHeadLoader: Error loading component:', error);
        this.loadFallback();
      }
    }

    /**
     * Find the target element for component injection
     */
    findTarget() {
      // First try to find existing universal-prompt-head
      let target = document.querySelector(this.targetSelector);
      
      if (target) {
        return target;
      }

      // If not found, create container in right-panel
      const rightPanel = document.querySelector(this.fallbackTargetSelector);
      if (rightPanel) {
        target = document.createElement('div');
        target.className = 'universal-prompt-head';
        rightPanel.insertBefore(target, rightPanel.firstChild);
        return target;
      }

      return null;
    }

    /**
     * Check if element already has meaningful content
     */
    hasExistingContent(element) {
      // Check if element has child elements with classes we recognize
      const existingElements = element.querySelectorAll('.logo-lockup-ctnr, .sidebar-toggle, .services-dropdown-trigger');
      return existingElements.length > 0;
    }

    /**
     * Enhance component with additional functionality
     */
    enhanceComponent() {
      if (!this.component) return;

      // Auto-adjust paths based on current page location
      this.component.adjustPaths();

      // Add global CSS variables for theming
      this.injectThemeVariables();

      // Integrate with existing page functionality
      this.integrateWithPage();
    }

    /**
     * Inject theme variables for component consistency
     */
    injectThemeVariables() {
      // Create or update CSS custom properties for component theming
      const style = document.createElement('style');
      style.id = 'prompt-head-theme';
      style.textContent = `
        :root {
          --prompt-head-bg: var(--contrast-background, #00b85c);
          --prompt-head-text: var(--black, #000);
          --prompt-head-accent: var(--highlight, #073429);
          --prompt-head-hover: var(--secondary-highlight, #94d4c3);
        }
      `;

      // Remove existing theme style if present
      const existingStyle = document.getElementById('prompt-head-theme');
      if (existingStyle) {
        existingStyle.remove();
      }

      document.head.appendChild(style);
    }

    /**
     * Integrate component with existing page systems
     */
    integrateWithPage() {
      // Integrate with copy functionality
      this.integrateCopyFunctionality();
      
      // Integrate with mobile menu system
      this.integrateMobileMenu();
      
      // Integrate with Webflow interactions
      this.integrateWebflowInteractions();
    }

    /**
     * Integrate with existing copy functionality
     */
    integrateCopyFunctionality() {
      const copiedElement = document.querySelector('.copied');
      if (!copiedElement) return;

      // Listen for copy events from the page
      document.addEventListener('copy-success', () => {
        this.showCopyFeedback();
      });

      // Also integrate with existing copy buttons
      const copyButtons = document.querySelectorAll('.copy-btn, .page-controls.copy, input[type="submit"]');
      copyButtons.forEach(button => {
        button.addEventListener('click', () => {
          setTimeout(() => this.showCopyFeedback(), 100);
        });
      });
    }

    /**
     * Show copy success feedback
     */
    showCopyFeedback() {
      const copiedElement = document.querySelector('.copied');
      if (copiedElement) {
        copiedElement.style.display = 'flex';
        copiedElement.style.opacity = '1';
        
        setTimeout(() => {
          copiedElement.style.opacity = '0';
          setTimeout(() => {
            copiedElement.style.display = 'none';
          }, 300);
        }, 2000);
      }
    }

    /**
     * Integrate with mobile hamburger menu system
     */
    integrateMobileMenu() {
      const hamburgerMenu = document.querySelector('.hamburger-menu');
      const sidebarToggle = document.querySelector('.sidebar-toggle');

      // Sync hamburger menu with sidebar toggle
      if (hamburgerMenu && sidebarToggle) {
        hamburgerMenu.addEventListener('click', () => {
          // Trigger sidebar toggle functionality
          if (this.component) {
            this.component.handleSidebarToggle();
          }
        });
      }
    }

    /**
     * Integrate with Webflow interactions and animations
     */
    integrateWebflowInteractions() {
      // Re-initialize Webflow interactions for new content
      if (typeof Webflow !== 'undefined') {
        try {
          Webflow.destroy();
          Webflow.ready();
          Webflow.require('ix2').init();
        } catch (error) {
          console.log('PromptHeadLoader: Webflow re-initialization not needed or failed:', error.message);
        }
      }
    }

    /**
     * Fallback loading mechanism
     */
    loadFallback() {
      console.log('PromptHeadLoader: Loading fallback - preserving existing markup');
      // In fallback mode, just ensure existing markup is preserved
      const existingElement = document.querySelector(this.targetSelector);
      if (existingElement) {
        console.log('PromptHeadLoader: Existing element found, preserving current implementation');
      }
    }

    /**
     * Destroy component and cleanup
     */
    destroy() {
      if (this.component) {
        const targetElement = document.querySelector(this.targetSelector);
        if (targetElement) {
          targetElement.innerHTML = '';
        }
        this.component = null;
      }

      const themeStyle = document.getElementById('prompt-head-theme');
      if (themeStyle) {
        themeStyle.remove();
      }

      this.isInitialized = false;
    }

    /**
     * Refresh/reload the component
     */
    refresh() {
      this.destroy();
      this.init();
    }
  }

  // Auto-initialize when script loads
  const loader = new PromptHeadLoader();
  loader.init();

  // Expose loader globally for manual control if needed
  window.PromptHeadLoader = loader;

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptHeadLoader;
  }

})();