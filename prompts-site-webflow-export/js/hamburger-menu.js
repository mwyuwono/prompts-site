/**
 * Hamburger Menu Component
 * Single, consistent hamburger menu that toggles sidebar visibility
 */

class HamburgerMenu {
  constructor() {
    this.isOpen = false;
    this.hamburgerElement = null;
    this.sidebar = null;
    this.pageWrap = null;
  }

  /**
   * Initialize the hamburger menu
   */
  init() {
    this.hamburgerElement = document.querySelector('.hamburger-menu');
    this.sidebar = document.querySelector('.left-panel');
    this.pageWrap = document.querySelector('.page-wrap');
    
    if (!this.hamburgerElement) {
      console.warn('Hamburger menu element not found');
      return;
    }

    this.bindEvents();
    this.updateIcon();
  }

  /**
   * Bind click events
   */
  bindEvents() {
    // Main hamburger button click
    this.hamburgerElement.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Close when clicking outside sidebar on mobile
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.sidebar.contains(e.target) && 
          !this.hamburgerElement.contains(e.target)) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  /**
   * Toggle sidebar open/closed
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open sidebar
   */
  open() {
    this.isOpen = true;
    this.hamburgerElement.classList.add('is-open');
    this.sidebar?.classList.add('is-open');
    this.pageWrap?.classList.add('sidebar-open');
    this.updateIcon();
    
    // Prevent body scroll on mobile when sidebar is open
    if (window.innerWidth <= 767) {
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Close sidebar
   */
  close() {
    this.isOpen = false;
    this.hamburgerElement.classList.remove('is-open');
    this.sidebar?.classList.remove('is-open');
    this.pageWrap?.classList.remove('sidebar-open');
    this.updateIcon();
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Update icon based on state
   */
  updateIcon() {
    const iconElement = this.hamburgerElement.querySelector('.hamburger-icon');
    if (!iconElement) return;

    if (this.isOpen) {
      iconElement.innerHTML = '✕'; // Close icon
      iconElement.setAttribute('aria-label', 'Close menu');
    } else {
      iconElement.innerHTML = '☰'; // Hamburger icon
      iconElement.setAttribute('aria-label', 'Open menu');
    }
  }

  /**
   * Handle responsive behavior
   */
  handleResize() {
    // Auto-close on desktop
    if (window.innerWidth > 767 && this.isOpen) {
      this.close();
    }
  }
}

/**
 * Initialize hamburger menu when DOM is ready
 */
function initHamburgerMenu() {
  const hamburgerMenu = new HamburgerMenu();
  hamburgerMenu.init();
  
  // Handle window resize
  window.addEventListener('resize', () => hamburgerMenu.handleResize());
  
  // Export for potential external use
  window.hamburgerMenu = hamburgerMenu;
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHamburgerMenu);
} else {
  initHamburgerMenu();
}