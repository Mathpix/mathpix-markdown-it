import { TextNode, XMLNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';
import { MathNode } from '../types';
import { TypstMathNode, TypstMathResult, ITypstMathSerializer, AstHandlerFn, astNodeStore, LabelsMap } from './types';
import { seq, symbol, funcCall, posArg, mathVal } from './builders';
import { serializeTypstMath } from './serialize';
import { isNegationOverlay } from '../common';
import { TEX_ATOM, BLOCK_CODE_FUNCS } from '../consts';
import { getCustomCmdTypst } from '../../custom-cmd-map';
import {
  tryBigDelimiterPattern, tryBareDelimiterPattern, tryIdotsintPattern,
  tryThousandSepPattern, isTaggedEqnArray,
} from '../inferred-mrow-patterns';
import { mnAst, mspaceAst, miAst, moAst, mtextAst } from './token-handlers';
import {
  mfracAst, msupAst, msubAst, msubsupAst, msqrtAst, mrootAst,
  moverAst, munderAst, munderoverAst, mmultiscriptsAst,
} from './script-handlers';
import {
  mrowAst, mpaddedAst, mphantomAst, mencloseAst, mstyleAst,
  tryCombiningMiChainAst,
} from './structural-handlers';
import { mtableAst, mtrAst } from './table-handlers';

const AST_HANDLERS: Readonly<Record<string, AstHandlerFn>> = {
  mi: miAst,
  mo: moAst,
  mn: mnAst,
  mtext: mtextAst,
  mspace: mspaceAst,
  mfrac: mfracAst,
  msup: msupAst,
  msub: msubAst,
  msubsup: msubsupAst,
  msqrt: msqrtAst,
  mroot: mrootAst,
  mover: moverAst,
  munder: munderAst,
  munderover: munderoverAst,
  mmultiscripts: mmultiscriptsAst,
  mrow: mrowAst,
  mpadded: mpaddedAst,
  mphantom: mphantomAst,
  menclose: mencloseAst,
  mstyle: mstyleAst,
  mtable: mtableAst,
  mtr: mtrAst,
};

const EMPTY_RESULT: TypstMathResult = {
  node: seq([])
};

/** Dispatch a MathML node to its AST handler. Returns TypstMathResult (block + inline). */
export const dispatchFull = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  if (node instanceof TextNode) {
    return {
      node: symbol(node.getText())
    };
  }
  if (node instanceof XMLNode) {
    return EMPTY_RESULT;
  }
  // Inferred mrow: full pattern matching (delimiters, idotsint, thousand seps, etc.)
  if (node.isInferred) {
    return visitInferredMrowAst(node, serialize);
  }
  // TeXAtom: custom commands or delegate to child
  if (node.kind === TEX_ATOM) {
    return visitTeXAtomAst(node, serialize);
  }
  const handler = AST_HANDLERS[node.kind];
  if (handler) {
    try {
      return handler(node, serialize);
    } catch (e: unknown) {
      if (typeof console !== 'undefined') console.warn('[TypstConvert] handler error for', node.kind, e);
      return EMPTY_RESULT;
    }
  }
  return handleAllAst(node, serialize);
};

/** Dispatch a MathML node, returning only the block TypstMathNode. */
export const dispatch = (node: MathNode, serialize: ITypstMathSerializer): TypstMathNode =>
  dispatchFull(node, serialize).node;

/** TeXAtom: check for custom command, otherwise delegate to single child. */
const visitTeXAtomAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  try {
    const cmd = node.getProperty?.('data-custom-cmd') as string | undefined;
    const customTypst = cmd ? getCustomCmdTypst(cmd) : undefined;
    if (customTypst) {
      return {
        node: symbol(customTypst)
      };
    }
    if (node.childNodes?.length > 0) {
      return dispatchFull(node.childNodes[0], serialize);
    }
    return EMPTY_RESULT;
  } catch (e: unknown) {
    if (typeof console !== 'undefined') console.warn('[TypstConvert] TeXAtom error', e);
    return EMPTY_RESULT;
  }
};

/** Serialize all children as a SeqNode (no pattern matching -- used for non-inferred containers). */
const handleAllAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const blockChildren: TypstMathNode[] = [];
  const inlineChildren: TypstMathNode[] = [];
  let hasInlineDiff = false;
  const nodeChildren = node.childNodes ?? [];
  for (let i = 0; i < nodeChildren.length; i++) {
    const result = dispatchFull(nodeChildren[i], serialize);
    blockChildren.push(result.node);
    inlineChildren.push(result.nodeInline ?? result.node);
    if (result.nodeInline) {
      hasInlineDiff = true;
    }
  }
  if (hasInlineDiff) {
    return {
      node: seq(blockChildren),
      nodeInline: seq(inlineChildren)
    };
  }
  return {
    node: seq(blockChildren)
  };
};

/** Check if a node contains a block-level code-mode function (#align, #grid, etc.).
 *  Only recurses into SeqNode children — does NOT inspect FuncCall.args or
 *  Delimited.body. Sufficient for current emission patterns. */
const containsBlockCodeFunc = (node: TypstMathNode): boolean => {
  if (node.type === 'func' && node.hash && BLOCK_CODE_FUNCS.has(node.name)) {
    return true;
  }
  if (node.type === 'seq') {
    return node.children.some(containsBlockCodeFunc);
  }
  return false;
};

