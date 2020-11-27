"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var generateNumberingXMLTemplate = function () {
    return "\n        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\n        <w:numbering\n        xmlns:w=\"" + helpers_1.namespaces.w + "\"\n        xmlns:ve=\"" + helpers_1.namespaces.ve + "\"\n        xmlns:o=\"" + helpers_1.namespaces.o + "\"\n        xmlns:r=\"" + helpers_1.namespaces.r + "\"\n        xmlns:v=\"" + helpers_1.namespaces.v + "\"\n        xmlns:wp=\"" + helpers_1.namespaces.wp + "\"\n        xmlns:w10=\"" + helpers_1.namespaces.w10 + "\"\n        xmlns:wne=\"" + helpers_1.namespaces.wne + "\">\n        </w:numbering>\n    ";
};
exports.default = generateNumberingXMLTemplate;
//# sourceMappingURL=numbering.js.map