import { RuleBlock } from 'markdown-it';
/** Does a `\renewcommand` start at `at`? With the `\b` the span reader requires: the two disagreeing
 *  on `\renewcommandfoo` cost the line its text. */
export declare const startsCommandAt: (text: string, at: number) => boolean;
export declare const parseOneCommand: (state: any, str: any) => number;
export declare const reNewCommand: (state: any, lineText: string) => void;
export declare const ReNewCommand: RuleBlock;
