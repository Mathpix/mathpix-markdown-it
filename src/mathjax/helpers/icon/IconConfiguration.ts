import { Configuration } from 'mathjax-full/js/input/tex/Configuration.js';
import TexParser from 'mathjax-full/js/input/tex/TexParser.js';
import { CommandMap } from 'mathjax-full/js/input/tex/SymbolMap.js';
import { ParseMethod } from 'mathjax-full/js/input/tex/Types.js';
import TexError from 'mathjax-full/js/input/tex/TexError.js';
import { EnvList } from 'mathjax-full/js/input/tex/StackItem.js'
import { MmlNode } from "mathjax-full/js/core/MmlTree/MmlNode.js";
import { findIcon } from "../../../helpers/icons";

export let IconMethods: Record<string, ParseMethod> = {};

IconMethods.Icon = function(parser: TexParser, iconNameInit: string) {
  let iconName: string = parser.GetArgument(iconNameInit);
  iconName = iconName ? iconName.trim() : '';
  if (!iconName) {
    let math: MmlNode = parser.create('node', 'mtext', [], {}, '');
    parser.Push(math);
    return;
  }

  let {icon = null, name= '', color = '', isSquared = false } = findIcon(iconName, true);
  if (!name) {
    let math: MmlNode = parser.create('node', 'mtext', [], {}, '');
    parser.Push(math);
    return;
  }

  if (!icon) {
    throw new TexError('MultipleIconProperty', 'The icon name "%1" can\'t be found.', iconName);
  } else {
    if (isSquared) {
      let textNode: MmlNode = parser.create('text', icon.symbol);
      let math: MmlNode = parser.create('node', 'mtext', [], {}, textNode);
      let def: EnvList = {
        height: '+0.1em',
        depth: '+0.1em',
        lspace: '+0.1em',
        width: '+0.3em',
        style: color ? `border: 1px solid ${color};` : `border: 1px solid;`
      };
      if (color) {
        def.color = color;
      }
      math = parser.create('node', 'mpadded', [math], def);
      parser.Push(math);
    } else {
      let textNode = parser.create('text', icon.symbol);
      let math = parser.create('node', 'mtext', [], {}, textNode);
      let def: {width?: string, color?: string} = {
        width: icon.width ? icon.width :'+0.5ex'
      };
      if (color) {
        def.color = color;
      }
      math = parser.create('node', 'mpadded', [math], def);
      parser.Push(math);
    }
  }
};

new CommandMap('icon', {icon: 'Icon'}, IconMethods);

export const IconConfiguration: Configuration = Configuration.create(
  'icon', {
    handler: {
      macro: ['icon']
    }
  }
);
