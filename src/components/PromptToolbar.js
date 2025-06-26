export class PromptToolbar {
  constructor() {
    this.isServicesOpen = false;
    this.services = [
      { name: 'Claude', url: 'https://claude.ai/chats' },
      { name: 'ChatGPT', url: 'https://chat.openai.com/' },
      { name: 'Perplexity', url: 'https://www.perplexity.ai' },
      { name: 'Copilot', url: 'https://copilot.microsoft.com/' },
      { name: 'Gemini', url: 'https://gemini.google.com/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/imagine' }
    ];
    this.quickServices = [
      { name: 'Claude', url: 'https://claude.ai/chats', icon: '🤖' },
      { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: '💬' }
    ];
  }

  render() {
    return `
      <div class="prompt-toolbar" id="promptToolbar">
        <div class="toolbar-buttons">
          ${this.quickServices.map(service => `
            <a href="${service.url}" target="_blank" class="toolbar-service-btn" aria-label="Open ${service.name}">
              <span class="service-icon">${service.icon}</span>
            </a>
          `).join('')}
          
          <button class="toolbar-dropdown-btn ${this.isServicesOpen ? 'active' : ''}" id="dropdownBtn" aria-label="Toggle services menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="services-dropdown ${this.isServicesOpen ? 'active' : ''}" id="servicesDropdown">
          <div class="services-header">Services</div>
          <div class="services-list">
            ${this.services.map(service => `
              <a href="${service.url}" target="_blank" class="service-link" data-service="${service.name.toLowerCase()}">
                ${service.name}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const servicesDropdown = document.getElementById('servicesDropdown');
    const serviceLinks = document.querySelectorAll('.service-link');

    if (dropdownBtn) {
      // Add both click and touchstart for better mobile support
      dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleServices();
      });
      
      dropdownBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleServices();
      }, { passive: false });
    }

    // Close dropdown when clicking outside - improve mobile support
    const closeHandler = (e) => {
      if (this.isServicesOpen && !e.target.closest('.prompt-toolbar')) {
        this.closeServices();
      }
    };
    
    document.addEventListener('click', closeHandler);
    document.addEventListener('touchstart', closeHandler);

    // Handle service link clicks
    serviceLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeServices();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isServicesOpen) {
        this.closeServices();
      }
    });
  }

  toggleServices() {
    if (this.isServicesOpen) {
      this.closeServices();
    } else {
      this.openServices();
    }
  }

  openServices() {
    this.isServicesOpen = true;
    this.updateServicesState();
  }

  closeServices() {
    this.isServicesOpen = false;
    this.updateServicesState();
  }

  updateServicesState() {
    const dropdownBtn = document.getElementById('dropdownBtn');
    const servicesDropdown = document.getElementById('servicesDropdown');

    if (dropdownBtn) {
      dropdownBtn.classList.toggle('active', this.isServicesOpen);
    }

    if (servicesDropdown) {
      servicesDropdown.classList.toggle('active', this.isServicesOpen);
    }
  }

  // Method to be called from copy button
  showServicesAfterCopy() {
    setTimeout(() => {
      this.openServices();
    }, 100); // Small delay for smooth UX
  }
}