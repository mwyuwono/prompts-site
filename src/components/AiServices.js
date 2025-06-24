class AiServices {
  constructor() {
    this.services = {
      llms: [
        { name: 'Claude', company: 'Anthropic', url: 'https://claude.ai/' },
        { name: 'ChatGPT', company: 'OpenAI', url: 'https://chat.openai.com/?model=gpt-4-code-interpreter' },
        { name: 'Gemini', company: 'Google', url: 'https://bard.google.com/' },
        { name: 'AI Studio', company: 'Google', url: 'https://aistudio.google.com/' },
        { name: 'Perplexity', company: '', url: 'https://www.perplexity.ai' },
        { name: 'Poe', company: 'Quora', url: 'https://poe.com/' }
      ],
      otherTools: [
        { name: 'Black Forest Labs', company: 'Image generation', url: 'https://blackforestlabs.ai/' },
        { name: 'NotebookLM', company: 'Google', url: 'https://notebooklm.google/' },
        { name: 'Midjourney', company: 'Image generation', url: 'https://www.midjourney.com/imagine' },
        { name: 'Revere', company: 'Image generation', url: 'https://revere.ai/' },
        { name: 'ImageFX', company: 'Google Labs', url: 'https://aitestkitchen.withgoogle.com/tools/image-fx' },
        { name: 'Image Outpainter', company: 'Hugging Face', url: 'https://huggingface.co/spaces/fffiloni/image-outpainter' }
      ]
    };
  }

  render() {
    return `
      <div class="ai-services-section">
        <div class="llms-section">
          <h2 class="services-heading">LLMs</h2>
          <div class="services-grid">
            ${this.services.llms.map(service => `
              <a href="${service.url}" target="_blank" class="service-button">
                <span class="service-name">${service.name}</span>
                ${service.company ? `<span class="service-company">${service.company}</span>` : ''}
              </a>
            `).join('')}
          </div>
        </div>
        
        <div class="other-tools-section">
          <h2 class="services-heading">Other tools</h2>
          <div class="services-grid">
            ${this.services.otherTools.map(service => `
              <a href="${service.url}" target="_blank" class="service-button">
                <span class="service-name">${service.name}</span>
                ${service.company ? `<span class="service-company">${service.company}</span>` : ''}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

export default AiServices;