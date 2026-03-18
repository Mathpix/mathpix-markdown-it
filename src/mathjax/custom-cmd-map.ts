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

export const customCmdMap: Record<string, CustomCmdEntry> = {
  Varangle:   { unicode: '\u2222', typst: 'angle.spheric' },  // ∢ spherical angle
  llbracket:  { unicode: '\u27E6', typst: 'bracket.l.stroked' },  // ⟦ left double bracket
  rrbracket:  { unicode: '\u27E7', typst: 'bracket.r.stroked' },  // ⟧ right double bracket
  pounds:     { unicode: '\u00A3', typst: 'pound' },                // £ pound sign
};

/** Lookup Unicode replacement for a custom command. Returns undefined if not found. */
export const getCustomCmdUnicode = (cmd: string): string | undefined =>
  customCmdMap[cmd]?.unicode;

/** Lookup Typst replacement for a custom command. Returns undefined if not found. */
export const getCustomCmdTypst = (cmd: string): string | undefined =>
  customCmdMap[cmd]?.typst;
