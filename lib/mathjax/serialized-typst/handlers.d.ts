import { HandlerFn } from './types';
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
export declare const handle: HandlerFn;
