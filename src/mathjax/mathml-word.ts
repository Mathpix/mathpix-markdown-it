import {SerializedMmlVisitor} from 'mathjax-full/js/core/MmlTree/SerializedMmlVisitor.js';
import { MmlMover, MmlMunder } from "mathjax-full/js/core/MmlTree/MmlNodes/munderover.js";
import { TextNode } from "mathjax-full/js/core/MmlTree/MmlNode.js";

export class MathMLVisitorWord<N, T, D> extends SerializedMmlVisitor {
  options = null;

  constructor(options) {
    super();
    this.options = options;
  }

  public visitTextNode(node: TextNode, space: string) {
    const { unicodeConvert = false} = this.options;
    return this.quoteHTML(node.getText(), unicodeConvert);
  }

  public restructureMtrForAligned(node: any, space: string): string {
    let [nl] = (node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]);
    let mml: string = '';
    const attributes = node.Parent && node.Parent.attributes
      ? node.Parent.attributes.getAllAttributes()
      : {};
    const {columnalign = ''} = attributes;
    if (!columnalign) {
      return mml;
    }
    if (columnalign.indexOf('center') >= 0 ) {
      return mml;
    }

    let space2 = space  + '  ';
    let space3 = space2 + '  ';
    let space4 = space3 + '  ';
    let space5 = space4 + '  ';

    // [aligned, align*, align]: 'rlrlrlrlrlrl', - Align all in left side
    if (columnalign === "right left right left right left right left right left right left") {
      mml += space + '<mtr>';
      if (node.childNodes.length > 1) {
        mml += nl + space2 + '<mtd>';
        mml += nl + space3 + '<mrow>';
        for (let i = 0; i < node.childNodes.length; i++) {
          mml += nl + space4 + '<mrow>';
          mml += nl + space5 + '<maligngroup/>';
          const child = this.childNodeMml(node.childNodes[i], space5, nl);
          mml += child.trim()
            ? nl + child
            : nl;
          mml += space4 +'</mrow>';
        }
        mml += nl + space3 +'</mrow>';
        mml += nl + space2 + '</mtd>';
      } else {
        mml += nl + space2 + '<mtd>';
        mml += nl + space3 +'<mrow>';
        mml += nl + space5 + '<maligngroup/>';
        mml += nl + this.childNodeMml(node.childNodes[0], space5, nl);
        mml += space3 +'</mrow>';
        mml += nl + space2 + '</mtd>';
      }
      mml += nl + space + '</mtr>';
      return mml
    }

    if (node.childNodes.length === 1) {
      mml = space + '<mtr>';
      mml += nl + space2 + '<mtd>';
      mml += nl + space3 +'<mrow>';
      mml += nl + space5 + '<maligngroup/>';
      mml += nl + space5 + '<malignmark/>';
      mml += nl + this.childNodeMml(node.childNodes[0], space5, nl);
      mml += space3 +'</mrow>';
      mml += nl + space2 + '</mtd>';
      mml += nl + space + '</mtr>';
      return mml
    };


    mml = space + '<mtr>';
    mml += nl + space2 + '<mtd>';
    mml += nl + space3 + '<mrow>';
    for (let i = 0; i < node.childNodes.length; i++) {
      mml += nl + space4 + '<maligngroup/>';
      mml += nl + space4 + '<malignmark/>';
      mml += nl + space4 + '<mrow>';
      const child = this.childNodeMml(node.childNodes[i], space5, nl);
      mml += child.trim()
        ? nl + child
        : nl;

      if (i < node.childNodes.length - 1) {
        mml += space5 + '<mo>'
          + String.fromCharCode(8197)
          + String.fromCharCode(8197)
          + String.fromCharCode(8197)
          + String.fromCharCode(8197)
          + '</mo>' + nl;
      }
      mml +=  space4 +'</mrow>';
    }
    mml += nl + space3 +'</mrow>';
    mml += nl + space2 + '</mtd>';

