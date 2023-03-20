import *  as sm from 'mathjax-full/js/input/tex/SymbolMap.js';
import ParseMethods from 'mathjax-full/js/input/tex/ParseMethods.js';
import ParseUtil from "mathjax-full/js/input/tex/ParseUtil.js";
import ArrayMethods from './ArrayMethods';

/**
 * Copied from /mathjax-full/ts/input/tex/ams/AmsMappings.ts
 */
let COLS = function(W: number[]) {
  const WW: string[] = [];
  for (let i = 0, m = W.length; i < m; i++) {
    WW[i] = ParseUtil.Em(W[i]);
  }
  return WW.join(' ');
};

/**
 * Environments from the Array package.
 */
new sm.EnvironmentMap('array-environment', ParseMethods.environment, {
  array:         ['AlignedArray'],
  gathered:      ['AmsEqnArray', null, null, null, 'c', null, '.5em', 'D'],
  aligned:       ['AmsEqnArray', null, null, null, 'rlrlrlrlrlrl',
    COLS([0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 0]), '.5em', 'D'],
}, ArrayMethods);
