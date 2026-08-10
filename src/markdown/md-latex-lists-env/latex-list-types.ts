import type Token from 'markdown-it/lib/token';
import type StateBlock from 'markdown-it/lib/rules_block/state_block';

export enum ListType {
  itemize = "itemize",
  enumerate = "enumerate"
}

export interface ListInlineContext {
  li: { value: number } | null;
  iOpen: number;
  itemizeLevelTokens: Token[][];
  enumerateLevelTypes: string[];
  itemizeLevelContents: string[];
  openTokens: Token[];
  allListTokens: Token[];
}

export interface ParsedListItem {
  startLine: number;
  endLine: number;
  content: string; // raw text inside \item{...}
}

export interface ListItemsResult {
  iOpen: number;
}

export interface ListOpenResult {
  iOpen: number;
  tokenStart: Token | null;
  li?: { value: number } | null;
}

/**
 * Result of handling a potential inline `\begin{lstlisting}` occurrence.
 *
 * @property handled  Whether the current line was handled (matched a begin).
 * @property stack Updated lstlisting/tabular environment depth after handling.
 * @property items    Aggregated items list (possibly updated).
 * @property lineText The (unchanged) original line text.
 */
export interface LstEndResult {
  handled: boolean;
  stack: OpaqueStack;
  items: any[];
  lineText: string;
}

// Hoisted: the members never change, and `Object.values(...)` allocated an array per call — this one
// is asked for every `\begin{…}` candidate.
const LIST_TYPE_VALUES: Set<string> = new Set<string>(Object.values(ListType));

export const isListType = (value: string): value is ListType => LIST_TYPE_VALUES.has(value);

export interface CustomMarkerHtmlResult {
  htmlMarker: string;
  markerType: string;
  textContent: string;
  isMarkerEmpty: boolean;
}

/**
 * Minimal "BlockState-like" contract used by list environment parser.
 * This allows reusing the same core logic for:
 * - real markdown-it StateBlock (block rule)
 * - synthetic block state (inline rule wrapper)
 */
export type StateBlockLike = Pick<
  StateBlock,
  | 'md'
  | 'src'
  | 'env'
  | 'bMarks'
  | 'eMarks'
  | 'tShift'
  | 'line'
  | 'startLine'
  | 'parentType'
  | 'level'
  | 'prentLevel'
  | 'push'
  | 'tokens'
>;

/** Token push signature used by markdown-it. */
export type PushFn<TTok extends Token = Token> = (
  type: string,
  tag: string,
  nesting: number
) => TTok;

/**
 * A lightweight buffered version of markdown-it StateBlock.
 * It shares most fields via prototype inheritance but isolates:
 * - tokens (local buffer)
 * - env (shallow-cloned)
 * - push() (writes into the local buffer)
 */
export type BufferedBlockState = StateBlock & {
  tokens: Token[];
  push: PushFn<Token>;
};

/** Result for a fully matched LaTeX list environment. */
export type EnvMatch = {
  type: ListType;
  start: number; // absolute position in original inline src
  end: number;   // absolute position in original inline src
  raw: string;   // raw env substring including begin/end
};


export type ParseListEnvResult = {
  ok: boolean;
  tokens: Token[];
  /** Optional diagnostics for debugging/telemetry. */
  error?: string;
};

// Wrapper envs are opaque like `lstlisting`: an `\item` inside their caption is not list structure.
export type OpaqueEnvType = "lstlisting" | "tabular"
  | "table" | "figure" | "center" | "left" | "right";
export type OpaqueStack = OpaqueEnvType[];

