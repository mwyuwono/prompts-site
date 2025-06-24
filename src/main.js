import './style.css'

// App initialization
document.querySelector('#app').innerHTML = `
  <div class="page-wrap">
    <div class="left-panel">
      <div class="sidebar">
        <h2>Prompts</h2>
        <div class="sidebar-content">
          <div class="sidebar-section">
            <div class="sidebar-category-head">Personal</div>
            <p>Navigation will go here...</p>
          </div>
          <div class="sidebar-section">
            <div class="sidebar-category-head">Work</div>
            <p>Navigation will go here...</p>
          </div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="start-page-content">
        <h1>Prompts Site - Modern Version</h1>
        <p>🚀 Successfully set up Vite project!</p>
        <p>Next steps:</p>
        <ul>
          <li>Copy CSS from Webflow export</li>
          <li>Create components for sidebar and forms</li>
          <li>Extract prompt data to JSON</li>
          <li>Deploy to p.weaver-yuwono.com</li>
        </ul>
      </div>
    </div>
  </div>
`
