/**
 * Universal Prompt Head Component - Production Version
 * Replaces static prompt head content with dynamic component
 */

class RefinedPromptHeadComponent {
  constructor(options = {}) {
    this.mode = options.mode || 'replace';
    this.isInitialized = false;
    this.originalElement = null;
    this.componentElement = null;
  }

  /**
   * Detect current page path for relative links
   */
  detectPathPrefix() {
    const path = window.location.pathname;
    
    // Special handling for test files in root directory
    if (path.includes('dropdown-interaction-test.html') || path.includes('component-testing.html')) {
      return 'prompts-site-webflow-export/';
    }
    
    // Determine path based on current location
    if (path.includes('/work/') || path.includes('/personal/')) {
      return '../';
    }
    
    return './';
  }

  /**
   * Generate component HTML matching exact static structure
   */
  generateHTML() {
    const pathPrefix = this.detectPathPrefix();
    
    return `
    <div class="universal-prompt-head">
      <div class="logo-lockup-ctnr">
        <div class="w-layout-hflex logo-image-container">
          <a href="${pathPrefix}index.html" class="home-link w-inline-block">
            <img src="${pathPrefix}images/Fat-Logo.svg" loading="lazy" alt="" class="logo-image">
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
        <div data-w-id="924aa154-11da-880c-f3f5-8b080d169af3" data-animation-type="lottie"
          data-src="${pathPrefix}documents/Animation---1719531472609.json" data-loop="0" data-direction="1" data-autoplay="1"
          data-is-ix2-target="0" data-renderer="svg" data-default-duration="3" data-duration="2"></div>
      </div>
      <div class="mobile-menu-icon"></div>
      <div class="services-dropdown-trigger">
        <a href="https://chat.openai.com/?model=gpt-4-code-interpreter" target="_blank"
          class="universal-heading-icon gpt w-inline-block">
          <div class="tooltip">
            <div>ChatGPT</div>
          </div>
          <div class="icon home">
            <img src="${pathPrefix}images/GPT-Icon.svg" loading="eager" alt="ChatGPT Logo" class="ai-icon">
          </div>
        </a>
        <a href="https://claude.ai/" target="_blank" class="universal-heading-icon gpt w-inline-block">
          <div class="tooltip">
            <div>Claude</div>
          </div>
          <div class="icon home">
            <img src="${pathPrefix}images/claude-logo.svg" loading="eager" alt="Claude Logo" class="ai-icon">
          </div>
        </a>
        <div class="services-dropdown">
          <div class="icon dropdown-trigger"></div>
          <div class="services-popup-menu">
            <div class="ai-menu-heading">Services</div>
            <div class="link-list">
              <a href="https://claude.ai/chats" target="_blank" class="block-link w-inline-block">
                <div class="div-block-15 block-link-ctnr">
                  <div class="div-block-17">
                    <div class="block-link-title">Claude</div>
                    <div class="block-link-arrow"></div>
                  </div>
                  <div class="block-link-description">Anthropic</div>
                </div>
              </a>
              <a href="https://chat.openai.com/?model=gpt-4-code-interpreter" target="_blank" class="block-link w-inline-block">
                <div class="div-block-15 block-link-ctnr">
                  <div class="div-block-17">
                    <div class="block-link-title">ChatGPT</div>
                    <div class="block-link-arrow"></div>
                  </div>
                  <div class="block-link-description">OpenAI</div>
                </div>
              </a>
              <a href="https://gemini.google.com/" target="_blank" class="block-link w-inline-block">
                <div class="div-block-15 block-link-ctnr">
                  <div class="div-block-17">
                    <div class="block-link-title">Gemini</div>
                    <div class="block-link-arrow"></div>
                  </div>
                  <div class="block-link-description">Google</div>
                </div>
              </a>
              <a href="https://chat.qwen.ai/" target="_blank" class="block-link w-inline-block">
                <div class="div-block-15 block-link-ctnr">
                  <div class="div-block-17">
                    <div class="block-link-title">Qwen</div>
                    <div class="block-link-arrow"></div>
                  </div>
                  <div class="block-link-description">Alibaba</div>
                </div>
              </a>
              <a href="https://perchance.org/ai-text-to-image-generator" target="_blank" class="block-link w-inline-block">
                <div class="div-block-15 block-link-ctnr">
                  <div class="div-block-17">
                    <div class="block-link-title">Perchance</div>
                    <div class="block-link-arrow"></div>
                  </div>
                  <div class="block-link-description">Text-to-Image</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  /**
   * Initialize component in specified mode
   */
  initialize(targetElement) {
    if (this.isInitialized) return;

    this.originalElement = targetElement;
    
    if (this.mode === 'replace') {
      this.initializeReplaceMode();
    }

        // Dynamically load GSAP
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    gsapScript.onload = () => {
      // GSAP is loaded, now attach event listeners
      setTimeout(() => {
        this.attachEventListeners();
      }, 200);
    };
    document.head.appendChild(gsapScript);
    
    this.isInitialized = true;
  }

  /**
   * Replace mode: Replace static content with component
   */
  initializeReplaceMode() {
    // Wait for layout to stabilize before replacing component
    setTimeout(() => {
      // Store original content as backup
      const originalContent = this.originalElement.innerHTML;
      
      try {
        // Generate and replace component HTML
        const fullHTML = this.generateHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHTML;
        const componentContent = tempDiv.firstElementChild.innerHTML;
        
        this.originalElement.innerHTML = componentContent;
        this.componentElement = this.originalElement;
        
        // Force viewport/media query recalculation (mimics inspector mode)
        this.forceViewportRecalculation();
        
        // Verify content was set correctly
        if (!this.originalElement.innerHTML.includes('logo-lockup-ctnr')) {
          // Fallback: restore original content if replacement failed
          this.originalElement.innerHTML = originalContent;
        }
      } catch (error) {
        // Restore original content on error
        this.originalElement.innerHTML = originalContent;
        console.error('Component initialization error:', error);
      }
    }, 100);
  }

  /**
   * Force viewport recalculation (mimics what inspector mode does)
   */
  forceViewportRecalculation() {
    // Method 1: Force media query re-evaluation
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    if (leftPanel && rightPanel) {
      // Temporarily trigger a minimal layout recalculation
      leftPanel.style.display = 'none';
      leftPanel.offsetHeight; // Force reflow
      leftPanel.style.display = '';
      
      // Force media queries to re-evaluate
      const currentWidth = window.innerWidth;
      const testQuery = window.matchMedia('(min-width: 769px)');
      
      // If we're on desktop, ensure desktop styles apply
      if (currentWidth > 768) {
        leftPanel.style.width = '32%';
        leftPanel.style.maxWidth = '32%';
        leftPanel.style.position = 'relative';
        leftPanel.style.transform = 'none';
        
        // Remove these inline styles after a brief moment to let CSS take over
        setTimeout(() => {
          leftPanel.style.width = '';
          leftPanel.style.maxWidth = '';
          leftPanel.style.position = '';
          leftPanel.style.transform = '';
        }, 50);
      }
    }
  }

  /**
   * Attach event listeners for dropdown interactions
   */
  attachEventListeners() {
    const trigger = document.querySelector('.services-dropdown');
    const popupMenu = document.querySelector('.services-popup-menu');
    const chevron = trigger ? trigger.querySelector('.icon.dropdown-trigger') : null;
    const links = popupMenu ? Array.from(popupMenu.querySelectorAll('.block-link')) : [];

    if (!trigger || !popupMenu || !chevron || links.length === 0) return;

    // Set initial states for the animation
    gsap.set(popupMenu, { scale: 0.8, y: -8, opacity: 0, transformOrigin: 'top right' });
    gsap.set(links, { x: 12, opacity: 0 });
    gsap.set(chevron, { rotation: 0, transformOrigin: 'center' });

    let isOpen = false;
    let openTl, closeTl;

    const playOpenAnimation = () => {
      if (closeTl && closeTl.isActive()) {
        closeTl.kill();
      }
      openTl = gsap.timeline({
        onStart: () => {
          gsap.set(popupMenu, { visibility: 'visible', willChange: 'transform, opacity' });
          gsap.set(chevron, { willChange: 'transform' });
        },
        onComplete: () => {
          gsap.set(popupMenu, { clearProps: 'willChange' });
          gsap.set(chevron, { clearProps: 'willChange' });
        }
      });

      openTl.to(popupMenu, {
        duration: 0.2,
        ease: 'cubic-bezier(0.2, 0, 0, 1)',
        scale: 1,
        y: 0,
        opacity: 1
      })
      .to(chevron, {
        duration: 0.3,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        rotation: 180
      }, '<')
      .to(links, {
        duration: 0.15,
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
        x: 0,
        opacity: 1,
        stagger: 0.04,
        onStart: function() {
          gsap.set(this.targets(), { willChange: 'transform, opacity' });
        },
        onComplete: function() {
          gsap.set(this.targets(), { clearProps: 'willChange' });
        }
      }, 0.15);
    };

    const playCloseAnimation = () => {
      if (openTl && openTl.isActive()) {
        openTl.kill();
      }
      closeTl = gsap.timeline({
        onComplete: () => {
          gsap.set(popupMenu, { visibility: 'hidden' });
        }
      });

      closeTl.to(popupMenu, {
        duration: 0.15,
        ease: 'cubic-bezier(0.4, 0, 1, 1)',
        scale: 0.8,
        y: -8,
        opacity: 0
      })
      .to(chevron, {
        duration: 0.2,
        ease: 'cubic-bezier(0.4, 0, 1, 1)',
        rotation: 0
      }, '<');
    };

    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      if (isOpen) {
        playCloseAnimation();
      } else {
        playOpenAnimation();
      }
      isOpen = !isOpen;
    });

    document.addEventListener('click', () => {
      if (isOpen) {
        playCloseAnimation();
        isOpen = false;
      }
    });
  }

  /**
   * Initialize Webflow interactions if available
   */
  initializeWebflowInteractions() {
    if (typeof Webflow !== 'undefined') {
      try {
        // Fully restart Webflow animations and interactions
        Webflow.destroy();
        Webflow.ready();
        Webflow.require('ix2').init();
        
        // Force animation recalculation after a brief delay
        setTimeout(() => {
          if (Webflow.require && Webflow.require('ix2')) {
            Webflow.require('ix2').store.dispatch({type: 'IX2_RAW_DATA_IMPORTED'});
          }
        }, 100);
      } catch (error) {
        // If full restart fails, try just IX2 reinit
        try {
          Webflow.require('ix2').init();
        } catch (e) {
          // Webflow re-initialization not available
        }
      }
    }
  }
}

// Make component available globally
if (typeof window !== 'undefined') {
  window.RefinedPromptHeadComponent = RefinedPromptHeadComponent;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RefinedPromptHeadComponent;
}