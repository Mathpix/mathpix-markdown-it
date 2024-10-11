import { RuleInline, Token } from "markdown-it";
import { findIcon, findSquaredIcon, IUnicodeIcon } from "../../helpers/icons";

export const inlineMmdIcon: RuleInline = (state, silent): boolean => {
  try {
    const { pos, src } = state;
    let match: RegExpExecArray;
    if (src.charCodeAt(pos) !== 0x5c /* \ */) {
      return false;
    }

    const reIcon: RegExp = /^(?:\\icon\{([^}]*)\})/;
    match = src.slice(pos).match(reIcon);
    if (!match) return false;

    if (silent) return true;

    let iconName = match[1]?.trim() || '';
    let token: Token;
    if (!iconName) {
      token = state.push('text', '', 0);
      token.content = '';
      token.latex = match[0];
      state.pos = pos + match.index + match[0].length;
      return true;
    }

    let icon: IUnicodeIcon = findIcon(iconName);
    if (!icon) {
      icon = findSquaredIcon(iconName);
      if (!icon) {
        token = state.push('text_error', '', 0);
        token.content = `The icon name "${iconName}" can't be found.`;
        state.pos = pos + match.index + match[0].length;
        return true;
      } else {
        token = state.push('text_icon', '', 0);
        token.attrSet('style', `border: 1px solid; width: 1em; height: 1em; display: inline-block; text-align: center; line-height: 1em;`);
        token.content = icon.symbol;
        token.latex = match[0];
        state.pos = pos + match.index + match[0].length;
        return true
      }
    }

    token = state.push('text_icon', '', 0);
    token.content = icon.symbol;
    if (icon.name?.indexOf('fa_') !== -1) {
      token.attrSet('style','vertical-align: middle;')
    }
    token.latex = match[0];
    state.pos = pos + match.index + match[0].length;
    return true

  } catch (err) {
    console.error("[ERROR]=>[inlineMmdIcon]=>", err);
    return false;
  }
}
