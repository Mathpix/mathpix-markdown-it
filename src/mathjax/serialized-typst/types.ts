import { MmlNode } from 'mathjax-full/js/core/MmlTree/MmlNode.js';

/** MmlNode with childNodes typed as MathNode[] to match AbstractMmlNode runtime behavior.
 *  All nodes in a MathJax MathML tree are MmlNode instances; this extension narrows
 *  the childNodes type from Node[] to MathNode[] to eliminate casts at access sites. */
export interface MathNode extends MmlNode {
  childNodes: MathNode[];
  parent: MathNode;
}

/** Visitor/serializer interface used by handlers. */
export interface ITypstSerializer {
  visitNode(node: MathNode, space: string): ITypstData;
}

/** Handler function signature. */
export type HandlerFn = (node: MathNode, serialize: ITypstSerializer) => ITypstData;

/** Supported MathML element kinds — keys of the handler registry. */
export type HandlerKind =
  | 'mi' | 'mo' | 'mn' | 'mtext' | 'mspace'
  | 'mfrac' | 'msup' | 'msub' | 'msubsup'
  | 'msqrt' | 'mroot'
  | 'mover' | 'munder' | 'munderover'
  | 'mmultiscripts'
  | 'mrow' | 'mpadded' | 'mphantom' | 'menclose' | 'mstyle'
  | 'mtable' | 'mtr';

/** Attributes for nodes with font styling (mi, mn, mtext). */
export interface FontAttrs { mathvariant?: string; }
/** Attributes for mfrac (also used for nested mfrac detection in mrow). */
export interface FracAttrs { linethickness?: string | number; }
/** Attributes for mo (operator behavior). */
export interface MoAttrs { movablelimits?: boolean; stretchy?: boolean; }
/** Attributes for mspace (spacing). */
export interface SpaceAttrs { width?: string | number; }
/** Attributes for mpadded (padding / colorbox). */
export interface PaddedAttrs { width?: string | number; height?: string | number; mathbackground?: string; }
/** Attributes for menclose (notation). */
export interface EncloseAttrs { notation?: string; }
/** Attributes for mstyle (color, background). */
export interface StyleAttrs { mathcolor?: string; mathbackground?: string; mathsize?: string | number; }

export interface ITypstData {
  typst: string;
  /** Inline-safe variant: same as typst when no block wrappers are used,
   *  otherwise contains pure math expressions without #math.equation() wrappers. */
  typst_inline?: string;
}
