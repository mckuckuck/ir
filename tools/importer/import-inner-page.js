/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS - Reuse the same cleanup transformer
import amexIrCleanupTransformer from './transformers/amex-ir-cleanup.js';

// TRANSFORMER REGISTRY
const transformers = [amexIrCleanupTransformer];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Execute afterTransform transformers (removes header, footer, nav, etc.)
    executeTransformers('afterTransform', main, payload);

    // 3. Remove breadcrumb module (from captured DOM: class="module module-breadcrumb")
    WebImporter.DOMUtils.remove(main, ['.module-breadcrumb']);

    // 4. Remove page-title module wrapper but keep the h1
    const pageTitleModule = main.querySelector('.module-page-title');
    if (pageTitleModule) {
      const h1 = pageTitleModule.querySelector('h1');
      if (h1) {
        pageTitleModule.replaceWith(h1);
      }
    }

    // 5. Remove empty panes
    WebImporter.DOMUtils.remove(main, ['.pane--left', '.pane--right']);

    // 6. Remove disclaimer-webcast and other non-content modules
    WebImporter.DOMUtils.remove(main, ['.module-disclaimer-webcast']);

    // 7. Convert the contact section into a columns-contact block
    const contactModule = main.querySelector('.module-contact.dark');
    const subscribeModule = main.querySelector('.module-subscribe--footer');

    if (contactModule) {
      // Build contact column content
      const contactTitle = contactModule.querySelector('.module_title');
      const contactGrid = contactModule.querySelector('.grid--no-gutter');

      // Build subscribe column content
      const col1 = document.createElement('div');
      if (contactTitle) {
        const h2 = document.createElement('h2');
        h2.textContent = contactTitle.textContent.trim();
        col1.append(h2);
      }
      if (contactGrid) {
        const cols = contactGrid.querySelectorAll('.grid_col');
        cols.forEach((col) => {
          const paras = col.querySelectorAll('p');
          paras.forEach((p) => col1.append(p));
        });
      }

      const col2 = document.createElement('div');
      if (subscribeModule) {
        const alertsTitle = subscribeModule.querySelector('.module_title');
        if (alertsTitle) {
          const h2 = document.createElement('h2');
          h2.textContent = alertsTitle.textContent.trim();
          col2.append(h2);
        }
        const introSpan = subscribeModule.querySelector('.IntroText');
        if (introSpan) {
          const paras = introSpan.querySelectorAll('p');
          paras.forEach((p) => col2.append(p));
        }
      }

      // Add section break before contact
      const hr = document.createElement('hr');
      contactModule.before(hr);

      // Create the block
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'columns-contact',
        cells: [[col1, col2]],
      });
      contactModule.replaceWith(block);

      // Add section metadata for dark style
      const sectionMeta = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: 'dark-navy' },
      });
      block.after(sectionMeta);

      // Remove the subscribe module (already captured in col2)
      if (subscribeModule) subscribeModule.remove();
    }

    // 8. Remove confirmation containers and loading spinners
    WebImporter.DOMUtils.remove(main, [
      '.module_confirmation-container',
      '.q4l-loading-spinner',
    ]);

    // 9. Apply WebImporter built-in rules
    const metaHr = document.createElement('hr');
    main.appendChild(metaHr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 10. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname
        .replace(/\/$/, '')
        .replace(/\.aspx$/, '')
        .replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: 'inner-page',
      },
    }];
  },
};
