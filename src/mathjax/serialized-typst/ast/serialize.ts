import {
  TypstMathNodeType,
  TypstMathNode,
  SeqNode,
  FuncCallNode,
  ScriptNode,
  DelimitedNode,
  DelimitedKind,
  OperatorNode,
  FuncArg,
  ArgValue,
  ArgValueType,
  FuncArgKind,
} from './types';
import { FuncEscapeContext, FUNC_ESCAPE_CONTEXTS } from './serialize-context';
import {
  escapeContentSeparators,
  escapeCasesSeparators,
  escapeMatrixRowSeparators,
  escapeLrSemicolons,
  escapeLrBrackets,
  escapeUnbalancedParens,
  hasTopLevelSeparators,
} from '../escape-utils';
import {
  RE_PHANTOM_BASE, RE_TOKEN_START, RE_SEPARATOR_END, RE_WORD_DOT_END,
  RE_ALPHA_END, RE_TRAILING_DOTTED_IDENT, TYPST_BUILTIN_OPS,
  OPEN_BRACKETS, CLOSE_BRACKETS,
} from '../consts';
import { sanitizeLabel } from '../../../markdown/common/labels';
import { mapDelimiter, escapeLrDelimiter } from '../bracket-utils';

/** Any escaped bracket at start: \( \) \[ \] \{ \} */
const RE_ESCAPED_BRACKET_START = /^\\[()[\]{}]/;
/** Any escaped bracket at end: ...\( ...\) etc. — NOT a separator */
const RE_ESCAPED_BRACKET_END = /\\[()[\]{}]$/;
const RE_BACKSLASH = /\\/g;
const RE_DOUBLE_QUOTE = /"/g;
/** Only escape \ before " and trailing \ — for mtext where MathJax preserves raw LaTeX */
const RE_BACKSLASH_BEFORE_QUOTE_OR_END = /\\(?=")|\\$/g;

/** Operators that need escaping or special formatting in Typst math mode */
const OPERATOR_ESCAPE_MAP: Readonly<Record<string, string>> = {
  '/': '\\/',    // bare / creates a fraction
  ';': '\\;',    // bare ; creates an array row
  '"': 'quote.double',  // bare " starts a string literal
  ',': ',',      // comma — serialized with trailing space
};

/** Functions that use multi-line formatting when they have 2+ positional args (rows) */
const MULTILINE_POSITIONAL_FUNCS: ReadonlySet<string> = new Set([
  'mat',
  'cases',
]);

/** Code-mode functions (#grid) that always use multi-line formatting */
const MULTILINE_CODE_FUNCS: ReadonlySet<string> = new Set([
  'grid',
]);

/** Separator chars that cannot be bare script bases — must be quoted */
const SEPARATOR_BASES: ReadonlySet<string> = new Set([
  ',',
  ';'
]);

/** Escape all backslashes and double-quotes for Typst string literals */
const escapeStringContent = (value: string): string =>
  value
    .replace(RE_BACKSLASH, '\\\\')
    .replace(RE_DOUBLE_QUOTE, '\\"');

/** Escape only dangerous backslashes (before " and trailing) for mtext strings */
const escapeMathTextContent = (value: string): string =>
  value
    .replace(RE_BACKSLASH_BEFORE_QUOTE_OR_END, '\\\\')
    .replace(RE_DOUBLE_QUOTE, '\\"');

/** Serialize a single AST node to a Typst math string */
export const serializeTypstMath = (node: TypstMathNode): string => {
  switch (node.type) {
    case TypstMathNodeType.Seq: {
      const result = serializeSeq(node);
      return node.trailingNewline ? result + '\n' : result;
    }
    case TypstMathNodeType.Symbol:
      return node.value;
    case TypstMathNodeType.Text: {
      const escape = node.preserveBackslash ? escapeMathTextContent : escapeStringContent;
      return '"' + escape(node.value) + '"';
    }
    case TypstMathNodeType.Number:
      return node.value;
    case TypstMathNodeType.Operator:
      return serializeOperator(node);
    case TypstMathNodeType.FuncCall:
      return serializeFuncCall(node);
    case TypstMathNodeType.Script:
      return serializeScript(node);
    case TypstMathNodeType.Delimited:
      return serializeDelimited(node);
    case TypstMathNodeType.Space:
      return node.width ? ' ' + node.width + ' ' : '';
    case TypstMathNodeType.Linebreak:
      return ' \\\n';
    case TypstMathNodeType.Alignment:
      return ' ' + node.variant;
    case TypstMathNodeType.Raw:
      return (node.leadingNewline ? '\n' : '') + node.value + (node.trailingNewline ? '\n' : '');
    case TypstMathNodeType.Placeholder:
      return '""';
    case TypstMathNodeType.Label:
      return ' <' + sanitizeLabel(node.key) + '>';
    case TypstMathNodeType.MatrixRow:
      return node.cells
        .map(cell => escapeCasesSeparators(serializeTypstMath(cell).trim()))
        .join(', ');
    case TypstMathNodeType.InlineMath: {
      const inner = serializeTypstMath(node.body);
      return node.display ? '$ ' + inner + ' $' : '$' + inner + '$';
    }
  }
};

const serializeSeq = (node: SeqNode): string => {
  const children = node.children;
  if (children.length === 0) {
    return '';
  }
  const parts: string[] = [];
  let prevSerialized = '';
  let prevNodeIdx = -1;
  let prevWasCompactAlignment = false;
  for (let i = 0; i < children.length; i++) {
    let serialized = serializeTypstMath(children[i]);
    // After a compact alignment marker (eqnArray &), strip the leading space from
    // the next token so that "& = b" becomes "&= b" (Typst alignment convention)
    if (prevWasCompactAlignment && serialized) {
      serialized = serialized.replace(/^ /, '');
    }
    if (serialized && prevSerialized) {
      // Never add extra space after compact alignment marker — content attaches directly
      if (!prevWasCompactAlignment && needsSeparator(prevSerialized, serialized, children[prevNodeIdx])) {
        parts.push(' ');
      }
    }
    parts.push(serialized);
    if (serialized) {
      const child = children[i];
      prevWasCompactAlignment = child.type === TypstMathNodeType.Alignment
        && !!child.compact && child.variant === '&';
      prevSerialized = serialized;
      prevNodeIdx = i;
    }
  }
  return parts.join('');
};

/**
 * Decide whether a space is needed between two adjacent serialized tokens.
 * Mirrors the logic of needsTokenSeparator + needsSpaceBetweenNodes from common.ts
 * but operates on serialized strings and AST node types instead of MmlNode.
 */
const needsSeparator = (
  prev: string,
  next: string,
  prevNode: TypstMathNode,
): boolean => {
  if (!prev || !next) {
    return false;
  }
  if (RE_PHANTOM_BASE.test(next)) {
    return false;
  }
  // Escaped bracket at end (\( \) \[ etc.) is NOT a separator
  const prevIsSeparator = RE_SEPARATOR_END.test(prev) && !RE_ESCAPED_BRACKET_END.test(prev);
  if (RE_TOKEN_START.test(next) && !prevIsSeparator) {
    return true;
  }
  // Any escaped bracket at start of next needs space after word/dot chars
  if (RE_ESCAPED_BRACKET_START.test(next) && RE_WORD_DOT_END.test(prev)) {
    return true;
  }
  // Space before (, [ or { after a script node to prevent Typst function-call parsing
  if (prevNode.type === TypstMathNodeType.Script) {
    const ch = next[0];
    if (ch === '[' || ch === '{') {
      return true;
    }
    if (ch === '(') {
      if (isDerivativeScript(prevNode)) {
        return false;
      }
      // Builtin ops with scripts: sin^2(x) — no space needed
      if (isBuiltinOpScript(prevNode)) {
        return false;
      }
      return true;
    }
  }
  // Space before [ or { after a function call to prevent Typst trailing-content-block parsing.
  // frac(1, 2)[x] → Typst parses [x] as body argument to frac, causing an error.
  // Space before ( after code-mode (#hash) function to prevent chained-call parsing.
  // #box(stroke: 0.5pt, $G$)(s) → Typst calls box result with (s), causing an error.
  if (prevNode.type === TypstMathNodeType.FuncCall) {
    const ch = next[0];
    if (ch === '[' || ch === '{') {
      return true;
    }
    if (ch === '(' && prevNode.hash) {
      return true;
    }
  }
  // Space before [ or { after a delimited node (lr, abs, norm, etc.)
  // lr(| x |)[y] → Typst parses [y] as body argument to lr.
  if (prevNode.type === TypstMathNodeType.Delimited) {
    const ch = next[0];
    if (ch === '[' || ch === '{') {
      return true;
    }
  }
  // Space before ( after multi-char identifier to prevent emptyset(i) → function call
  if (next[0] === '(' && RE_ALPHA_END.test(prev)) {
    const match = prev.match(RE_TRAILING_DOTTED_IDENT);
    if (match && match[1].length > 1 && !TYPST_BUILTIN_OPS.has(match[1])) {
      return true;
    }
  }
  return false;
};

/**
 * Check whether a ScriptNode is a derivative pattern like f'(x).
 * In that case we do NOT insert a space before the following paren.
 */
const isDerivativeScript = (node: ScriptNode): boolean => {
  if (!node.sup || node.sub) {
    return false;
  }
  if (node.base.type !== TypstMathNodeType.Symbol) {
    return false;
  }
  // Prime superscript: the sup is a symbol whose value is a prime char
  if (node.sup.type === TypstMathNodeType.Symbol) {
    const val = node.sup.value;
    return val === "'" || val === "''" || val === "'''";
  }
  // Raw prime shorthand
  if (node.sup.type === TypstMathNodeType.Raw) {
    const val = node.sup.value;
    return val === "'" || val === "''" || val === "'''";
  }
  // Parenthesized superscript: f^{(n)}(a) — the (n) is a group, not function args
  const supStr = serializeTypstMath(node.sup).trim();
  if (supStr.startsWith('(') && supStr.endsWith(')')) {
    return true;
  }
  return false;
};

/** Check if a ScriptNode's base is a Typst builtin operator (sin, cos, log, etc.).
 *  sin^2(x) should NOT get space before ( — builtin ops accept args directly. */
const isBuiltinOpScript = (node: ScriptNode): boolean => {
  if (node.base.type === TypstMathNodeType.Symbol) {
    return TYPST_BUILTIN_OPS.has(node.base.value);
  }
  return false;
};

const serializeOperator = (node: OperatorNode): string => {
  const escaped = OPERATOR_ESCAPE_MAP[node.value] ?? node.value;
  if (node.spaced) {
    return ' ' + escaped + ' ';
  }
  if (node.unaryPrefix) {
    return ' ' + escaped;
  }
  // Comma gets trailing space for readability: a, b not a,b
  if (node.value === ',') {
    return ', ';
  }
  return escaped;
};

const serializeFuncCall = (node: FuncCallNode, parentCodeMode = false, indentLevel = 0): string => {
  const prefix = node.hash ? '#' : '';
  const codeMode = !!node.hash || parentCodeMode;
  const escapeCtx = node.escapeContext
    ?? FUNC_ESCAPE_CONTEXTS[node.name]
    ?? FuncEscapeContext.Standard;
  const argStrings: string[] = [];
  for (let i = 0; i < node.args.length; i++) {
    argStrings.push(serializeFuncArg(node.args[i], escapeCtx, codeMode, indentLevel));
  }
  // Separate named and positional args
  const named: string[] = [];
  const positional: string[] = [];
  for (let i = 0; i < node.args.length; i++) {
    (node.args[i].kind === FuncArgKind.Named ? named : positional).push(argStrings[i]);
  }
  // Check for multi-line formatting
  const isMultilinePositional = MULTILINE_POSITIONAL_FUNCS.has(node.name)
    && positional.length >= 2
    && !node.singleLine;
  const isMultilineCode = MULTILINE_CODE_FUNCS.has(node.name);
  const isMultiline = isMultilinePositional || isMultilineCode;
  let argsStr: string;
  if (isMultiline) {
    const indent = ' '.repeat(indentLevel + 2);
    if (node.semicolonSep) {
      // mat: named on first line, rows indented with ;\n separator, trailing comma
      const parts: string[] = [];
      if (named.length > 0) {
        parts.push(named.join(', '));
      }
      parts.push('\n' + positional.map(r => indent + r).join(';\n') + ',\n' + ' '.repeat(indentLevel));
      argsStr = parts.join(', ');
    } else if (isMultilineCode) {
      // Code-mode (#grid, #math.equation): ALL args indented on new lines
      const allArgs = [...named, ...positional];
      argsStr = '\n' + allArgs.map(a => indent + a).join(',\n') + ',\n' + ' '.repeat(indentLevel);
    } else {
      // Math-mode (cases): named on first line, positional indented
      const parts: string[] = [];
      if (named.length > 0) {
        parts.push(named.join(', '));
      }
      parts.push('\n' + positional.map(r => indent + r).join(',\n') + ',\n' + ' '.repeat(indentLevel));
      argsStr = parts.join(', ');
    }
  } else if (node.semicolonSep) {
    // Single-row mat: named args with , then positional with ;
    const parts: string[] = [];
    if (named.length > 0) {
      parts.push(named.join(', '));
    }
    if (positional.length > 0) {
      parts.push(positional.join('; '));
    }
    argsStr = parts.join(', ');
  } else {
    argsStr = argStrings.join(', ');
  }
  let result: string;
  if (argsStr || !node.body) {
    result = prefix + node.name + '(' + argsStr + ')';
  } else {
    result = prefix + node.name;
  }
  if (node.body) {
    const bodyParts: string[] = [];
    for (let i = 0; i < node.body.length; i++) {
      bodyParts.push(serializeTypstMath(node.body[i]));
    }
    result += '[' + bodyParts.join('') + ']';
  }
  if (node.trailingNewline) {
    result += '\n';
  }
  return result;
};

const serializeFuncArg = (arg: FuncArg, escapeCtx: FuncEscapeContext, codeMode = false, indentLevel = 0): string => {
  const valueStr = serializeArgValue(arg.value, escapeCtx, codeMode, indentLevel);
  if (arg.kind === FuncArgKind.Named) {
    return arg.name + ': ' + valueStr;
  }
  return valueStr;
};

const serializeArgValue = (value: ArgValue, escapeCtx: FuncEscapeContext, codeMode = false, indentLevel = 0): string => {
  switch (value.type) {
    case ArgValueType.Math: {
      const serialized = serializeTypstMath(value.node).trim();
      if (!serialized) {
        return '""';
      }
      return applyFuncEscaping(serialized, escapeCtx);
    }
    case ArgValueType.String:
      return '"' + escapeStringContent(value.value) + '"';
    case ArgValueType.Bool:
      if (codeMode) {
        return value.value ? 'true' : 'false';
      }
      return value.value ? '#true' : '#false';
    case ArgValueType.Ident:
      return value.value;
    case ArgValueType.Length:
      return value.value;
    case ArgValueType.Raw:
      return value.value;
    case ArgValueType.InlineMath: {
      const inner = serializeTypstMath(value.node);
      return value.display ? '$ ' + inner + ' $' : '$' + inner + '$';
    }
    case ArgValueType.Call:
      return serializeFuncCall(value.node, codeMode, indentLevel + 2);
  }
};

/** Apply context-appropriate escaping to serialized math content inside function args */
const applyFuncEscaping = (expr: string, ctx: FuncEscapeContext): string => {
  switch (ctx) {
    case FuncEscapeContext.None:
      return expr;
    case FuncEscapeContext.Standard:
      return escapeContentSeparators(expr);
    case FuncEscapeContext.MatrixCell:
      return escapeCasesSeparators(expr);
    case FuncEscapeContext.MatrixRow:
      return escapeMatrixRowSeparators(expr);
    case FuncEscapeContext.Wrapper:
      return escapeUnbalancedParens(escapeContentSeparators(expr));
    case FuncEscapeContext.StringArg:
      return escapeStringContent(expr);
    case FuncEscapeContext.LrContent:
      return escapeLrSemicolons(expr);
  }
};

/** Serialize script base: quote separator chars, placeholder for empty */
const serializeScriptBase = (node: TypstMathNode): string => {
  const s = serializeTypstMath(node);
  const trimmed = s.trim();
  if (SEPARATOR_BASES.has(trimmed)) {
    return '"' + trimmed + '"';
  }
  return trimmed || '""';
};

const serializeScript = (node: ScriptNode): string => {
  // Prescripts → attach(base, tl: ..., bl: ..., tr: ..., br: ...)
  if (node.preSub || node.preSup) {
    const serializeAttachArg = (n: TypstMathNode): string => {
      const s = serializeTypstMath(n).trim();
      return escapeContentSeparators(s || '""');
    };
    const args: string[] = [serializeAttachArg(node.base)];
    if (node.preSup) {
      args.push('tl: ' + serializeAttachArg(node.preSup));
    }
    if (node.preSub) {
      args.push('bl: ' + serializeAttachArg(node.preSub));
    }
    if (node.sup) {
      args.push('tr: ' + serializeAttachArg(node.sup));
    }
    if (node.sub) {
      args.push('br: ' + serializeAttachArg(node.sub));
    }
    return 'attach(' + args.join(', ') + ')';
  }
  // Regular sub/sup with _() ^() grouping
  const base = serializeScriptBase(node.base);
  let result = base;
  if (node.sub) {
    const subStr = serializeTypstMath(node.sub).trim();
    result += node.bareSub ? '_' + subStr : formatScriptPart('_', subStr);
  }
  if (node.sup) {
    result += formatScriptPart('^', serializeTypstMath(node.sup).trim());
  }
  return result;
};

/** Format _x or _(multi-char). Escapes unbalanced parens inside grouping to
 *  prevent bare ( or ) from breaking the ^(...) / _(...) syntax. */
const formatScriptPart = (prefix: string, content: string): string => {
  if (!content) {
    return '';
  }
  if (content.length > 1) {
    return prefix + '(' + escapeUnbalancedParens(content) + ')';
  }
  return prefix + content;
};

/** Build the set of ASCII bracket chars to escape inside lr() based on delimiters.
 *  When delimiters are standard brackets, escape those and their peers.
 *  When delimiters are non-bracket chars (|, ‖, ⟨, etc.), Typst still auto-scales
 *  ALL unescaped brackets inside lr(), so we escape all ASCII bracket types. */
const buildLrBracketChars = (openDelim: string, closeDelim: string): Set<string> => {
  const chars = new Set<string>();
  let hasBracketDelim = false;
  for (const d of [openDelim, closeDelim]) {
    if (d && (d in OPEN_BRACKETS || d in CLOSE_BRACKETS)) {
      hasBracketDelim = true;
      chars.add(d);
      const peer = OPEN_BRACKETS[d] ?? CLOSE_BRACKETS[d];
      if (peer) {
        chars.add(peer);
      }
    }
  }
  if (!hasBracketDelim && (openDelim || closeDelim)) {
    chars.add('[');
    chars.add(']');
    chars.add('(');
    chars.add(')');
    chars.add('{');
    chars.add('}');
  }
  return chars;
};

/** Escape body content for lr() with delimiter-specific bracket escaping */
const escapeLrBody = (body: string, openDelim: string, closeDelim: string): string => {
  const chars = buildLrBracketChars(openDelim, closeDelim);
  const escaped = chars.size > 0 ? escapeLrBrackets(body, chars) : body;
  return escapeLrSemicolons(escaped);
};

const serializeDelimited = (node: DelimitedNode): string => {
  const bodyStr = serializeTypstMath(node.body).trim();
  const openDelim = node.open;
  const closeDelim = node.close;
  const openMapped = openDelim ? mapDelimiter(openDelim) : '';
  const closeMapped = closeDelim ? mapDelimiter(closeDelim) : '';
  const hasVisibleOpen = !!openMapped;
  const hasVisibleClose = !!closeMapped;
  // Shorthand functions: abs/norm/floor/ceil when no top-level separators
  if (node.kind !== DelimitedKind.Lr && hasVisibleOpen && hasVisibleClose) {
    if (!hasTopLevelSeparators(bodyStr)) {
      const funcName = node.kind as string;
      return funcName + '(' + escapeContentSeparators(bodyStr) + ')';
    }
    // Has separators — use lr() with raw Unicode delimiter chars
    // (‖, ⌊, ⌋, ⌈, ⌉ are valid Typst lr() delimiters)
    const escaped = escapeLrBody(bodyStr, openDelim, closeDelim);
    return 'lr(' + openDelim + ' ' + escaped + ' ' + closeDelim + ')';
  }
  // lr() with both delimiters visible
  if (hasVisibleOpen && hasVisibleClose) {
    const escaped = escapeLrBody(bodyStr, openDelim, closeDelim);
    // Mismatched pairs need backslash-escaped delimiters
    const typstOpen = (openDelim in OPEN_BRACKETS && OPEN_BRACKETS[openDelim] !== closeDelim)
      ? '\\' + openDelim : openMapped;
    const typstClose = (closeDelim in CLOSE_BRACKETS && CLOSE_BRACKETS[closeDelim] !== openDelim)
      ? '\\' + closeDelim : closeMapped;
    return 'lr(' + typstOpen + ' ' + escaped + ' ' + typstClose + ')';
  }
  // One-sided lr(): \left. ... \right) or \left( ... \right.
  // Typst lr() supports unmatched delimiters: "this can be used to scale unmatched delimiters".
  const openEsc = openDelim ? escapeLrDelimiter(openDelim) : '';
  const closeEsc = closeDelim ? escapeLrDelimiter(closeDelim) : '';
  const escaped = escapeLrBody(bodyStr, openDelim, closeDelim);
  if (openEsc) {
    return 'lr(' + openEsc + ' ' + escaped + ')';
  }
  if (closeEsc) {
    return 'lr(' + escaped + ' ' + closeEsc + ')';
  }
  return bodyStr;
};
