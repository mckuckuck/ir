# American Express Investor Relations Site Migration Plan

## Overview

Migrate **19 pages** from **ir.americanexpress.com** to AEM Edge Delivery Services. All pages belong to the investor relations subdomain, sourced from the [site map](https://ir.americanexpress.com/site-map/default.aspx).

## Pages to Migrate (19 pages)

All URLs confirmed under `ir.americanexpress.com`:

| # | URL | Section |
|---|-----|---------|
| 1 | `https://ir.americanexpress.com/investor-relations/default.aspx` | Homepage |
| 2 | `https://ir.americanexpress.com/events/default.aspx` | Events |
| 3 | `https://ir.americanexpress.com/financials/earnings-and-sec-filings/default.aspx` | Financials |
| 4 | `https://ir.americanexpress.com/financials/annual-reports-and-proxy-statements/default.aspx` | Financials |
| 5 | `https://ir.americanexpress.com/financials/insider-filings/default.aspx` | Financials |
| 6 | `https://ir.americanexpress.com/financials/pillar-3-disclosures/default.aspx` | Financials |
| 7 | `https://ir.americanexpress.com/stock-information/default.aspx` | Stock Info |
| 8 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/executive-committee-and-directors/default.aspx` | Governance |
| 9 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/governance-framework/default.aspx` | Governance |
| 10 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/committee-composition/default.aspx` | Governance |
| 11 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/shareholder-engagement/default.aspx` | Governance |
| 12 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/reporting-and-resources/default.aspx` | Governance |
| 13 | `https://ir.americanexpress.com/governance-and-corporate-responsibility/policy-engagement-and-political-activity/default.aspx` | Governance |
| 14 | `https://ir.americanexpress.com/fixed-income-investors/default.aspx` | Fixed Income |
| 15 | `https://ir.americanexpress.com/news/investor-relations-news/default.aspx` | News |
| 16 | `https://ir.americanexpress.com/resources/sign-up-for-email-alerts/default.aspx` | Resources |
| 17 | `https://ir.americanexpress.com/resources/faq/default.aspx` | Resources |
| 18 | `https://ir.americanexpress.com/resources/shareholder-services/default.aspx` | Resources |
| 19 | `https://ir.americanexpress.com/resources/information-request/default.aspx` | Resources |

**Excluded** (not on `ir.americanexpress.com`):
- `https://about.americanexpress.com/newsroom/` — different subdomain
- `https://about.americanexpress.com/home/default.aspx` — different subdomain
- `https://www.computershare.com/investor` — external site
- `https://www.q4inc.com/Powered-by-Q4/` — external site

> **Note:** `ir.americanexpress.com/resources/our-contact-information/default.aspx` was also found and is included as page 19 equivalent (if it resolves). Will verify during analysis.

## Migration Approach

### Phase 1: Site Analysis & Template Classification
- Analyze the 19 pages and group them by template type (e.g., landing page, list page, detail page, form page)
- Create page template definitions in `page-templates.json`

### Phase 2: Page-by-Page Analysis
- Analyze each page's content structure, sections, and blocks
- Identify block variants and track similarities across pages (70% threshold for reuse)
- Generate analysis artifacts (screenshots, cleaned HTML, JSON)

### Phase 3: Design System Extraction
- Extract design tokens: colors, typography, spacing from the site
- Map American Express brand styles to CSS custom properties
- Apply to `styles/styles.css` and `styles/fonts.css`

### Phase 4: Block Mapping & Import Infrastructure
- Map content sections to EDS blocks with variant names
- Create block parsers for each unique block type
- Create page transformers for each template
- Build and bundle import scripts

### Phase 5: Content Import
- Execute content import for all 19 pages
- Generate HTML content files in the content directory

### Phase 6: Navigation Setup
- Extract navigation structure from the original site
- Create `nav.html` with proper EDS navigation format

### Phase 7: Verification & QA
- Preview each migrated page and compare against originals
- Fix styling and structural issues
- Visual critique and iteration

## Checklist

- [ ] **Site analysis** — classify 19 URLs into page templates
- [ ] **Page analysis** — analyze each page's content structure and blocks
- [ ] **Design system extraction** — extract colors, fonts, spacing, tokens
- [ ] **Block mapping** — map content to EDS blocks with variant tracking
- [ ] **Import infrastructure** — create parsers, transformers, import scripts
- [ ] **Content import** — generate HTML content for all 19 pages
- [ ] **Navigation setup** — migrate nav structure to EDS format
- [ ] **Preview verification** — compare migrated pages against originals
- [ ] **Visual QA & fixes** — iterate on styling until accurate

## Execution

> **This plan requires Execute mode to begin implementation.** The migration will use the `excat-site-migration` skill to orchestrate all phases with intelligent block variant management and multi-page optimization.
