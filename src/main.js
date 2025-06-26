import './style.css'
import { Sidebar } from './components/Sidebar.js'
import { PromptForm } from './components/PromptForm.js'
import AiServices from './components/AiServices.js'
import { PromptToolbar } from './components/PromptToolbar.js'

class App {
  constructor() {
    this.sidebar = new Sidebar();
    this.promptForm = new PromptForm();
    this.aiServices = new AiServices();
    this.toolbar = new PromptToolbar();
    this.currentPrompt = null;
    this.isTransitioning = false;
    this.transitionDebounceTimeout = null;
    this.isMobileMenuOpen = false;
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    document.querySelector('#app').innerHTML = `
      <div class="mobile-header" id="mobileHeader">
        <button class="mobile-hamburger" id="mobileHamburger">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 class="mobile-title">Prompts</h1>
        <div></div>
      </div>
      
      <!-- Universal Prompt Head Toolbar (shown only when prompt is active) -->
      ${this.currentPrompt ? this.toolbar.render() : ''}
      
      <div class="mobile-menu-overlay" id="mobileOverlay"></div>
      
      <div class="page-wrap">
        <div class="left-panel" id="leftPanel">
          ${this.sidebar.render()}
        </div>
        <div class="right-panel start-page">
          ${this.currentPrompt ? this.promptForm.render(this.currentPrompt) : this.aiServices.render()}
        </div>
      </div>
    `;
    
    // Attach event listeners after rendering
    this.sidebar.attachEventListeners();
    this.promptForm.attachEventListeners();
    this.attachMobileMenuListeners();
    
    // Attach toolbar event listeners only when toolbar is visible
    if (this.currentPrompt) {
      this.toolbar.attachEventListeners();
    }
  }

