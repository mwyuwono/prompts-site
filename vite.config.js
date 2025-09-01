import { defineConfig } from 'vite';

export default defineConfig({
  root: 'prompts-site-webflow-export',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'prompts-site-webflow-export/index.html',
        'personal/antiques': 'prompts-site-webflow-export/personal/antiques.html',
        'personal/architecture-critic': 'prompts-site-webflow-export/personal/architecture-critic.html',
        'personal/artwork-scene-composer': 'prompts-site-webflow-export/personal/artwork-scene-composer.html',
        'personal/audio-essay': 'prompts-site-webflow-export/personal/audio-essay.html',
        'personal/copy-editor': 'prompts-site-webflow-export/personal/copy-editor.html',
        'personal/image-quick-use': 'prompts-site-webflow-export/personal/image-quick-use.html',
        'personal/lodging-finder': 'prompts-site-webflow-export/personal/lodging-finder.html',
        'personal/midjourney-prompts': 'prompts-site-webflow-export/personal/midjourney-prompts.html',
        'personal/mj': 'prompts-site-webflow-export/personal/mj.html',
        'personal/new-topic': 'prompts-site-webflow-export/personal/new-topic.html',
        'personal/project-guidance': 'prompts-site-webflow-export/personal/project-guidance.html',
        'personal/prompt-builder': 'prompts-site-webflow-export/personal/prompt-builder.html',
        'personal/prompt-improver': 'prompts-site-webflow-export/personal/prompt-improver.html',
        'personal/quiz-me': 'prompts-site-webflow-export/personal/quiz-me.html',
        'personal/restaurant-finder': 'prompts-site-webflow-export/personal/restaurant-finder.html',
        'personal/sell-something': 'prompts-site-webflow-export/personal/sell-something.html',
        'personal/shipping-antiques': 'prompts-site-webflow-export/personal/shipping-antiques.html',
        'personal/sourcing-products-materials': 'prompts-site-webflow-export/personal/sourcing-products-materials.html',
        'personal/travel-dates-timeline': 'prompts-site-webflow-export/personal/travel-dates-timeline.html',
        'work/assessments': 'prompts-site-webflow-export/work/assessments.html',
        'work/bar-chart-sizing': 'prompts-site-webflow-export/work/bar-chart-sizing.html',
        'work/data-viz': 'prompts-site-webflow-export/work/data-viz.html',
        'work/eh-emails': 'prompts-site-webflow-export/work/eh-emails.html',
        'work/general-banking': 'prompts-site-webflow-export/work/general-banking.html',
        'work/impact': 'prompts-site-webflow-export/work/impact.html',
        'work/jira': 'prompts-site-webflow-export/work/jira.html',
        'work/magic-use-case': 'prompts-site-webflow-export/work/magic-use-case.html',
        'work/meeting-notes': 'prompts-site-webflow-export/work/meeting-notes.html',
        'work/project-summary': 'prompts-site-webflow-export/work/project-summary.html',
        'work/replay-user-inputs': 'prompts-site-webflow-export/work/replay-user-inputs.html',
        'work/webflow': 'prompts-site-webflow-export/work/webflow.html',
        'work/work-email-reply': 'prompts-site-webflow-export/work/work-email-reply.html'
      }
    }
  }
});