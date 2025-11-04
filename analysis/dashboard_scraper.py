"""
Cell Collective Research Dashboard Analyzer
Comprehensive DOM structure analysis and control mapping
"""

import asyncio
import json
from playwright.async_api import async_playwright
from pathlib import Path
import time

class CellCollectiveDashboardAnalyzer:
    def __init__(self):
        self.base_url = "https://research.cellcollective.org"
        self.dashboard_url = f"{self.base_url}/research/dashboard/"
        self.analysis_dir = Path("projects/cell-collective-k12-wrapper/analysis")
        self.screenshots_dir = Path("projects/cell-collective-k12-wrapper/screenshots")
        self.docs_dir = Path("projects/cell-collective-k12-wrapper/docs")

        # Ensure directories exist
        self.analysis_dir.mkdir(parents=True, exist_ok=True)
        self.screenshots_dir.mkdir(parents=True, exist_ok=True)
        self.docs_dir.mkdir(parents=True, exist_ok=True)

    async def analyze_iframe_compatibility(self, page):
        """Test if dashboard can be loaded in iframe"""
        print("\n=== Testing iframe compatibility ===")

        # Check response headers
        response = await page.goto(self.dashboard_url)
        headers = response.headers

        iframe_analysis = {
            "url": self.dashboard_url,
            "x_frame_options": headers.get("x-frame-options", "Not Set"),
            "content_security_policy": headers.get("content-security-policy", "Not Set"),
            "can_iframe": True,
            "restrictions": []
        }

        # Check X-Frame-Options
        if "x-frame-options" in headers:
            xfo = headers["x-frame-options"].lower()
            if xfo in ["deny", "sameorigin"]:
                iframe_analysis["can_iframe"] = False
                iframe_analysis["restrictions"].append(f"X-Frame-Options: {xfo}")

        # Check CSP frame-ancestors
        if "content-security-policy" in headers:
            csp = headers["content-security-policy"]
            if "frame-ancestors" in csp:
                if "'none'" in csp or "'self'" in csp:
                    iframe_analysis["can_iframe"] = False
                    iframe_analysis["restrictions"].append(f"CSP restricts framing")

        # Try to actually load in iframe
        try:
            await page.evaluate("""
                const iframe = document.createElement('iframe');
                iframe.src = arguments[0];
                document.body.appendChild(iframe);
            """, self.dashboard_url)
            await page.wait_for_timeout(2000)
            iframe_analysis["actual_test"] = "Successfully loaded in iframe"
        except Exception as e:
            iframe_analysis["actual_test"] = f"Failed: {str(e)}"
            iframe_analysis["can_iframe"] = False

        return iframe_analysis

    async def analyze_dom_structure(self, page):
        """Extract complete DOM structure with selectors"""
        print("\n=== Analyzing DOM structure ===")

        dom_structure = await page.evaluate("""
            () => {
                const structure = {
                    header: [],
                    navigation: [],
                    main_content: [],
                    sidebar: [],
                    footer: [],
                    modals: [],
                    controls: []
                };

                // Header elements
                const headers = document.querySelectorAll('header, [class*="header"], [class*="Header"], nav[class*="top"]');
                headers.forEach(el => {
                    structure.header.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: Array.from(el.classList),
                        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
                        text: el.innerText?.substring(0, 100)
                    });
                });

                // Navigation elements
                const navs = document.querySelectorAll('nav, [class*="nav"], [class*="menu"], [class*="Menu"]');
                navs.forEach(el => {
                    structure.navigation.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: Array.from(el.classList),
                        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
                        text: el.innerText?.substring(0, 100)
                    });
                });

                // Main content areas
                const mains = document.querySelectorAll('main, [class*="content"], [class*="dashboard"], [class*="workspace"]');
                mains.forEach(el => {
                    structure.main_content.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: Array.from(el.classList),
                        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
                        dimensions: {
                            width: el.offsetWidth,
                            height: el.offsetHeight
                        }
                    });
                });

                // Sidebar elements
                const sidebars = document.querySelectorAll('[class*="sidebar"], [class*="Sidebar"], aside');
                sidebars.forEach(el => {
                    structure.sidebar.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: Array.from(el.classList),
                        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
                        position: window.getComputedStyle(el).position
                    });
                });

                // Control buttons
                const buttons = document.querySelectorAll('button, [role="button"], [class*="btn"], [class*="Button"]');
                buttons.forEach(el => {
                    structure.controls.push({
                        tag: el.tagName.toLowerCase(),
                        id: el.id,
                        classes: Array.from(el.classList),
                        selector: el.id ? `#${el.id}` : `.${Array.from(el.classList).join('.')}`,
                        text: el.innerText?.substring(0, 50),
                        type: el.type,
                        onclick: el.onclick ? 'Has onclick handler' : 'No onclick'
                    });
                });

                return structure;
            }
        """)

        return dom_structure

    async def analyze_model_builder(self, page):
        """Analyze model builder interface"""
        print("\n=== Analyzing model builder interface ===")

        # Look for "New Model" or similar button
        try:
            # Wait for page to load completely
            await page.wait_for_load_state("networkidle")

            # Take screenshot of dashboard
            await page.screenshot(path=str(self.screenshots_dir / "01_dashboard_home.png"), full_page=True)

            # Try to find and click new model button
            new_model_selectors = [
                'button:has-text("New Model")',
                'button:has-text("Create Model")',
                'a:has-text("New Model")',
                '[class*="new-model"]',
                '[id*="new-model"]'
            ]

            model_builder_info = {"found_new_model_button": False}

            for selector in new_model_selectors:
                try:
                    button = await page.query_selector(selector)
                    if button:
                        model_builder_info["found_new_model_button"] = True
                        model_builder_info["new_model_selector"] = selector

                        # Click and analyze builder interface
                        await button.click()
                        await page.wait_for_timeout(2000)

                        # Screenshot of builder
                        await page.screenshot(path=str(self.screenshots_dir / "02_model_builder.png"), full_page=True)

                        # Analyze builder canvas
                        canvas_info = await page.evaluate("""
                            () => {
                                const canvas = document.querySelector('canvas');
                                const svgs = document.querySelectorAll('svg');
                                const toolbars = document.querySelectorAll('[class*="toolbar"], [class*="tools"]');

                                return {
                                    canvas: canvas ? {
                                        id: canvas.id,
                                        classes: Array.from(canvas.classList),
                                        width: canvas.width,
                                        height: canvas.height
                                    } : null,
                                    svg_count: svgs.length,
                                    svgs: Array.from(svgs).map(svg => ({
                                        id: svg.id,
                                        classes: Array.from(svg.classList),
                                        viewBox: svg.getAttribute('viewBox')
                                    })),
                                    toolbars: Array.from(toolbars).map(tb => ({
                                        id: tb.id,
                                        classes: Array.from(tb.classList),
                                        text: tb.innerText?.substring(0, 100)
                                    }))
                                };
                            }
                        """)

                        model_builder_info["canvas_info"] = canvas_info
                        break

                except Exception as e:
                    continue

            return model_builder_info

        except Exception as e:
            return {"error": str(e)}

    async def analyze_javascript_controls(self, page):
        """Analyze JavaScript event handlers and APIs"""
        print("\n=== Analyzing JavaScript controls ===")

        js_analysis = await page.evaluate("""
            () => {
                const analysis = {
                    global_objects: [],
                    event_listeners: [],
                    api_endpoints: [],
                    frameworks: []
                };

                // Check for common frameworks
                if (window.React) analysis.frameworks.push('React');
                if (window.Vue) analysis.frameworks.push('Vue');
                if (window.Angular) analysis.frameworks.push('Angular');
                if (window.jQuery || window.$) analysis.frameworks.push('jQuery');

                // Look for Cell Collective specific objects
                for (let key in window) {
                    if (key.toLowerCase().includes('cell') ||
                        key.toLowerCase().includes('model') ||
                        key.toLowerCase().includes('collective')) {
                        analysis.global_objects.push({
                            name: key,
                            type: typeof window[key],
                            properties: Object.keys(window[key] || {}).slice(0, 20)
                        });
                    }
                }

                // Scan for API endpoints in scripts
                const scripts = Array.from(document.scripts);
                scripts.forEach(script => {
                    if (script.src.includes('api') || script.src.includes('bundle')) {
                        analysis.api_endpoints.push(script.src);
                    }
                });

                return analysis;
            }
        """)

        return js_analysis

    async def test_network_requests(self, page):
        """Monitor network requests to understand API structure"""
        print("\n=== Monitoring network requests ===")

        requests = []

        def handle_request(request):
            if 'api' in request.url or 'research.cellcollective.org' in request.url:
                requests.append({
                    "url": request.url,
                    "method": request.method,
                    "resource_type": request.resource_type,
                    "headers": dict(request.headers)
                })

        page.on("request", handle_request)

        # Navigate and interact
        await page.goto(self.dashboard_url)
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)

        return requests

    async def generate_css_hide_recommendations(self, dom_structure):
        """Generate CSS to hide non-essential elements"""
        print("\n=== Generating CSS recommendations ===")

        css_hide = []
        css_keep = []

        # Elements to hide (headers, complex nav, researcher controls)
        for header in dom_structure.get("header", []):
            if header["selector"] and header["selector"] != ".":
                css_hide.append(f"{header['selector']} {{ display: none !important; }}")

        # Navigation that's not essential
        for nav in dom_structure.get("navigation", []):
            if any(keyword in str(nav.get("classes", [])).lower()
                   for keyword in ["admin", "profile", "settings", "account"]):
                if nav["selector"] and nav["selector"] != ".":
                    css_hide.append(f"{nav['selector']} {{ display: none !important; }}")

        # Keep main content
        for content in dom_structure.get("main_content", []):
            if content["selector"] and content["selector"] != ".":
                css_keep.append(f"{content['selector']} {{ display: block !important; }}")

        return {
            "hide": css_hide,
            "keep": css_keep,
            "complete_css": "\n".join(css_hide)
        }

    async def run_comprehensive_analysis(self):
        """Run all analysis tasks"""
        print("Starting comprehensive Cell Collective dashboard analysis...")

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context(
                viewport={"width": 1920, "height": 1080},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            )
            page = await context.new_page()

            results = {
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "url": self.dashboard_url
            }

            try:
                # 1. Test iframe compatibility
                results["iframe_compatibility"] = await self.analyze_iframe_compatibility(page)

                # 2. Network requests
                results["network_requests"] = await self.test_network_requests(page)

                # 3. DOM structure
                results["dom_structure"] = await self.analyze_dom_structure(page)

                # 4. JavaScript analysis
                results["javascript_controls"] = await self.analyze_javascript_controls(page)

                # 5. Model builder interface
                results["model_builder"] = await self.analyze_model_builder(page)

                # 6. CSS recommendations
                results["css_recommendations"] = await self.generate_css_hide_recommendations(
                    results["dom_structure"]
                )

                # Save raw results
                with open(self.analysis_dir / "dashboard_analysis_raw.json", "w") as f:
                    json.dump(results, f, indent=2)

                print("\n✅ Analysis complete! Results saved to:")
                print(f"   - {self.analysis_dir / 'dashboard_analysis_raw.json'}")
                print(f"   - {self.screenshots_dir}/*.png")

                return results

            except Exception as e:
                print(f"\n❌ Error during analysis: {str(e)}")
                results["error"] = str(e)
                return results

            finally:
                await browser.close()

async def main():
    analyzer = CellCollectiveDashboardAnalyzer()
    results = await analyzer.run_comprehensive_analysis()
    return results

if __name__ == "__main__":
    results = asyncio.run(main())
    print("\n=== Analysis Summary ===")
    print(f"Iframe Compatible: {results.get('iframe_compatibility', {}).get('can_iframe', 'Unknown')}")
    print(f"Network Requests Captured: {len(results.get('network_requests', []))}")
    print(f"DOM Elements Found: {sum(len(v) for v in results.get('dom_structure', {}).values())}")
