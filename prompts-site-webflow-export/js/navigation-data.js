/**
 * Navigation Data - Single Source of Truth for Sidebar Navigation
 * This file contains all navigation links for the prompts site
 */

const NavigationData = {
  personal: {
    utilities: [
      { title: "Prompt improver", href: "prompt-improver.html" },
      { title: "Proofreader", href: "copy-editor.html" },
      { title: "Meeting notes", href: "../work/meeting-notes.html" },
      { title: "Sell something", href: "sell-something.html" },
      { title: "Request shipping quote", href: "shipping-antiques.html" }
    ],
    research: [
      { title: "Expertise test", href: "quiz-me.html" },
      { title: "Learn any topic", href: "new-topic.html" },
      { title: "Research products & materials", href: "sourcing-products-materials.html" },
      { title: "Antiques Expert", href: "antiques.html" },
      { title: "Restaurant finder", href: "restaurant-finder.html" },
      { title: "Accommodations finder", href: "lodging-finder.html" },
      { title: "Visualize trip timeline", href: "travel-dates-timeline.html" }
    ],
    creativity: [
      { title: "Midjourney visual prompts", href: "mj.html" },
      { title: "Midjourney text prompts", href: "midjourney-prompts.html" },
      { title: "Project how-to guide", href: "project-guidance.html" },
      { title: "Architecture critic", href: "architecture-critic.html" },
      { title: "Audio Essay Generator", href: "audio-essay.html" },
      { title: "Image Quick-Use Prompts", href: "image-quick-use.html" }
    ]
  },
  work: {
    banking: [
      { title: "General design request", href: "general-banking.html" },
      { title: "MAGIC use cases", href: "magic-use-case.html" }
    ],
    miscellaneous: [
      { title: "E-mail reply", href: "work-email-reply.html" },
      { title: "Project impact summary", href: "project-summary.html" },
      { title: "Jira task", href: "jira.html" },
      { title: "Self assessment", href: "impact.html" },
      { title: "Colleague assessment", href: "assessments.html" }
    ],
    prototyping: [
      { title: "jQuery: Replay user inputs", href: "replay-user-inputs.html" },
      { title: "Webflow code assistance", href: "webflow.html" },
      { title: "Interactive charts", href: "data-viz.html" },
      { title: "Bar charts: Calculate pixel heights", href: "bar-chart-sizing.html" }
    ],
    ehc: [
      { title: "Email newsletters", href: "eh-emails.html" }
    ]
  }
};

/**
 * Helper function to get navigation data
 */
function getNavigationData() {
  return NavigationData;
}

/**
 * Helper function to get category display names
 */
function getCategoryDisplayNames() {
  return {
    utilities: "Utilities",
    research: "Research", 
    creativity: "Creativity",
    banking: "Banking",
    miscellaneous: "Miscellaneous",
    prototyping: "Prototyping",
    ehc: "E.H.C."
  };
}