/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-contact variant.
 * Base block: columns
 * Source: https://ir.americanexpress.com/investor-relations/default.aspx
 * Selector: .module-contact.dark, .module-subscribe--footer
 *
 * Source DOM structure (from captured HTML):
 *   .module-contact.dark (left column)
 *     h2.module_title > span "Contact"
 *     .grid_col--1-of-3 (×3): AmEx address, IR contact, Transfer Agent
 *   .module-subscribe--footer (right column)
 *     h2.module_title > span "Investor Alerts"
 *     .module_introduction (subscription intro text)
 *     Email input, mailing list checkboxes, submit button
 *
 * Target: Columns block with two columns (contact info | email alerts)
 */
export default function parse(element, { document }) {
  // Build column 1: Contact info
  const col1 = document.createElement('div');

  const contactTitle = element.querySelector('.module_title');
  if (contactTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = contactTitle.textContent.trim();
    col1.append(h2);
  }

  // Get the three contact grid columns
  const contactCols = element.querySelectorAll('.grid_col--1-of-3');
  contactCols.forEach((col) => {
    const paras = col.querySelectorAll('p');
    paras.forEach((p) => col1.append(p));
  });

  // Build column 2: Investor Alerts info (simplified for authoring)
  const col2 = document.createElement('div');

  // Find the subscribe module - it may be the element itself or a sibling
  const subscribeModule = element.closest('.pane--footer')
    ? element.closest('.pane--footer').querySelector('.module-subscribe--footer')
    : null;

  if (subscribeModule) {
    const alertsTitle = subscribeModule.querySelector('.module_title');
    if (alertsTitle) {
      const h2 = document.createElement('h2');
      h2.textContent = alertsTitle.textContent.trim();
      col2.append(h2);
    }

    // Get the intro text
    const introSpan = subscribeModule.querySelector('.IntroText');
    if (introSpan) {
      const paras = introSpan.querySelectorAll('p');
      paras.forEach((p) => col2.append(p));
    }

    // List the mailing list options as text
    const labels = subscribeModule.querySelectorAll('#_ctrl0_ctl36_chkLists label');
    if (labels.length > 0) {
      const ul = document.createElement('ul');
      labels.forEach((label) => {
        const li = document.createElement('li');
        li.textContent = label.textContent.trim();
        ul.append(li);
      });
      col2.append(ul);
    }
  }

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
