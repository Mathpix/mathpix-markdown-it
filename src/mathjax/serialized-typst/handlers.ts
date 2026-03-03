import { MathNode, ITypstData, ITypstSerializer, HandlerFn, HandlerKind } from './types';
import { initTypstData, handleAll } from './common';
import { mi, mo, mn, mtext, mspace } from './token-handlers';
import {
  mfrac, msup, msub, msubsup, msqrt, mroot,
  mover, munder, munderover, mmultiscripts,
} from './script-handlers';
import { mrow, mpadded, mphantom, menclose, mstyle } from './structural-handlers';
import { mtable, mtr } from './table-handlers';

const handlers = {
  mi, mo, mn, mtext, mspace,
  mfrac, msup, msub, msubsup, msqrt, mroot,
  mover, munder, munderover, mmultiscripts,
  mrow, mpadded, mphantom, menclose, mstyle,
  mtable, mtr,
} as const satisfies Record<HandlerKind, HandlerFn>;

// Keys are exactly HandlerKind at compile time; Set<string> for cast-free runtime guard
const HANDLER_KIND_SET: ReadonlySet<string> = new Set(Object.keys(handlers));

const isHandlerKind = (k: string): k is HandlerKind => HANDLER_KIND_SET.has(k);

/**
 * Top-level dispatch: route a MathML node to the appropriate handler.
 * Guards against unexpected handler errors — logs a warning and returns
 * empty output so the rest of the expression can still be serialized.
 */
export const handle: HandlerFn = (node: MathNode, serialize: ITypstSerializer): ITypstData => {
  const kind: string = node.kind;
  const handler: HandlerFn = isHandlerKind(kind) ? handlers[kind] : handleAll;
  try {
    return handler(node, serialize);
  } catch (e: unknown) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[typst-serializer] handler error for "${kind || 'unknown'}":`, e);
    }
    return initTypstData();
  }
};
