import *  as sm from 'mathjax-full/js/input/tex/SymbolMap.js';
import ParseMethods from 'mathjax-full/js/input/tex/ParseMethods.js';
import ArrayMethods from './ArrayMethods';

/**
 * Environments from the Array package.
 */
new sm.EnvironmentMap('array-environment', ParseMethods.environment, {
  array:      ['AlignedArray']
}, ArrayMethods);
