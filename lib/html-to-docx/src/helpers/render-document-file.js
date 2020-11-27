"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertVTreeToXML = exports.buildList = exports.buildImage = void 0;
var tslib_1 = require("tslib");
/* eslint-disable no-case-declarations */
var xmlbuilder2_1 = require("xmlbuilder2");
// FIXME: remove the cyclic dependency
// eslint-disable-next-line import/no-cycle
var xmlBuilder = require("./xml-builder");
var namespaces_1 = require("./namespaces");
var unit_conversion_1 = require("../utils/unit-conversion");
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var escape = require('escape-html');
var sizeOf = require('image-size');
var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText,
});
// eslint-disable-next-line consistent-return
exports.buildImage = function (docxDocumentInstance, vNode, maximumWidth) {
    if (maximumWidth === void 0) { maximumWidth = null; }
    var response = null;
    try {
        // libtidy encodes the image src
        response = docxDocumentInstance.createMediaFile(decodeURIComponent(vNode.properties.src));
    }
    catch (error) {
        // NOOP
    }
    if (response) {
        docxDocumentInstance.zip
            .folder('word')
            .folder('media')
            .file(response.fileNameWithExtension, Buffer.from(response.fileContent, 'base64'), {
            createFolders: false,
        });
        var documentRelsId = docxDocumentInstance.createDocumentRelationships(docxDocumentInstance.relationshipFilename, 'image', "media/" + response.fileNameWithExtension, 'Internal');
        var imageBuffer = Buffer.from(response.fileContent, 'base64');
        var imageProperties = sizeOf(imageBuffer);
        var imageFragment = xmlBuilder.buildParagraph(vNode, tslib_1.__assign(tslib_1.__assign({ type: 'picture', inlineOrAnchored: true, relationshipId: documentRelsId }, response), { maximumWidth: maximumWidth || docxDocumentInstance.availableDocumentSpace, originalWidth: imageProperties.width, originalHeight: imageProperties.height }), docxDocumentInstance);
        return imageFragment;
    }
    return null;
};
exports.buildList = function (vNode) {
    var listElements = [];
    var vNodeObjects = [{ node: vNode, level: 0, type: vNode.tagName }];
    var _loop_1 = function () {
        var tempVNodeObject = vNodeObjects.shift();
        if (isVText(tempVNodeObject.node) ||
            (isVNode(tempVNodeObject.node) && !['ul', 'ol', 'li'].includes(tempVNodeObject.node.tagName))) {
            listElements.push({
                node: tempVNodeObject.node,
                level: tempVNodeObject.level,
                type: tempVNodeObject.type,
            });
        }
        if (tempVNodeObject.node.children &&
            tempVNodeObject.node.children.length &&
            ['ul', 'ol', 'li'].includes(tempVNodeObject.node.tagName)) {
            var tempVNodeObjects = tempVNodeObject.node.children.reduce(function (accumulator, childVNode) {
                if (['ul', 'ol'].includes(childVNode.tagName)) {
                    accumulator.push({
                        node: childVNode,
                        level: tempVNodeObject.level + 1,
                        type: childVNode.tagName,
                    });
                }
                else {
                    // eslint-disable-next-line no-lonely-if
                    if (accumulator.length > 0 &&
                        isVNode(accumulator[accumulator.length - 1].node) &&
                        accumulator[accumulator.length - 1].node.tagName.toLowerCase() === 'p') {
                        accumulator[accumulator.length - 1].node.children.push(childVNode);
                    }
                    else {
                        var paragraphVNode = new VNode('p', null, 
                        // eslint-disable-next-line no-nested-ternary
                        isVText(childVNode)
                            ? [childVNode]
                            : // eslint-disable-next-line no-nested-ternary
                                isVNode(childVNode)
                                    ? childVNode.tagName.toLowerCase() === 'li'
                                        ? tslib_1.__spread(childVNode.children) : [childVNode]
                                    : []);
                        accumulator.push({
                            // eslint-disable-next-line prettier/prettier, no-nested-ternary
                            node: isVNode(childVNode)
                                ? // eslint-disable-next-line prettier/prettier, no-nested-ternary
                                    childVNode.tagName.toLowerCase() === 'li'
                                        ? childVNode
                                        : childVNode.tagName.toLowerCase() !== 'p'
                                            ? paragraphVNode
                                            : childVNode
                                : // eslint-disable-next-line prettier/prettier
                                    paragraphVNode,
                            level: tempVNodeObject.level,
                            type: tempVNodeObject.type,
                        });
                    }
                }
                return accumulator;
            }, []);
            vNodeObjects = tempVNodeObjects.concat(vNodeObjects);
        }
    };
    while (vNodeObjects.length) {
        _loop_1();
    }
    return listElements;
};
function findXMLEquivalent(docxDocumentInstance, vNode, xmlFragment) {
    if (vNode.tagName === 'div' &&
        (vNode.properties.attributes.class === 'page-break' ||
            (vNode.properties.style && vNode.properties.style['page-break-after']))) {
        var paragraphFragment = xmlbuilder2_1.fragment({
            namespaceAlias: { w: namespaces_1.default.w },
        })
            .ele('@w', 'p')
            .ele('@w', 'r')
            .ele('@w', 'br')
            .att('@w', 'type', 'page')
            .up()
            .up()
            .up();
        xmlFragment.import(paragraphFragment);
        return;
    }
    switch (vNode.tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            var fontSize = unit_conversion_1.pixelToHIP(unit_conversion_1.defaultHeadingSizesInPixel[vNode.tagName]);
            var lineHeight = xmlBuilder.fixupLineHeight(1, fontSize);
            var headingFragment = xmlBuilder.buildParagraph(vNode, {
                fontSize: fontSize,
                lineHeight: Math.max(lineHeight, 240),
                strong: 'bold',
                beforeSpacing: 240,
            });
            xmlFragment.import(headingFragment);
            return;
        case 'span':
        case 'strong':
        case 'b':
        case 'em':
        case 'i':
        case 'u':
        case 'ins':
        case 'strike':
        case 'del':
        case 's':
        case 'sub':
        case 'sup':
        case 'mark':
        case 'p':
            var paragraphFragment = xmlBuilder.buildParagraph(vNode, {}, docxDocumentInstance);
            xmlFragment.import(paragraphFragment);
            return;
        case 'figure':
            if (vNode.children && Array.isArray(vNode.children) && vNode.children.length) {
                // eslint-disable-next-line no-plusplus
                for (var index = 0; index < vNode.children.length; index++) {
                    var childVNode = vNode.children[index];
                    if (childVNode.tagName === 'table') {
                        var tableFragment_1 = xmlBuilder.buildTable(childVNode, {
                            maximumWidth: docxDocumentInstance.availableDocumentSpace,
                            rowCantSplit: docxDocumentInstance.tableRowCantSplit,
                        }, docxDocumentInstance);
                        xmlFragment.import(tableFragment_1);
                        // Adding empty paragraph for space after table
                        var emptyParagraphFragment_1 = xmlBuilder.buildParagraph(null, {});
                        xmlFragment.import(emptyParagraphFragment_1);
                    }
                    else if (childVNode.tagName === 'img') {
                        var imageFragment_1 = exports.buildImage(docxDocumentInstance, childVNode);
                        if (imageFragment_1) {
                            xmlFragment.import(imageFragment_1);
                        }
                    }
                }
            }
            return;
        case 'table':
            var tableFragment = xmlBuilder.buildTable(vNode, {
                maximumWidth: docxDocumentInstance.availableDocumentSpace,
                rowCantSplit: docxDocumentInstance.tableRowCantSplit,
            }, docxDocumentInstance);
            xmlFragment.import(tableFragment);
            // Adding empty paragraph for space after table
            var emptyParagraphFragment = xmlBuilder.buildParagraph(null, {});
            xmlFragment.import(emptyParagraphFragment);
            return;
        case 'ol':
        case 'ul':
            var listElements = exports.buildList(vNode);
            var numberingId = docxDocumentInstance.createNumbering(listElements);
            // eslint-disable-next-line no-plusplus
            for (var index = 0; index < listElements.length; index++) {
                var listElement = listElements[index];
                // eslint-disable-next-line no-shadow
                var paragraphFragment_1 = xmlBuilder.buildParagraph(listElement.node, {
                    numbering: { levelId: listElement.level, numberingId: numberingId },
                }, docxDocumentInstance);
                xmlFragment.import(paragraphFragment_1);
            }
            return;
        case 'img':
            var imageFragment = exports.buildImage(docxDocumentInstance, vNode);
            if (imageFragment) {
                xmlFragment.import(imageFragment);
            }
            return;
        case 'br':
            var linebreakFragment = xmlBuilder.buildParagraph(null, {});
            xmlFragment.import(linebreakFragment);
            return;
        default:
            break;
    }
    if (vNode.children && Array.isArray(vNode.children) && vNode.children.length) {
        // eslint-disable-next-line no-plusplus
        for (var index = 0; index < vNode.children.length; index++) {
            var childVNode = vNode.children[index];
            // eslint-disable-next-line no-use-before-define
            convertVTreeToXML(docxDocumentInstance, childVNode, xmlFragment);
        }
    }
}
// eslint-disable-next-line consistent-return
function convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment) {
    if (!vTree) {
        // eslint-disable-next-line no-useless-return
        return '';
    }
    if (Array.isArray(vTree) && vTree.length) {
        // eslint-disable-next-line no-plusplus
        for (var index = 0; index < vTree.length; index++) {
            var vNode = vTree[index];
            convertVTreeToXML(docxDocumentInstance, vNode, xmlFragment);
        }
    }
    else if (isVNode(vTree)) {
        findXMLEquivalent(docxDocumentInstance, vTree, xmlFragment);
    }
    else if (isVText(vTree)) {
        // xmlBuilder.buildTextElement(xmlFragment, escape(String(vTree.text)));
        xmlBuilder.buildTextElement(escape(String(vTree.text)));
    }
    return xmlFragment;
}
exports.convertVTreeToXML = convertVTreeToXML;
function renderDocumentFile(docxDocumentInstance) {
    var vTree = convertHTML(docxDocumentInstance.htmlString);
    var xmlFragment = xmlbuilder2_1.fragment({
        namespaceAlias: { w: namespaces_1.default.w },
    });
    var populatedXmlFragment = convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment);
    return populatedXmlFragment;
}
exports.default = renderDocumentFile;
//# sourceMappingURL=render-document-file.js.map