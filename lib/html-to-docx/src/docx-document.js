"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmlbuilder2_1 = require("xmlbuilder2");
var schemas_1 = require("./schemas");
var helpers_1 = require("./helpers");
var document_template_1 = require("../template/document.template");
var crypto = require('crypto');
var landscapeMargins = {
    top: 1800,
    right: 1440,
    bottom: 1800,
    left: 1440,
    header: 720,
    footer: 720,
    gutter: 0,
};
var portraitMargins = {
    top: 1440,
    right: 1800,
    bottom: 1440,
    left: 1800,
    header: 720,
    footer: 720,
    gutter: 0,
};
var DocxDocument = /** @class */ (function () {
    function DocxDocument(_a) {
        var zip = _a.zip, htmlString = _a.htmlString, orientation = _a.orientation, margins = _a.margins, title = _a.title, subject = _a.subject, creator = _a.creator, keywords = _a.keywords, description = _a.description, lastModifiedBy = _a.lastModifiedBy, revision = _a.revision, createdAt = _a.createdAt, modifiedAt = _a.modifiedAt, headerType = _a.headerType, header = _a.header, font = _a.font, fontSize = _a.fontSize, complexScriptFontSize = _a.complexScriptFontSize, table = _a.table;
        this.zip = zip;
        this.htmlString = htmlString;
        this.orientation = orientation;
        this.width = orientation === 'landscape' ? 15840 : 12240;
        this.height = orientation === 'landscape' ? 12240 : 15840;
        this.margins =
            // eslint-disable-next-line no-nested-ternary
            margins && Object.keys(margins).length
                ? margins
                : orientation === 'landscape'
                    ? landscapeMargins
                    : portraitMargins;
        this.availableDocumentSpace = this.width - this.margins.left - this.margins.right;
        this.title = title || '';
        this.subject = subject || '';
        this.creator = creator || 'html-to-docx';
        this.keywords = keywords || ['html-to-docx'];
        this.description = description || '';
        this.lastModifiedBy = lastModifiedBy || 'html-to-docx';
        this.revision = revision || 1;
        this.createdAt = createdAt || new Date();
        this.modifiedAt = modifiedAt || new Date();
        this.headerType = headerType || 'default';
        this.header = header || false;
        this.font = font || 'Times New Roman';
        this.fontSize = fontSize || 22;
        this.complexScriptFontSize = complexScriptFontSize || 22;
        this.tableRowCantSplit = (table && table.row && table.row.cantSplit) || false;
        this.lastNumberingId = 0;
        this.lastMediaId = 0;
        this.lastHeaderId = 0;
        this.stylesObjects = [];
        this.numberingObjects = [];
        this.relationshipFilename = 'document';
        this.relationships = [{ fileName: 'document', lastRelsId: 4, rels: [] }];
        this.mediaFiles = [];
        this.headerObjects = [];
        this.documentXML = null;
        this.generateContentTypesXML = this.generateContentTypesXML.bind(this);
        this.generateCoreXML = this.generateCoreXML.bind(this);
        this.generateDocumentXML = this.generateDocumentXML.bind(this);
        this.generateSettingsXML = this.generateSettingsXML.bind(this);
        this.generateWebSettingsXML = this.generateWebSettingsXML.bind(this);
        this.generateStylesXML = this.generateStylesXML.bind(this);
        this.generateFontTableXML = this.generateFontTableXML.bind(this);
        this.generateNumberingXML = this.generateNumberingXML.bind(this);
        this.generateRelsXML = this.generateRelsXML.bind(this);
        this.createMediaFile = this.createMediaFile.bind(this);
        this.createDocumentRelationships = this.createDocumentRelationships.bind(this);
        this.generateHeaderXML = this.generateHeaderXML.bind(this);
    }
    DocxDocument.prototype.generateContentTypesXML = function () {
        var contentTypesXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.contentTypesXML);
        if (this.headerObjects && Array.isArray(this.headerObjects) && this.headerObjects.length) {
            this.headerObjects.forEach(
            // eslint-disable-next-line array-callback-return
            function (_a) {
                var headerId = _a.headerId;
                var contentTypesFragment = xmlbuilder2_1.fragment({
                    defaultNamespace: {
                        ele: 'http://schemas.openxmlformats.org/package/2006/content-types',
                    },
                })
                    .ele('Override')
                    .att('PartName', "/word/header" + headerId + ".xml")
                    .att('ContentType', 'application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml')
                    .up();
                contentTypesXML.root().import(contentTypesFragment);
            });
        }
        return contentTypesXML.toString({ prettyPrint: true });
    };
    DocxDocument.prototype.generateCoreXML = function () {
        var coreXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.generateCoreXML(this.title, this.subject, this.creator, this.keywords, this.description, this.lastModifiedBy, this.revision, this.createdAt, this.modifiedAt));
        return coreXML.toString({ prettyPrint: true });
    };
    DocxDocument.prototype.generateDocumentXML = function () {
        var documentXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, document_template_1.default(this.width, this.height, this.orientation, this.margins));
        documentXML.root().first().import(this.documentXML);
        if (this.header &&
            this.headerObjects &&
            Array.isArray(this.headerObjects) &&
            this.headerObjects.length) {
            var headerXmlFragment_1 = xmlbuilder2_1.fragment();
            this.headerObjects.forEach(
            // eslint-disable-next-line array-callback-return
            function (_a) {
                var relationshipId = _a.relationshipId, type = _a.type;
                var headerFragment = xmlbuilder2_1.fragment({
                    namespaceAlias: {
                        w: helpers_1.namespaces.w,
                        r: helpers_1.namespaces.r,
                    },
                })
                    .ele('@w', 'headerReference')
                    .att('@r', 'id', "rId" + relationshipId)
                    .att('@w', 'type', type)
                    .up();
                headerXmlFragment_1.import(headerFragment);
            });
            documentXML.root().first().first().import(headerXmlFragment_1);
        }
        return documentXML.toString({ prettyPrint: true });
    };
    // eslint-disable-next-line class-methods-use-this
    DocxDocument.prototype.generateSettingsXML = function () {
        var settingsXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.settingsXML);
        return settingsXML.toString({ prettyPrint: true });
    };
    // eslint-disable-next-line class-methods-use-this
    DocxDocument.prototype.generateWebSettingsXML = function () {
        var webSettingsXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.webSettingsXML);
        return webSettingsXML.toString({ prettyPrint: true });
    };
    // eslint-disable-next-line class-methods-use-this
    DocxDocument.prototype.generateStylesXML = function () {
        var stylesXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.generateStylesXML(this.font, this.fontSize, this.complexScriptFontSize));
        return stylesXML.toString({ prettyPrint: true });
    };
    // eslint-disable-next-line class-methods-use-this
    DocxDocument.prototype.generateFontTableXML = function () {
        var fontTableXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.fontTableXML);
        return fontTableXML.toString({ prettyPrint: true });
    };
    DocxDocument.prototype.generateNumberingXML = function () {
        var numberingXML = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.generateNumberingXMLTemplate());
        var abstractNumberingFragments = xmlbuilder2_1.fragment();
        var numberingFragments = xmlbuilder2_1.fragment();
        this.numberingObjects.forEach(
        // eslint-disable-next-line array-callback-return
        function (_a) {
            var numberingId = _a.numberingId, listElements = _a.listElements;
            var abstractNumberingFragment = xmlbuilder2_1.fragment({
                namespaceAlias: { w: helpers_1.namespaces.w },
            })
                .ele('@w', 'abstractNum')
                .att('@w', 'abstractNumId', String(numberingId))
                .ele('@w', 'multiLevelType')
                .att('@w', 'val', 'hybridMultilevel')
                .up();
            listElements
                .filter(function (value, index, self) {
                return self.findIndex(function (v) { return v.level === value.level; }) === index;
            })
                .forEach(function (_a) {
                var level = _a.level, type = _a.type;
                var levelFragment = xmlbuilder2_1.fragment({
                    namespaceAlias: { w: helpers_1.namespaces.w },
                })
                    .ele('@w', 'lvl')
                    .att('@w', 'ilvl', level)
                    .ele('@w', 'start')
                    .att('@w', 'val', '1')
                    .up()
                    .ele('@w', 'numFmt')
                    .att('@w', 'val', type === 'ol' ? 'decimal' : 'bullet')
                    .up()
                    .ele('@w', 'lvlText')
                    .att('@w', 'val', type === 'ol' ? "%" + (level + 1) : '')
                    .up()
                    .ele('@w', 'lvlJc')
                    .att('@w', 'val', 'left')
                    .up()
                    .ele('@w', 'pPr')
                    .ele('@w', 'tabs')
                    .ele('@w', 'tab')
                    .att('@w', 'val', 'num')
                    .att('@w', 'pos', ((level + 1) * 720).toString())
                    .up()
                    .up()
                    .ele('@w', 'ind')
                    .att('@w', 'left', ((level + 1) * 720).toString())
                    .att('@w', 'hanging', (360).toString())
                    .up()
                    .up()
                    .up();
                if (type === 'ul') {
                    var runPropertiesFragment = xmlbuilder2_1.fragment({
                        namespaceAlias: { w: helpers_1.namespaces.w },
                    })
                        .ele('@w', 'rPr')
                        .ele('@w', 'rFonts')
                        .att('@w', 'ascii', 'Wingdings')
                        .att('@w', 'hAnsi', 'Wingdings')
                        .att('@w', 'hint', 'default')
                        .up()
                        .up();
                    levelFragment.last().import(runPropertiesFragment);
                }
                abstractNumberingFragment.import(levelFragment);
            });
            abstractNumberingFragment.up();
            var numberingFragment = xmlbuilder2_1.fragment({
                namespaceAlias: { w: helpers_1.namespaces.w },
            })
                .ele('@w', 'num')
                .att('@w', 'numId', String(numberingId))
                .ele('@w', 'abstractNumId')
                .att('@w', 'val', String(numberingId))
                .up()
                .up();
            abstractNumberingFragments.import(abstractNumberingFragment);
            numberingFragments.import(numberingFragment);
        });
        numberingXML.root().import(abstractNumberingFragments);
        numberingXML.root().import(numberingFragments);
        return numberingXML.toString({ prettyPrint: true });
    };
    // eslint-disable-next-line class-methods-use-this
    DocxDocument.prototype.appendRelationships = function (xmlFragment, relationships) {
        relationships.forEach(
        // eslint-disable-next-line array-callback-return
        function (_a) {
            var relationshipId = _a.relationshipId, type = _a.type, target = _a.target, targetMode = _a.targetMode;
            var relationshipFragment = xmlbuilder2_1.fragment({
                defaultNamespace: { ele: 'http://schemas.openxmlformats.org/package/2006/relationships' },
            })
                .ele('Relationship')
                .att('Id', "rId" + relationshipId)
                .att('Type', type)
                .att('Target', target)
                .att('TargetMode', targetMode)
                .up();
            xmlFragment.import(relationshipFragment);
        });
    };
    DocxDocument.prototype.generateRelsXML = function () {
        var _this = this;
        var relationshipXMLStrings = this.relationships.map(function (_a) {
            var fileName = _a.fileName, rels = _a.rels;
            var xmlFragment;
            if (fileName === 'document') {
                xmlFragment = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.documentRelsXML);
            }
            else {
                xmlFragment = xmlbuilder2_1.create({ encoding: 'UTF-8', standalone: true }, schemas_1.genericRelsXML);
            }
            _this.appendRelationships(xmlFragment.root(), rels);
            return {
                fileName: fileName,
                xmlString: xmlFragment.toString({ prettyPrint: true }),
            };
        });
        return relationshipXMLStrings;
    };
    DocxDocument.prototype.createNumbering = function (listElements) {
        this.lastNumberingId += 1;
        this.numberingObjects.push({ numberingId: this.lastNumberingId, listElements: listElements });
        return this.lastNumberingId;
    };
    DocxDocument.prototype.createMediaFile = function (base64String) {
        // eslint-disable-next-line no-useless-escape
        var matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
            throw new Error('Invalid base64 string');
        }
        var base64FileContent = matches[2];
        // matches array contains file type in base64 format - image/jpeg and base64 stringified data
        var fileExtension = matches[1].match(/\/(.*?)$/)[1] === 'octet-stream' ? 'png' : matches[1].match(/\/(.*?)$/)[1];
        var SHA1String = crypto.createHash('sha1').update(crypto.randomBytes(20)).digest('hex');
        var fileNameWithExtension = "image-" + SHA1String + "." + fileExtension;
        this.lastMediaId += 1;
        return { id: this.lastMediaId, fileContent: base64FileContent, fileNameWithExtension: fileNameWithExtension };
    };
    DocxDocument.prototype.createDocumentRelationships = function (fileName, type, target, targetMode) {
        if (fileName === void 0) { fileName = 'document'; }
        if (targetMode === void 0) { targetMode = 'External'; }
        var relationshipObject = this.relationships.find(function (relationship) { return relationship.fileName === fileName; });
        var lastRelsId = 1;
        if (relationshipObject) {
            lastRelsId = relationshipObject.lastRelsId + 1;
            relationshipObject.lastRelsId = lastRelsId;
        }
        else {
            relationshipObject = { fileName: fileName, lastRelsId: lastRelsId, rels: [] };
            this.relationships.push(relationshipObject);
        }
        var relationshipType;
        switch (type) {
            case 'hyperlink':
                relationshipType = helpers_1.namespaces.hyperlinks;
                break;
            case 'image':
                relationshipType = helpers_1.namespaces.images;
                break;
            case 'header':
                relationshipType = helpers_1.namespaces.headers;
                break;
            default:
                break;
        }
        relationshipObject.rels.push({
            relationshipId: lastRelsId,
            type: relationshipType,
            target: target,
            targetMode: targetMode,
        });
        return lastRelsId;
    };
    DocxDocument.prototype.generateHeaderXML = function (vTree) {
        var headerXML = xmlbuilder2_1.create({
            encoding: 'UTF-8',
            standalone: true,
            namespaceAlias: {
                w: helpers_1.namespaces.w,
                ve: helpers_1.namespaces.ve,
                o: helpers_1.namespaces.o,
                r: helpers_1.namespaces.r,
                v: helpers_1.namespaces.v,
                wp: helpers_1.namespaces.wp,
                w10: helpers_1.namespaces.w10,
            },
        }).ele('@w', 'hdr');
        var XMLFragment = xmlbuilder2_1.fragment();
        helpers_1.convertVTreeToXML(this, vTree, XMLFragment);
        headerXML.root().import(XMLFragment);
        this.lastHeaderId += 1;
        return { headerId: this.lastHeaderId, headerXML: headerXML };
    };
    return DocxDocument;
}());
exports.default = DocxDocument;
//# sourceMappingURL=docx-document.js.map