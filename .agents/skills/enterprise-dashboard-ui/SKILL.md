---
name: enterprise-dashboard-ui
description: Transform enterprise dashboards into premium SaaS products with modern UI/UX comparable to Linear, Stripe, Vercel, Attio, Notion and Raycast. Focus on hierarchy, spacing, typography, interactions, accessibility and production-ready interfaces. Never produce AI-looking layouts.
---

# Enterprise Dashboard UI/UX Guidelines

Use this skill when designing or refining dashboard pages, cards, sidebars, headers, grids, components, loading states, and tables to match state-of-the-art SaaS designs.

## Design Philosophy
* **Less UI, More Information:** Eliminate container borders where possible, using negative space and font weights to establish grid divisions.
* **Sleek Hierarchy:** Focus on high font weight contrast. Larger KPIs should dominate pages.
* **Color Discipline:** Use neutral palettes (zinc, slate, grey). Limit use of accent colors exclusively to states: Success (Green), Warning (Amber), Danger (Red), Information (Blue).
* **Very Subtle Shadows:** Shadows must be extremely soft and blended, avoiding harsh edges.

## Layout & Grid Rules
* Use a professional 12-column grid.
* Spacing must strictly follow a fixed scale: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`.

## UI Components Polish

### 1. KPI Cards
Each card must include:
* Small label on top.
* Large dominant count/number with monospace/sans font.
* Trend indicator (e.g., +2%, -5%) with mini sparkline SVG path.
* Status colors (Success, Warning, Neutral).
* Last updated timestamp.
* Balanced padding and subtle hover scale/border transition.

### 2. Header & Navigation
* Dynamic breadcrumbs indicating parent routes.
* Command menu placeholder search box.
* Avatar user menus and quick access menus.

### 3. Sidebar
* Collapsible sidebar supporting collapsed icon-only mode and expanded details.
* Grouped navigation categories (e.g., General, Financials, Settings).
* Flat, modern active indicators with clean hover transitions.

### 4. Tables
* Sticky headers with backdrop-blur.
* Clean hover states.
* Column resizing, density selection, search box filtering, and pagination states.
* Skeletons / shimmers loader states instead of spinner loaders.

### 5. Forms
* Small bold labels.
* Frost overlay backdrop-blur overlay on modals.
* Inline validations and transition state buttons.

### 6. Empty States
* Minimalist illustrations or Lucide icons.
* Informative titles and descriptions.
* Primary CTA and secondary reset filters buttons.
