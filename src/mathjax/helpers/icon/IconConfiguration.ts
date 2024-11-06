import { Configuration } from 'mathjax-full/js/input/tex/Configuration.js';
import TexParser from 'mathjax-full/js/input/tex/TexParser.js';
import { CommandMap } from 'mathjax-full/js/input/tex/SymbolMap.js';
import { ParseMethod } from 'mathjax-full/js/input/tex/Types.js';
import { findSquaredIcon, findIcon, IUnicodeIcon } from "../../../helpers/icons";
import TexError from 'mathjax-full/js/input/tex/TexError.js';

export let IconMethods: Record<string, ParseMethod> = {};

IconMethods.Icon = function(parser: TexParser, name: string) {
  let iconName = parser.GetArgument(name);
  iconName = iconName ? iconName.trim() : '';
  if (!iconName) {
    let math = parser.create('node', 'mtext', [], {}, '');
    parser.Push(math);
    return;
  }

  let icon: IUnicodeIcon = findIcon(iconName, true);
  if (!icon) {
    icon = findSquaredIcon(iconName);
    if (!icon) {
      throw new TexError('MultipleIconProperty', 'The icon name "%1" can\'t be found.', iconName);
    } else {
      let textNode = parser.create('text', icon.symbol);
      let math = parser.create('node', 'mtext', [], {}, textNode);
      let def = {
        height: '+0.1em',
        depth: '+0.1em',
        lspace: '+0.1em',
        width: '+0.3em',
        style: `border: 1px solid;`
      };

      math = parser.create('node', 'mpadded', [math], def);
      parser.Push(math);
    }
  } else {
    let textNode = parser.create('text', icon.symbol);
    let math = parser.create('node', 'mtext', [], {}, textNode);
    let def = {
      width: icon.width ? icon.width :'+0.5ex'
    };
    math = parser.create('node', 'mpadded', [math], def);
    parser.Push(math);
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
