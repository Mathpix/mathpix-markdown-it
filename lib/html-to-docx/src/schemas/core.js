"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var generateCoreXML = function (title, subject, creator, keywords, description, lastModifiedBy, revision, createdAt, modifiedAt) {
    if (title === void 0) { title = ''; }
    if (subject === void 0) { subject = ''; }
    if (creator === void 0) { creator = 'html-to-docx'; }
    if (keywords === void 0) { keywords = ['html-to-docx']; }
    if (description === void 0) { description = ''; }
    if (lastModifiedBy === void 0) { lastModifiedBy = 'html-to-docx'; }
    if (revision === void 0) { revision = 1; }
    if (createdAt === void 0) { createdAt = new Date(); }
    if (modifiedAt === void 0) { modifiedAt = new Date(); }
    return "\n        <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\n        <cp:coreProperties\n          xmlns:cp=\"" + helpers_1.namespaces.coreProperties + "\"\n          xmlns:dc=\"" + helpers_1.namespaces.dc + "\"\n          xmlns:dcterms=\"" + helpers_1.namespaces.dcterms + "\"\n          xmlns:dcmitype=\"" + helpers_1.namespaces.dcmitype + "\"\n          xmlns:xsi=\"" + helpers_1.namespaces.xsi + "\"\n          >\n            <dc:title>" + title + "</dc:title>\n            <dc:subject>" + subject + "</dc:subject>\n            <dc:creator>" + creator + "</dc:creator>\n            " + (keywords && Array.isArray(keywords)
        ? "<cp:keywords>" + keywords.join(', ') + "</cp:keywords>"
        : '') + "\n            <dc:description>" + description + "</dc:description>\n            <cp:lastModifiedBy>" + lastModifiedBy + "</cp:lastModifiedBy>\n            <cp:revision>" + revision + "</cp:revision>\n            <dcterms:created xsi:type=\"dcterms:W3CDTF\">" + (createdAt instanceof Date ? createdAt.toISOString() : new Date().toISOString()) + "</dcterms:created>\n            <dcterms:modified xsi:type=\"dcterms:W3CDTF\">" + (modifiedAt instanceof Date ? modifiedAt.toISOString() : new Date().toISOString()) + "</dcterms:modified>\n        </cp:coreProperties>\n    ";
};
exports.default = generateCoreXML;
//# sourceMappingURL=core.js.map