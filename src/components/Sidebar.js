import promptsData from '../data/prompts.json';

export class Sidebar {
  constructor() {
    this.currentTab = 'personal';
    this.currentPrompt = null;
  }

  render() {
    return `
      <div class="sidebar">
        <div class="sidebar-header">
          <h1 class="prompts-title">Prompts</h1>
          <button class="mobile-close" id="mobileClose">
            ×
          </button>
        </div>
        
        <div class="sidebar-section-head">
          <div class="tab personal ${this.currentTab === 'personal' ? 'active' : ''}" data-tab="personal">
            <div>Personal prompts</div>
          </div>
          <div class="tab work ${this.currentTab === 'work' ? 'active' : ''}" data-tab="work">
            <div>Work prompts</div>
          </div>
        </div>

        <div class="sidebar-content">
          ${this.renderPromptCategories()}
        </div>
      </div>
    `;
  }

  renderPromptCategories() {
    const categories = promptsData.categories[this.currentTab];
    
    return Object.entries(categories).map(([categoryName, prompts]) => `
      <div class="sidebar-section">
        <div class="sidebar-category-head">${this.formatCategoryName(categoryName)}</div>
        <div class="sidebar-links-container">
          ${prompts.map(prompt => `
            <a href="#" class="sidebar-link" data-prompt-id="${prompt.id}">
              ${prompt.title}
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  formatCategoryName(categoryName) {
    const categoryMap = {
      'utilities': 'Utilities',
      'research': 'Research', 
      'creativity': 'Creativity',
      'banking': 'Banking',
      'miscellaneous': 'Miscellaneous',
      'prototyping': 'Prototyping',
      'ehc': 'E.H.C.'
    };
    return categoryMap[categoryName] || categoryName;
  }

  attachEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabType = e.currentTarget.dataset.tab;
        this.switchTab(tabType);
      });
    });

    // Prompt selection
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const promptId = e.currentTarget.dataset.promptId;
        this.selectPrompt(promptId);
      });
    });
  }

  switchTab(tabType) {
    this.currentTab = tabType;
    this.updateSidebar();
    
    // Fire custom event for main app to listen to
    window.dispatchEvent(new CustomEvent('tabChanged', { 
      detail: { tab: tabType } 
    }));
  }

  selectPrompt(promptId) {
    this.currentPrompt = promptId;
    
    // Update active state
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.remove('current');
    });
    document.querySelector(`[data-prompt-id="${promptId}"]`).classList.add('current');
    
    // Fire custom event for main app to listen to
    window.dispatchEvent(new CustomEvent('promptSelected', { 
      detail: { promptId } 
    }));
  }

  updateSidebar() {
    const sidebarContent = document.querySelector('.sidebar-content');
    sidebarContent.innerHTML = this.renderPromptCategories();
    
    // Update tab active states
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`.tab.${this.currentTab}`).classList.add('active');
    
    this.attachEventListeners();
  }

  getPromptData(promptId) {
    console.log('Searching for promptId:', promptId);
    // Find prompt across all categories
    for (const tabType of ['personal', 'work']) {
      for (const category of Object.values(promptsData.categories[tabType])) {
        const prompt = category.find(p => p.id === promptId);
        if (prompt) {
          console.log('Found prompt:', prompt);
          return prompt;
        }
      }
    }
    console.log('Prompt not found for promptId:', promptId);
    return null;
  }
}