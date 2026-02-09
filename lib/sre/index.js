"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAriaToMathHTML = exports.addSpeechToMathContainer = exports.getSpeech = void 0;
/**
 * TODO: Add a handler to reader output "softmax" as a word instead of "s o f t m a x"
 * */
var getSpeech = function (sre, mml) {
    try {
        return sre.toSpeech(mml);
    }
    catch (err) {
        console.error('ERROR=>[getSpeech]=>' + err);
        return '';
    }
};
exports.getSpeech = getSpeech;
/**
 * Process a single mjx-container element to add speech accessibility.
 *
 * @param sre - Speech Rule Engine instance
 * @param elMath - The mjx-container element
 * @param doc - Document object for creating elements (pass `document` in browser)
 */
var addSpeechToMathContainer = function (sre, elMath, doc) {
    var _a;
    // Skip if already has aria-label
    if (elMath.hasAttribute('aria-label'))
        return;
    // Find assistive MathML element
    var elMml = elMath.querySelector('mjx-assistive-mml');
    if (!elMml)
        return;
    var speech = (0, exports.getSpeech)(sre, elMml.innerHTML);
    if (!speech)
        return;
    // Set accessibility attributes
    elMath.setAttribute('aria-label', speech);
    elMath.setAttribute('role', 'math');
    elMath.setAttribute('tabindex', '0');
    elMath.removeAttribute('aria-labelledby');
    // Add hidden speech element for context menu
    var elSpeech = doc.createElement('speech');
    elSpeech.innerHTML = speech;
    elSpeech.style.display = 'none';
    (_a = elMath.parentElement) === null || _a === void 0 ? void 0 : _a.appendChild(elSpeech);
};
exports.addSpeechToMathContainer = addSpeechToMathContainer;
var addAriaToMathHTML = function (sre, html) {
    try {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var mathEls = doc
            ? doc.querySelectorAll('mjx-container')
            : null;
        if (!mathEls || !mathEls.length) {
            return html;
        }
        for (var i = 0; i < mathEls.length; i++) {
            (0, exports.addSpeechToMathContainer)(sre, mathEls[i], doc);
        }
        return doc.body.innerHTML;
    }
    catch (err) {
        console.error('ERROR=>[addAriaToMathHTML]=>' + err);
        return html;
    }
};
exports.addAriaToMathHTML = addAriaToMathHTML;
//# sourceMappingURL=index.js.map