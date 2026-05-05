/* eslint-disable */
/* global WebImporter */

/**
 * Section transformer for American Express IR pages.
 * Adds section breaks and section-metadata blocks based on template sections.
 * Runs in afterTransform only. Uses payload.template.sections.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const template = payload && payload.template;
    if (!template || !template.sections || template.sections.length < 2) return;

    const sections = template.sections;
    const document = element.ownerDocument;

    // Process sections in reverse order to avoid DOM position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];

      // Find the section element using the selector
      let sectionEl = null;
      if (Array.isArray(section.selector)) {
        for (const sel of section.selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
      } else {
        sectionEl = element.querySelector(section.selector);
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (hr) before each section except the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
