/** Where each balanced `{` closes. One pass: asking per brace rescanned the tail, `n^1.9` on a run of
 *  unmatched `{`. A brace inside `verbatim`, or escaped, opens and closes nothing. */
export declare const braceMatches: (text: string, verbatim: Array<[
    number,
    number
]>) => Map<number, number>;
/** Outermost command-argument spans, ascending, `[openBrace, closeBrace]` inclusive. Read forward from
 *  the commands: a group with no command before it — `opens {` … `closes }` in prose — is not one. */
export declare const commandArgumentSpans: (text: string, verbatim: Array<[
    number,
    number
]>) => Array<[
    number,
    number
]>;
