import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode";
import { AMsymbols } from "./helperA";

const regW: RegExp = /^\w/;

const isFirstChild = (node) => {
  return node.parent.childNodes[0] === node
};
const isLastChild = (node) => {
  return node.parent.childNodes[node.parent.childNodes.length -1] === node
};

const needFirstSpase = (node) => {
  if (isFirstChild(node)) {
    return false
  } else {
    const index = node.parent.childNodes.findIndex(item => item === node);
    const prev = node.parent.childNodes[index-1];
    if(prev.kind === 'mi' || prev.kind === 'mo') {
      const text = prev.childNodes[0].text;
      return regW.test(text[0])
    } else {
      return false
    }
  }
};

const needLastSpase = (node) => {
  if (isLastChild(node)) {
    return false
  } else {
    const index = node.parent.childNodes.findIndex(item => item === node);
    let next = node.parent.childNodes[index+1];
    if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061' && !isLastChild(next)) {
      next = node.parent.childNodes[index+2];
    }

    if(next.kind === 'mi' || next.kind === 'mo') {
      const text = next.childNodes[0].text;
      if (next.childNodes[0].kind === 'text' && next.childNodes[0].text === '\u2061') {
        return true
      }
      return regW.test(text[0])
    } else {
      return false
    }
  }
};


export const SymbolToAM = (tag: string, output: string, atr = null) => {
  let tags = null;
  output = tag !== 'mtext' ? output.split(' ').join('') : output;
  if (atr) {
    for (let [atname, atval] of Object.entries(atr)) {
      tags = AMsymbols.find(item => (item.tag === "mstyle" && item.atname === atname && item.atval === atval));
      if (tags ) {
        break
      }
    }
    if (tags && tags.input) {
      return tags.input + '(' + output + ')';
    }
  }
  if (!tags) {
    tags = AMsymbols.find(item => (item.tag === tag && item.output === output));
  }

  //need split
  if (!tags && atr && atr.stretchy === false) {
    const sp = output.split('');
    let res = ''
    for (let i = 0; i < sp.length; i++) {
      let tags = AMsymbols.find(item => (item.tag === tag && item.output === sp[i]));
      res += i > 0 ? ' ' : '';
      res += tags && tags.input ? tags.input : sp[i];
    }
    return res;
  }

  return tags ? tags.input : output

};

export const FindSymbolToAM = (tag: string, output: string): string => {
  output = output.split(' ').join('');
  const tags = AMsymbols.find(item => (item.tag === tag && item.output === output));
  return tags ? tags.input : '';
};

const defHandle = (node, serialize) => {
    return handlerApi.handleAll(node, serialize);
};

export const getAttributes = (node: MmlNode) =>{
  return node.attributes.getAllAttributes();
}
;
const menclose = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    const atr = getAttributes(node);
    let isLeft = false;
    let isRight = false;
    let isBottom = false;
    if (atr && atr.notation) {
      isLeft = atr.notation.toString().indexOf('left') > -1;
      isRight = atr.notation.toString().indexOf('right') > -1;
      isBottom = atr.notation.toString().indexOf('bottom') > -1;
    }
    const parent: any = node.parent;
    const isParenrLeft = (parent.properties && (parent.properties.open === '{' || parent.properties.open === '(' || parent.properties.open === '['));
    const isParenrRight = (parent.properties && (parent.properties.close === '}' || parent.properties.close === ')' || parent.properties.close === ']'));

    mml += isLeft ? '[' : isParenrLeft ? '' :'{:';
    mml += handlerApi.handleAll(node, serialize);
    mml += isBottom ? ',[hline]' : '';
    mml += isRight ? ']' : isParenrRight ? '' : ':}';

    return mml;
  };
};

const mtable = () => {
  return  (node, serialize) => {
    let mml = '';
    const parent: any = node.parent;
    //const atr = this.getAttributes(node);
    let isLeft = (node.parent.parent.kind !== 'menclose')
      ?(parent.properties && (parent.properties.open === '{' || parent.properties.open === '(' || parent.properties.open === '['))
      :true;
    let isRight = (node.parent.parent.kind !== 'menclose')
      ?(parent.properties && (parent.properties.close === '}' || parent.properties.close === ')' || parent.properties.close === ']'))
      :true;

    mml += isLeft ? '' : '{:';

    for (let i = 0; i < node.childNodes.length; i++) {
      if (i>0) {mml += ','}
      mml += serialize.visitNode(node.childNodes[i], '');
    }

    mml += isRight ? '' : ':}';
    return mml;
  }
};

const mtr = () => {
  return  (node, serialize) => {
    let mml = '';
    mml += node.parent.childNodes.length > 1 ? '[' : '';
    //mml += '[' ;
    for (let i = 0; i < node.childNodes.length; i++) {
      if (i>0) {mml += ','}
      mml += serialize.visitNode(node.childNodes[i], '');
    }
    mml += node.parent.childNodes.length > 1 ? ']' : '';
    //mml +=  ']';
    return mml;
  }
};

const mpadded = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    mml += '"';
    mml += handlerApi.handleAll(node, serialize, mml);
    mml += '"';
    return mml;
  }
};

const mover = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    if (secondChild.kind === 'mo') {
      const t = serialize.visitNode(secondChild, '');
      const asc = FindSymbolToAM('mover', t);
      if (asc ) {
        mml += asc + '(';
        mml += serialize.visitNode(firstChild, '');
        mml += ')';
      } else {
        mml += serialize.visitNode(firstChild, '');
        mml += '^';
        mml += serialize.visitNode(secondChild, '');
      }
    } else {
      mml += handlerApi.handleAll(node, serialize);
    }
    return mml;
  }
};

