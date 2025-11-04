"""Extract and format analysis data for documentation"""
import json
from pathlib import Path

def extract_analysis():
    analysis_file = Path("C:/Users/MarieLexisDad/projects/cell-collective-k12-wrapper/analysis/dashboard_analysis_raw.json")
    output_file = Path("C:/Users/MarieLexisDad/projects/cell-collective-k12-wrapper/analysis/formatted_analysis.md")

    with open(analysis_file, 'r') as f:
        data = json.load(f)

    report = []
    report.append("# Cell Collective Dashboard - Extracted Analysis\n")
    report.append(f"**Analysis Date:** {data.get('timestamp', 'N/A')}\n")
    report.append(f"**URL:** {data.get('url', 'N/A')}\n")

    # Iframe Compatibility
    report.append("\n## 🔒 Iframe Compatibility\n")
    iframe = data.get('iframe_compatibility', {})
    report.append(f"- **Can Load in Iframe:** {'NO' if not iframe.get('can_iframe') else 'YES'}\n")
    report.append(f"- **X-Frame-Options:** {iframe.get('x_frame_options', 'Not Set')}\n")
    report.append(f"- **CSP:** {iframe.get('content_security_policy', 'Not Set')}\n")
    if iframe.get('restrictions'):
        report.append(f"- **Restrictions:** {', '.join(iframe.get('restrictions', []))}\n")
    report.append(f"- **Test Result:** {iframe.get('actual_test', 'N/A')}\n")

    # DOM Structure
    report.append("\n## 🏗️ DOM Structure Summary\n")
    dom = data.get('dom_structure', {})
    report.append(f"- **Headers:** {len(dom.get('header', []))}\n")
    report.append(f"- **Navigation Elements:** {len(dom.get('navigation', []))}\n")
    report.append(f"- **Main Content Areas:** {len(dom.get('main_content', []))}\n")
    report.append(f"- **Sidebars:** {len(dom.get('sidebar', []))}\n")
    report.append(f"- **Controls/Buttons:** {len(dom.get('controls', []))}\n")

    # Header Elements to Hide
    report.append("\n### Header Elements (TO HIDE)\n")
    for i, header in enumerate(dom.get('header', [])[:10]):
        report.append(f"\n**Header {i+1}:**\n")
        report.append(f"- Selector: `{header.get('selector', 'N/A')}`\n")
        report.append(f"- Classes: `{', '.join(header.get('classes', []))}`\n")
        if header.get('text'):
            report.append(f"- Text: \"{header.get('text', '')[:80]}...\"\n")

    # Navigation Elements
    report.append("\n### Navigation Elements\n")
    for i, nav in enumerate(dom.get('navigation', [])[:10]):
        report.append(f"\n**Nav {i+1}:**\n")
        report.append(f"- Selector: `{nav.get('selector', 'N/A')}`\n")
        report.append(f"- Classes: `{', '.join(nav.get('classes', []))}`\n")
        if nav.get('text'):
            report.append(f"- Text: \"{nav.get('text', '')[:80]}...\"\n")

    # Main Content Areas (sample)
    report.append("\n### Main Content Areas (Sample - first 20)\n")
    for i, content in enumerate(dom.get('main_content', [])[:20]):
        report.append(f"\n**Content {i+1}:**\n")
        report.append(f"- Selector: `{content.get('selector', 'N/A')}`\n")
        report.append(f"- Classes: `{', '.join(content.get('classes', []))}`\n")
        if content.get('dimensions'):
            dims = content['dimensions']
            report.append(f"- Dimensions: {dims.get('width')}x{dims.get('height')}px\n")

    # Control Buttons
    report.append("\n### Control Buttons\n")
    for i, control in enumerate(dom.get('controls', [])[:20]):
        report.append(f"\n**Button {i+1}:**\n")
        report.append(f"- Text: \"{control.get('text', '')}\"\n")
        report.append(f"- Selector: `{control.get('selector', 'N/A')}`\n")
        report.append(f"- Classes: `{', '.join(control.get('classes', []))}`\n")
        report.append(f"- Type: {control.get('type', 'N/A')}\n")

    # JavaScript Analysis
    report.append("\n## ⚙️ JavaScript Controls\n")
    js = data.get('javascript_controls', {})
    report.append(f"- **Frameworks Detected:** {', '.join(js.get('frameworks', ['None']))}\n")
    report.append(f"- **Global Objects:** {len(js.get('global_objects', []))}\n")
    report.append(f"- **API Endpoints:** {len(js.get('api_endpoints', []))}\n")

    if js.get('global_objects'):
        report.append("\n### Global Objects (Cell Collective specific)\n")
        for obj in js.get('global_objects', [])[:10]:
            report.append(f"\n**{obj.get('name', 'N/A')}:**\n")
            report.append(f"- Type: {obj.get('type', 'N/A')}\n")
            props = obj.get('properties', [])
            if props:
                report.append(f"- Properties: `{', '.join(props[:10])}`\n")

    if js.get('api_endpoints'):
        report.append("\n### API Endpoints\n")
        for endpoint in js.get('api_endpoints', []):
            report.append(f"- `{endpoint}`\n")

    # Model Builder
    report.append("\n## 🎨 Model Builder Interface\n")
    builder = data.get('model_builder', {})
    report.append(f"- **New Model Button Found:** {'YES' if builder.get('found_new_model_button') else 'NO'}\n")
    if builder.get('new_model_selector'):
        report.append(f"- **Selector:** `{builder.get('new_model_selector')}`\n")

    if builder.get('canvas_info'):
        canvas = builder['canvas_info']
        report.append(f"\n### Canvas/SVG Information\n")
        report.append(f"- **Canvas Element:** {'Found' if canvas.get('canvas') else 'Not found'}\n")
        if canvas.get('canvas'):
            c = canvas['canvas']
            report.append(f"  - ID: `{c.get('id', 'N/A')}`\n")
            report.append(f"  - Classes: `{', '.join(c.get('classes', []))}`\n")
            report.append(f"  - Size: {c.get('width')}x{c.get('height')}px\n")

        report.append(f"- **SVG Count:** {canvas.get('svg_count', 0)}\n")
        if canvas.get('svgs'):
            for i, svg in enumerate(canvas['svgs'][:5]):
                report.append(f"  - SVG {i+1}: ID=`{svg.get('id', 'N/A')}`, Classes=`{', '.join(svg.get('classes', []))}`\n")

        report.append(f"- **Toolbar Count:** {len(canvas.get('toolbars', []))}\n")
        for i, toolbar in enumerate(canvas.get('toolbars', [])):
            report.append(f"  - Toolbar {i+1}: `{toolbar.get('id', 'N/A')}` - {', '.join(toolbar.get('classes', []))}\n")

    # CSS Recommendations
    report.append("\n## 🎨 CSS Recommendations\n")
    css = data.get('css_recommendations', {})
    report.append(f"- **Selectors to Hide:** {len(css.get('hide', []))}\n")
    report.append(f"- **Selectors to Keep:** {len(css.get('keep', []))}\n")

    report.append("\n### CSS to Hide Elements\n")
    report.append("```css\n")
    for rule in css.get('hide', [])[:30]:
        report.append(f"{rule}\n")
    report.append("```\n")

    report.append("\n### CSS to Keep Elements\n")
    report.append("```css\n")
    for rule in css.get('keep', [])[:20]:
        report.append(f"{rule}\n")
    report.append("```\n")

    # Network Requests
    report.append("\n## 🌐 Network Requests\n")
    requests = data.get('network_requests', [])
    report.append(f"- **Total Requests Captured:** {len(requests)}\n")

    # Filter API requests
    api_requests = [r for r in requests if 'api' in r.get('url', '').lower()]
    report.append(f"- **API Requests:** {len(api_requests)}\n")

    if api_requests:
        report.append("\n### API Endpoints Found\n")
        seen_urls = set()
        for req in api_requests[:20]:
            url = req.get('url', '')
            if url not in seen_urls:
                seen_urls.add(url)
                report.append(f"- `{req.get('method', 'GET')} {url}`\n")

    # Save formatted report
    with open(output_file, 'w', encoding='utf-8') as f:
        f.writelines(report)

    print(f"Formatted analysis saved to: {output_file}")
    print(f"\nKey Findings:")
    print(f"  - Iframe compatible: {iframe.get('can_iframe', False)}")
    print(f"  - New model button found: {builder.get('found_new_model_button', False)}")
    print(f"  - Total DOM elements: {sum(len(v) for v in dom.values())}")
    print(f"  - API endpoints: {len(api_requests)}")

if __name__ == "__main__":
    extract_analysis()
