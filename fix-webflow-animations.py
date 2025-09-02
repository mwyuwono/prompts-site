#!/usr/bin/env python3
"""
Remove Webflow animation inline styles that hide content
Since Webflow compatibility is not required per CLAUDE.md
"""

import os
import re
import glob

def fix_webflow_styles(file_path):
    """Remove opacity:0 and transform styles that hide content"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to match style attributes with opacity:0 and/or transform
        # This removes the entire style attribute if it only contains animation properties
        style_pattern = r'style="[^"]*(?:opacity:\s*0|transform:\s*translate3d\([^)]+\))[^"]*"'
        
        # Find all matches to analyze them
        matches = re.findall(style_pattern, content)
        
        if matches:
            print(f"\nProcessing: {os.path.basename(file_path)}")
            for match in matches:
                print(f"  Found: {match}")
                
                # Check if style contains only animation properties we want to remove
                style_content = match[7:-1]  # Remove style=" and "
                
                # Split by semicolon and check each property
                properties = [prop.strip() for prop in style_content.split(';') if prop.strip()]
                
                # Properties to remove (Webflow animation properties)
                animation_props = ['opacity', 'transform', '-webkit-transform', 'will-change']
                
                # Keep properties that are not animation-related
                keep_props = []
                for prop in properties:
                    prop_name = prop.split(':')[0].strip()
                    if prop_name not in animation_props:
                        keep_props.append(prop)
                
                # Create replacement
                if keep_props:
                    # Keep non-animation styles
                    new_style = f'style="{"; ".join(keep_props)}"'
                else:
                    # Remove entire style attribute if only animation props
                    new_style = ''
                
                print(f"  Replace with: {new_style if new_style else '(removed)'}")
                content = content.replace(match, new_style)
        
        # Clean up any double spaces left by removed attributes
        content = re.sub(r'\s+', ' ', content)
        content = re.sub(r'>\s+<', '><', content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Fixed {os.path.basename(file_path)}")
            return True
        else:
            return False
            
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {e}")
        return False

def main():
    """Process all HTML files in the export directory"""
    base_dir = "prompts-site-webflow-export"
    
    if not os.path.exists(base_dir):
        print(f"Directory {base_dir} not found")
        return
    
    # Find all HTML files
    html_files = []
    for pattern in ["*.html", "*/*.html"]:
        html_files.extend(glob.glob(os.path.join(base_dir, pattern)))
    
    print(f"Found {len(html_files)} HTML files to process")
    
    fixed_count = 0
    for file_path in html_files:
        if fix_webflow_styles(file_path):
            fixed_count += 1
    
    print(f"\n🎉 Fixed {fixed_count} files")
    print("Webflow animation styles removed - content should now display correctly!")

if __name__ == "__main__":
    main()