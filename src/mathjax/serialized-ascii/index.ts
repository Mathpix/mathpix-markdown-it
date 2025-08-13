import {MmlVisitor} from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import {MmlNode, TextNode, XMLNode} from 'mathjax-full/js/core/MmlTree/MmlNode.js';

import { handle, needLastSpaceAfterTeXAtom, needFirstSpaceBeforeTeXAtom } from "./handlers";
import {IAsciiData, AddToAsciiData, getFunctionNameFromAscii} from "./common";
import { regExpIsFunction } from "./helperA";

export class SerializedAsciiVisitor extends MmlVisitor {
  options = null;

  constructor(options) {
    super();
    this.options = options
  }

  public visitTree(node: MmlNode): IAsciiData {
    return this.visitNode(node, '');
  }

  public visitNode(node, ...args: any[]): IAsciiData {
    this.setChildInheritedAttribute(node, 'toTsv');
    this.setChildInheritedAttribute(node, 'toCsv');
    this.setChildInheritedAttribute(node, 'toMd');
    this.setChildInheritedAttribute(node, 'flattenSup');
    /** return super.visitNode(node, ...args); */
    let handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
    return handler.call(this, node, ...args);
  }
  
  public visitTextNode(node: TextNode, space: string): IAsciiData {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      res = AddToAsciiData(res, [node.getText()]);
      return res;
    } catch (e) {
      console.error('mml => visitTextNode =>', e);
      return res;
    }
  }

  public visitXMLNode(node: XMLNode, space: string) {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      res = AddToAsciiData(res, [space + node.getSerializedXML()]);
      return res;
    } catch (e) {
      console.error('mml => visitXMLNode =>', e);
      return res;
    }
  }

  public needsGrouping(element): boolean {
    try {
      if (element.parent
        && (element.parent.kind === 'math' || element.parent.kind === 'mstyle'
          || element.parent.kind === 'mtable' || element.parent.kind === 'mtr' || element.parent.kind === 'mtd' || element.parent.kind === 'menclose')) {
        return false;
      }

      if (this.options.extraBrackets) {
        if (element.parent.parent && (element.parent.parent.kind === 'msup' || element.parent.parent.kind === 'msub' || element.parent.parent.kind === 'msubsup'
          || element.parent.parent.kind === 'mover' || element.parent.parent.kind === 'munder' || element.parent.parent.kind === 'munderover')) {
          return false;
        }
      }

      if (element.parent.kind === 'TeXAtom' && element.parent.parent.kind === 'inferredMrow') {
        return false;
      }

      if (element.childNodes && element.childNodes.length === 1) {
        if (element.childNodes[0].childNodes && element.childNodes[0].childNodes.length === 1) {
          return false;
        }
      }

      if (element.properties && element.properties.open === '(' && element.properties.close === ')') {
        return false;
      }
      const firstChild = element.childNodes[0];

      if (element.childNodes.length == 1 && firstChild.kind == 'mtext') {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  public needsGroupingStyle(element) {
    try {
      if (element.childNodes.length < 2) { return null }
      let firstChild = element.childNodes[0];
      let firstAtr = this.getAttributes(firstChild);
      if (!firstAtr || !firstAtr.mathvariant || !firstAtr.hasOwnProperty('mathvariant')) { return null }

      for (let i = 1; i< element.childNodes.length; i++) {
        let atr = this.getAttributes(element.childNodes[i]);
        if (!atr || atr.mathvariant !== firstAtr.mathvariant ) {
          return null
        }
      }
      return firstAtr;
    } catch (e) {
      return null
    }
  }

  public visitInferredMrowNode(node: MmlNode, space: string): IAsciiData {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      const iclose: number = node.childNodes.findIndex(child => child.kind === 'menclose');
      const hasFunc = node.childNodes.find(child => (child.kind === 'msub'));
      if (iclose > -1) {
        const mclose: any = node.childNodes[iclose];
        const atr = this.getAttributes(mclose);
        let isFrame = mclose.attributes.get('isFrame');
        if (mclose.childNodes[0]?.childNodes[0]?.kind === 'mtable') {
          isFrame = true;
        }
        const atrDef = this.getAttributesDefaults(mclose);
        /** \longdiv */
        if ((!atr.notation && atrDef.notation === "longdiv") ||
            atr.notation.toString().indexOf("longdiv") !== -1
        ) {
          if (iclose === 0) {
            const data: IAsciiData = this.visitNode(mclose, '');
            res = AddToAsciiData(res, [
              `((${data.ascii})/())`,
              `((${data.ascii_tsv})/())`,
              `((${data.ascii_csv})/())`,
              `((${data.ascii_md})/())`,
            ]);
          } else {
            let mnList = [];
            let i = 1;
            while (iclose-i >= 0) {
              let child = node.childNodes[iclose - i];
              mnList.unshift(child);
              i++
            }

            if (iclose - mnList.length > 0) {
              for (let i = 0; i < iclose - mnList.length; i++) {
                const data: IAsciiData = this.visitNode(node.childNodes[i], space);
                res = AddToAsciiData(res, [
                  data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md
                ]);
              }
            }
            const dataDivisor: IAsciiData = this.visitNode(mclose, '');
            res = AddToAsciiData(res, [`((`]);
            res = AddToAsciiData(res, [dataDivisor.ascii, dataDivisor.ascii_tsv, dataDivisor.ascii_csv, dataDivisor.ascii_md]);
            res = AddToAsciiData(res, [`)/(`]);
            mnList.forEach(item => {
              const dataDividend: IAsciiData = this.visitNode(item, '');
              res = AddToAsciiData(res, [dataDividend.ascii, dataDividend.ascii_tsv, dataDividend.ascii_csv, dataDividend.ascii_md]);
            });
            res = AddToAsciiData(res, [`))`]);

            if (iclose < node.childNodes.length - 1) {
              for (let i = iclose + 1; i < node.childNodes.length; i++) {
                const data: IAsciiData = this.visitNode(node.childNodes[i], space);
                res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
              }
            }
          }
          return res;
        }
        /** \lcm */
        if (!isFrame && ((!atr.notation && atrDef.notation === "bottom") 
          || atr.notation.toString().indexOf("bottom") !== -1)
        ) {
          if (iclose === 0) {
            const data: IAsciiData = this.visitNode(mclose, '');
            res = AddToAsciiData(res, ['(()/(']);
            res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            res = AddToAsciiData(res, ['))']);
          } else {
            let mnList = [];
            let i = 1;
            while (iclose-i >= 0) {
              let child = node.childNodes[iclose - i];
              mnList.unshift(child);
              i++
            }

            if (iclose - mnList.length > 0) {
              for (let i = 0; i < iclose - mnList.length; i++) {
                const data: IAsciiData = this.visitNode(node.childNodes[i], space);
                res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
              }
            }
            res = AddToAsciiData(res, ['((']);
            mnList.forEach(item => {
              const data: IAsciiData = this.visitNode(item, '');
              res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            });
            res = AddToAsciiData(res, [')/(']);
            const data: IAsciiData = this.visitNode(mclose, '');
            res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
            res = AddToAsciiData(res, ['))']);

            if (iclose < node.childNodes.length - 1) {
              for (let i = iclose + 1; i < node.childNodes.length; i++) {
                const data: IAsciiData = this.visitNode(node.childNodes[i], space);
                res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
              }
            }
          }
          return res;
        }
      }

      const addParens = this.needsGrouping(node);
      const group = addParens ? this.needsGroupingStyle(node) : null;
      //TeXAtom
      const needBranch = node.parent && node.parent.kind === 'TeXAtom'
        && node.parent.Parent && node.parent.Parent.kind === 'mtd'
        && node.childNodes.length > 1;
      
      res = AddToAsciiData(res, [needBranch && hasFunc ? '{:' : '']);
      if (addParens && !group) {
        res = AddToAsciiData(res, ['(']);
      }
      let beforeAscii: string = '';
      let childBefore = null;
      let parenthesisOpen: boolean = false;
      for (let j = 0; j < node.childNodes.length; j++) {
        let child: any = node.childNodes[j];
        const data: IAsciiData = this.visitNode(child, space);
        if (parenthesisOpen) {
          let text: string = getFunctionNameFromAscii(data.ascii, child);
          if (!text || regExpIsFunction.test(text)) {
            res = AddToAsciiData(res, [')']);
            parenthesisOpen = false;
          }
        }
        if (child?.kind === "mfrac" && beforeAscii?.trim()) {
          const isFunction = childBefore.attributes.get('isFunction');
          if (isFunction || regExpIsFunction.test(beforeAscii.trim()) || (childBefore?.kind === 'mo' && childBefore?.texClass === -1)) {
            res = AddToAsciiData(res, ['(']);
            parenthesisOpen = true;
          }
        }
        res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
        beforeAscii = res.ascii;
        childBefore = child;
      }
      if (parenthesisOpen) {
        res = AddToAsciiData(res, [')']);
      }
      if (addParens && !group) {
        res = AddToAsciiData(res, [')']);
      }
      res = AddToAsciiData(res, [needBranch && hasFunc ? ':}' : '']);
      return res;
    } catch (e) {
      return res;
    }
  }

  public visitTeXAtomNode(node: MmlNode, space: string): IAsciiData {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: '',
    };
    try {
      let children: IAsciiData = this.childNodeMml(node, space + '  ', '\n');
      if (needFirstSpaceBeforeTeXAtom(node)) {
        res = AddToAsciiData(res, [' ']);
      }
      res = AddToAsciiData(res, [
        children.ascii?.match(/\S/) ? children.ascii : '',
        children.ascii_tsv?.match(/\S/) ? children.ascii_tsv : '',
        children.ascii_csv?.match(/\S/) ? children.ascii_csv : '',
        children.ascii_md?.match(/\S/) ? children.ascii_md : '',
      ]);
      if (needLastSpaceAfterTeXAtom(node)) {
        res = AddToAsciiData(res, [' ']);
      }
      return res;
    } catch (e) {
      console.error('mml => visitTeXAtomNode =>', e);
      return res;
    }
  }

  public visitAnnotationNode(node: MmlNode, space: string): IAsciiData {
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: '',
    };
    try {
      const data: IAsciiData = this.childNodeMml(node, '', '');
      res = AddToAsciiData(res, [
        space + '<annotation' + this.getAttributes(node) + '>' + data.ascii + '</annotation>',
        space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_tsv + '</annotation>',
        space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_csv + '</annotation>',
        space + '<annotation' + this.getAttributes(node) + '>' + data.ascii_md + '</annotation>',
      ]);
      return res;
    } catch (e) {
      console.error('mml => visitAnnotationNode =>', e);
      return res;
    }
  }

  /** Apply inherited attribute to all children */
  setChildInheritedAttribute = (node, attrName: string) => {
    try {
      const inherited = node?.attributes ? node?.attributes?.getAllInherited() : null;
      if (!inherited || !inherited.hasOwnProperty(attrName) || !node.childNodes || !node.childNodes.length) {
        return
      }
      for (const child of node.childNodes) {
        if (child.attributes) {
          child.attributes.setInherited(attrName, inherited[attrName]);
        }
      }
    } catch (e) {
      console.log("[MMD]=>error=>", e)
    }

  };
  
  public visitDefault(node: MmlNode, space: string): IAsciiData {
    return this.childNodeMml(node,  '  ', '')
  }

  protected childNodeMml(node: MmlNode, space: string, nl: string): IAsciiData {
    const handleCh = handle.bind(this);
    let res: IAsciiData = {
      ascii: '',
      ascii_tsv: '',
      ascii_csv: '',
      ascii_md: ''
    };
    try {
      if (node.kind === 'mover' && node.childNodes.length > 1 && node.childNodes[0].kind === 'TeXAtom' && node.childNodes[1].kind === 'TeXAtom') {
        const firstChild: any = node.childNodes[0];
        firstChild.properties.needBrackets = true;
        const dataFirstChild: IAsciiData = handleCh(firstChild, this);
        const dataChildNodes: IAsciiData = handleCh(node.childNodes[1], this);
        
        res = AddToAsciiData(res, [dataFirstChild.ascii, dataFirstChild.ascii_tsv, dataFirstChild.ascii_csv, dataFirstChild.ascii_md]);
        res = AddToAsciiData(res, ['^']);
        res = AddToAsciiData(res, ['(']);
        res = AddToAsciiData(res, [dataChildNodes.ascii, dataChildNodes.ascii_tsv, dataChildNodes.ascii_csv, dataChildNodes.ascii_md]);
        res = AddToAsciiData(res, [')']);
      } else {
        const data: IAsciiData = handleCh(node, this);
        res = AddToAsciiData(res, [data.ascii, data.ascii_tsv, data.ascii_csv, data.ascii_md]);
      }
      return res;
    } catch (e) {
      return res;
    }
  }

  protected getAttributes(node: MmlNode) {
    return node.attributes.getAllAttributes();
  }
  protected getAttributesDefaults(node: MmlNode) {
    return node.attributes.getAllDefaults();
  }
}
