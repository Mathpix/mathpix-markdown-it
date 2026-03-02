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

const isHandlerKind = (k: string): k is HandlerKind => k in handlers;

const handlers: Readonly<Record<HandlerKind, HandlerFn>> = {
  mi, mo, mn, mfrac, msup, msub, msubsup, msqrt,
  mover, munder, munderover, mmultiscripts, mspace, mtext,
  mtable, mrow, mtr, mpadded, mroot, menclose, mstyle, mphantom,
};

/**
 * Top-level dispatch: route a MathML node to the appropriate handler.
 *
 * Error handling strategy for the serializer:
 * - **Utility functions** (needsSpaceBefore, needsSpaceAfter, isThousandSepComma,
 *   getMovablelimits, isStretchyBase) use local try/catch and return safe defaults
 *   (false / empty string). This prevents a single malformed node from propagating
 *   errors upward and breaking the entire expression.
 * - **This top-level catch** guards against unexpected errors inside handlers themselves.
 *   It logs a warning and returns empty output so the rest of the expression can still
 *   be serialized.
 */
export const handle: HandlerFn = (node, serialize) => {
  const kind = node.kind;
  const handler = isHandlerKind(kind) ? handlers[kind] : defaultHandler;
  try {
    return handler(node, serialize);
  } catch (e: unknown) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[typst-serializer] handler error for "${kind || 'unknown'}":`, e);
    }
    return initTypstData();
  }
};
