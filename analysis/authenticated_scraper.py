"""
Cell Collective Dashboard Analyzer with Authentication
Uses saved session cookies for authenticated access
"""

import asyncio
import json
from playwright.async_api import async_playwright
from pathlib import Path
import os

async def analyze_with_auth():
    """Run analysis with authentication cookies"""

    base_path = Path("C:/Users/MarieLexisDad/projects/cell-collective-wrapper")
    cookie_file = base_path / "paste_cookie_here.txt"
    output_dir = Path("C:/Users/MarieLexisDad/projects/cell-collective-k12-wrapper/analysis")
    screenshots_dir = Path("C:/Users/MarieLexisDad/projects/cell-collective-k12-wrapper/screenshots")

    output_dir.mkdir(parents=True, exist_ok=True)
    screenshots_dir.mkdir(parents=True, exist_ok=True)

    # Read cookie if available
    cookies = None
    if cookie_file.exists():
        with open(cookie_file, 'r') as f:
            cookie_str = f.read().strip()
            if cookie_str:
                # Parse cookie string
                cookies = []
                for cookie_part in cookie_str.split(';'):
                    if '=' in cookie_part:
                        name, value = cookie_part.strip().split('=', 1)
                        cookies.append({
                            'name': name,
                            'value': value,
                            'domain': '.cellcollective.org',
                            'path': '/'
                        })

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )

        if cookies:
            await context.add_cookies(cookies)
            print("✅ Added authentication cookies")

        page = await context.new_page()

        # Navigate to dashboard
        url = "https://research.cellcollective.org/research/dashboard/"
        print(f"\n🌐 Navigating to {url}")

        try:
            response = await page.goto(url, wait_until="networkidle")

            # Check response headers
            headers = response.headers
            print("\n📋 Response Headers:")
            print(f"   X-Frame-Options: {headers.get('x-frame-options', 'Not set')}")
            print(f"   CSP: {headers.get('content-security-policy', 'Not set')[:100]}...")

            await page.wait_for_timeout(3000)

            # Take initial screenshot
            await page.screenshot(path=str(screenshots_dir / "dashboard_home.png"), full_page=True)
            print(f"📸 Screenshot saved: dashboard_home.png")

            # Analyze DOM structure
            print("\n🔍 Analyzing DOM structure...")

            dom_analysis = await page.evaluate("""
                () => {
                    const analysis = {
                        page_title: document.title,
                        main_containers: [],
                        buttons: [],
                        links: [],
                        forms: [],
                        canvas_svg: []
                    };

                    // Find all major containers
                    const containers = document.querySelectorAll('[class*="container"], [class*="wrapper"], [id*="main"], main');
                    containers.forEach(el => {
                        analysis.main_containers.push({
                            tag: el.tagName,
                            id: el.id,
                            classes: Array.from(el.classList),
                            selector: el.id ? `#${el.id}` : `.${Array.from(el.classList)[0]}`,
                            children_count: el.children.length
                        });
                    });

                    // Find all buttons
                    const buttons = document.querySelectorAll('button, [role="button"]');
                    buttons.forEach(el => {
                        const text = el.innerText || el.textContent || '';
                        if (text.length < 100) {
                            analysis.buttons.push({
                                text: text.trim(),
                                id: el.id,
                                classes: Array.from(el.classList),
                                selector: el.id ? `#${el.id}` : el.className ? `.${el.className.split(' ')[0]}` : 'button'
                            });
                        }
                    });

                    // Find important links
                    const links = document.querySelectorAll('a[href]');
                    links.forEach(el => {
                        const text = el.innerText || el.textContent || '';
                        if (text.length < 50 && (
                            text.toLowerCase().includes('model') ||
                            text.toLowerCase().includes('new') ||
                            text.toLowerCase().includes('create') ||
                            text.toLowerCase().includes('simulation')
                        )) {
                            analysis.links.push({
                                text: text.trim(),
                                href: el.href,
                                id: el.id,
                                classes: Array.from(el.classList)
                            });
                        }
                    });

                    // Check for canvas or SVG elements
                    const canvases = document.querySelectorAll('canvas');
                    const svgs = document.querySelectorAll('svg');

                    analysis.canvas_svg.push({
                        canvas_count: canvases.length,
                        svg_count: svgs.length,
                        canvas_elements: Array.from(canvases).map(c => ({
                            id: c.id,
                            width: c.width,
                            height: c.height,
                            classes: Array.from(c.classList)
                        })),
                        svg_elements: Array.from(svgs).slice(0, 5).map(s => ({
                            id: s.id,
                            viewBox: s.getAttribute('viewBox'),
                            classes: Array.from(s.classList)
                        }))
                    });

                    return analysis;
                }
            """)

            # Save analysis
            with open(output_dir / "dom_analysis.json", 'w') as f:
                json.dump(dom_analysis, f, indent=2)

            print(f"\n✅ Analysis saved to: {output_dir / 'dom_analysis.json'}")
            print(f"\n📊 Summary:")
            print(f"   Page Title: {dom_analysis['page_title']}")
            print(f"   Main Containers: {len(dom_analysis['main_containers'])}")
            print(f"   Buttons Found: {len(dom_analysis['buttons'])}")
            print(f"   Relevant Links: {len(dom_analysis['links'])}")
            print(f"   Canvas Elements: {dom_analysis['canvas_svg'][0]['canvas_count']}")
            print(f"   SVG Elements: {dom_analysis['canvas_svg'][0]['svg_count']}")

            # Try to find and click "New Model" button
            print("\n🔎 Looking for 'New Model' button...")

            new_model_button = None
            for button in dom_analysis['buttons']:
                if 'new' in button['text'].lower() and 'model' in button['text'].lower():
                    print(f"   Found: '{button['text']}' - {button['selector']}")
                    new_model_button = button
                    break

            if new_model_button:
                try:
                    # Try clicking it
                    await page.click(new_model_button['selector'])
                    await page.wait_for_timeout(3000)

                    # Take screenshot of model builder
                    await page.screenshot(path=str(screenshots_dir / "model_builder.png"), full_page=True)
                    print("   📸 Model builder screenshot saved")

                    # Analyze model builder
                    builder_analysis = await page.evaluate("""
                        () => {
                            return {
                                url: window.location.href,
                                toolbars: Array.from(document.querySelectorAll('[class*="toolbar"], [class*="tools"], [class*="palette"]')).map(el => ({
                                    id: el.id,
                                    classes: Array.from(el.classList),
                                    text: el.innerText?.substring(0, 200)
                                })),
                                canvas_svg_updated: {
                                    canvas: document.querySelector('canvas') ? {
                                        id: document.querySelector('canvas').id,
                                        classes: Array.from(document.querySelector('canvas').classList)
                                    } : null,
                                    svg_main: document.querySelector('svg[class*="graph"], svg[class*="canvas"]') ? {
                                        id: document.querySelector('svg[class*="graph"], svg[class*="canvas"]').id,
                                        classes: Array.from(document.querySelector('svg[class*="graph"], svg[class*="canvas"]').classList)
                                    } : null
                                }
                            };
                        }
                    """)

                    with open(output_dir / "model_builder_analysis.json", 'w') as f:
                        json.dump(builder_analysis, f, indent=2)

                    print(f"   ✅ Model builder analysis saved")

                except Exception as e:
                    print(f"   ⚠️ Could not interact with button: {str(e)}")

            # Get page HTML
            html_content = await page.content()
            with open(output_dir / "dashboard_page.html", 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"\n💾 Page HTML saved to: {output_dir / 'dashboard_page.html'}")

            print("\n✅ Analysis complete!")

        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            await page.screenshot(path=str(screenshots_dir / "error_screenshot.png"))

        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(analyze_with_auth())
