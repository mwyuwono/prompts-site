/**
 * Universal Prompt Head Component
 * Reusable header component with logo, sidebar toggle, and AI service links
 */

class PromptHeadComponent {
  constructor() {
    this.services = [
      {
        name: 'ChatGPT',
        url: 'https://chat.openai.com/?model=gpt-4-code-interpreter',
        icon: '../images/GPT-Icon.svg',
        iconAlt: 'ChatGPT Logo'
      },
      {
        name: 'Claude',
        url: 'https://claude.ai/',
        icon: '../images/claude-logo.svg',
        iconAlt: 'Claude Logo'
      }
    ];
    this.dropdownServices = [
      {
        name: 'Claude',
        url: 'https://claude.ai/chats'
      },
      {
        name: 'ChatGPT', 
        url: 'https://chat.openai.com/?model=gpt-4-code-interpreter'
      },
      {
        name: 'Perplexity',
        url: 'https://www.perplexity.ai'
      },
      {
        name: 'Copilot',
        url: 'https://copilot.microsoft.com/'
      },
      {
        name: 'Gemini',
        url: 'https://bard.google.com/'
      },
      {
        name: 'Midjourney',
        url: 'https://www.midjourney.com/imagine'
      }
    ];
  }

  /**
   * Generate the complete universal prompt head HTML
   */
  generateHTML() {
    return `
      <div class="universal-prompt-head">
        ${this.generateLogoSection()}
        ${this.generateSidebarToggle()}
        ${this.generateCopiedFeedback()}
        <div class="mobile-menu-icon"></div>
        ${this.generateServicesDropdown()}
      </div>
    `;
  }

  /**
   * Generate logo and home link section
   */
  generateLogoSection() {
    return `
      <div class="logo-lockup-ctnr">
        <div class="w-layout-hflex logo-image-container">
          <a href="../index.html" class="home-link w-inline-block">
            <img src="../images/Fat-Logo.svg" loading="lazy" alt="Prompts Site Logo" class="logo-image">
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Generate sidebar toggle controls
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
   * Generate copied feedback notification
   */
  generateCopiedFeedback() {
    return `
      <div class="copied">
        <div class="copied-content">
          <div>Copied!</div>
        </div>
        <div data-w-id="924aa154-11da-880c-f3f5-8b080d169af3" 
             data-animation-type="lottie" 
             data-src="../documents/Animation---1719531472609.json" 
             data-loop="0" 
             data-direction="1" 
             data-autoplay="1" 
             data-is-ix2-target="0" 
             data-renderer="svg" 
             data-default-duration="3" 
             data-duration="2">
        </div>
      </div>
    `;
  }

  /**
   * Generate AI services dropdown section
   */
  generateServicesDropdown() {
    return `
      <div class="services-dropdown-trigger">
        ${this.generateMainServiceLinks()}
        ${this.generateDropdownMenu()}
      </div>
    `;
  }

  /**
   * Generate main service links (ChatGPT, Claude)
   */
  generateMainServiceLinks() {
    return this.services.map(service => `
      <a href="${service.url}" target="_blank" class="universal-heading-icon gpt w-inline-block">
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
   * Generate services dropdown menu
   */
  generateDropdownMenu() {
    return `
      <div class="services-dropdown">
        <div class="icon dropdown-trigger"></div>
        <div class="services-popup-menu">
          <div class="ai-menu-heading">Services</div>
          <div class="link-list">
            ${this.generateDropdownLinks()}
          </div>
          <div data-is-ix2-target="1" 
               class="confetti-animation" 
               data-w-id="a9d48a9e-e0bf-3c36-12a0-da43dae50371" 
               data-animation-type="lottie" 
               data-src="../documents/Animation---1719531472609.json" 
               data-loop="0" 
               data-direction="1" 
               data-autoplay="0" 
               data-renderer="svg" 
               data-default-duration="3" 
               data-duration="0" 
               data-ix2-initial-state="1">
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate dropdown service links
   */
  generateDropdownLinks() {
    return this.dropdownServices.map(service => `
      <a href="${service.url}" target="_blank" class="block-link w-inline-block">
        <div class="div-block-15 block-link-ctnr">
          <div class="div-block-17">
            <div class="block-link-title">${service.name}</div>
            <div class="block-link-arrow"></div>
          </div>
        </div>
      </a>
    `).join('');
  }

  /**
   * Render the component to a target element
   */
  render(targetElement) {
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }

    if (!targetElement) {
      console.error('PromptHeadComponent: Target element not found');
      return false;
    }

    targetElement.innerHTML = this.generateHTML();
    this.attachEventListeners(targetElement);
    return true;
  }

  /**
   * Attach event listeners for component functionality
   */
  attachEventListeners(container) {
    // Sidebar toggle functionality
    const sidebarToggle = container.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', this.handleSidebarToggle.bind(this));
    }

    // Services dropdown functionality
    const dropdownTrigger = container.querySelector('.services-dropdown');
    const dropdownMenu = container.querySelector('.services-popup-menu');
    
    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown(dropdownMenu);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        this.closeDropdown(dropdownMenu);
      });
    }
  }

  /**
   * Handle sidebar toggle clicks
   */
  handleSidebarToggle() {
    const sidebar = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    if (sidebar) {
      const isHidden = sidebar.style.display === 'none';
      if (isHidden) {
        sidebar.style.display = 'flex';
        if (rightPanel) rightPanel.style.width = 'calc(100% - 32%)';
      } else {
        sidebar.style.display = 'none';
        if (rightPanel) rightPanel.style.width = '100%';
      }
    }
  }

  /**
   * Toggle services dropdown menu
   */
  toggleDropdown(menu) {
    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
  }

  /**
   * Close services dropdown menu
   */
  closeDropdown(menu) {
    if (menu) {
      menu.style.display = 'none';
    }
  }

  /**
   * Update service configuration
   */
  updateServices(newServices) {
    this.services = newServices;
  }

  /**
   * Add a new service to the dropdown
   */
  addDropdownService(service) {
    this.dropdownServices.push(service);
  }

  /**
   * Get current path for proper relative links
   */
  getCurrentPath() {
    const path = window.location.pathname;
    const pathSegments = path.split('/');
    const depth = pathSegments.filter(segment => segment).length;
    
    // Adjust paths based on directory depth
    if (path.includes('/work/') || path.includes('/personal/')) {
      return '../';
    }
    return './';
  }

  /**
   * Auto-detect and adjust paths based on page location
   */
  adjustPaths() {
    const basePath = this.getCurrentPath();
    
    // Update logo path
    this.services.forEach(service => {
      if (service.icon.startsWith('../images/')) {
        service.icon = service.icon;
      } else if (service.icon.startsWith('./images/')) {
        service.icon = basePath + service.icon.substring(2);
      }
    });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PromptHeadComponent;
}

// Global registration
window.PromptHeadComponent = PromptHeadComponent;