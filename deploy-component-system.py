#!/usr/bin/env python3
"""
Deploy component system to all pages with universal-prompt-head element.
Adds component scripts and activation code to enable URL parameter testing.
"""

import os
import re
from pathlib import Path

# Base directory
base_dir = Path("prompts-site-webflow-export")

# Component script includes to add to <head>
component_scripts = '''  <script src="../js/refined-prompt-head-component.js" type="text/javascript"></script>'''

# Component activation code to add before </body>
activation_code = '''  <script>
    // Initialize refined prompt head component - URL PARAMETER ONLY
    document.addEventListener('DOMContentLoaded', function() {
      const urlParams = new URLSearchParams(window.location.search);
      const testComponent = urlParams.get('test-component');
      
      // Only activate with URL parameter to prevent layout issues
      if (testComponent) {
        console.log('🚀 COMPONENT SYSTEM ACTIVATED (TEST MODE)');
        console.log('📍 URL Parameter detected:', testComponent);
        
        const targetElement = document.querySelector('.universal-prompt-head');
        if (targetElement) {
          console.log('✅ Target element found, initializing component...');
          const component = new RefinedPromptHeadComponent({
            mode: testComponent,
            enableTesting: true
          });
          component.initialize(targetElement);
        } else {
          console.error('❌ Target element .universal-prompt-head not found');
        }
      } else {
        console.log('📄 Static mode - page using original implementation');
      }
    });
  </script>'''

def get_all_html_files():
    """Get all HTML files that contain universal-prompt-head element"""
    html_files = []
    
    # Get files from both personal/ and work/ directories
    for subdir in ["personal", "work"]:
        subdir_path = base_dir / subdir
        if subdir_path.exists():
            for html_file in subdir_path.glob("*.html"):
                # Check if file contains universal-prompt-head
                content = html_file.read_text(encoding='utf-8')
                if 'universal-prompt-head' in content:
                    html_files.append(html_file)
    
    return html_files

def add_component_system(file_path):
    """Add component system to a single HTML file"""
    print(f"Processing: {file_path}")
    
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Skip if already has component system
        if 'refined-prompt-head-component' in content:
            print(f"  ✅ Already has component system")
            return True
        
        # Add script to head section (before </head>)
        head_pattern = r'(.*</head>)'
        if re.search(head_pattern, content, re.DOTALL):
            content = re.sub(
                head_pattern,
                rf'{component_scripts}\n\1',
                content,
                flags=re.DOTALL
            )
            print(f"  ✅ Added component script to <head>")
        else:
            print(f"  ❌ Could not find </head> tag")
            return False
        
        # Add activation code before </body>
        body_pattern = r'(.*)(</body>)'
        if re.search(body_pattern, content, re.DOTALL):
            content = re.sub(
                body_pattern,
                rf'\1{activation_code}\n\2',
                content,
                flags=re.DOTALL
            )
            print(f"  ✅ Added activation code before </body>")
        else:
            print(f"  ❌ Could not find </body> tag")
            return False
        
        # Write updated content
        file_path.write_text(content, encoding='utf-8')
        print(f"  ✅ File updated successfully")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing file: {e}")
        return False

def main():
    print("🚀 Deploying component system to all pages...")
    
    # Get all HTML files with universal-prompt-head
    html_files = get_all_html_files()
    print(f"Found {len(html_files)} pages with universal-prompt-head element")
    
    success_count = 0
    
    for file_path in html_files:
        if add_component_system(file_path):
            success_count += 1
    
    print(f"\n📊 Deployment Results:")
    print(f"  ✅ Successfully updated: {success_count} pages")
    print(f"  ❌ Failed to update: {len(html_files) - success_count} pages")
    
    print(f"\n🎯 Component system deployed!")
    print(f"🔧 Test any page with: ?test-component=replace-safe")
    print(f"📋 Modes available: test, replace-safe, comparison")

if __name__ == "__main__":
    main()