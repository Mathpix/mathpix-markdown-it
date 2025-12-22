import type Token from "markdown-it/lib/token";
import type StateBlock from "markdown-it/lib/rules_block/state_block";
import type StateInline from "markdown-it/lib/rules_inline/state_inline";
import { ListType } from "./latex-list-types";
import {
  getCurrentListLevelState,
  enterListLevel,
  leaveListLevel,
  type ListLevelState,
} from "./list-state";
import { reNumber } from "../common/consts";

/**
 * Compute token types and HTML tag for a given LaTeX list type.
 */
export const getListTokenTypes = (listType: ListType) => {
  const isItemize = listType === ListType.itemize;
  return {
    isItemize,
    openType: isItemize ? "itemize_list_open" : "enumerate_list_open",
    closeType: isItemize ? "itemize_list_close" : "enumerate_list_close",
    htmlTag: isItemize ? "ul" : "ol",
  };
};

/**
 * Apply state changes when opening a list environment.
 */
export const applyListOpenState = (
  state: StateBlock | StateInline,
  listType: ListType,
  token: Token
): void => {
  const isTopLevel: boolean = state.parentType !== "itemize" && state.parentType !== "enumerate";
  state.prentLevel = isTopLevel ? 0 : state.prentLevel + 1;
  state.parentType = listType;
  state.types = state.types?.length
    ? [...state.types, listType]
    : [listType];
  token.prentLevel = state.prentLevel;
  // Register new list depth in internal list-level tracker
  enterListLevel();
};

/**
 * Apply state changes when closing a list environment.
 */
export const applyListCloseState = (
  state: StateBlock | StateInline,
  token: Token
): void => {
  if (typeof token.level === "number") {
    token.level = Math.max(0, token.level - 1);
  }
  if (typeof state.level === "number") {
    state.level = Math.max(0, state.level - 1);
  }
  state.prentLevel = Math.max(0, state.prentLevel - 1);
  token.prentLevel = state.prentLevel;
  // Update list-level nesting state
  leaveListLevel();
};

/**
 * Close an open <li> if the current list level reports open items.
 */
export const closeOpenListItemIfNeeded = (state: StateBlock | StateInline): void => {
  const listData: ListLevelState | undefined = getCurrentListLevelState();
  if (listData?.openItems && listData.openItems > 0) {
    state.push("latex_list_item_close", "li", -1);
    listData.openItems -= 1;
  }
};

/**
 * Parse a \setcounter match and return the "next" number (N+1),
 * or null if the number is invalid.
 *
 * Assumes match[2] is the numeric argument of \setcounter.
 */
export const parseSetCounterNumber = (
  match: RegExpMatchArray
): number | null => {
  const raw: string = match[2]?.trim() ?? "";
  if (!raw || !reNumber.test(raw)) {
    return null;
  }
  return Number(raw) + 1;
};
