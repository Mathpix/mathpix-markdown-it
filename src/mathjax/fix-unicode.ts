import { MapHandler } from "mathjax-full/js/input/tex/MapHandler";
import NodeUtil from "mathjax-full/js/input/tex/NodeUtil";
import { getRange } from "mathjax-full/js/core/MmlTree/OperatorDictionary";
import { CharacterMap } from 'mathjax-full/js/input/tex/SymbolMap.js';

/**
 * Remapping some ASCII characters to their Unicode operator equivalent.
 */
new CharacterMap('remap', null, {
  '-':   '\u2212',
  '*':   '\u2217',
  '`':   '\u2018'   // map ` to back quote
});

/**
 * Default handling of characters (as <mo> elements).
 * @param {TexParser} parser The calling parser.
 * @param {string} char The character to parse.
 */
export function Other(parser, char) {
  const font = parser.stack.env['font'];
  let def = font
    ? {mathvariant: parser.stack.env['font']}
    : {};
  const remap = (MapHandler.getMap('remap') as CharacterMap).lookup(char);
  const range = getRange(char);
  const type = range?.[3] || 'mo';
  let mo = parser.create('token', type, def, (remap ? remap.char : char));
  range?.[4] && mo.attributes.set('mathvariant', range[4]);
  if (type === 'mo') {
    NodeUtil.setProperty(mo, 'fixStretchy', true);
    parser.configuration.addNode('fixStretchy', mo);
  }
  parser.Push(mo);
}
