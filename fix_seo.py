#!/usr/bin/env python3
"""Remove all keywords props from SEO components and add socialDescription differentiation."""
import os
import re


def generate_social(description: str, filename: str) -> str:
    """Generate a punchier social description from the SEO description."""
    page_name = filename.replace('Page.tsx', '').replace('.tsx', '')
    
    social_templates = {
        'TallyPrime': "Transform your business with Kenya's leading TallyPrime partner. Get expert implementation, KRA eTIMS compliance, and reliable cloud hosting today.",
        'Contact': "Ready to modernize your business? Contact Optimum Prime Solutions — Kenya's certified TallyPrime partner in Ruiru.",
        'FAQ': "Got questions about TallyPrime in Kenya? Find answers to the most common questions about implementation, pricing, and KRA compliance.",
        'Blog': "Stay informed with the latest insights on TallyPrime, KRA eTIMS compliance, and business automation in Kenya.",
        'Pricing': "Transparent pricing for TallyPrime in Kenya. Get genuine licences, cloud hosting, and expert support — no hidden fees.",
        'Industries': "TallyPrime solutions for every industry in Kenya — manufacturing, retail, construction, NGOs, schools, and more.",
        'Products': "Discover our full range of business solutions — TallyPrime, cloud hosting, and business automation.",
        'Testimonials': "See what Kenyan businesses say about working with Optimum Prime Solutions — your trusted TallyPrime partner.",
        'Webinar': "Join our free webinars on TallyPrime best practices, KRA compliance, and business growth in Kenya.",
        'KnowledgeHub': "Access guides, templates, case studies, and resources for TallyPrime and business management in Kenya.",
        'NotFound': "The page you're looking for doesn't exist. Return to Optimum Prime Solutions — Kenya's TallyPrime partner.",
    }
    
    for key, template in social_templates.items():
        if key.lower() in page_name.lower():
            return template
    
    base_title = page_name.replace('Page', '').replace('-', ' ')
    return f"Optimum Prime Solutions — Kenya's trusted TallyPrime partner. {base_title} solutions for your business in Ruiru and beyond."


src_dir = 'src/pages'
count = 0

for root, dirs, files in os.walk(src_dir):
    for fname in files:
        if not fname.endswith('.tsx'):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r') as f:
            content = f.read()
        
        original = content
        
        # Remove keywords="..." or keywords={`...`} props from SEO components
        # Match keywords prop in SEO component - handles string literals, template literals, and multiline
        content = re.sub(
            r'\s*keywords="[^"]*"\s*',
            '\n',
            content
        )
        content = re.sub(
            r'\s*keywords={`[^`]*`}\s*',
            '\n',
            content
        )
        
        # Check if the page already has socialDescription
        if 'socialDescription' not in content:
            # Find description prop and add socialDescription after it
            content = re.sub(
                r'(description="([^"]+)")',
                lambda m: f'{m.group(1)}\n        socialDescription="{generate_social(m.group(2), fname)}"',
                content
            )
            content = re.sub(
                r'(description={`([^`]+)`})',
                lambda m: f'{m.group(1)}\n        socialDescription=`{generate_social(m.group(2), fname)}`',
                content
            )
        
        if content != original:
            with open(fpath, 'w') as f:
                f.write(content)
            count += 1
            print(f"Fixed: {fpath}")

# Also fix AboutPage which we already edited
about_path = 'src/pages/AboutPage.tsx'
with open(about_path, 'r') as f:
    content = f.read()
original = content
content = re.sub(r'\s*keywords="[^"]*"\s*', '\n', content)
if content != original:
    with open(about_path, 'w') as f:
        f.write(content)
    count += 1
    print(f"Fixed: {about_path}")

print(f"\nTotal files fixed: {count}")