const munder = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];

    if (secondChild.kind === 'mo') {
      const t = serialize.visitNode(secondChild, '')
      const asc = FindSymbolToAM(node.kind, t);
      if (asc ) {
        mml += asc + '(';
        mml += serialize.visitNode(firstChild, '');
        mml += ')';
      } else {
        mml += handlerApi.handleAll(node, serialize);
      }
    } else {
      mml += serialize.visitNode(firstChild, '');
      mml += '_';
      mml += serialize.visitNode(secondChild, '');
    }
    return mml;
  }
};

const munderover = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    const thirdChild = node.childNodes[2];

    mml += serialize.visitNode(firstChild, '');
    mml += '_';
    mml += serialize.visitNode(secondChild, '');
    mml += '^';
    mml += serialize.visitNode(thirdChild, '');
    return mml;
  }
};

const msub = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    mml += serialize.visitNode(firstChild, '');
    mml += '_';
    mml += serialize.visitNode(secondChild, '');
    return mml;
  }
};

const msup = () =>  {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];

    mml += serialize.visitNode(firstChild, '');
    mml += '^';
    mml += serialize.visitNode(secondChild, '');
    return mml;
  }
};


const msubsup = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    const thirdChild = node.childNodes[2];

    mml += serialize.visitNode(firstChild, '');
    mml += '_';
    mml += serialize.visitNode(secondChild, '');
    mml += '^';
    mml += serialize.visitNode(thirdChild, '');
    return mml;
  }
};

const msqrt = (handlerApi) => {
  return  (node, serialize) => {
    let mml = '';
    mml += 'sqrt(';
    mml += handlerApi.handleAll(node, serialize, mml);
    mml += ')';
    return mml;
  }
};

const mroot = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    mml += 'root';
    mml += '(' + serialize.visitNode(firstChild, '') + ')';
    mml += '(' + serialize.visitNode(secondChild, '') + ')';
    return mml;
  }
};


const mfrac = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild = node.childNodes[0];
    const secondChild = node.childNodes[1];
    if (firstChild.kind === "mrow" && firstChild.childNodes.length > 1) {
      mml += '(';
      mml += serialize.visitNode(firstChild, '');
      mml += ')';
    } else {
      mml += serialize.visitNode(firstChild, '');
    }
    mml += '/';

    if (secondChild.kind === "mrow" && secondChild.childNodes.length > 1) {
      mml += '(';
      mml += serialize.visitNode(secondChild, '');
      mml += ')';
    } else {
      mml += serialize.visitNode(secondChild, '');
    }
    return mml;
  }
};

const mtext = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild: any = node.childNodes[0];
    const value = firstChild.text;
    const asc = FindSymbolToAM(node.kind, value);
    if (asc) {
      mml += asc;
      return mml;
    }
    if (value[0] === '(') {
      mml += value;
    } else {
      mml += '"' + value + '"';
    }
    return mml;
  }
};

const mi = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild: any = node.childNodes[0];
    const value = firstChild.text;
    const atr = serialize.options.showStyle
      ? getAttributes(node)
      : null;

    let abs = SymbolToAM(node.kind, value, atr);
    if (abs.length > 1 && regW.test(abs[0])) {
      mml += needFirstSpase(node) ? ' ' : '';
      mml += abs;
      mml += needLastSpase(node) ? ' ' : '';
    } else {
      mml += abs ;
    }
    return mml;
  }
};

const mo = () => {
  return  (node, serialize) => {
    let mml = '';
    const firstChild: any = node.childNodes[0];
    const value = firstChild.text;

    let abs = SymbolToAM(node.kind, value, getAttributes(node));
    if (abs.length > 1 && regW.test(abs[0])) {
      mml += needFirstSpase(node) ? ' ' : '';
      mml += abs;
      mml += needLastSpase(node) ? ' ' : '';
    } else {
      mml += abs ;
    }
    return mml;
  }
};

const mspace = (handlerApi) => {
  return (node, serialize) => {
    let mml = '';
    const atr = getAttributes(node);
    if (atr && atr.width === "2em") {
      mml += 'qquad';
      return mml;
    }
    if (atr && atr.width === "1em") {
      mml += 'quad';
      return mml;
    }
    mml += handlerApi.handleAll(node, serialize, mml);
    return mml;
  }
};

export const handle = (node, serialize) => {
  const handler = handlers[node.kind] || defHandle;

  return handler(node, serialize)
};

const  handleAll = (node, serialize, mml='') => {
  for (const child of node.childNodes) {
    mml += serialize.visitNode(child, '');
  }
  return mml;
};


const handlerApi = {
  handle: handle,
  handleAll: handleAll
};

const handlers = {
  mi:     mi(),
  mo:     mo(),
  mfrac:  mfrac(),
  msup:   msup(),
  msub:   msub(),
  msubsup:   msubsup(),
  msqrt:  msqrt(handlerApi),
  mover:  mover(handlerApi),
  munder:  munder(handlerApi),
  munderover:  munderover(),
  mspace: mspace(handlerApi),
  mtext:  mtext(),
  mtable:  mtable(),
  mtr:  mtr(),
  mpadded: mpadded(handlerApi),
  mroot: mroot(),
  menclose:  menclose(handlerApi),
};
