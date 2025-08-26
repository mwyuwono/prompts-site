/**
 * Sidebar Loader
 * Initializes the sidebar navigation component after page load
 */

(function() {
  'use strict';

  /**
   * Initialize sidebar when DOM is ready
   */
  function initWhenReady() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeSidebar);
    } else {
      initializeSidebar();
    }
  }

  /**
   * Auto-detect current page information if not set
   */
  function autoDetectPageInfo() {
    const body = document.body;
    
    // Auto-detect current page if not already set
    if (!body.getAttribute('data-current-page')) {
      const pathname = window.location.pathname;
      const filename = pathname.split('/').pop() || 'index.html';
      body.setAttribute('data-current-page', filename);
    }

    // Auto-detect current section if not already set
    if (!body.getAttribute('data-current-section')) {
      const pathname = window.location.pathname;
      if (pathname.includes('/personal/')) {
        body.setAttribute('data-current-section', 'personal');
      } else if (pathname.includes('/work/')) {
        body.setAttribute('data-current-section', 'work');
      } else {
        body.setAttribute('data-current-section', 'personal'); // default
      }
    }
  }

  /**
   * Fallback to original sidebar if component fails
   */
  function enableFallback() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const originalSidebar = document.getElementById('original-sidebar');
    
    if (sidebarContainer && originalSidebar) {
      console.warn('Sidebar component failed, using original sidebar');
      sidebarContainer.style.display = 'none';
      originalSidebar.style.display = 'block';
    }
  }

  /**
   * Enhanced initialization with error handling
   */
  function initializeSidebarSafely() {
    try {
      // Auto-detect page info
      autoDetectPageInfo();
      
      // Check if required functions exist
      if (typeof getNavigationData !== 'function' || 
          typeof SidebarNavigation !== 'function') {
        throw new Error('Required sidebar components not loaded');
      }

      // Initialize sidebar
      initializeSidebar();
      
      // Hide original sidebar after successful initialization
      const originalSidebar = document.getElementById('original-sidebar');
      if (originalSidebar) {
        originalSidebar.style.display = 'none';
      }
      
    } catch (error) {
      console.error('Sidebar component initialization failed:', error);
      enableFallback();
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebarSafely);
  } else {
    initializeSidebarSafely();
  }

  // Export for manual initialization if needed
  window.initializeSidebarComponent = initializeSidebarSafely;

})();