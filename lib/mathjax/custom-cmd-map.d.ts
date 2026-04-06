/**
 * Central registry for custom LaTeX commands that expand into visual hacks
 * but should be serialized as clean symbols in all text-based formats
 * (MathML, AsciiMath, LinearMath, Typst, assistive MML).
 *
 * Key:   value of `data-custom-cmd` property set during parsing
 * Value: { unicode, typst } — Unicode char for MathML/ASCII, Typst symbol name
 *
 * To add a new custom command:
 * 1. Add the entry here
 * 2. Create a handler in my-BaseMappings.ts that sets `data-custom-cmd` property
 */
interface CustomCmdEntry {
    unicode: string;
    typst: string;
}
export declare const customCmdMap: Record<string, CustomCmdEntry>;
/** Lookup Unicode replacement for a custom command. Returns undefined if not found. */
export declare const getCustomCmdUnicode: (cmd: string) => string | undefined;
/** Lookup Typst replacement for a custom command. Returns undefined if not found. */
export declare const getCustomCmdTypst: (cmd: string) => string | undefined;
export {};
