import SmilesDrawer from './smiles-drawer';
import { IOptions } from './smiles-drawer/src/Drawer';
import { ISmilesOptions } from './index';
import { initDocument } from '../dom-adaptor';
import { setFontSize } from './chemistry-options';

export const ChemistryDrawer = {
  drawSvgSync: function(content: string, id: string,
                        options: ISmilesOptions = {}): string {
    initDocument();
    const { theme = 'light', stretch, scale = 1, fontSize = 14} = options;
    let config: IOptions = setFontSize(fontSize,{});

    if (options) {
      config = Object.assign(config, options, {id: id})
    }

    return SmilesDrawer.parse(content, (tree) => {
      const svgDrawer = new SmilesDrawer.SvgDrawer(config);

      const output_svg = document.createElement('svg');
      const svgId: string = 'smiles-' + id;
      output_svg.id = svgId;

      const svg = svgDrawer.draw(tree, output_svg, theme, false);

      if (!stretch && svgDrawer.svgWrapper?.drawingWidth) {
        svg.style.width = `${svgDrawer.svgWrapper?.drawingWidth * scale}px`;
      }

      if (svg && svg.outerHTML) {
        return svg.outerHTML
      } else {
        return '';
      }
    }, function (err) {
      console.error('[drawSvgSync]' + err);
      return `<span class="smiles-error" style="background-color: yellow; color: red;">SyntaxError: ${err.message}</span>`
    });
  }
};
