import SmilesDrawer from './smiles-drawer';
import { IOptions } from './smiles-drawer/src/Drawer';
import { initDocument } from '../dom-adaptor';
import { ISmilesOptions } from './index';

export const ChemistryDrawer = {
  drawSvgSync: function(content: string, id: string,
                        options: ISmilesOptions = {}): string {
    initDocument();
    const { theme = 'light', stretch, scale = 3 } = options;
    let config: IOptions;

    if (options) {
      config = Object.assign({}, options, {id: id})
    }

    return SmilesDrawer.parse(content, (tree) => {
      const svgDrawer = new SmilesDrawer.SvgDrawer(config);

      const output_svg = document.createElement('svg');
      const svgId: string = 'smiles-' + id;
      output_svg.id = svgId;

      document.body.appendChild(output_svg);
      const svg = svgDrawer.draw(tree, svgId, theme, false);
      if (!stretch && svgDrawer.svgWrapper?.drawingWidth) {
        svg.style.width = `${svgDrawer.svgWrapper?.drawingWidth * scale}px`;
      }

      document.body.removeChild(output_svg);

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
