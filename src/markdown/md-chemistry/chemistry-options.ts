export const setFontSize = (fontSize: number, options) => {
  if (!fontSize) {
    return options
  }
  const pt = Number(fontSize) * 3/4;
  const scale = pt/5;
  options.bondThickness = 0.6 * scale;
  options.bondLength = 15 * scale;
  options.bondSpacing = 0.18 * 15 * scale;
  options.fontSizeLarge = pt;
  options.fontSizeLargePx = fontSize;
  options.fontSizeSmall = 3 * scale;
  options.fontSizeSmallPx = (3 * scale) * 4/3;
  options.padding = 5 * scale;

  return options;
};
