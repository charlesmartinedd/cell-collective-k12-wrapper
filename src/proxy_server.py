"""
Cell Collective K-12 Wrapper - Proxy Server
Intercepts Cell Collective requests and injects K-12 educational modifications
"""

from flask import Flask, request, Response, send_from_directory
from bs4 import BeautifulSoup
import requests
import os

app = Flask(__name__)

# Configuration
CELL_COLLECTIVE_BASE = "https://research.cellcollective.org"
STATIC_DIR = os.path.join(os.path.dirname(__file__), 'static')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve K-12 CSS and JS files"""
    return send_from_directory(STATIC_DIR, filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def proxy(path):
    """
    Proxy all requests to Cell Collective and inject K-12 modifications
    """
    # Build target URL
    url = f"{CELL_COLLECTIVE_BASE}/{path}"

    # Get query parameters
    params = request.args.to_dict()

    # Forward cookies for authentication
    cookies = {key: value for key, value in request.cookies.items()}

    # Forward headers (exclude host)
    headers = {key: value for key, value in request.headers.items()
               if key.lower() not in ['host', 'connection']}

    try:
        # Make request to Cell Collective
        if request.method == 'GET':
            resp = requests.get(url, params=params, cookies=cookies,
                                headers=headers, allow_redirects=True)
        elif request.method == 'POST':
            resp = requests.post(url, data=request.form, cookies=cookies,
                                 headers=headers, allow_redirects=True)
        else:
            # Other methods (PUT, DELETE, etc.)
            resp = requests.request(request.method, url, data=request.data,
                                    cookies=cookies, headers=headers,
                                    allow_redirects=True)

        # Check if response is HTML
        content_type = resp.headers.get('Content-Type', '')

        if 'text/html' in content_type:
            # Parse HTML
            soup = BeautifulSoup(resp.content, 'html.parser')

            # Find head and body
            head = soup.find('head')
            body = soup.find('body')

            if head:
                # Inject K-12 CSS
                k12_css = soup.new_tag('link', rel='stylesheet',
                                        href='/static/k12-cell-collective.css')
                head.append(k12_css)

                # Add meta tag for K-12 mode
                k12_meta = soup.new_tag('meta', attrs={'name': 'k12-mode', 'content': 'enabled'})
                head.append(k12_meta)

            if body:
                # Inject K-12 JavaScript
                k12_js = soup.new_tag('script', src='/static/k12-cell-collective.js')
                body.append(k12_js)

                # Add K-12 wrapper div
                k12_wrapper = soup.new_tag('div', id='k12-wrapper', attrs={
                    'data-version': '1.0',
                    'data-mode': 'student'
                })
                # Wrap existing body content
                for child in list(body.children):
                    k12_wrapper.append(child)
                body.append(k12_wrapper)

            # Return modified HTML
            return Response(str(soup), mimetype='text/html',
                            headers=dict(resp.headers))

        else:
            # Pass through non-HTML responses (images, CSS, JS, etc.)
            return Response(resp.content, mimetype=content_type,
                            headers=dict(resp.headers))

    except requests.exceptions.RequestException as e:
        # Handle errors
        return Response(f"Error proxying request: {str(e)}",
                        status=500, mimetype='text/plain')

@app.route('/k12-api/status')
def k12_status():
    """
    K-12 wrapper status endpoint
    """
    return {
        "status": "active",
        "version": "1.0",
        "mode": "student",
        "target": CELL_COLLECTIVE_BASE
    }

if __name__ == '__main__':
    # Create static directory if it doesn't exist
    os.makedirs(STATIC_DIR, exist_ok=True)

    print("=" * 60)
    print("Cell Collective K-12 Wrapper - Proxy Server")
    print("=" * 60)
    print(f"Target: {CELL_COLLECTIVE_BASE}")
    print(f"Static files: {STATIC_DIR}")
    print("Server starting on http://localhost:5000")
    print("-" * 60)
    print("IMPORTANT: Place these files in src/static/:")
    print("  - k12-cell-collective.css")
    print("  - k12-cell-collective.js")
    print("=" * 60)

    # Run server
    app.run(debug=True, port=5000, host='0.0.0.0')
