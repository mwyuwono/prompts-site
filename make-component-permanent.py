#!/usr/bin/env python3
"""
Make component permanent on all pages by removing URL parameter requirement.
Converts from parameter-based activation to always-active deployment.
"""

import os
import re
from pathlib import Path

# Base directory
base_dir = Path("prompts-site-webflow-export")

# Updated activation code (always runs, no URL parameter needed)
new_activation_code = '''  <script>
    // Initialize refined prompt head component - PERMANENT DEPLOYMENT
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🚀 COMPONENT SYSTEM INITIALIZING (PERMANENT MODE)');
      
      const targetElement = document.querySelector('.universal-prompt-head');
      if (targetElement) {
        console.log('✅ Target element found, initializing component...');
        const component = new RefinedPromptHeadComponent({
          mode: 'replace-safe',  // Use safe replace mode with backup/rollback
          enableTesting: false   // Disable testing features for production
        });
        component.initialize(targetElement);
      } else {
        console.error('❌ Target element .universal-prompt-head not found');
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

def make_component_permanent(file_path):
    """Remove URL parameter requirement from a single HTML file"""
    print(f"Processing: {file_path}")
    
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Find and replace the existing component activation code
        # Look for the script block with URL parameter check
        old_pattern = r'<script>\s*// Initialize refined prompt head component.*?</script>'
        
        if re.search(old_pattern, content, re.DOTALL):
            content = re.sub(
                old_pattern,
                new_activation_code,
                content,
                flags=re.DOTALL
            )
            print(f"  ✅ Replaced parameter-based activation with permanent activation")
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
    print("🔄 Making component permanent on all pages...")
    
    # Get all HTML files with component system
    html_files = get_all_component_files()
    print(f"Found {len(html_files)} pages with component system")
    
    success_count = 0
    
    for file_path in html_files:
        if make_component_permanent(file_path):
            success_count += 1
    
    print(f"\n📊 Conversion Results:")
    print(f"  ✅ Successfully updated: {success_count} pages")
    print(f"  ❌ Failed to update: {len(html_files) - success_count} pages")
    
    print(f"\n🎯 Component is now PERMANENT on all pages!")
    print(f"🔴 Red background still active - remove from CSS when ready")
    print(f"🛡️ Safe replace mode with backup/rollback still available")

if __name__ == "__main__":
    main()