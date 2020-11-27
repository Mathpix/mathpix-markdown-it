/* eslint-disable no-case-declarations */
import { fragment } from 'xmlbuilder2';

// FIXME: remove the cyclic dependency
// eslint-disable-next-line import/no-cycle
import * as xmlBuilder from './xml-builder';
import namespaces from './namespaces';
import { pixelToHIP, defaultHeadingSizesInPixel } from '../utils/unit-conversion';

const VNode = require('virtual-dom/vnode/vnode');
const VText = require('virtual-dom/vnode/vtext');
const isVNode = require('virtual-dom/vnode/is-vnode');
const isVText = require('virtual-dom/vnode/is-vtext');
const escape = require('escape-html');
const sizeOf = require('image-size');

const convertHTML = require('html-to-vdom')({
  VNode,
  VText,
});

// eslint-disable-next-line consistent-return
export const buildImage = (docxDocumentInstance, vNode, maximumWidth = null) => {
  let response = null;
  try {
    // libtidy encodes the image src
    response = docxDocumentInstance.createMediaFile(decodeURIComponent(vNode.properties.src));
  } catch (error) {
    // NOOP
  }
  if (response) {
    docxDocumentInstance.zip
      .folder('word')
      .folder('media')
      .file(response.fileNameWithExtension, Buffer.from(response.fileContent, 'base64'), {
        createFolders: false,
      });

    const documentRelsId = docxDocumentInstance.createDocumentRelationships(
      docxDocumentInstance.relationshipFilename,
      'image',
      `media/${response.fileNameWithExtension}`,
      'Internal'
    );

    const imageBuffer = Buffer.from(response.fileContent, 'base64');
    const imageProperties = sizeOf(imageBuffer);

    const imageFragment = xmlBuilder.buildParagraph(
      vNode,
      {
        type: 'picture',
        inlineOrAnchored: true,
        relationshipId: documentRelsId,
        ...response,
        maximumWidth: maximumWidth || docxDocumentInstance.availableDocumentSpace,
        originalWidth: imageProperties.width,
        originalHeight: imageProperties.height,
      },
      docxDocumentInstance
    );

    return imageFragment;
  }
  return null
};

