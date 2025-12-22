import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import { ListType } from "./latex-list-types";
/**
 * Compute token types and HTML tag for a given LaTeX list type.
 */
export declare const getListTokenTypes: (listType: ListType) => {
    isItemize: boolean;
    openType: string;
    closeType: string;
    htmlTag: string;
};
/**
 * Apply state changes when opening a list environment.
 */
export declare const applyListOpenState: (state: StateBlock | StateInline, listType: ListType, token: Token) => void;
/**
 * Apply state changes when closing a list environment.
 */
export declare const applyListCloseState: (state: StateBlock | StateInline, token: Token) => void;
/**
 * Close an open <li> if the current list level reports open items.
 */
export declare const closeOpenListItemIfNeeded: (state: StateBlock | StateInline) => void;
/**
 * Parse a \setcounter match and return the "next" number (N+1),
 * or null if the number is invalid.
 *
 * Assumes match[2] is the numeric argument of \setcounter.
 */
export declare const parseSetCounterNumber: (match: RegExpMatchArray) => number | null;
