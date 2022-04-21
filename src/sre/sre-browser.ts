import * as sre from 'speech-rule-engine/lib/sre.js';

export const loadSre = (options = {}) => {
  const optionsEngine = Object.assign({}, {domain: 'mathspeak'}, options);
  sre.setupEngine(optionsEngine);
  return sre;
};
