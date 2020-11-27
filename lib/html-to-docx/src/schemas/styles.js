"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var generateStylesXML = function (font, fontSize, complexScriptFontSize) {
    if (font === void 0) { font = 'Times New Roman'; }
    if (fontSize === void 0) { fontSize = 22; }
    if (complexScriptFontSize === void 0) { complexScriptFontSize = 22; }
    return "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\n    <w:styles\n      xmlns:w=\"" + helpers_1.namespaces.w + "\"\n      xmlns:r=\"" + helpers_1.namespaces.r + "\" >\n        <w:docDefaults>\n          <w:rPrDefault>\n            <w:rPr>\n              <w:rFonts w:ascii=\"" + font + "\" w:eastAsiaTheme=\"minorHAnsi\" w:hAnsiTheme=\"minorHAnsi\" w:cstheme=\"minorBidi\" />\n              <w:sz w:val=\"" + fontSize + "\"/>\n              <w:szCs w:val=\"" + complexScriptFontSize + "\"/>\n              <w:lang w:val=\"en-US\" w:eastAsia=\"en-US\" w:bidi=\"ar-SA\"/>\n            </w:rPr>\n          </w:rPrDefault>\n          <w:pPrDefault>\n            <w:pPr>\n              <w:spacing w:after=\"120\" w:line=\"240\" w:lineRule=\"atLeast\"/>\n            </w:pPr>\n          </w:pPrDefault>\n        </w:docDefaults>\n    </w:styles>\n  ";
};
exports.default = generateStylesXML;
//# sourceMappingURL=styles.js.map