    mml += nl + space + '</mtr>';
    return mml;
  };

  public visitDefault(node: any, space: string) {
    if (node.needRow) {
      return this.pasteNodeToNewRow(node, space);
    }
    if (node.kind === 'msubsup' || node.kind === 'msub' || node.kind === 'sup') {
      return this.visitMunderoverNode(node, space);
    }
    if ( !this.options.forDocx
      && node.kind === 'mtr' && this.options.aligned
      && node.Parent && node.Parent.kind === 'mtable'
    ) {
      if ( node.Parent.Parent && node.Parent.Parent.kind === 'math'
        || !this.isSubTable(node.Parent)) {
        const mml = this.restructureMtrForAligned(node, space);
        if (mml) {
          return mml;
        }
      }
    }

    if (this.needConvertToFenced(node)) {
      return this.convertToFenced(node, space)
    }

    if (this.options.forDocx) {
      if (node.kind === 'mo') {
        if (node.properties && node.properties.hasOwnProperty('movablelimits')
          && node.properties['movesupsub'] === true
          && node.properties['texprimestyle'] === true
          && node.properties['texClass'] === 1
          && node.properties['movablelimits'] === false
        ) {
          if (node.attributes.attributes) {
            node.attributes.attributes.movablelimits = false;
          } else {
            node.attributes.attributes = {movablelimits: false};
          }
        }
      }
    }
    return super.visitDefault(node,  space)
  }

  public isSubTable = (node) => {
    let res = false;
    while(node.Parent) {
      if (node.Parent.kind === 'mtable') {
        res = true;
        break;
      }
      node = node.Parent;
    }
    return res;
  };

  public needToAddRow = (node) => {
    if (node.parent && node.parent.childNodes.length > 0) {
      const index = node.parent.childNodes.findIndex(item => item === node);
      if (index < node.parent.childNodes.length) {
        let next = node.parent.childNodes[index+1];
        if (next && next.kind  //&& next.kind !== 'mrow'
        ) {
          next.needRow = true;
        }
      }
    }
  };

  public visitMunderoverNode(node: any, space: string) {
    if (node.kind === "munder" || node.kind === "mover") {
      node.attributes.attributes.accent = true;
      node.attributes.attributes.accentunder = false;
    }

    const base = node.childNodes[node.base];

    if (node.kind !== 'msup' && node.kind !== 'msub' && base && base.kind !== 'TeXAtom'
      && (base.kind !== 'mrow' || this.needConvertToFenced(base))) {
      base.needRow = true;
    }

    let [nl] = (node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]);
    let space2 = space  + '  ';
    let mml: string = super.visitDefault(node, space);

    if (base.kind === 'mo' && base.properties.texClass === 1) {
      mml += nl + space  + '<mrow>';
      mml += nl + space2 + '<mo>' + String.fromCharCode(8202) + '</mo>';
      mml += nl + space  + '</mrow>';
    }
    return mml;
  }

  protected visitMunderNode(node: MmlMunder, space: string) {
    return this.visitMunderoverNode(node, space);
  }

  protected visitMoverNode(node: MmlMover, space: string) {
    return this.visitMunderoverNode(node, space);
  }

  protected quoteHTML(value: string, replaceAll = false) {
    let result: string = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;');

    if (replaceAll) {
      result = result
      .replace(/([\uD800-\uDBFF].)/g, (m, c) => {
        return '&#x' + ((c.charCodeAt(0) - 0xD800) * 0x400 +
          (c.charCodeAt(1) - 0xDC00) + 0x10000).toString(16).toUpperCase() + ';';
      })
      .replace(/([\u0080-\uD7FF\uE000-\uFFFF])/g, (m, c) => {
        return '&#x' + c.charCodeAt(0).toString(16).toUpperCase() + ';';
      });
    }
    return result;
  }

  public needConvertToFenced = (node: any) => {
    let kind = node.kind;
    let properties = node.properties;
    return  kind === "mrow" && properties && properties.texClass === 7;
  };

  public pasteNodeToNewRow = (node: any, space) => {
    let [nl, endspace] = (node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]);
    node.needRow = false;
    return space + '<mrow>' + endspace
      + nl + this.visitNode(node, space + '  ') + endspace
      + nl + space + '</mrow>'  + endspace;
  };

  public convertToFenced = (node: any, space) => {
    let [nl, endspace] = (node.isToken || node.childNodes.length === 0 ? ['\n', ''] : ['\n', space]);
    if (node.needRow) {
      return this.pasteNodeToNewRow(node, space);
    }
    let kind = node.kind;
    let properties = node.properties;
    let mml = space + '<mfenced';
    if (this.options.forDocx) {
      mml += properties.open ? ` open="${properties.open}" branch_open="${properties.open}"`:  ' open="" branch_open=""';
      mml += properties.close ? ` close="${properties.close}" branch_close="${properties.close}"`:  ' close="" branch_close=""';
    } else {
      mml += properties.open ? ` open="${properties.open}"`:  ' open=""';
      mml += properties.close ? ` close="${properties.close}"`:  ' close=""';
    }

    mml += ' separators="|"';
    mml += '>';

    mml += nl + space + '  ' + '<' + kind + '>';
    for (let i = 0; i < node.childNodes.length; i++) {
      if (i === 0 && node.childNodes[i].kind === 'mo' && node.childNodes[i].texClass === 4) {
        continue
      }
      if (i === node.childNodes.length - 1 && node.childNodes[i].kind === 'mo' && node.childNodes[i].texClass === 5) {
        continue
      }
      const children = this.visitNode(node.childNodes[i], space + '    ');
      mml += nl + children + endspace
    }

    mml += nl + space + '  ' + '</' + kind + '>' + endspace;

    mml += nl + space + '</mfenced>';
    return mml
  };

}
