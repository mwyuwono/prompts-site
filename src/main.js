import './style.css'
import { Sidebar } from './components/Sidebar.js'
import { PromptForm } from './components/PromptForm.js'

class App {
  constructor() {
    this.sidebar = new Sidebar();
    this.promptForm = new PromptForm();
    this.currentPrompt = null;
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    document.querySelector('#app').innerHTML = `
      <div class="page-wrap">
        <div class="left-panel">
          ${this.sidebar.render()}
        </div>
        <div class="right-panel start-page">
          ${this.promptForm.render(this.currentPrompt)}
        </div>
      </div>
    `;
    
    // Attach event listeners after rendering
    this.sidebar.attachEventListeners();
    this.promptForm.attachEventListeners();
  }

  attachEventListeners() {
    // Listen for prompt selection
    window.addEventListener('promptSelected', (e) => {
      const promptId = e.detail.promptId;
      const promptData = this.sidebar.getPromptData(promptId);
      this.loadPrompt(promptData);
    });

    // Listen for tab changes
    window.addEventListener('tabChanged', (e) => {
      // Clear current prompt when switching tabs
      this.currentPrompt = null;
      this.updateRightPanel();
    });
  }

  loadPrompt(promptData) {
    this.currentPrompt = promptData;
    this.updateRightPanel();
  }

  updateRightPanel() {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.innerHTML = this.promptForm.render(this.currentPrompt);
    
    // Remove start-page class when showing a prompt
    if (this.currentPrompt) {
      rightPanel.classList.remove('start-page');
    } else {
      rightPanel.classList.add('start-page');
    }
    
    this.promptForm.attachEventListeners();
  }
}

// Initialize the app
new App();
