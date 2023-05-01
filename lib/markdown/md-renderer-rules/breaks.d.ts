/**
 * Replacing the default rules to ignore insertion of line breaks after hidden tokens.
 * Hidden tokens do not participate in rendering
 * */
export declare const softBreak: (tokens: any, idx: any, options: any) => "" | "\n" | "<br />\n" | "<br>\n";
export declare const hardBreak: (tokens: any, idx: any, options: any) => "" | "<br />\n" | "<br>\n";
