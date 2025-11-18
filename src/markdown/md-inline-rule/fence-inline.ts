import type StateInline from 'markdown-it/lib/rules_inline/state_inline';

export const fenceInline = (state: StateInline, silent: boolean): boolean => {
  const src = state.src;
  let pos = state.pos, max = state.posMax;

  const markerCh = src.charCodeAt(pos);            // '`' or '~' (code)
  if (markerCh !== 0x60 && markerCh !== 0x7E) return false;

  const start = pos;
  while (pos < max && src.charCodeAt(pos) === markerCh) pos++;
  const fenceLen = pos - start;                    // marker length (>=3)
  if (fenceLen < 3) return false;

  const markup = String.fromCharCode(markerCh).repeat(fenceLen); // "```" or "~~~"

  const infoStart = pos;
  const firstEnd = src.indexOf('\n', infoStart) === -1 ? max : src.indexOf('\n', infoStart);
  const info = src.slice(infoStart, firstEnd);
  if (markerCh === 0x60 && info.includes('`')) return false;

  // search for the closing line
  let cur = firstEnd;
  if (cur < max && src.charCodeAt(cur) === 0x0A) cur++;
  let found = false, contentStart = cur, contentEnd = cur;

  while (cur <= max) {
    const ls = cur;
    const le = (src.indexOf('\n', ls) === -1 || src.indexOf('\n', ls) > max) ? max : src.indexOf('\n', ls);

    // ≤3 spaces + ≥ fenceLen of the same character
    let i = ls, indent = 0;
    while (i < le && (src.charCodeAt(i) === 0x20 || src.charCodeAt(i) === 0x09)) { indent++; i++; }
    if (indent <= 3) {
      let k = i, cnt = 0;
      while (k < le && src.charCodeAt(k) === markerCh) { cnt++; k++; }
      if (cnt >= fenceLen) {
        found = true;
        contentEnd = (ls > contentStart && src.charCodeAt(ls - 1) === 0x0A) ? ls - 1 : ls;
        pos = le; if (pos < max && src.charCodeAt(pos) === 0x0A) pos++;
        break;
      }
    }

    cur = (le < max && src.charCodeAt(le) === 0x0A) ? le + 1 : le;
    if (cur > max) break;
  }

  if (!found) return false;
  if (silent) return true;

  const tok = state.push('fence', 'code', 0);
  tok.block = false;
  tok.markup = markup;
  tok.info = info.trim();
  tok.content = src.slice(contentStart, contentEnd) + '\n';
  state.pos = pos;
  return true;
}
