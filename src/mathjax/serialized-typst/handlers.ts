import { HandlerFn, HandlerKind } from './types';
import { initTypstData, handleAll } from './common';
import { mi, mo, mn, mtext, mspace } from './token-handlers';
import {
  mfrac, msup, msub, msubsup, msqrt, mroot,
  mover, munder, munderover, mmultiscripts,
} from './script-handlers';
import { mrow, mpadded, mphantom, menclose, mstyle } from './structural-handlers';
import { mtable, mtr } from './table-handlers';

const defaultHandler: HandlerFn = (node, serialize) => handleAll(node, serialize);

const handlers: Record<HandlerKind, HandlerFn> = {
  mi, mo, mn, mfrac, msup, msub, msubsup, msqrt,
  mover, munder, munderover, mmultiscripts, mspace, mtext,
  mtable, mrow, mtr, mpadded, mroot, menclose, mstyle, mphantom,
};

export const handle: HandlerFn = (node, serialize) => {
  const kind = node.kind;
  const handler = kind in handlers
    ? handlers[kind as HandlerKind]
    : defaultHandler;
  try {
    return handler(node, serialize);
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[typst-serializer] handler error for "${kind || 'unknown'}":`, e);
    }
    return initTypstData();
  }
};
