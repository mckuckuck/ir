/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-ir variant.
 * Base block: cards
 * Source: https://ir.americanexpress.com/investor-relations/default.aspx
 * Selector: .module-latest_items
 *
 * Source DOM structure (from captured HTML):
 *   .module-latest_items (grid--flex container)
 *     .module-latest_item (×6, each with grid_col--1-of-3)
 *       .module-latest_item-container
 *         h2.module_title (card heading: Events, Q4 2025 Earnings, News, SEC Filings, etc.)
 *         .module-latest_widget (card content: event listings, doc links, news headlines, etc.)
 *         .module-latest_button > a.button (CTA: View All Events, View All Earnings, etc.)
 *
 * Target: Cards block - one row per card with content cell
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.module-latest_item');
  const cells = [];

  cards.forEach((card) => {
    const container = card.querySelector('.module-latest_item-container');
    if (!container) return;

    const contentCell = [];

    // Extract card title (h2.module_title)
    const title = container.querySelector('h2.module_title');
    if (title) contentCell.push(title);

    // Extract widget content - get key items (headlines, links, dates)
    const widget = container.querySelector('.module-latest_widget');
    if (widget) {
      // Get headlines and date items
      const items = widget.querySelectorAll('.module_item');
      items.forEach((item) => {
        const dateText = item.querySelector('.module_date-text');
        const headlineLink = item.querySelector('.module_headline-link');
        const headline = item.querySelector('.module_headline');

        if (dateText || headlineLink || headline) {
          const p = document.createElement('p');
          if (dateText) {
            p.append(dateText.cloneNode(true));
            p.append(document.createTextNode(' — '));
          }
          if (headlineLink) {
            p.append(headlineLink.cloneNode(true));
          } else if (headline) {
            p.append(headline.cloneNode(true));
          }
          contentCell.push(p);
        }
      });

      // Get document links (Press Release, Webcast, etc.)
      const docLinks = widget.querySelectorAll('.module_links > a.module_link');
      docLinks.forEach((link) => {
        contentCell.push(link);
      });

      // Get cover images (Annual Report)
      const coverImgs = widget.querySelectorAll('.module_cover img');
      coverImgs.forEach((img) => {
        contentCell.push(img);
      });

      // Get download responsibility items
      const respItems = widget.querySelectorAll('.module-download-responsability_item');
      respItems.forEach((item) => {
        const img = item.querySelector('img');
        const headlineA = item.querySelector('.module-download-responsability_headline a');
        if (img) contentCell.push(img);
        if (headlineA) contentCell.push(headlineA);
      });
    }

    // Extract CTA button
    const cta = container.querySelector('.module-latest_button a.button');
    if (cta) contentCell.push(cta);

    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-ir', cells });
  element.replaceWith(block);
}
