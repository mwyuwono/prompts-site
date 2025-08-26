/**
 * Sidebar Navigation Component
 * Renders consistent navigation across all pages
 */

class SidebarNavigation {
  constructor(currentPage, currentSection = 'personal') {
    this.currentPage = currentPage;
    this.currentSection = currentSection;
    this.navigationData = getNavigationData();
    this.categoryNames = getCategoryDisplayNames();
  }

  /**
   * Generate complete sidebar HTML
   */
  render() {
    return `
      <div class="sidebar">
        <div class="sidebar-all-content-wrap">
          ${this.renderSectionTabs()}
          ${this.renderPersonalContent()}
          ${this.renderWorkContent()}
        </div>
      </div>
    `;
  }

  /**
   * Render section tabs (Personal/Work)
   */
  renderSectionTabs() {
    return `
      <div class="sidebar-section-head">
        <div class="tab personal">
          <div>Personal <span class="mobile-hide">prompts</span></div>
        </div>
        <div class="tab work">
          <div>Work<span class="mobile-hide"> prompts</span></div>
        </div>
      </div>
    `;
  }

  /**
   * Render personal section content
   */
  renderPersonalContent() {
    return `
      <div class="sidebar-content personal">
        ${this.renderSection('personal', 'utilities')}
        ${this.renderSection('personal', 'research')}
        ${this.renderSection('personal', 'creativity')}
      </div>
    `;
  }

  /**
   * Render work section content
   */
  renderWorkContent() {
    return `
      <div class="sidebar-content work">
        ${this.renderSection('work', 'banking')}
        ${this.renderSection('work', 'miscellaneous')}
        ${this.renderSection('work', 'prototyping')}
        ${this.renderSection('work', 'ehc')}
      </div>
    `;
  }

  /**
   * Render a category section with links
   */
  renderSection(section, category) {
    const links = this.navigationData[section][category] || [];
    const categoryTitle = this.categoryNames[category] || category;

    return `
      <div class="sidebar-section">
        <div class="sidebar-category-head">${categoryTitle}</div>
        <div class="sidebar-links-container">
          ${links.map(link => this.renderLink(link, section)).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render individual navigation link
   */
  renderLink(link, section) {
    const href = this.buildHref(link.href, section);
    const isCurrentPage = this.isCurrentPage(link.href);
    const currentPageClass = isCurrentPage ? 'w--current' : '';
    const ariaCurrent = isCurrentPage ? 'aria-current="page"' : '';

    return `
      <a href="${href}" ${ariaCurrent} class="sidebar-link ${currentPageClass}">${link.title}</a>
    `;
  }

  /**
   * Build correct href based on current page location and target
   */
  buildHref(targetHref, section) {
    // If it's already a relative path with ../, keep it as is
    if (targetHref.startsWith('../')) {
      return targetHref;
    }

    // Determine if we need to add path prefix based on current page location
    const currentPagePath = window.location.pathname;
    const isInPersonalFolder = currentPagePath.includes('/personal/');
    const isInWorkFolder = currentPagePath.includes('/work/');
    const isInRoot = !isInPersonalFolder && !isInWorkFolder;

    // Build the href based on current location and target section
    if (isInRoot) {
      // We're in root (index.html), need to add section prefix
      if (section === 'personal') {
        return `personal/${targetHref}`;
      } else if (section === 'work') {
        return `work/${targetHref}`;
      }
    } else if (isInPersonalFolder) {
      // We're in personal folder
      if (section === 'personal') {
        return targetHref; // Same folder, no prefix needed
      } else if (section === 'work') {
        return `../work/${targetHref}`;
      }
    } else if (isInWorkFolder) {
      // We're in work folder  
      if (section === 'work') {
        return targetHref; // Same folder, no prefix needed
      } else if (section === 'personal') {
        return `../personal/${targetHref}`;
      }
    }

    return targetHref;
  }

  /**
   * Check if the given href matches current page
   */
  isCurrentPage(href) {
    // Remove any path prefixes and extensions for comparison
    const cleanHref = href.replace('../work/', '').replace('../personal/', '').replace('.html', '');
    const cleanCurrentPage = this.currentPage.replace('.html', '');
    
    return cleanHref === cleanCurrentPage;
  }
}

/**
 * Initialize sidebar navigation
 */
function initializeSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  // Get current page info from data attributes or URL
  const body = document.body;
  const currentPage = body.getAttribute('data-current-page') || 
                     window.location.pathname.split('/').pop() || 
                     'index.html';
  const currentSection = body.getAttribute('data-current-section') || 'personal';

  // Create and render sidebar
  const sidebar = new SidebarNavigation(currentPage, currentSection);
  sidebarContainer.innerHTML = sidebar.render();
  
  // Initialize tab switching functionality
  initializeTabSwitching(currentSection);
}

/**
 * Initialize tab switching functionality
 */
function initializeTabSwitching(currentSection) {
  const personalTab = document.querySelector('.tab.personal');
  const workTab = document.querySelector('.tab.work');
  const personalContent = document.querySelector('.sidebar-content.personal');
  const workContent = document.querySelector('.sidebar-content.work');
  
  if (!personalTab || !workTab || !personalContent || !workContent) return;
  
  // Set initial active state based on current section
  if (currentSection === 'work') {
    workTab.classList.add('w--current');
    personalTab.classList.remove('w--current');
    workContent.style.display = 'block';
    personalContent.style.display = 'none';
  } else {
    personalTab.classList.add('w--current');
    workTab.classList.remove('w--current');
    personalContent.style.display = 'block';
    workContent.style.display = 'none';
  }
  
  // Add click handlers for tab switching
  personalTab.addEventListener('click', function() {
    personalTab.classList.add('w--current');
    workTab.classList.remove('w--current');
    personalContent.style.display = 'block';
    workContent.style.display = 'none';
  });
  
  workTab.addEventListener('click', function() {
    workTab.classList.add('w--current');
    personalTab.classList.remove('w--current');
    workContent.style.display = 'block';
    personalContent.style.display = 'none';
  });
}