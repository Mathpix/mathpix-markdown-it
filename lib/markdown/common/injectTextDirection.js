"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectTextDirection = void 0;
var mmdRendererRules_1 = require("./mmdRendererRules");
var injectTextDirection = function (md, textDirection) {
    var bidi = function (defaultRenderer) { return function (tokens, idx, opts, env, self) {
        var token = tokens[idx];
        var prevToken = tokens[idx - 1];
        if (token.type === 'th_open' && prevToken.type === 'tr_open') {
            return defaultRenderer(tokens, idx, opts, env, self);
        }
        token.attrSet('dir', textDirection);
        return defaultRenderer(tokens, idx, opts, env, self);
    }; };
    var proxy = function (tokens, idx, opts, _, self) {
        return self.renderToken(tokens, idx, opts);
    };
    mmdRendererRules_1.mmdRendererRules.forEach(function (rule) {
        if (rule.generatesContainer) {
            var defaultRenderer = md.renderer.rules[rule.name] || proxy;
            md.renderer.rules[rule.name] = bidi(defaultRenderer);
        }
    });
};
exports.injectTextDirection = injectTextDirection;
//# sourceMappingURL=injectTextDirection.js.map