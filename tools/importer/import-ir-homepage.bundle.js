var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-ir-homepage.js
  var import_ir_homepage_exports = {};
  __export(import_ir_homepage_exports, {
    default: () => import_ir_homepage_default
  });

  // tools/importer/parsers/hero-ir.js
  function parse(element, { document }) {
    const logo = element.querySelector(".module-banner-home_logo img");
    const heading = element.querySelector(".module-banner-home_title h1, .module-banner-home_title h2");
    const eventBanner = element.querySelector(".module-event-banner");
    const eventDate = eventBanner ? eventBanner.querySelector(".module_date-text") : null;
    const eventTime = eventBanner ? eventBanner.querySelector(".module_time-text") : null;
    const eventHeadline = eventBanner ? eventBanner.querySelector(".module_headline-link") : null;
    const stockHeader = element.querySelector(".module-stock-header");
    const stockTicker = stockHeader ? stockHeader.querySelector(".module-stock-header_description1") : null;
    const stockPrice = stockHeader ? stockHeader.querySelector(".module-stock-header_stock-price") : null;
    const cells = [];
    if (logo) {
      cells.push([logo]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (eventDate && eventHeadline) {
      const eventP = document.createElement("p");
      if (eventDate) eventP.append(eventDate.cloneNode(true));
      if (eventTime) {
        eventP.append(document.createTextNode(" "));
        eventP.append(eventTime.cloneNode(true));
      }
      contentCell.push(eventP);
      contentCell.push(eventHeadline);
    }
    if (stockTicker && stockPrice) {
      const stockP = document.createElement("p");
      stockP.append(stockTicker.cloneNode(true));
      stockP.append(document.createTextNode(" "));
      stockP.append(stockPrice.cloneNode(true));
      contentCell.push(stockP);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-ir", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-ir.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(".module-latest_item");
    const cells = [];
    cards.forEach((card) => {
      const container = card.querySelector(".module-latest_item-container");
      if (!container) return;
      const contentCell = [];
      const title = container.querySelector("h2.module_title");
      if (title) contentCell.push(title);
      const widget = container.querySelector(".module-latest_widget");
      if (widget) {
        const items = widget.querySelectorAll(".module_item");
        items.forEach((item) => {
          const dateText = item.querySelector(".module_date-text");
          const headlineLink = item.querySelector(".module_headline-link");
          const headline = item.querySelector(".module_headline");
          if (dateText || headlineLink || headline) {
            const p = document.createElement("p");
            if (dateText) {
              p.append(dateText.cloneNode(true));
              p.append(document.createTextNode(" \u2014 "));
            }
            if (headlineLink) {
              p.append(headlineLink.cloneNode(true));
            } else if (headline) {
              p.append(headline.cloneNode(true));
            }
            contentCell.push(p);
          }
        });
        const docLinks = widget.querySelectorAll(".module_links > a.module_link");
        docLinks.forEach((link) => {
          contentCell.push(link);
        });
        const coverImgs = widget.querySelectorAll(".module_cover img");
        coverImgs.forEach((img) => {
          contentCell.push(img);
        });
        const respItems = widget.querySelectorAll(".module-download-responsability_item");
        respItems.forEach((item) => {
          const img = item.querySelector("img");
          const headlineA = item.querySelector(".module-download-responsability_headline a");
          if (img) contentCell.push(img);
          if (headlineA) contentCell.push(headlineA);
        });
      }
      const cta = container.querySelector(".module-latest_button a.button");
      if (cta) contentCell.push(cta);
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-ir", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse3(element, { document }) {
    const col1 = document.createElement("div");
    const contactTitle = element.querySelector(".module_title");
    if (contactTitle) {
      const h2 = document.createElement("h2");
      h2.textContent = contactTitle.textContent.trim();
      col1.append(h2);
    }
    const contactCols = element.querySelectorAll(".grid_col--1-of-3");
    contactCols.forEach((col) => {
      const paras = col.querySelectorAll("p");
      paras.forEach((p) => col1.append(p));
    });
    const col2 = document.createElement("div");
    const subscribeModule = element.closest(".pane--footer") ? element.closest(".pane--footer").querySelector(".module-subscribe--footer") : null;
    if (subscribeModule) {
      const alertsTitle = subscribeModule.querySelector(".module_title");
      if (alertsTitle) {
        const h2 = document.createElement("h2");
        h2.textContent = alertsTitle.textContent.trim();
        col2.append(h2);
      }
      const introSpan = subscribeModule.querySelector(".IntroText");
      if (introSpan) {
        const paras = introSpan.querySelectorAll("p");
        paras.forEach((p) => col2.append(p));
      }
      const labels = subscribeModule.querySelectorAll("#_ctrl0_ctl36_chkLists label");
      if (labels.length > 0) {
        const ul = document.createElement("ul");
        labels.forEach((label) => {
          const li = document.createElement("li");
          li.textContent = label.textContent.trim();
          ul.append(li);
        });
        col2.append(ul);
      }
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/amex-ir-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".module-skip"]);
      WebImporter.DOMUtils.remove(element, [".module.hidden"]);
      WebImporter.DOMUtils.remove(element, [".aspNetHidden"]);
      element.querySelectorAll('input[type="hidden"], input#__RequestVerificationToken, input#hdnRedirectToLoginUrl').forEach((el) => el.remove());
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["#globalHeader"]);
      WebImporter.DOMUtils.remove(element, [".pane--header"]);
      WebImporter.DOMUtils.remove(element, [".pane--navigation", ".nav--mobile", "#accessibleRespNav"]);
      WebImporter.DOMUtils.remove(element, [".module-search"]);
      WebImporter.DOMUtils.remove(element, [".pane--breadcrumb"]);
      WebImporter.DOMUtils.remove(element, [".module-corporate-footer-feed"]);
      WebImporter.DOMUtils.remove(element, [".module-q4-credits"]);
      WebImporter.DOMUtils.remove(element, [".pane--credits", ".pane--footer2"]);
      WebImporter.DOMUtils.remove(element, [".layout_toggle"]);
      WebImporter.DOMUtils.remove(element, ["iframe", "noscript", "link"]);
      WebImporter.DOMUtils.remove(element, [".grecaptcha-badge", '[class*="recaptcha"]']);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-module");
      });
    }
  }

  // tools/importer/transformers/amex-ir-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const template = payload && payload.template;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      const document = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
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
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-ir-homepage.js
  var parsers = {
    "hero-ir": parse,
    "cards-ir": parse2,
    "columns-contact": parse3
  };
  var PAGE_TEMPLATE = {
    name: "ir-homepage",
    description: "Investor Relations homepage with hero, stock ticker, featured content, and quick links",
    urls: [
      "https://ir.americanexpress.com/investor-relations/default.aspx"
    ],
    blocks: [
      {
        name: "hero-ir",
        instances: [".module-banner-home.dark"]
      },
      {
        name: "cards-ir",
        instances: [".module-latest_items"]
      },
      {
        name: "columns-contact",
        instances: [".module-contact.dark", ".module-subscribe--footer"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".module-banner-home",
        style: "amex-blue",
        blocks: ["hero-ir"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Corporate Profile",
        selector: ".module-corporate-profile",
        style: null,
        blocks: [],
        defaultContent: [
          ".module-corporate-profile .module_title",
          ".module-corporate-profile .text-left p",
          ".module-corporate-profile .module-corporate-profile_button a"
        ]
      },
      {
        id: "section-3",
        name: "Latest Widgets Grid",
        selector: ".module-latest--landing",
        style: "light-grey",
        blocks: ["cards-ir"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Disclaimer",
        selector: ".module-information-footer",
        style: null,
        blocks: [],
        defaultContent: [
          ".module-information-footer .module_container--inner p"
        ]
      },
      {
        id: "section-5",
        name: "Contact and Alerts Footer",
        selector: ".pane--footer",
        style: "dark-navy",
        blocks: ["columns-contact"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_ir_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.aspx$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_ir_homepage_exports);
})();
