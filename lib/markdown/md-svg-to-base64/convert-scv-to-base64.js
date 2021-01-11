"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64_1 = require("./base64");
var convertSvgToBase64 = function (svgString) {
    if (svgString === void 0) { svgString = ''; }
    var PREFIX = 'data:image/svg+xml;base64,';
    var base64Encode = PREFIX + base64_1.default.encode(svgString);
    return '<img class="imgSvg" src=\"' + base64Encode + '\"/>';
};
exports.default = convertSvgToBase64;
//# sourceMappingURL=convert-scv-to-base64.js.map