"use strict";
/*************************************************************
 *
 *  Copyright (c) 2017 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * @fileoverview  A visitor that produces a serilaied MathML string
 *                (replacement for toMathML() output from v2)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */
var MmlVisitor_js_1 = require("mathjax-full/js/core/MmlTree/MmlVisitor.js");
var MmlNode_js_1 = require("mathjax-full/js/core/MmlTree/MmlNode.js");
/*****************************************************************/
/**
 *  Implements the SerializedMmlVisitor (subclass of MmlVisitor)
 */
var SerializedMmlVisitor = /** @class */ (function (_super) {
    tslib_1.__extends(SerializedMmlVisitor, _super);
    function SerializedMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Convert the tree rooted at a particular node into a serialized MathML string
     *
     * @param {MmlNode} node  The node to use as the root of the tree to traverse
     * @return {string}       The MathML string representing the internal tree
     */
    SerializedMmlVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    /**
     * @param {TextNode} node  The text node to visit
     * @param {string} space   The amount of indenting for this node
     * @return {string}        The (HTML-quoted) text of the node
     */
    SerializedMmlVisitor.prototype.visitTextNode = function (node, space) {
        return this.quoteHTML(node.getText());
    };
    /**
     * @param {XMLNode} node  The XML node to visit
     * @param {string} space  The amount of indenting for this node
     * @return {string}       The serialization of the XML node
     */
    SerializedMmlVisitor.prototype.visitXMLNode = function (node, space) {
        return space + node.getSerializedXML();
    };
    /**
     * Visit an inferred mrow, but don't add the inferred row itself (since
     * it is supposed to be inferred).
     *
     * @param {MmlNode} node  The inferred mrow to visit
     * @param {string} space  The amount of indenting for this node
     * @return {string}       The serialized contents of the mrow, properly indented
     */
    SerializedMmlVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var mml = [];
        for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            mml.push(this.visitNode(child, space));
        }
        return mml.join('\n');
    };
    /**
     * Visit a TeXAtom node. It is turned into a mrow with the appropriate TeX class
     * indicator.
     *
     * @param {MmlNode} node  The TeXAtom to visit.
     * @param {string} space  The amount of indenting for this node.
     * @return {string}       The serialized contents of the mrow, properly indented.
     */
    SerializedMmlVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var texclass = node.texClass < 0 ? 'NONE' : MmlNode_js_1.TEXCLASSNAMES[node.texClass];
        var children = this.childNodeMml(node, space + '  ', '\n');
        var attributes = node.attributes;
        var names = attributes.getExplicit('class');
        attributes.set('class', 'MJX-TeXAtom-' + texclass + (names ? ' ' + names : ''));
        var mml = space + '<mrow' + this.getAttributes(node) + '>' +
            (children.match(/\S/) ? '\n' + children + space : '') + '</mrow>';
        attributes.set('class', names);
        return mml;
    };
    /**
     * @param {MmlNode} node    The annotation node to visit
     * @param {string} space    The number of spaces to use for indentation
     * @return {string}         The serializied annotation element
     */
    SerializedMmlVisitor.prototype.visitAnnotationNode = function (node, space) {
        return space + '<annotation' + this.getAttributes(node) + '>'
            + this.childNodeMml(node, '', '')
            + '</annotation>';
    };
    /**
     * The generic visiting function:
     *   Make the string version of the open tag, properly indented, with it attributes
     *   Increate the indentation level
     *   Add the childnodes
     *   Add the end tag with proper spacing (empty tags have the close tag following directly)
     *
     * @param {MmlNode} node    The node to visit
     * @param {Element} parent  The DOM parent to which this node should be added
     * @return {string}         The serialization of the given node
     */
    SerializedMmlVisitor.prototype.visitDefault = function (node, space) {
        var kind = node.kind;
        // console.log('1 visitDefault=>kind=>', kind)
        var _a = (node.isToken || node.childNodes.length === 0 ? ['', ''] : ['\n', space]), nl = _a[0], endspace = _a[1];
        var children = this.childNodeMml(node, space + '  ', nl);
        // console.log('1 visitDefault=>this.getAttributes(node)=>', this.getAttributes(node))
        // console.log('1 visitDefault=>nl=>', nl);
        // console.log('1 visitDefault=>children=>', children);
        return space + '<' + kind + this.getAttributes(node) + '>'
            + (children.match(/\S/) ? nl + children + endspace : '')
            + '</' + kind + '>';
    };
    /**
     * @param {MmlNode} node    The node whose children are to be added
     * @param {string} space    The spaces to use for indentation
     * @param {string} nl       The newline character (or empty)
     * @return {string}         The serializied children
     */
    SerializedMmlVisitor.prototype.childNodeMml = function (node, space, nl) {
        var mml = '';
        for (var _i = 0, _a = node.childNodes; _i < _a.length; _i++) {
            var child = _a[_i];
            mml += this.visitNode(child, space) + nl;
        }
        return mml;
    };
    /**
     * @param {MmlNode} node  The node whose attributes are to be produced
     * @return {string}       The attribute list as a string
     */
    SerializedMmlVisitor.prototype.getAttributes = function (node) {
        var ATTR = '';
        var attributes = node.attributes.getAllAttributes();
        for (var _i = 0, _a = Object.keys(attributes); _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (attributes[name_1] === undefined)
                continue;
            ATTR += ' ' + name_1 + '="' + this.quoteHTML(attributes[name_1].toString()) + '"';
        }
        return ATTR;
    };
    /**
     *  Convert HTML special characters to entities (&amp;, &lt;, &gt;, &quot;)
     *  Convert multi-character Unicode characters to entities
     *  Convert non-ASCII characters to entities.
     *
     * @param {string} value  The string to be made HTML escaped
     * @return {string}       The string with escaping performed
     */
    SerializedMmlVisitor.prototype.quoteHTML = function (value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/([\uD800-\uDBFF].)/g, function (m, c) {
            return '&#x' + ((c.charCodeAt(0) - 0xD800) * 0x400 +
                (c.charCodeAt(1) - 0xDC00) + 0x10000).toString(16).toUpperCase() + ';';
        })
            .replace(/([\u0080-\uD7FF\uE000-\uFFFF])/g, function (m, c) {
            return '&#x' + c.charCodeAt(0).toString(16).toUpperCase() + ';';
        });
    };
    return SerializedMmlVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedMmlVisitor = SerializedMmlVisitor;
//# sourceMappingURL=SerializedAscii.js.map