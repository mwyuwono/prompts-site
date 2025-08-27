#!/usr/bin/env python3
"""
Fix Hamburger Menu HTML Structure
Fixes the stray closing div tag after hamburger menu button
"""

import os
import re
from pathlib import Path

def fix_html_structure(file_path):
    """Fix the hamburger menu HTML structure in a file"""
    print(f"Processing: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        filename = Path(file_path).name
        
        # Find and fix the problematic structure
        # Pattern: hamburger button followed by stray </div>
        problematic_pattern = r'(<button class="hamburger-menu"[^>]*>\s*<span class="hamburger-icon">[^<]*</span>\s*</button>)\s*</div>'
        
        if re.search(problematic_pattern, content, re.MULTILINE):
            # Replace with just the hamburger button (remove stray </div>)
            content = re.sub(problematic_pattern, r'\1', content, flags=re.MULTILINE)
            print(f"  ✅ Fixed hamburger HTML structure in {filename}")
            
            # Write the updated content back
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        else:
            print(f"  ℹ️  No structure issues found in {filename}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {str(e)}")
        return False

def main():
    """Main execution function"""
    # Get all HTML files in the webflow export directory
    base_dir = "prompts-site-webflow-export"
    html_files = []
    
    # Find all HTML files
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"Found {len(html_files)} HTML files to check:")
    print()
    
    # Process each file
    fixed = 0
    
    for file_path in html_files:
        if fix_html_structure(file_path):
            fixed += 1
        print()
    
    print(f"HTML structure fix completed!")
    print(f"✅ Fixed structure in: {fixed} files")

if __name__ == "__main__":
    main()