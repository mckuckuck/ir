/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: American Express IR cleanup.
 * Selectors from captured DOM of ir.americanexpress.com
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove skip-to-content links (from captured DOM: class="module module-embed module-skip")
    WebImporter.DOMUtils.remove(element, ['.module-skip']);

    // Remove hidden modules (from captured DOM: class="module module-embed hidden")
    WebImporter.DOMUtils.remove(element, ['.module.hidden']);

    // Remove ASP.NET form artifacts (from captured DOM: class="aspNetHidden", input elements)
    WebImporter.DOMUtils.remove(element, ['.aspNetHidden']);
    element.querySelectorAll('input[type="hidden"], input#__RequestVerificationToken, input#hdnRedirectToLoginUrl').forEach((el) => el.remove());
  }

  if (hookName === H.after) {
    // Remove global header (from captured DOM: id="globalHeader")
    WebImporter.DOMUtils.remove(element, ['#globalHeader']);

    // Remove header pane with all nav (from captured DOM: class="pane pane--header grid--no-gutter")
    WebImporter.DOMUtils.remove(element, ['.pane--header']);

    // Remove IR sub-navigation (from captured DOM: class="pane pane--navigation", class="nav nav--mobile")
    WebImporter.DOMUtils.remove(element, ['.pane--navigation', '.nav--mobile', '#accessibleRespNav']);

    // Remove search modules (from captured DOM: class="module module-search")
    WebImporter.DOMUtils.remove(element, ['.module-search']);

    // Remove breadcrumb pane (from captured DOM: class="pane pane--breadcrumb")
    WebImporter.DOMUtils.remove(element, ['.pane--breadcrumb']);

    // Remove corporate footer feed (from captured DOM: class="module module-embed module-corporate-footer-feed")
    WebImporter.DOMUtils.remove(element, ['.module-corporate-footer-feed']);

    // Remove Q4 credits (from captured DOM: class="module module-q4-credits")
    WebImporter.DOMUtils.remove(element, ['.module-q4-credits']);

    // Remove credits and footer2 panes (from captured DOM: class="pane pane--credits", class="pane pane--footer2")
    WebImporter.DOMUtils.remove(element, ['.pane--credits', '.pane--footer2']);

    // Remove layout toggle (from captured DOM: class="module module-embed layout_toggle")
    WebImporter.DOMUtils.remove(element, ['.layout_toggle']);

    // Remove iframes, noscript, link tags
    WebImporter.DOMUtils.remove(element, ['iframe', 'noscript', 'link']);

    // Remove reCAPTCHA artifacts
    WebImporter.DOMUtils.remove(element, ['.grecaptcha-badge', '[class*="recaptcha"]']);

    // Remove tracking/data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-module');
    });
  }
}
