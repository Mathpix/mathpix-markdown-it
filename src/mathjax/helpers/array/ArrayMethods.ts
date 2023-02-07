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

export default ArrayMethods;
