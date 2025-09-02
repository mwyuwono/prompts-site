#!/usr/bin/env python3
"""
Clean up component for production by removing testing UI and switching to regular replace mode.
"""

import os
import re
from pathlib import Path

# Base directory
base_dir = Path("prompts-site-webflow-export")

# Clean production activation code (no testing UI, minimal logging)
production_activation_code = '''  <script>
    // Initialize refined prompt head component - PRODUCTION
    document.addEventListener('DOMContentLoaded', function() {
      const targetElement = document.querySelector('.universal-prompt-head');
      if (targetElement) {
        const component = new RefinedPromptHeadComponent({
          mode: 'replace'  // Regular replace mode for production
        });
        component.initialize(targetElement);
      }
    });
  </script>'''

def get_all_component_files():
    """Get all HTML files that have the component system"""
    html_files = []
    
    # Get files from both personal/ and work/ directories
    for subdir in ["personal", "work"]:
        subdir_path = base_dir / subdir
        if subdir_path.exists():
            for html_file in subdir_path.glob("*.html"):
                # Check if file has component system
                content = html_file.read_text(encoding='utf-8')
                if 'refined-prompt-head-component' in content:
                    html_files.append(html_file)
    
    return html_files

def cleanup_component(file_path):
    """Clean up component activation code for production"""
    print(f"Processing: {file_path}")
    
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Find and replace the existing component activation code
        old_pattern = r'<script>\s*// Initialize refined prompt head component.*?</script>'
        
        if re.search(old_pattern, content, re.DOTALL):
            content = re.sub(
                old_pattern,
                production_activation_code,
                content,
                flags=re.DOTALL
            )
            print(f"  ✅ Replaced with clean production activation code")
        else:
            print(f"  ❌ Could not find existing component activation code")
            return False
        
        # Write updated content
        file_path.write_text(content, encoding='utf-8')
        print(f"  ✅ File updated successfully")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing file: {e}")
        return False

def main():
    print("🧹 Cleaning up component for production...")
    
    # Get all HTML files with component system
    html_files = get_all_component_files()
    print(f"Found {len(html_files)} pages with component system")
    
    success_count = 0
    
    for file_path in html_files:
        if cleanup_component(file_path):
            success_count += 1
    
    print(f"\n📊 Cleanup Results:")
    print(f"  ✅ Successfully updated: {success_count} pages")
    print(f"  ❌ Failed to update: {len(html_files) - success_count} pages")
    
    print(f"\n🎯 Component cleaned up for production!")
    print(f"📝 Next: Remove red background from CSS")
    print(f"🏗️ Next: Clean up component JavaScript code")

if __name__ == "__main__":
    main()