export class PromptToolbar {
  constructor() {
    this.isServicesOpen = false;
    this.services = [
      { name: 'Claude', url: 'https://claude.ai/chats' },
      { name: 'ChatGPT', url: 'https://chat.openai.com/?model=gpt-4-code-interpreter' },
      { name: 'Perplexity', url: 'https://www.perplexity.ai' },
      { name: 'Copilot', url: 'https://copilot.microsoft.com/' },
      { name: 'Gemini', url: 'https://bard.google.com/' },
      { name: 'Midjourney', url: 'https://www.midjourney.com/imagine' }
    ];
    this.quickServices = [
      { name: 'Claude', url: 'https://claude.ai/', icon: 'claude-logo.svg' },
      { name: 'ChatGPT', url: 'https://chat.openai.com/?model=gpt-4-code-interpreter', icon: 'GPT-Icon.svg' }
    ];
  }

  render() {
    return `
      <div class="universal-prompt-head">
        <div class="logo-lockup-ctnr">
          <div class="w-layout-hflex logo-image-container">
            <a href="/index.html" class="home-link w-inline-block">
              <img src="/src/assets/Fat-Logo.svg" loading="lazy" alt="" class="logo-image">
            </a>
          </div>
        </div>
        <div class="copied" id="copiedNotification">
          <div class="copied-content">
            <div>Copied!</div>
          </div>
        </div>
        <div class="services-dropdown-trigger">
          ${this.quickServices.map(service => `
            <a href="${service.url}" target="_blank" class="universal-heading-icon gpt w-inline-block">
              <div class="tooltip">
                <div>${service.name}</div>
              </div>
              <div class="icon home">
                <img src="/src/assets/${service.icon}" loading="eager" alt="${service.name} Logo" class="ai-icon">
              </div>
            </a>
          `).join('')}
          <div class="services-dropdown">
            <div class="icon dropdown-trigger" id="dropdownTrigger"></div>
            <div class="services-popup-menu ${this.isServicesOpen ? 'active' : ''}" id="servicesPopupMenu">
              <div class="ai-menu-heading">Services</div>
              <div class="link-list">
                ${this.services.map(service => `
                  <a href="${service.url}" target="_blank" class="block-link w-inline-block">
                    <div class="div-block-15 block-link-ctnr">
                      <div class="div-block-17">
                        <div class="block-link-title">${service.name}</div>
                        <div class="block-link-arrow"></div>
                      </div>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const servicesPopupMenu = document.getElementById('servicesPopupMenu');
    const serviceLinks = document.querySelectorAll('.block-link');

    if (dropdownTrigger) {
      // Add both click and touchstart for better mobile support
      dropdownTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleServices();
      });
      
      dropdownTrigger.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleServices();
      }, { passive: false });
    }

    // Close dropdown when clicking outside - improve mobile support
    const closeHandler = (e) => {
      if (this.isServicesOpen && !e.target.closest('.universal-prompt-head')) {
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
    const servicesPopupMenu = document.getElementById('servicesPopupMenu');

    if (servicesPopupMenu) {
      servicesPopupMenu.classList.toggle('active', this.isServicesOpen);
    }
  }

  // Method to be called from copy button
  showServicesAfterCopy() {
    // Show copied notification first
    this.showCopiedNotification();
    
    // Then show services dropdown after a short delay
    setTimeout(() => {
      this.openServices();
    }, 100);
  }

  showCopiedNotification() {
    const copiedNotification = document.getElementById('copiedNotification');
    if (copiedNotification) {
      copiedNotification.classList.add('active');
      
      // Hide after 2 seconds
      setTimeout(() => {
        copiedNotification.classList.remove('active');
      }, 2000);
    }
  }
}