  attachEventListeners() {
    // Listen for prompt selection
    window.addEventListener('promptSelected', (e) => {
      const promptId = e.detail.promptId;
      const promptData = this.sidebar.getPromptData(promptId);
      this.loadPrompt(promptData);
      
      // Close mobile menu when selecting a prompt
      if (this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Listen for tab changes
    window.addEventListener('tabChanged', (e) => {
      // Clear current prompt when switching tabs
      this.currentPrompt = null;
      this.updateRightPanel();
    });

    // Listen for copy events to trigger toolbar services dropdown
    window.addEventListener('promptCopied', () => {
      if (this.currentPrompt && this.toolbar) {
        this.toolbar.showServicesAfterCopy();
      }
    });
  }

  attachMobileMenuListeners() {
    // Remove existing listeners to prevent duplicates
    this.removeMobileMenuListeners();
    
    const hamburger = document.getElementById('mobileHamburger');
    const overlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    // Store bound functions for removal later
    this.hamburgerClickHandler = () => this.toggleMobileMenu();
    this.overlayClickHandler = () => this.closeMobileMenu();
    this.mobileCloseClickHandler = () => this.closeMobileMenu();
    this.escapeKeyHandler = (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    };

    if (hamburger) {
      hamburger.addEventListener('click', this.hamburgerClickHandler);
    }

    if (overlay) {
      overlay.addEventListener('click', this.overlayClickHandler);
    }

    if (mobileClose) {
      mobileClose.addEventListener('click', this.mobileCloseClickHandler);
    }

    // Close menu on escape key
    document.addEventListener('keydown', this.escapeKeyHandler);
  }

  removeMobileMenuListeners() {
    const hamburger = document.getElementById('mobileHamburger');
    const overlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    if (hamburger && this.hamburgerClickHandler) {
      hamburger.removeEventListener('click', this.hamburgerClickHandler);
    }

    if (overlay && this.overlayClickHandler) {
      overlay.removeEventListener('click', this.overlayClickHandler);
    }

    if (mobileClose && this.mobileCloseClickHandler) {
      mobileClose.removeEventListener('click', this.mobileCloseClickHandler);
    }

    if (this.escapeKeyHandler) {
      document.removeEventListener('keydown', this.escapeKeyHandler);
    }
  }

  toggleMobileMenu() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMobileMenuOpen = true;
    const leftPanel = document.getElementById('leftPanel');
    const overlay = document.getElementById('mobileOverlay');
    const hamburger = document.getElementById('mobileHamburger');

    if (leftPanel) leftPanel.classList.add('active');
    if (overlay) overlay.classList.add('active');
    if (hamburger) hamburger.classList.add('active');

    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    const leftPanel = document.getElementById('leftPanel');
    const overlay = document.getElementById('mobileOverlay');
    const hamburger = document.getElementById('mobileHamburger');

    if (leftPanel) leftPanel.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
  }

  loadPrompt(promptData) {
    // Debounce rapid prompt switches
    if (this.transitionDebounceTimeout) {
      clearTimeout(this.transitionDebounceTimeout);
    }
    
    this.transitionDebounceTimeout = setTimeout(() => {
      this.currentPrompt = promptData;
      this.updateRightPanelWithTransition();
    }, 50);
  }

  async updateRightPanelWithTransition() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.updateRightPanel();
      return;
    }
    
    // Prevent multiple simultaneous transitions
    if (this.isTransitioning) {
      return;
    }
    
    this.isTransitioning = true;
    const rightPanel = document.querySelector('.right-panel');
    
    try {
      // Phase 1: Measure current state and prepare transition
      const currentHeight = rightPanel.scrollHeight;
      const currentScrollTop = rightPanel.scrollTop;
      
      // Show loading state briefly for better UX
      this.showLoadingState(rightPanel);
      
      // Create temporary element to measure new content height
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.style.width = rightPanel.offsetWidth + 'px';
      tempElement.style.padding = getComputedStyle(rightPanel).padding;
      tempElement.innerHTML = this.currentPrompt ? this.promptForm.render(this.currentPrompt) : this.aiServices.render();
      document.body.appendChild(tempElement);
      const newHeight = tempElement.scrollHeight;
      document.body.removeChild(tempElement);
      
      // Phase 2: Start transition - fade out current content
      rightPanel.classList.add('transitioning');
      rightPanel.style.minHeight = currentHeight + 'px';
      
      await this.fadeOut(rightPanel);
      
      // Phase 3: Update content and animate height
      rightPanel.innerHTML = this.currentPrompt ? this.promptForm.render(this.currentPrompt) : this.aiServices.render();
      
      // Update panel classes
      if (this.currentPrompt) {
        rightPanel.classList.remove('start-page');
        this.promptForm.attachEventListeners();
      } else {
        rightPanel.classList.add('start-page');
      }

      // Re-render and attach toolbar if needed
      this.updateToolbar();
      
      // Animate height change
      await this.animateHeight(rightPanel, currentHeight, newHeight);
      
      // Phase 4: Fade in new content and cleanup
      await this.fadeIn(rightPanel);
      
      // Smart scroll positioning - scroll to top for new content
      if (Math.abs(currentHeight - newHeight) > 200) {
        rightPanel.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      rightPanel.classList.remove('transitioning');
      rightPanel.style.minHeight = '';
      
    } catch (error) {
      console.error('Transition error:', error);
      // Fallback to immediate update
      this.updateRightPanel();
    } finally {
      this.isTransitioning = false;
    }
  }

  showLoadingState(element) {
    const loadingContent = `
      <div class="loading-content">
        <div class="loading-skeleton"></div>
        <div class="loading-skeleton"></div>
        <div class="loading-skeleton" style="width: 60%;"></div>
      </div>
    `;
    element.innerHTML = loadingContent;
  }

  updateRightPanel() {
    // Fallback method for immediate updates (no transition)
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = this.currentPrompt ? this.promptForm.render(this.currentPrompt) : this.aiServices.render();
    
    // Remove start-page class when showing a prompt
    if (this.currentPrompt) {
      rightPanel.classList.remove('start-page');
      this.promptForm.attachEventListeners();
    } else {
      rightPanel.classList.add('start-page');
    }

    // Re-render and attach toolbar if needed
    this.updateToolbar();
  }

  updateToolbar() {
    // The toolbar is now part of the main render, so we just need to re-render
    // This method is called after transitions to ensure proper state
    if (this.currentPrompt) {
      // Re-attach event listeners for the toolbar
      this.toolbar.attachEventListeners();
    }
  }

  fadeOut(element) {
    return new Promise(resolve => {
      element.style.transition = 'opacity 0.2s ease-in-out';
      element.style.opacity = '0';
      setTimeout(resolve, 200);
    });
  }

  fadeIn(element) {
    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.25s ease-in-out';
      // Force reflow
      element.offsetHeight;
      element.style.opacity = '1';
      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, 250);
    });
  }

  animateHeight(element, fromHeight, toHeight) {
    return new Promise(resolve => {
      if (Math.abs(fromHeight - toHeight) < 10) {
        // Skip animation for very small height differences
        resolve();
        return;
      }
      
      element.style.transition = 'min-height 0.3s ease-out';
      element.style.minHeight = toHeight + 'px';
      
      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, 300);
    });
  }
}

// Initialize the app
new App();
