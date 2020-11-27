"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var relsXML = "\n    <?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n\n    <Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n        <Relationship Id=\"rId1\" Type=\"" + helpers_1.namespaces.officeDocumentRelation + "\" Target=\"word/document.xml\"/>\n        <Relationship Id=\"rId2\" Type=\"" + helpers_1.namespaces.corePropertiesRelation + "\" Target=\"docProps/core.xml\"/>\n    </Relationships>\n";
exports.default = relsXML;
//# sourceMappingURL=rels.js.map