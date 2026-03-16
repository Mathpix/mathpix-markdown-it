import { ITypstSerializer, MathNode } from "./types";
export declare const delimiterToTypst: (delim: string) => string;
export declare const treeContainsMo: (node: MathNode, moText: string, skipPhantom?: boolean) => boolean;
export declare const serializePrefixBeforeMo: (node: MathNode, serialize: ITypstSerializer, stopMoText: string) => string;
export type BracketToken = {
    char: string;
    pos: number;
};
/** Scan a Typst expression and collect bracket positions, skipping escaped chars,
 *  quoted strings, and function-call parens (preceded by word char or dot). */
export declare const scanBracketTokens: (expr: string) => BracketToken[];
/** Strict stack pairing: a closing bracket matches ONLY the corresponding open
 *  at the top of the stack. On mismatch the top stays in the stack and the
 *  closing bracket is left unpaired — both sides remain unmatched.
 *  Returns the set of indices (into the chars array) that are unpaired. */
export declare const findUnpairedIndices: (chars: string[]) => Set<number>;
export declare const replaceUnpairedBrackets: (expr: string) => string;
export declare const markUnpairedBrackets: (root: MathNode) => void;
export declare const mapDelimiter: (delim: string) => string;
/** Map delimiter for use inside lr(): apply lr-specific escapes first,
 *  then fall back to typstSymbolMap, then return as-is. */
export declare const escapeLrDelimiter: (delim: string) => string;