export const buildList = (vNode) => {
  const listElements = [];

  let vNodeObjects = [{ node: vNode, level: 0, type: vNode.tagName }];
  while (vNodeObjects.length) {
    const tempVNodeObject = vNodeObjects.shift();
    if (
      isVText(tempVNodeObject.node) ||
      (isVNode(tempVNodeObject.node) && !['ul', 'ol', 'li'].includes(tempVNodeObject.node.tagName))
    ) {
      listElements.push({
        node: tempVNodeObject.node,
        level: tempVNodeObject.level,
        type: tempVNodeObject.type,
      });
    }

    if (
      tempVNodeObject.node.children &&
      tempVNodeObject.node.children.length &&
      ['ul', 'ol', 'li'].includes(tempVNodeObject.node.tagName)
    ) {
      const tempVNodeObjects = tempVNodeObject.node.children.reduce((accumulator, childVNode) => {
        if (['ul', 'ol'].includes(childVNode.tagName)) {
          accumulator.push({
            node: childVNode,
            level: tempVNodeObject.level + 1,
            type: childVNode.tagName,
          });
        } else {
          // eslint-disable-next-line no-lonely-if
          if (
            accumulator.length > 0 &&
            isVNode(accumulator[accumulator.length - 1].node) &&
            accumulator[accumulator.length - 1].node.tagName.toLowerCase() === 'p'
          ) {
            accumulator[accumulator.length - 1].node.children.push(childVNode);
          } else {
            const paragraphVNode = new VNode(
              'p',
              null,
              // eslint-disable-next-line no-nested-ternary
              isVText(childVNode)
                ? [childVNode]
                : // eslint-disable-next-line no-nested-ternary
                isVNode(childVNode)
                ? childVNode.tagName.toLowerCase() === 'li'
                  ? [...childVNode.children]
                  : [childVNode]
                : []
            );
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
  }

  return listElements;
};

function findXMLEquivalent(docxDocumentInstance, vNode, xmlFragment) {
  if (
    vNode.tagName === 'div' &&
    (vNode.properties.attributes.class === 'page-break' ||
      (vNode.properties.style && vNode.properties.style['page-break-after']))
  ) {
    const paragraphFragment = fragment({
      namespaceAlias: { w: namespaces.w },
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
      const fontSize = pixelToHIP(defaultHeadingSizesInPixel[vNode.tagName]);
      const lineHeight = xmlBuilder.fixupLineHeight(1, fontSize);
      const headingFragment = xmlBuilder.buildParagraph(vNode, {
        fontSize,
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
      const paragraphFragment = xmlBuilder.buildParagraph(vNode, {}, docxDocumentInstance);
      xmlFragment.import(paragraphFragment);
      return;
    case 'figure':
      if (vNode.children && Array.isArray(vNode.children) && vNode.children.length) {
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < vNode.children.length; index++) {
          const childVNode = vNode.children[index];
          if (childVNode.tagName === 'table') {
            const tableFragment = xmlBuilder.buildTable(
              childVNode,
              {
                maximumWidth: docxDocumentInstance.availableDocumentSpace,
                rowCantSplit: docxDocumentInstance.tableRowCantSplit,
              },
              docxDocumentInstance
            );
            xmlFragment.import(tableFragment);
            // Adding empty paragraph for space after table
            const emptyParagraphFragment = xmlBuilder.buildParagraph(null, {});
            xmlFragment.import(emptyParagraphFragment);
          } else if (childVNode.tagName === 'img') {
            const imageFragment = buildImage(docxDocumentInstance, childVNode);
            if (imageFragment) {
              xmlFragment.import(imageFragment);
            }
          }
        }
      }
      return;
    case 'table':
      const tableFragment = xmlBuilder.buildTable(
        vNode,
        {
          maximumWidth: docxDocumentInstance.availableDocumentSpace,
          rowCantSplit: docxDocumentInstance.tableRowCantSplit,
        },
        docxDocumentInstance
      );
      xmlFragment.import(tableFragment);
      // Adding empty paragraph for space after table
      const emptyParagraphFragment = xmlBuilder.buildParagraph(null, {}, );
      xmlFragment.import(emptyParagraphFragment);
      return;
    case 'ol':
    case 'ul':
      const listElements = buildList(vNode);
      const numberingId = docxDocumentInstance.createNumbering(listElements);
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < listElements.length; index++) {
        const listElement = listElements[index];
        // eslint-disable-next-line no-shadow
        const paragraphFragment = xmlBuilder.buildParagraph(
          listElement.node,
          {
            numbering: { levelId: listElement.level, numberingId },
          },
          docxDocumentInstance
        );
        xmlFragment.import(paragraphFragment);
      }
      return;
    case 'img':
      const imageFragment = buildImage(docxDocumentInstance, vNode);
      if (imageFragment) {
        xmlFragment.import(imageFragment);
      }
      return;
    case 'br':
      const linebreakFragment = xmlBuilder.buildParagraph(null, {});
      xmlFragment.import(linebreakFragment);
      return;
    default:
      break;
  }
  if (vNode.children && Array.isArray(vNode.children) && vNode.children.length) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vNode.children.length; index++) {
      const childVNode = vNode.children[index];
      // eslint-disable-next-line no-use-before-define
      convertVTreeToXML(docxDocumentInstance, childVNode, xmlFragment);
    }
  }
}

// eslint-disable-next-line consistent-return
export function convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment) {
  if (!vTree) {
    // eslint-disable-next-line no-useless-return
    return '';
  }
  if (Array.isArray(vTree) && vTree.length) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < vTree.length; index++) {
      const vNode = vTree[index];
      convertVTreeToXML(docxDocumentInstance, vNode, xmlFragment);
    }
  } else if (isVNode(vTree)) {
    findXMLEquivalent(docxDocumentInstance, vTree, xmlFragment);
  } else if (isVText(vTree)) {
    // xmlBuilder.buildTextElement(xmlFragment, escape(String(vTree.text)));
    xmlBuilder.buildTextElement(escape(String(vTree.text)));
  }
  return xmlFragment;
}

function renderDocumentFile(docxDocumentInstance) {
  const vTree = convertHTML(docxDocumentInstance.htmlString);

  const xmlFragment = fragment({
    namespaceAlias: { w: namespaces.w },
  });

  const populatedXmlFragment = convertVTreeToXML(docxDocumentInstance, vTree, xmlFragment);

  return populatedXmlFragment;
}

export default renderDocumentFile;
