#!/usr/bin/env python3
"""
Switch all HTML files to use the production component instead of testing version.
"""

import os
import re
from pathlib import Path

# Base directory
base_dir = Path("prompts-site-webflow-export")

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

def switch_to_production_component(file_path):
    """Switch HTML file to use production component"""
    print(f"Processing: {file_path}")
    
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Replace the script src with production version
        old_script = 'refined-prompt-head-component.js'
        new_script = 'refined-prompt-head-component-production.js'
        
        if old_script in content:
            content = content.replace(old_script, new_script)
            print(f"  ✅ Switched to production component script")
        else:
            print(f"  ❌ Could not find component script reference")
            return False
        
        # Write updated content
        file_path.write_text(content, encoding='utf-8')
        print(f"  ✅ File updated successfully")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing file: {e}")
        return False

def main():
    print("🔄 Switching to production component...")
    
    # Get all HTML files with component system
    html_files = get_all_component_files()
    print(f"Found {len(html_files)} pages with component system")
    
    success_count = 0
    
    for file_path in html_files:
        if switch_to_production_component(file_path):
            success_count += 1
    
    print(f"\n📊 Switch Results:")
    print(f"  ✅ Successfully updated: {success_count} pages")
    print(f"  ❌ Failed to update: {len(html_files) - success_count} pages")
    
    print(f"\n🎯 All pages now use production component!")
    print(f"🧹 No more testing UI, logging, or safety panels")
    print(f"⚡ Clean, minimal component implementation")

if __name__ == "__main__":
    main()