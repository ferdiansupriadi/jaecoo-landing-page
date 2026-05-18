#!/usr/bin/env python3
"""
Extract CSS and JavaScript from HTML files and create separate files
"""
import re
import os

def extract_css_and_js_from_html(html_path):
    """Extract CSS and JS from HTML file"""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract all <style> content (non-external)
    css_pattern = r'<style[^>]*?>(.*?)</style>'
    css_blocks = re.findall(css_pattern, content, re.DOTALL | re.IGNORECASE)
    combined_css = '\n\n'.join(css_blocks)
    
    # Extract all inline <script> content (not type="application/ld+json" and not with src attribute)
    # We need to be careful to exclude JSON-LD and external scripts
    script_pattern = r'<script[^>]*?(?<!src=["\'])[^>]*?>([^<]*?)</script>'
    all_scripts = re.findall(script_pattern, content, re.DOTALL | re.IGNORECASE)
    
    # Filter out JSON-LD and external scripts
    js_blocks = []
    for match in re.finditer(r'<script[^>]*?(?<!src=["\'])[^>]*?>(.*?)</script>', content, re.DOTALL | re.IGNORECASE):
        script_tag = match.group(0)
        script_content = match.group(1)
        
        # Skip JSON-LD
        if 'application/ld+json' in script_tag:
            continue
        
        # Skip if it's external (has src)
        if re.search(r'src\s*=', script_tag):
            continue
        
        js_blocks.append(script_content)
    
    combined_js = '\n\n'.join(js_blocks)
    
    return combined_css, combined_js, content

def update_html_file(html_content, basename, has_css, has_js):
    """Update HTML to reference external CSS/JS files"""
    
    # Remove <style> tags
    if has_css:
        html_content = re.sub(r'<style[^>]*?>.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove inline <script> tags (but keep JSON-LD and external scripts)
    if has_js:
        # Only remove inline scripts (without src, not JSON-LD)
        def should_remove_script(match):
            script_tag = match.group(0)
            # Keep JSON-LD
            if 'application/ld+json' in script_tag:
                return match.group(0)
            # Keep external scripts (with src)
            if re.search(r'src\s*=', script_tag):
                return match.group(0)
            # Remove everything else (inline scripts)
            return ''
        
        html_content = re.sub(r'<script[^>]*?>.*?</script>', lambda m: should_remove_script(m), html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Add CSS link reference before </head>
    if has_css:
        css_link = f'    <link rel="stylesheet" href="styles-{basename}.css">\n'
        html_content = html_content.replace('</head>', css_link + '</head>')
    
    # Add JS script reference before </body>
    if has_js:
        js_script = f'    <script src="scripts-{basename}.js"></script>\n'
        html_content = html_content.replace('</body>', js_script + '</body>')
    
    return html_content

def main():
    base_dir = r'C:\Users\DELL\OneDrive\Documents\jaecoo'
    html_files = [
        ('index.html', 'index'),
        ('J5EV.html', 'J5EV'),
        ('J7.html', 'J7'),
        ('J8.html', 'J8')
    ]
    
    print("=" * 60)
    print("HTML CSS/JS Extraction Tool")
    print("=" * 60)
    
    for html_filename, basename in html_files:
        html_path = os.path.join(base_dir, html_filename)
        
        print(f"\nProcessing: {html_filename}")
        print("-" * 60)
        
        # Extract CSS and JS
        css_content, js_content, html_content = extract_css_and_js_from_html(html_path)
        
        has_css = len(css_content.strip()) > 0
        has_js = len(js_content.strip()) > 0
        
        print(f"  CSS found: {has_css} ({len(css_content)} bytes)")
        print(f"  JS found: {has_js} ({len(js_content)} bytes)")
        
        # Create CSS file
        if has_css:
            css_path = os.path.join(base_dir, f'styles-{basename}.css')
            with open(css_path, 'w', encoding='utf-8') as f:
                f.write(css_content)
            print(f"  ✓ Created: styles-{basename}.css")
        
        # Create JS file
        if has_js:
            js_path = os.path.join(base_dir, f'scripts-{basename}.js')
            with open(js_path, 'w', encoding='utf-8') as f:
                f.write(js_content)
            print(f"  ✓ Created: scripts-{basename}.js")
        
        # Update HTML
        updated_html = update_html_file(html_content, basename, has_css, has_js)
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(updated_html)
        print(f"  ✓ Updated: {html_filename}")
    
    print("\n" + "=" * 60)
    print("Extraction completed successfully!")
    print("=" * 60)

if __name__ == '__main__':
    main()
