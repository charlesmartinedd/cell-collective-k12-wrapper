# Cell Collective K-12 Educational Wrapper

A proxy server wrapper that simplifies the Cell Collective research platform for K-12 educational use.

## Overview

This wrapper intercepts requests to `research.cellcollective.org` and injects CSS/JavaScript modifications to:
- Hide researcher-level complexity
- Enhance accessibility for students
- Add K-12-specific UI elements
- Simplify biological modeling for educational purposes

## Documentation

- **[Complete Dashboard Analysis](docs/DASHBOARD-ANALYSIS-COMPLETE.md)** - Comprehensive technical analysis with 981 DOM elements analyzed
- **[Manual Analysis Guide](docs/MANUAL-ANALYSIS-GUIDE.md)** - Guide for manual inspection using browser DevTools
- **[Formatted Analysis](analysis/formatted_analysis.md)** - Human-readable analysis results

## Quick Start

### Prerequisites

```bash
pip install flask beautifulsoup4 requests
```

### Running the Proxy Server

```bash
cd projects/cell-collective-k12-wrapper
python src/proxy_server.py
```

Server will start on `http://localhost:5000`

## Key Features

### CSS Hiding Rules
Hides 5 categories of researcher-level elements

### CSS Enhancements
Keeps and enhances core functionality

### JavaScript Wrapper
Provides K-12-specific functionality

## Analysis Results

- **Total DOM Elements:** 981
- **Iframe Compatible:** NO (requires proxy)
- **API Endpoints:** 3 identified
- **Status:** Proof of Concept Complete

See full documentation for details.
