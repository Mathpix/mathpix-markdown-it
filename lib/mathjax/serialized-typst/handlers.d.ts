import { HandlerFn } from './types';
/**
 * Top-level dispatch: route a MathML node to the appropriate handler.
 * Guards against unexpected handler errors — logs a warning and returns
 * empty output so the rest of the expression can still be serialized.
 */
export declare const handle: HandlerFn;