/**
 * Inferred mrow with pattern matching. Order matters:
 *
 * 1. Big delimiters — before bare delimiters: \bigl( is TeXAtom(sized mo),
 *    not a bare mo. If bare ran first, it would miss the sizing.
 * 2. Bare delimiters — before normal mo: groups |..|→lr(), ⌈⌉→ceil() etc.
 *    for correct subscript attachment (norm(x)_2 vs ‖x‖_2).
 * 3. \idotsint — before normal: ∫⋯∫ with scripts is 3 siblings that must
 *    be merged into lr(integral dots.c integral) with shared scripts.
 * 4. Thousand separators — before comma becomes operator: 1,000→1\,000.
 * 5. Combining chains — before mi: consecutive non-Latin mi→text("merged").
 * 6. Tagged eqnArray — consumes all remaining siblings (pre/post content).
 * 7. \not overlay — wraps next sibling in cancel().
 */
const visitInferredMrowAst = (node: MathNode, serialize: ITypstMathSerializer): TypstMathResult => {
  const children = node.childNodes ?? [];
  const blockNodes: TypstMathNode[] = [];
  const inlineNodes: TypstMathNode[] = [];
  let hasInlineDiff = false;
  /** Push a node that is identical for block and inline */
  const pushSame = (n: TypstMathNode): void => {
    blockNodes.push(n);
    inlineNodes.push(n);
  };
  /** Push a full result (block + optional inline variant) */
  const pushResult = (r: TypstMathResult): void => {
    blockNodes.push(r.node);
    inlineNodes.push(r.nodeInline ?? r.node);
    if (r.nodeInline) {
      hasInlineDiff = true;
    }
  };
  try {
    let j = 0;
    while (j < children.length) {
      const child = children[j];
      // Pattern 1: Big delimiter (\big, \Big, \bigg, \Bigg)
      const bigDelim = tryBigDelimiterPattern(node, j, serialize);
      if (bigDelim) {
        pushSame(bigDelim.node);
        j = bigDelim.nextJ;
        continue;
      }
      // Pattern 2: Bare delimiter pairing (|...|, floor, ceil, norm — no chevrons)
      const bareDelim = tryBareDelimiterPattern(node, j, serialize);
      if (bareDelim) {
        pushSame(bareDelim.node);
        j = bareDelim.nextJ;
        continue;
      }
      // Pattern 3: \idotsint (integral dots integral with scripts)
      const idotsint = tryIdotsintPattern(node, j, serialize);
      if (idotsint) {
        pushSame(idotsint.node);
        j = idotsint.nextJ;
        continue;
      }
      // Pattern 4: Thousand separator chain (1,000,000)
      const thousandSep = tryThousandSepPattern(node, j, serialize);
      if (thousandSep) {
        pushSame(thousandSep.node);
        j = thousandSep.nextJ;
        continue;
      }
      // Pattern 5: Combining-mark chain (Devanagari, Arabic, etc.)
      const combChain = tryCombiningMiChainAst(node, j);
      if (combChain) {
        pushSame(combChain.node);
        j = combChain.nextIndex;
        continue;
      }
      // Pattern 6: Tagged eqnArray mtable with sibling content
      if (isTaggedEqnArray(child)) {
        // Build pre-content from accumulated block nodes
        const preNode = seq([...blockNodes]);
        const preStr = serializeTypstMath(preNode).trim();
        if (preStr) {
          const store = astNodeStore.get(child) ?? {};
          store.preContent = preNode;
          astNodeStore.set(child, store);
          blockNodes.length = 0;
          inlineNodes.length = 0;
        }
        // Build post-content from remaining children as typed AST nodes
        const postNodes: TypstMathNode[] = [];
        for (let k = j + 1; k < children.length; k++) {
          postNodes.push(serialize.visitNode(children[k]));
        }
        if (postNodes.length > 0) {
          const postNode = seq(postNodes);
          if (serializeTypstMath(postNode).trim()) {
            const store = astNodeStore.get(child) ?? {};
            store.postContent = postNode;
            astNodeStore.set(child, store);
          }
        }
        pushResult(serialize.visitNodeFull(child));
        break;
      }
      // Pattern 7: \not negation overlay -- wrap next sibling in cancel()
      if (isNegationOverlay(child) && j + 1 < children.length) {
        const nextNode = serialize.visitNode(children[j + 1]);
        pushSame(funcCall('cancel', [posArg(mathVal(nextNode))]));
        j += 2;
        continue;
      }
      // Normal processing -- via AST dispatcher (preserving block/inline split)
      pushResult(serialize.visitNodeFull(child));
      j++;
    }
  } catch (e: unknown) {
    if (typeof console !== 'undefined') console.warn('[TypstConvert] inferred mrow error', e);
  }
  if (hasInlineDiff) {
    // Block-level code-mode funcs (#align, #grid, #math.equation) with siblings
    // disrupt math flow. Use inline variants to keep everything in math mode.
    // Inline #box/#circle/#text/#highlight/#hide are safe and do NOT trigger this.
    if (blockNodes.length > 1) {
      let hasCodeModeBlock = false;
      for (let i = 0; i < blockNodes.length; i++) {
        if (blockNodes[i] !== inlineNodes[i] && containsBlockCodeFunc(blockNodes[i])) {
          hasCodeModeBlock = true;
          break;
        }
      }
      if (hasCodeModeBlock) {
        return {
          node: seq(inlineNodes),
        };
      }
    }
    return {
      node: seq(blockNodes),
      nodeInline: seq(inlineNodes)
    };
  }
  return {
    node: seq(blockNodes)
  };
};

/**
 * Create a self-referencing ITypstMathSerializer that dispatches through the AST pipeline.
 * Children are returned as typed TypstMathNode, not raw(string).
 */
export const createAstSerializer = (labels: LabelsMap = null): ITypstMathSerializer => {
  const serialize: ITypstMathSerializer = {
    visitNode: (child: MathNode): TypstMathNode => dispatch(child, serialize),
    visitNodeFull: (child: MathNode): TypstMathResult => dispatchFull(child, serialize),
    labels,
  };
  return serialize;
};

