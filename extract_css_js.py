#!/usr/bin/env python3
import re
import os
from pathlib import Path

def extract_css_js(html_content, filename):
    """Extract CSS and JavaScript from HTML content"""
    
    # Extract CSS from <style> tags
    css_pattern = r'<style[^>]*>(.*?)</style>'
    css_matches = re.findall(css_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    # Extract inline JavaScript (not external src references)
    # This pattern finds <script> tags without src attribute
    script_pattern = r'<script(?![^>]*src=)[^>]*>(.*?)</script>'
    script_matches = re.findall(script_pattern, html_content, re.DOTALL | re.IGNORECASE)
    
    # Combine all CSS
    combined_css = '\n'.join(css_matches)
    
    # Combine all JS
    combined_js = '\n'.join(script_matches)
    
    return combined_css, combined_js, css_matches, script_matches

def update_html(html_content, filename, has_css, has_js):
    """Update HTML to reference external CSS and JS files"""
    
    # Remove <style> tags and their content
    if has_css:
        html_content = re.sub(r'<style[^>]*>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove inline <script> tags (keep external ones)
    if has_js:
        # Remove inline scripts (without src attribute)
        html_content = re.sub(r'<script(?![^>]*src=)[^>]*>.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Add CSS reference before </head>
    if has_css:
        css_link = f'    <link rel="stylesheet" href="styles-{filename}.css">\n'
        html_content = html_content.replace('</head>', css_link + '</head>')
    
    # Add JS reference before </body>
    if has_js:
        js_script = f'    <script src="scripts-{filename}.js"></script>\n'
        html_content = html_content.replace('</body>', js_script + '</body>')
    
    return html_content

# Process all HTML files
html_dir = r'C:\Users\DELL\OneDrive\Documents\jaecoo'
html_files = [
    ('index.html', 'index'),
    ('J5EV.html', 'J5EV'),
    ('J7.html', 'J7'),
    ('J8.html', 'J8')
]

results = []

for filepath, basename in html_files:
    full_path = os.path.join(html_dir, filepath)
    
    with open(full_path, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract CSS and JS
    css_content, js_content, css_matches, js_matches = extract_css_js(html_content, basename)
    
    has_css = len(css_content.strip()) > 0
    has_js = len(js_content.strip()) > 0
    
    results.append({
        'file': filepath,
        'basename': basename,
        'has_css': has_css,
        'has_js': has_js,
        'css_size': len(css_content),
        'js_size': len(js_content),
        'css_matches': len(css_matches),
        'js_matches': len(js_matches),
        'html_content': html_content,
        'css_content': css_content,
        'js_content': js_content
    })
    
    print(f"=== {filepath} ===")
    print(f"CSS: {has_css} ({len(css_matches)} blocks, {len(css_content)} chars)")
    print(f"JS: {has_js} ({len(js_matches)} blocks, {len(js_content)} chars)")
    print()

# Save extracted files
print("Creating extracted files...\n")
for result in results:
    basename = result['basename']
    
    if result['has_css']:
        css_file = os.path.join(html_dir, f'styles-{basename}.css')
        with open(css_file, 'w', encoding='utf-8') as f:
            f.write(result['css_content'])
        print(f"Created: styles-{basename}.css")
    
    if result['has_js']:
        js_file = os.path.join(html_dir, f'scripts-{basename}.js')
        with open(js_file, 'w', encoding='utf-8') as f:
            f.write(result['js_content'])
        print(f"Created: scripts-{basename}.js")

# Update HTML files
print("\nUpdating HTML files...\n")
for result in results:
    basename = result['basename']
    filepath = result['file']
    full_path = os.path.join(html_dir, filepath)
    
    updated_html = update_html(result['html_content'], basename, result['has_css'], result['has_js'])
    
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(updated_html)
    
    print(f"Updated: {filepath}")

print("\nDone!")
