import { PromptToolbar } from './PromptToolbar.js';

export class PromptForm {
  constructor() {
    this.currentPrompt = null;
    this.toolbar = new PromptToolbar();
  }

  render(promptData) {
    if (!promptData) {
      return this.renderStartPage();
    }

    this.currentPrompt = promptData;
    
    return `
      <div class="prompt-form-container">
        <div class="prompt-form">
          <div class="prompt-header">
            <h1>${promptData.title}</h1>
            ${promptData.description ? `
              <div class="header-description">
                <div>${promptData.description}</div>
              </div>
            ` : ''}
            
            ${promptData.overview ? this.renderOverview(promptData.overview) : ''}
          </div>

          ${this.toolbar.render()}

          <form class="prompt-form-element">
            ${this.renderInputFields(promptData.inputFields || [])}
            
            <div class="form-controls">
              <button type="button" class="copy-btn" id="copyBtn">
                Copy to clipboard
              </button>
            </div>

            <div class="prompt-text-container">
              <div class="prompt-text">
                ${promptData.promptText.content}
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderStartPage() {
    return `
      <div class="start-page-content">
        <h1>AI Prompts Collection</h1>
        <p>🚀 Welcome to your modernized prompts site!</p>
        <p>Select a prompt from the sidebar to get started.</p>
        
        <div class="resources-content">
          <h2>Quick Links</h2>
          <div class="link-list">
            <a href="https://claude.ai/chats" target="_blank" class="block-link">
              <div class="link-title">Claude</div>
              <div class="link-description">Anthropic</div>
            </a>
            <a href="https://chat.openai.com/" target="_blank" class="block-link">
              <div class="link-title">ChatGPT</div>
              <div class="link-description">OpenAI</div>
            </a>
            <a href="https://www.perplexity.ai" target="_blank" class="block-link">
              <div class="link-title">Perplexity</div>
              <div class="link-description">AI-powered search</div>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  renderOverview(overview) {
    if (!overview.userSteps && !overview.aiSteps) return '';
    
    return `
      <div class="prompt-overview-wrap">
        <div class="prompt-overview">
          ${overview.userSteps ? `
            <div class="prompt-overview-section">
              <div class="section-heading">You</div>
              <ol class="instructions-list">
                ${overview.userSteps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
          
          ${overview.aiSteps ? `
            <div class="prompt-overview-section">
              <div class="section-heading">AI</div>
              <ol class="instructions-list">
                ${overview.aiSteps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderInputFields(inputFields) {
    if (!inputFields || inputFields.length === 0) return '';
    
    return inputFields.map(field => `
      <div class="field-wrap">
        <label for="${field.name}" class="field-label">${field.label}</label>
        ${this.renderField(field)}
      </div>
    `).join('');
  }

  renderField(field) {
    const commonAttrs = `
      id="${field.name}"
      name="${field.name}"
      class="field"
      ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
      ${field.required ? 'required' : ''}
      ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
    `;

    switch (field.type) {
      case 'textarea':
        return `<textarea ${commonAttrs} rows="4"></textarea>`;
      case 'text':
        return `<input type="text" ${commonAttrs}>`;
      case 'select':
        return `
          <select ${commonAttrs}>
            ${field.options?.map(option => 
              `<option value="${option.value}">${option.label}</option>`
            ).join('') || ''}
          </select>
        `;
      default:
        return `<input type="text" ${commonAttrs}>`;
    }
  }

  attachEventListeners() {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.copyToClipboard();
      });
    }
    
    // Attach toolbar event listeners
    this.toolbar.attachEventListeners();
  }

  async copyToClipboard() {
    const form = document.querySelector('.prompt-form-element');
    const promptText = document.querySelector('.prompt-text');
    
    let content = '';
    
    // Collect form field values
    if (form) {
      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
        if (value.trim()) {
          const field = this.currentPrompt?.inputFields?.find(f => f.name === key);
          const label = field?.label || key;
          
          // Apply formatting if specified
          if (field?.formatting) {
            const prefix = field.formatting.prefix || '';
            const suffix = field.formatting.suffix || '';
            content += `${label}: ${prefix}${value}${suffix}\n\n`;
          } else {
            content += `${label}: ${value}\n\n`;
          }
        }
      }
    }
    
    // Add static prompt text (convert HTML to text)
    if (promptText) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = promptText.innerHTML;
      content += tempDiv.textContent || tempDiv.innerText || '';
    }
    
    try {
      await navigator.clipboard.writeText(content);
      this.showCopyFeedback();
      // Show services dropdown after successful copy
      this.toolbar.showServicesAfterCopy();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      this.fallbackCopyToClipboard(content);
    }
  }

  fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback();
      // Show services dropdown after successful copy
      this.toolbar.showServicesAfterCopy();
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
    
    document.body.removeChild(textArea);
  }

  showCopyFeedback() {
    const copyBtn = document.getElementById('copyBtn');
    if (!copyBtn) return;
    
    const originalText = copyBtn.textContent;
    const originalClass = copyBtn.className;
    
    copyBtn.textContent = 'Copied!';
    copyBtn.classList.add('copied');
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.className = originalClass;
    }, 2000);
  }
}