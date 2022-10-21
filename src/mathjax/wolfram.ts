import { MmlVisitor } from 'mathjax-full/js/core/MmlTree/MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { FindSymbolToAM, handle } from "./serialized-wolfram/handlers";
import { getFunction, openBranches } from "./serialized-wolfram/helperA";

const regLogic: RegExp = /\\vee|\\wedge/;

export class WolframVisitor extends MmlVisitor {
  options = null;
  isLogic = false;

  constructor(options) {
    super();
    this.options = options;
    if (this.options.inputLatex) {
      this.isLogic = regLogic.test(this.options.inputLatex)
    }
  }

  public visitTree(node: MmlNode) {
    return this.visitNode(node, '');
  }

  public visitTextNode(node: TextNode, space: string) {
    return node.getText();
  }

  public visitXMLNode(node: XMLNode, space: string) {
    return space + node.getSerializedXML();
  }

  public needsGrouping(element) {
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
          return element.parent?.kind === "msqrt"
        }
      }

      if (element.properties && element.properties.open === '(' && element.properties.close === ')') {
        return false;
      }
      const firstChild = element.childNodes[0];

      if (element.childNodes.length == 1 && firstChild.kind == 'mtext') {
        return false;
      }
      if (firstChild?.kind === "mover") {
        const t = firstChild?.childNodes[1] ? this.visitNode(firstChild?.childNodes[1], '') : '';
        const asc = t ? FindSymbolToAM('mover', t, {}) : '';
        return asc !== "dot";
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

  public visitInferredMrowNode(node: MmlNode, space: string) {
    let mml = [];
    try {
      const iclose: number = node.childNodes.findIndex(child => child.kind === 'menclose');
      const hasFunc = node.childNodes.find(child => (child.kind === 'msub'));
      
      //Check on interval
      if (iclose > -1) {
        const mclose: any = node.childNodes[iclose];
        const atr = this.getAttributes(mclose);
        const atrDef = this.getAttributesDefaults(mclose);
        let longdiv = '';
        let divisor = '';
        let dividend = '';
        /** \longdiv */
        if ((!atr.notation && atrDef.notation === "longdiv") ||
          atr.notation.toString().indexOf("longdiv") !== -1
        ) {
          if (iclose === 0) {
            divisor = this.visitNode(mclose, '');
            dividend = '';
            longdiv += `((${divisor})/(${dividend}))`;
          } else {
            let beforeLongdiv = "";
            let afterLongdiv = "";
            let mnList = [];
            let i = 1;
            while (iclose-i >= 0) {
              let child = node.childNodes[iclose - i];
              mnList.unshift(child);
              i++
            }

            if (iclose - mnList.length > 0) {
              for (let i = 0; i < iclose - mnList.length; i++) {
                longdiv += this.visitNode(node.childNodes[i], space);
                beforeLongdiv += longdiv;
              }
            }
            divisor = this.visitNode(mclose, '');
            dividend = '';
            mnList.forEach(item => {
              dividend += this.visitNode(item, '');
            });
            longdiv += `((${divisor})/(${dividend}))`;

            if (iclose < node.childNodes.length - 1) {
              for (let i = iclose + 1; i < node.childNodes.length; i++) {
                longdiv += this.visitNode(node.childNodes[i], space);
                afterLongdiv += longdiv;
              }
            }
            if (node.parent?.kind === "math" && !beforeLongdiv && !afterLongdiv &&
              divisor?.trim() && dividend?.trim() && (/[a-zA-Z]/.test(divisor?.trim()) || /[a-zA-Z]/.test(dividend?.trim()))
            ) {
              /** Divide a polynomial by another polynomial to find the quotient and remainder.
               * Perform polynomial long division */
              longdiv = 'long division ' + longdiv;
            }
          }
          mml.push(longdiv);
          return mml.join('');
        }
        /** \lcm */
        if ((!atr.notation && atrDef.notation === "bottom")
          || atr.notation.toString().indexOf("bottom") !== -1
        ) {
          if (iclose === 0) {
            longdiv += '(()/(';
            longdiv += this.visitNode(mclose, '');
            longdiv += '))';
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
                longdiv += this.visitNode(node.childNodes[i], space);
              }
            }
            longdiv += '((';
            mnList.forEach(item => {
              longdiv += this.visitNode(item, '');
            });
            longdiv += ')/(';
            longdiv += this.visitNode(mclose, '');
            longdiv += '))';

            if (iclose < node.childNodes.length - 1) {
              for (let i = iclose + 1; i < node.childNodes.length; i++) {
                longdiv += this.visitNode(node.childNodes[i], space);
              }
            }
          }
          mml.push(longdiv);
          return mml.join('');
        }
      }

      const addParens = this.needsGrouping(node);
      const group = addParens ? this.needsGroupingStyle(node) : null;
      if (addParens && !group) {
        mml.push('(')
      }
      let nOpenBranch = 0;
      for(let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.kind === "msqrt" && mml.length) {
          const mmlContentBefore = mml.join('').trim();
          if (mmlContentBefore?.length 
            && !openBranches.includes(mmlContentBefore[mmlContentBefore.length - 1])
            && (mml[mml.length - 1] 
              && !getFunction(mml[mml.length - 1].toLowerCase()))
          ) {
            mml.push(" ");
          }
        }

        let contentBefore = mml.join('');
        const sVisitNode = this.visitNode(child, space);
        
        //iint
        if (child.kind === "mo" && sVisitNode?.trim() === 'iint') {
          mml.push("int int ");
          continue;
        }        
        //iiint
        if (child.kind === "mo" && sVisitNode?.trim() === 'iiint') {
          mml.push(" int int int ");
          continue;
        }
        
        if (mml.length && mml[mml.length - 1]?.trim() === "\u0394" && sVisitNode?.trim() !== "(") {
          mml.push(" ");
          mml.push(sVisitNode);
          continue;
        }
        
        let sFunction = sVisitNode?.trim() ? getFunction(sVisitNode.trim()) : "";
        if (child.kind === "mo" 
          && i > 0
          && sVisitNode?.trim() 
          && ![",", "/", "×", ")", "]", "}", ".", "("].includes(sVisitNode?.trim())) {
          
          if (child.kind === "mo" 
            && sVisitNode?.trim() && nOpenBranch > 0) {
            mml.push(")");
            nOpenBranch -= 1;
            if (nOpenBranch === 0) {
              mml.push(" ");
            }
          } else {
            mml.push(" ");
          }
        }
        
        if (child.kind === "mo" && sVisitNode?.trim() && nOpenBranch > 0) {
          mml.push(")");
          nOpenBranch -= 1;
        }
        
        mml.push(sVisitNode);

        if (sFunction) {
          let nextChild = i + 2 < node.childNodes.length
            ? node.childNodes[i+2]
            : null;
          let sNextChild = nextChild ? this.visitNode(nextChild, space) : '';
          sNextChild = sNextChild?.trim();
          if (sNextChild.length && sNextChild.indexOf("(") !== 0
            && i + 1 < node.childNodes.length) {
            mml.push("(");
            nOpenBranch += 1;
          }
          sFunction = ''
        } 
        
        contentBefore = mml.join('');
        const childNext = i + 1 < node.childNodes.length 
          ? node.childNodes[i+1] 
          : null;
        if (((child.kind === "mn" 
            && sVisitNode !== "d"
            && (childNext?.kind === "mi" || childNext?.kind === "msub")) 
          || 
          (child.kind === "mo" && sVisitNode?.trim() && i > 0
          && !["/","×", "(", "[", ")", "{"].includes(sVisitNode?.trim())) )
          && contentBefore?.length && (
            contentBefore[contentBefore.length - 1] !== " " 
            && contentBefore[contentBefore.length - 1] !== "."
          )
        ) {
          mml.push(" ");
        }
      }
      
      if (nOpenBranch > 0) {
        for (let i = 0; i < nOpenBranch; i++) {
          mml.push(')');
        }
      }
      if (addParens && !group) {
        mml.push(')')
      }
      //TeXAtom
      const needBranch = node.parent && node.parent.kind === 'TeXAtom'
        && node.parent.Parent && node.parent.Parent.kind === 'mtd'
        && node.childNodes.length > 1;
      let mmlContent = needBranch && hasFunc
        ? '{'
        : '';
      mmlContent += mml.join('');
      mmlContent += needBranch && hasFunc
        ? '}'
        : '';
      mmlContent = mmlContent.replace(/  /g, ' ');
      mmlContent = mmlContent
        .replace(/ \)/g, ')')
        .replace(/\( /g, '(')
        .replace(/ }/g, '}')
        .replace(/{ /g, '{')
        .replace(/ ,/g, ',')
      ;
      mmlContent = mmlContent
        .replace(/ \|\||\|\| /g, '||')
        .replace(/ \||\| /g, '|')
      ;
      return mmlContent;
    } catch (e) {
      return '';
    }
  }

  public visitTeXAtomNode(node: MmlNode, space: string) {
    let children = this.childNodeMml(node, space + '  ', '\n');

    let mml =
      (children.match(/\S/) ? children : '');
    return mml;
  }


  public visitAnnotationNode(node: MmlNode, space: string) {
    return space + '<annotation' + this.getAttributes(node) + '>'
      + this.childNodeMml(node, '', '')
      + '</annotation>';
  }

  public visitDefault(node: MmlNode, space: string) {
    return  this.childNodeMml(node,  '  ', '')
  }

  protected childNodeMml(node: MmlNode, space: string, nl: string) {
    const handleCh = handle.bind(this);
    let mml = '';
    try {
      if (node.kind === 'mover' && node.childNodes.length > 1 && node.childNodes[0].kind === 'TeXAtom' && node.childNodes[1].kind === 'TeXAtom') {
        const firstChild: any = node.childNodes[0];
        firstChild.properties.needBrackets = true;
        mml += handleCh(firstChild, this);
        mml += '^';
        mml += '(' + handleCh(node.childNodes[1], this) + ')';
      } else {
        mml += handleCh(node, this);
      }
      return mml;
    } catch (e) {
      return mml;
    }
  }

  protected getAttributes(node: MmlNode) {
    return node.attributes.getAllAttributes();
  }
  protected getAttributesDefaults(node: MmlNode) {
    return node.attributes.getAllDefaults();
  }
}
