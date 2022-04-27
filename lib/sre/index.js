"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAriaToMathHTML = exports.getSpeech = void 0;
/**
 * TODO: Add a handler to reader output "softmax" as a word instead of "s o f t m a x"
 * */
exports.getSpeech = function (sre, mml) {
    try {
        return sre.toSpeech(mml);
    }
    catch (err) {
        console.error('ERROR=>[getSpeech]=>' + err);
        return '';
    }
};
exports.addAriaToMathHTML = function (sre, html) {
    try {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var mathEls = doc
            ? doc.querySelectorAll('mjx-container')
            : null;
        if (!mathEls || !mathEls.length) {
            return html;
        }
        for (var i = 0; i < mathEls.length; i++) {
            var elMath = mathEls[i];
            var elMml = elMath
                ? elMath.querySelector('mjx-assistive-mml')
                : null;
            if (!elMml) {
                continue;
            }
            var speech = exports.getSpeech(sre, elMml.innerHTML);
            elMml.setAttribute('aria-hidden', "true");
            if (!speech) {
                continue;
            }
            elMath.setAttribute('aria-label', speech);
            elMath.setAttribute('role', "math");
            elMath.setAttribute('tabindex', '0');
            var elSpeech = doc.createElement('speech');
            elSpeech.innerHTML = speech;
            elSpeech.style.display = "none";
            elMath.parentElement.appendChild(elSpeech);
        }
        return doc.body.innerHTML;
    }
    catch (err) {
        console.error('ERROR=>[addAriaToMathHTML]=>' + err);
        return html;
    }
};
//# sourceMappingURL=index.js.map