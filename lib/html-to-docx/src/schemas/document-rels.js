"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var documentRelsXML = "\n  <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\n  <Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n    <Relationship Id=\"rId1\" Type=\"" + helpers_1.namespaces.numbering + "\" Target=\"numbering.xml\"/>\n    <Relationship Id=\"rId2\" Type=\"" + helpers_1.namespaces.styles + "\" Target=\"styles.xml\"/>\n    <Relationship Id=\"rId3\" Type=\"" + helpers_1.namespaces.settingsRelation + "\" Target=\"settings.xml\"/>\n    <Relationship Id=\"rId4\" Type=\"" + helpers_1.namespaces.webSettingsRelation + "\" Target=\"webSettings.xml\"/>\n  </Relationships>\n";
exports.default = documentRelsXML;
//# sourceMappingURL=document-rels.js.map