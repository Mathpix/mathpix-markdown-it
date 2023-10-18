/** 
 * Replacing the default rules to ignore insertion of line breaks after hidden tokens.
 * Hidden tokens do not participate in rendering
 * */
export const softBreak = (tokens, idx, options /*, env */) => {
  const beforeToken = idx - 1 < 0 ? null : tokens[idx-1];
  if (beforeToken && beforeToken.hidden) {
    return '';
  }
  if (tokens[idx].hidden) {
    return tokens[idx].showSpace ? ' ' : '';
  }
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};

export const hardBreak = (tokens, idx, options /*, env */) => {
  const beforeToken = idx - 1 < 0 ? null : tokens[idx-1];
  if (beforeToken && beforeToken.hidden) {
    return '';
  }
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
