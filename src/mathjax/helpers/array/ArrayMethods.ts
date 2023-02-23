/**
 * @fileoverview The Array Parse methods.
 */

import * as sitem from "mathjax-full/js/input/tex/base/BaseItems.js";
import { ParseMethod } from 'mathjax-full/js/input/tex/Types.js';
import BaseMethods from 'mathjax-full/js/input/tex/base/BaseMethods.js';
import TexParser from "mathjax-full/js/input/tex/TexParser.js";
import {StackItem} from "mathjax-full/js/input/tex/StackItem.js";
import ParseUtil from "mathjax-full/js/input/tex/ParseUtil.js";

// Namespace
let ArrayMethods: Record<string, ParseMethod> = BaseMethods;

/** 
 * Replace the AlignedArray method to set the name attribute which points to the environment
 * */
ArrayMethods.AlignedArray = function(parser: TexParser, begin: StackItem) {
  const envName = begin.getName();
  const align = parser.GetBrackets('\\begin{' + envName + '}');
  let item: any = BaseMethods.Array(parser, begin);
  if (item.hasOwnProperty('arraydef')) {
    item.arraydef['name'] = envName
  } else {
    item['arraydef'] = {
      name: envName
    }
  }
  return ParseUtil.setArrayAlign(item as sitem.ArrayItem, align);
};

/**
 * Replace the AmsMethods.AmsEqnArray method to set the name attribute which points to the environment.
 * Used for aligned, gathered
 * */
ArrayMethods.AmsEqnArray = function(parser: TexParser, begin: StackItem,
                                    numbered: boolean, taggable: boolean,
                                    align: string, spacing: string,
                                    style: string) {
  const envName = begin.getName();
  const args = parser.GetBrackets('\\begin{' + envName + '}');
  const array: any = BaseMethods.EqnArray(parser, begin, numbered, taggable, align, spacing, style);
  if (array.hasOwnProperty('arraydef')) {
    array.arraydef['name'] = envName
  } else {
    array['arraydef'] = {
      name: envName
    }
  }
  return ParseUtil.setArrayAlign(array, args);
};

export default ArrayMethods;
