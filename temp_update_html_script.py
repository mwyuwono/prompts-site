import re
import os

html_files = [
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/meeting-notes.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/eh-emails.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/magic-use-case.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/jira.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/general-banking.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/data-viz.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/webflow.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/work-email-reply.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/impact.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/assessments.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/replay-user-inputs.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/bar-chart-sizing.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/work/project-summary.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/architecture-critic.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/lodging-finder.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/quiz-me.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/artwork-scene-composer.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/project-guidance.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/antiques.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/audio-essay.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/restaurant-finder.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/sourcing-products-materials.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/copy-editor.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/image-quick-use.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/new-topic.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/midjourney-prompts.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/travel-dates-timeline.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/sell-something.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/prompt-builder.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/prompt-improver.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/index.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/sandbox/chart-testing.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/mj.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/personal/shipping-antiques.html",
    "/Users/mwy/Library/Mobile Documents/com~apple~CloudDocs/Projects/prompts-site/prompts-site-webflow-export/role-spec.html"
]

# Patterns for individual old link tags
old_link_patterns = [
    re.compile(r'<link\s+href="(?:../)?css/normalize\.css"[^>]*>', re.IGNORECASE),
    re.compile(r'<link\s+href="(?:../)?css/components\.css"[^>]*>', re.IGNORECASE),
    re.compile(r'<link\s+href="(?:../)?css/gptp\.css"[^>]*>', re.IGNORECASE),
    re.compile(r'<link\s+href="(?:../)?css/hamburger-menu\.css"[^>]*>', re.IGNORECASE)
]

for file_path in html_files:
    updated = False
    with open(file_path, 'r') as f:
        content = f.read()

    original_content = content # Keep original to check for changes

    # Remove old link tags
    for pattern in old_link_patterns:
        content = pattern.sub('', content)

    # Determine the correct new link based on file location
    if "prompts-site-webflow-export/personal/" in file_path or \
       "prompts-site-webflow-export/work/" in file_path or \
       "prompts-site-webflow-export/sandbox/" in file_path:
        new_main_link = '<link href="../css/main.css" rel="stylesheet" type="text/css">'
    else:
        new_main_link = '<link href="css/main.css" rel="stylesheet" type="text/css">'

    # Insert the new main.css link after the <title> tag
    # This regex looks for <title>...</title> and inserts the new link right after it.
    # It's important to handle cases where <title> might be on a different line or have whitespace around it.
    title_tag_pattern = re.compile(r'(<title>.*?</title>\s*)', re.DOTALL | re.IGNORECASE)
    
    if title_tag_pattern.search(content):
        content = title_tag_pattern.sub(r'\1\n  ' + new_main_link, content, 1)
    else:
        # Fallback: if no title tag, insert at the beginning of <head>
        head_tag_pattern = re.compile(r'(<head>\s*)', re.DOTALL | re.IGNORECASE)
        if head_tag_pattern.search(content):
            content = head_tag_pattern.sub(r'\1\n  ' + new_main_link, content, 1)
        else:
            print(f"Warning: Could not find <head> or <title> tag in {file_path}. Skipping main.css insertion.")
            continue # Skip this file if we can't find a place to insert

    # Write back only if content changed
    if content != original_content:
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes needed for {file_path}")

print("HTML file updates complete.")