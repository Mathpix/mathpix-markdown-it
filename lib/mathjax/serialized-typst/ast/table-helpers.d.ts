import { MathNode } from "../types";
import { TypstMathNode, ITypstMathSerializer, LabelsMap } from "./types";
/** Extract the original \label{} key from an mlabeledtr label cell.
 *  Primary: data-label-key property (set by mathjax.ts getTag patch for environments).
 *  Fallback: labels map from MathJax tags system (for bare display math where
 *  getTag isn't called). Matches by mtd id attribute → label key.
 *  Dedup: checks global labelsList — if another entry owns this key with a different
 *  tagId, returns null (duplicate label — Typst doesn't allow duplicate <label>). */
export declare const getLabelKey: (labelCell: MathNode, labels: LabelsMap) => string | null;
/** Serialize a tag label mtd as Typst content for use inside [...].
 *  mtext → plain text, math → $typst_math$.
 *  "(1.2)" → "1.2", "($x\sqrt{5}$ 1.3.1)" → "$x sqrt(5)$ 1.3.1".
 *  NOTE: returns a plain string because tag content lives in Typst content-mode,
 *  not math-mode. */
export declare const serializeTagContent: (labelCell: MathNode, serialize: ITypstMathSerializer) => string;
export declare const extractTagFromConditionCell: (cell: MathNode) => string | null;
export declare const isNumcasesTable: (node: MathNode) => boolean;
/** Check if a node is nested inside a mat()/cases() cell */
export declare const isInsideMatrixCell: (node: MathNode) => boolean;
/** Check if a node is inside an eqnArray cell with sibling content. */
export declare const isInsideEqnArrayCellWithSiblings: (node: MathNode) => boolean;
/** Compute Typst augment string from rowlines/columnlines attributes. */
export declare const computeAugment: (node: MathNode) => string;
/** Build a #figure() wrapper for an explicit equation tag with a label. */
export declare const buildFigureTag: (tagContent: string, labelKey: string) => string;
/** Build an auto-numbered tag entry with a label. */
export declare const buildAutoTagWithLabel: (labelKey: string) => string;
/** Simple auto-numbered tag entry. */
export declare const AUTO_TAG_ENTRY: string;
/** Visit flat children until stopMo, return SeqNode (for numcases prefix extraction). */
export declare const visitPrefixBeforeMo: (node: MathNode, serialize: ITypstMathSerializer, stopMoText: string) => TypstMathNode | null;
/** Visit a cell's children, skipping mtext nodes that contain \tag{...}. */
export declare const visitCellWithoutTag: (mtdNode: MathNode, serialize: ITypstMathSerializer) => TypstMathNode;
