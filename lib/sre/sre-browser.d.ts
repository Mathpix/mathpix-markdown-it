import * as sre from 'speech-rule-engine/lib/sre.js';
type SreDomain = 'mathspeak' | 'clearspeak' | string;
type SreLocale = string;
export interface LoadSreOptions {
    domain?: SreDomain;
    locale?: SreLocale;
    [key: string]: unknown;
}
export declare const loadSre: (options?: {}) => any;
/**
 * Initializes Speech Rule Engine (SRE) with the given options and waits until it is ready.
 *
 * @param {LoadSreOptions} [options] SRE engine options (merged with defaults).
 * @returns {Promise<typeof sre>} The initialized SRE instance.
 */
export declare const loadSreAsync: (options?: LoadSreOptions) => Promise<typeof sre>;
export {};
