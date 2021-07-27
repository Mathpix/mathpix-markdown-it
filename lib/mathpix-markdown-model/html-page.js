"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtmlPage = void 0;
exports.generateHtmlPage = function (title, previewHtml, styles, fonts) {
    if (styles === void 0) { styles = ''; }
    if (fonts === void 0) { fonts = ''; }
    return "<!DOCTYPE html>\n<html lang=\"en-US\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>" + title + "</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    " + fonts + "\n    " + styles + "\n</head>\n<body>\n  <div id=\"preview\" class=\"preview scrollEditor\">\n    <div id=\"container-ruller\" />\n    <div id=\"preview-content\">\n      " + previewHtml + "\n    </div>\n  </div>\n</body>\n</html>";
};
//# sourceMappingURL=html-page.js.map