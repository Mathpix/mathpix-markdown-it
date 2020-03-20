//export const itemizeLevel = ['•', '–', '*', '·'];

const reEnum: RegExp = /(?:\\alph|\\Alph|\\arabic|\\roman|\\Roman\s{0,}\{(enumi|enumii|enumiii|enumiv)\})/;
const reEnumL: RegExp = /^(?:alph|Alph|arabic|roman|Roman)/;

export const LevelsEnum = ["labelenumi", "labelenumii", "labelenumiii", "labelenumiv"];
export const LevelsItem = ["labelitemi", "labelitemii", "labelitemiii", "labelitemiv"];
export const AvailableStyles = {
  "alph":   "lower-alpha",
  "Alph":   "upper-alpha",
  "arabic": "decimal",
  "roman":  "lower-roman",
  "Roman":  "upper-roman",
};

export var itemizeLevelDef = ['\\textbullet', '\\textendash', '\\textasteriskcentered', '\\textperiodcentered'];
export var enumerateLevelDef = ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha'];
export var itemizeLevel = [];
export var enumerateLevel = [];
export var itemizeLevelTokens = [];

export const SetDefaultItemizeLevel = () => {
  itemizeLevel = [].concat(itemizeLevelDef);
  return itemizeLevel;
};

export const SetDefaultEnumerateLevel = () => {
  enumerateLevel = [].concat(enumerateLevelDef);
  return enumerateLevel;
};

export const GetItemizeLevel = (data = null) => {
  if (!data || data.length === 0) {
    if (!itemizeLevel || itemizeLevel.length === 0) {
      return SetDefaultItemizeLevel()
    } else {
      return [].concat(itemizeLevel)
    }
  } else {
    return [].concat(data);
  }
};

export const GetEnumerateLevel = (data = null) => {
  if (!data || data.length === 0) {
    if (!enumerateLevel || enumerateLevel.length === 0) {
      return SetDefaultEnumerateLevel()
    } else {
      return [].concat(enumerateLevel)
    }
  } else {
    return [].concat(data);
  }
};

//SetItemizeLevelTokens
export const SetItemizeLevelTokens = (state) => {
  for (let i = 0; i < itemizeLevel.length; i++) {
    let children = [];
    state.md.inline.parse(itemizeLevel[i], state.md, state.env, children);
    itemizeLevelTokens[i] = children
  }
  return [].concat(itemizeLevelTokens)
};

export const SetItemizeLevelTokensByIndex = (state, index: number) => {
  let children = [];
  state.md.inline.parse(itemizeLevel[index], state.md, state.env, children);
  itemizeLevelTokens[index] = children
};

export const GetItemizeLevelTokens = (data = null) => {
  if (!data || data.length === 0) {
    if (itemizeLevelTokens && itemizeLevelTokens.length > 0) {
      return [].concat(itemizeLevelTokens)
    } else {
      return []
    }
  } else {
    return [].concat(data);
  }
};

export const GetItemizeLevelTokensByState = (state) => {
  if (itemizeLevelTokens && itemizeLevelTokens.length > 0) {
    return [].concat(itemizeLevelTokens)
  } else {
    return SetItemizeLevelTokens(state)
  }
};


export const ChangeLevel = (state, data) => {
  if (!data) { return false}
  const {command = '', params = ''} = data;
  if (!command || !params) { return false}

  let index = LevelsEnum.indexOf(command);
  if (index >= 0) {
    const matchL = params.match(reEnum);
    if (matchL) {
      const matchE = matchL[0].slice(1).match(reEnumL);
      if (matchE) {
        const newStyle =  AvailableStyles[matchE[0]];
        enumerateLevel[index] = newStyle;
        return true;
      }
    }
    return false;
  }
  index = LevelsItem.indexOf(command);
  if (index >= 0) {
    itemizeLevel[index] = params;
    SetItemizeLevelTokensByIndex(state, index);
    return true;
  }
  return false;
};


export const clearItemizeLevelTokens = () => {
  itemizeLevelTokens = [];
};
