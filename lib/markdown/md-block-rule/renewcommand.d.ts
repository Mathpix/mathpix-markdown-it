import { RuleBlock } from 'markdown-it';
/** Does a `\renewcommand` start at `at`? With the `\b` the span reader requires: the two disagreeing
 *  on `\renewcommandfoo` cost the line its text. */
export declare const startsCommandAt: (text: string, at: number) => boolean;
export declare const parseOneCommand: (state: any, str: any) => number;
/** `parseOneCommand` for a caller that clamps the result to `limit`: past it only the value of a list
 *  label still matters, so the rest of `str` is read for that alone — or for a name not yet read. */
export declare const parseOneCommandWithin: (state: any, str: string, limit: number) => number;
export declare const reNewCommand: (state: any, lineText: string) => void;
export declare const ReNewCommand: RuleBlock;
