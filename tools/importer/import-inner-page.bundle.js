var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
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

  // tools/importer/import-inner-page.js
  var import_inner_page_exports = {};
  __export(import_inner_page_exports, {
    default: () => import_inner_page_default
  });

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

  // tools/importer/import-inner-page.js
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_inner_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      executeTransformers("afterTransform", main, payload);
      WebImporter.DOMUtils.remove(main, [".module-breadcrumb"]);
      const pageTitleModule = main.querySelector(".module-page-title");
      if (pageTitleModule) {
        const h1 = pageTitleModule.querySelector("h1");
        if (h1) {
          pageTitleModule.replaceWith(h1);
        }
      }
      WebImporter.DOMUtils.remove(main, [".pane--left", ".pane--right"]);
      WebImporter.DOMUtils.remove(main, [".module-disclaimer-webcast"]);
      const contactModule = main.querySelector(".module-contact.dark");
      const subscribeModule = main.querySelector(".module-subscribe--footer");
      if (contactModule) {
        const contactTitle = contactModule.querySelector(".module_title");
        const contactGrid = contactModule.querySelector(".grid--no-gutter");
        const col1 = document.createElement("div");
        if (contactTitle) {
          const h2 = document.createElement("h2");
          h2.textContent = contactTitle.textContent.trim();
          col1.append(h2);
        }
        if (contactGrid) {
          const cols = contactGrid.querySelectorAll(".grid_col");
          cols.forEach((col) => {
            const paras = col.querySelectorAll("p");
            paras.forEach((p) => col1.append(p));
          });
        }
        const col2 = document.createElement("div");
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
        }
        const hr = document.createElement("hr");
        contactModule.before(hr);
        const block = WebImporter.Blocks.createBlock(document, {
          name: "columns-contact",
          cells: [[col1, col2]]
        });
        contactModule.replaceWith(block);
        const sectionMeta = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: "dark-navy" }
        });
        block.after(sectionMeta);
        if (subscribeModule) subscribeModule.remove();
      }
      WebImporter.DOMUtils.remove(main, [
        ".module_confirmation-container",
        ".q4l-loading-spinner"
      ]);
      const metaHr = document.createElement("hr");
      main.appendChild(metaHr);
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
          template: "inner-page"
        }
      }];
    }
  };
  return __toCommonJS(import_inner_page_exports);
})();
