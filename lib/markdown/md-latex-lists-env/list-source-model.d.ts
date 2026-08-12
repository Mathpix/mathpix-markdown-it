import { StateBlockLike, OpaqueEnvType } from "./latex-list-types";
/** Text around an inline transition. A transition with a backtick on both sides sits in a code span,
 *  and the parse loop leaves the whole line to the inline path when it meets one. */
export declare const splitInlineListEnv: (lineText: string, match: any) => {
    sB: string;
    sE: string;
    isBacktickEscapedPair: boolean;
};
export declare const unclosedEnvsIn: (s: string) => number;
export declare const CLOSER_SUFFIX_KEY: unique symbol;
export declare const listCloserOffsets: (state: StateBlock) => readonly number[];
export declare const lastListEndPos: (state: StateBlock) => number;
export declare const pairArgumentSpans: (text: string, verbatim: Array<[
    number,
    number
]>) => Array<[
    number,
    number
]>;
export declare const wrapperBeginAt: (lineText: string) => RegExpExecArray | null;
export declare const absoluteOffsetOf: (state: StateBlockLike, line: number, lineText: string, index: number, text: string) => number;
export declare const structuralCountIn: (state: StateBlockLike, all: readonly number[], key: symbol, from: number, to: number) => number;
export declare const hasCloserAhead: (state: StateBlockLike, from: number, name: string) => boolean;
export declare const nextListEnvMatch: (s: string) => {
    match: RegExpMatchArray;
    isEnd: boolean;
};
export declare const firstUsableCloser: (state: StateBlockLike, line: number, text: string, env: OpaqueEnvType, skipCodeClosers: boolean) => {
    index: number;
    length: number;
} | null;
