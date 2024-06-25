import { mmdRendererRules } from "./mmdRendererRules";
import { Token } from "markdown-it";
export const injectTextDirection = (md, textDirection) => {
  const bidi = defaultRenderer => (tokens, idx, opts, env, self) => {
    const token: Token = tokens[idx];
    const prevToken = tokens[idx - 1];
    if (token.type === 'th_open' && prevToken.type === 'tr_open') {
      return defaultRenderer(tokens, idx, opts, env, self);
    }
    token.attrSet('dir', textDirection);
    return defaultRenderer(tokens, idx, opts, env, self);
  };

  const proxy = (tokens, idx, opts, _, self) => {
    return self.renderToken(tokens, idx, opts);
  };

  mmdRendererRules.forEach(rule => {
    if (rule.generatesContainer) {
      const defaultRenderer = md.renderer.rules[rule.name] || proxy;
      md.renderer.rules[rule.name] = bidi(defaultRenderer);
    }
  });
}