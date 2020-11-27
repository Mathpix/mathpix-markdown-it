"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* eslint-disable no-param-reassign */
var JSZip = require("jszip");
var html_to_docx_1 = require("./src/html-to-docx");
var minify = require('html-minifier').minify;
var minifyHTMLString = function (htmlString) {
    if (typeof htmlString === 'string' || htmlString instanceof String) {
        try {
            var minifiedHTMLString = minify(htmlString, {
                caseSensitive: true,
                collapseWhitespace: true,
                html5: false,
                keepClosingSlash: true,
            });
            return minifiedHTMLString;
        }
        catch (error) {
            return null;
        }
    }
    else {
        return null;
    }
};
function generateContainer(htmlString, headerHTMLString, documentOptions, onlyBuffer) {
    if (documentOptions === void 0) { documentOptions = {}; }
    if (onlyBuffer === void 0) { onlyBuffer = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var zip, contentHTML, headerHTML, buffer;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    zip = new JSZip();
                    contentHTML = htmlString;
                    headerHTML = headerHTMLString;
                    if (htmlString) {
                        // contentHTML = contentHTML//minifyHTMLString(contentHTML);
                        contentHTML = minifyHTMLString(contentHTML);
                    }
                    if (headerHTMLString) {
                        // headerHTML = headerHTML//minifyHTMLString(headerHTML);
                        headerHTML = minifyHTMLString(headerHTML);
                    }
                    html_to_docx_1.addFilesToContainer(zip, contentHTML, documentOptions, headerHTML);
                    return [4 /*yield*/, zip.generateAsync({ type: 'arraybuffer' })];
                case 1:
                    buffer = _a.sent();
                    if (onlyBuffer) {
                        return [2 /*return*/, buffer];
                    }
                    if (Object.prototype.hasOwnProperty.call(global, 'Blob')) {
                        // eslint-disable-next-line no-undef
                        return [2 /*return*/, new Blob([buffer], {
                                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            })];
                    }
                    if (Object.prototype.hasOwnProperty.call(global, 'Buffer')) {
                        return [2 /*return*/, Buffer.from(new Uint8Array(buffer))];
                    }
                    throw new Error('Add blob support using a polyfill eg https://github.com/bjornstar/blob-polyfill');
            }
        });
    });
}
exports.default = generateContainer;
//# sourceMappingURL=index.js.map