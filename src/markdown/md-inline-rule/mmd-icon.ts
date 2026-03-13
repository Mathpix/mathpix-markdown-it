import { RuleInline, Token } from "markdown-it";
import { findIcon } from "../../helpers/icons";

export const inlineMmdIcon: RuleInline = (state, silent): boolean => {
  try {
    const { pos, src } = state;
    if (src.charCodeAt(pos) !== 0x5c /* \ */) {
      return false;
    }

    const reIcon: RegExp = /^(?:\\icon\{([^}]*)\})/;
    const match = src.slice(pos).match(reIcon);
    if (!match) return false;

    const endPos = pos + match.index + match[0].length;

    if (!silent) {
      let iconName = match[1]?.trim() || '';
      let token: Token;
      if (!iconName) {
        token = state.push('text', '', 0);
        token.content = '';
        token.latex = match[0];
      } else {
        let { icon = null, name = '', color = '', isSquared = false } = findIcon(iconName);
        if (!name) {
          token = state.push('text', '', 0);
          token.content = '';
          token.latex = match[0];
        } else if (!icon) {
          token = state.push('text_error', '', 0);
          token.content = `The icon name "${iconName}" can't be found.`;
        } else if (isSquared) {
          token = state.push('text_icon', '', 0);
          token.attrJoin('style', `border: 1px solid; width: 1em; height: 1em; display: inline-block; text-align: center; line-height: 1em;`);
          if (color) {
            token.attrJoin('style', `color: ${color};`)
          }
          token.content = icon.symbol;
          token.latex = match[0];
        } else {
          token = state.push('text_icon', '', 0);
          token.content = icon.symbol;
          if (color) {
            token.attrJoin('style', `color: ${color};`)
          }
          if (icon.name?.indexOf('fa_') !== -1) {
            token.attrJoin('style','vertical-align: middle;')
          }
          token.latex = match[0];
        }
      }
    }

    state.pos = endPos;
    return true;

  } catch (err) {
    console.error("[ERROR]=>[inlineMmdIcon]=>", err);
    return false;
  }
}
