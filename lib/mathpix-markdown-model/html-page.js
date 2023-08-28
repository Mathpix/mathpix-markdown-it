"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlPage = void 0;
var generateHtmlPage = function (title, previewHtml, styles, fonts) {
    if (styles === void 0) { styles = ''; }
    if (fonts === void 0) { fonts = ''; }
    return "<!DOCTYPE html>\n<html lang=\"en-US\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>".concat(title, "</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    ").concat(fonts, "\n    ").concat(styles, "\n</head>\n<body>\n  <div id=\"preview\" class=\"preview scrollEditor\">\n    <div id=\"container-ruller\" />\n    <div id=\"preview-content\">\n      ").concat(previewHtml, "\n    </div>\n  </div>\n</body>\n</html>");
};
exports.generateHtmlPage = generateHtmlPage;
//# sourceMappingURL=html-page.js.map