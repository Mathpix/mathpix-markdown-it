import * as sre from 'speech-rule-engine/lib/sre.js';
type SreDomain = 'mathspeak' | 'clearspeak' | string;
type SreLocale = string;

export interface LoadSreOptions {
  domain?: SreDomain;
  locale?: SreLocale;
  // allow extra SRE engine options without losing type safety for known keys
  [key: string]: unknown;
}

export const loadSre = (options = {}) => {
  const optionsEngine = Object.assign({}, {domain: 'mathspeak'}, options);
  sre.setupEngine(optionsEngine);
  return sre;
};

/**
 * Initializes Speech Rule Engine (SRE) with the given options and waits until it is ready.
 *
 * @param {LoadSreOptions} [options] SRE engine options (merged with defaults).
 * @returns {Promise<typeof sre>} The initialized SRE instance.
 */
export const loadSreAsync = async (options: LoadSreOptions = {}): Promise<typeof sre> => {
  const optionsEngine: LoadSreOptions = {
    domain: 'mathspeak',
    locale: 'en',
    ...options,
  };
  sre.setupEngine(optionsEngine);
  await sre.engineReady();
  return sre;
};
