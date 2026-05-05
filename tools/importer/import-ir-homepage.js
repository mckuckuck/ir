/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroIrParser from './parsers/hero-ir.js';
import cardsIrParser from './parsers/cards-ir.js';
import columnsContactParser from './parsers/columns-contact.js';

// TRANSFORMER IMPORTS
import amexIrCleanupTransformer from './transformers/amex-ir-cleanup.js';
import amexIrSectionsTransformer from './transformers/amex-ir-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-ir': heroIrParser,
  'cards-ir': cardsIrParser,
  'columns-contact': columnsContactParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'ir-homepage',
  description: 'Investor Relations homepage with hero, stock ticker, featured content, and quick links',
  urls: [
    'https://ir.americanexpress.com/investor-relations/default.aspx',
  ],
  blocks: [
    {
      name: 'hero-ir',
      instances: ['.module-banner-home.dark'],
    },
    {
      name: 'cards-ir',
      instances: ['.module-latest_items'],
    },
    {
      name: 'columns-contact',
      instances: ['.module-contact.dark', '.module-subscribe--footer'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.module-banner-home',
      style: 'amex-blue',
      blocks: ['hero-ir'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Corporate Profile',
      selector: '.module-corporate-profile',
      style: null,
      blocks: [],
      defaultContent: [
        '.module-corporate-profile .module_title',
        '.module-corporate-profile .text-left p',
        '.module-corporate-profile .module-corporate-profile_button a',
      ],
    },
    {
      id: 'section-3',
      name: 'Latest Widgets Grid',
      selector: '.module-latest--landing',
      style: 'light-grey',
      blocks: ['cards-ir'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Disclaimer',
      selector: '.module-information-footer',
      style: null,
      blocks: [],
      defaultContent: [
        '.module-information-footer .module_container--inner p',
      ],
    },
    {
      id: 'section-5',
      name: 'Contact and Alerts Footer',
      selector: '.pane--footer',
      style: 'dark-navy',
      blocks: ['columns-contact'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  amexIrCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1
    ? [amexIrSectionsTransformer]
    : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
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
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
