/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-ir variant.
 * Base block: hero
 * Source: https://ir.americanexpress.com/investor-relations/default.aspx
 * Selector: .module-banner-home.dark
 *
 * Source DOM structure (from captured HTML):
 *   .module-banner-home.dark
 *     .grid_col--3-of-4 (left column)
 *       .module-banner-home_logo > img (AmEx logo)
 *       .module-banner-home_title > h1 (Investor Relations)
 *       .module-event-banner (upcoming event: date, title, links)
 *     .grid_col--1-of-4 (right column)
 *       .module-stock-header (stock ticker: NYSE:AXP, price, change, market cap, volume)
 *
 * Target: Hero block with image row + content row
 */
export default function parse(element, { document }) {
  // Extract logo image (from .module-banner-home_logo img)
  const logo = element.querySelector('.module-banner-home_logo img');

  // Extract heading (from .module-banner-home_title h1)
  const heading = element.querySelector('.module-banner-home_title h1, .module-banner-home_title h2');

  // Extract event banner content
  const eventBanner = element.querySelector('.module-event-banner');
  const eventDate = eventBanner ? eventBanner.querySelector('.module_date-text') : null;
  const eventTime = eventBanner ? eventBanner.querySelector('.module_time-text') : null;
  const eventHeadline = eventBanner ? eventBanner.querySelector('.module_headline-link') : null;

  // Extract stock header content
  const stockHeader = element.querySelector('.module-stock-header');
  const stockTicker = stockHeader ? stockHeader.querySelector('.module-stock-header_description1') : null;
  const stockPrice = stockHeader ? stockHeader.querySelector('.module-stock-header_stock-price') : null;

  // Build cells matching hero block structure: row 1 = image, row 2 = content
  const cells = [];

  // Row 1: Logo image
  if (logo) {
    cells.push([logo]);
  }

  // Row 2: Content - heading, event info, stock info
  const contentCell = [];
  if (heading) contentCell.push(heading);

  // Add event info as a paragraph
  if (eventDate && eventHeadline) {
    const eventP = document.createElement('p');
    if (eventDate) eventP.append(eventDate.cloneNode(true));
    if (eventTime) {
      eventP.append(document.createTextNode(' '));
      eventP.append(eventTime.cloneNode(true));
    }
    contentCell.push(eventP);
    contentCell.push(eventHeadline);
  }

  // Add stock info as a paragraph
  if (stockTicker && stockPrice) {
    const stockP = document.createElement('p');
    stockP.append(stockTicker.cloneNode(true));
    stockP.append(document.createTextNode(' '));
    stockP.append(stockPrice.cloneNode(true));
    contentCell.push(stockP);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-ir', cells });
  element.replaceWith(block);
}
