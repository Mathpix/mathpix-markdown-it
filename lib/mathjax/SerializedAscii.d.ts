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
/**
 * @fileoverview  A visitor that produces a serilaied MathML string
 *                (replacement for toMathML() output from v2)
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */
import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
/*****************************************************************/
/**
 *  Implements the SerializedMmlVisitor (subclass of MmlVisitor)
 */
export declare class SerializedMmlVisitor extends MmlVisitor {
    /**
     * Convert the tree rooted at a particular node into a serialized MathML string
     *
     * @param {MmlNode} node  The node to use as the root of the tree to traverse
     * @return {string}       The MathML string representing the internal tree
     */
    visitTree(node: MmlNode): any;
    /**
     * @param {TextNode} node  The text node to visit
     * @param {string} space   The amount of indenting for this node
     * @return {string}        The (HTML-quoted) text of the node
     */
    visitTextNode(node: TextNode, space: string): string;
    /**
     * @param {XMLNode} node  The XML node to visit
     * @param {string} space  The amount of indenting for this node
     * @return {string}       The serialization of the XML node
     */
    visitXMLNode(node: XMLNode, space: string): string;
    /**
     * Visit an inferred mrow, but don't add the inferred row itself (since
     * it is supposed to be inferred).
     *
     * @param {MmlNode} node  The inferred mrow to visit
     * @param {string} space  The amount of indenting for this node
     * @return {string}       The serialized contents of the mrow, properly indented
     */
    visitInferredMrowNode(node: MmlNode, space: string): string;
    /**
     * Visit a TeXAtom node. It is turned into a mrow with the appropriate TeX class
     * indicator.
     *
     * @param {MmlNode} node  The TeXAtom to visit.
     * @param {string} space  The amount of indenting for this node.
     * @return {string}       The serialized contents of the mrow, properly indented.
     */
    visitTeXAtomNode(node: MmlNode, space: string): string;
    /**
     * @param {MmlNode} node    The annotation node to visit
     * @param {string} space    The number of spaces to use for indentation
     * @return {string}         The serializied annotation element
     */
    visitAnnotationNode(node: MmlNode, space: string): string;
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
    visitDefault(node: MmlNode, space: string): string;
    /**
     * @param {MmlNode} node    The node whose children are to be added
     * @param {string} space    The spaces to use for indentation
     * @param {string} nl       The newline character (or empty)
     * @return {string}         The serializied children
     */
    protected childNodeMml(node: MmlNode, space: string, nl: string): string;
    /**
     * @param {MmlNode} node  The node whose attributes are to be produced
     * @return {string}       The attribute list as a string
     */
    protected getAttributes(node: MmlNode): string;
    /**
     *  Convert HTML special characters to entities (&amp;, &lt;, &gt;, &quot;)
     *  Convert multi-character Unicode characters to entities
     *  Convert non-ASCII characters to entities.
     *
     * @param {string} value  The string to be made HTML escaped
     * @return {string}       The string with escaping performed
     */
    protected quoteHTML(value: string): string;
}
