import SmilesDrawer from './smiles-drawer';
import { IOptions } from './smiles-drawer/src/Drawer';
import { ISmilesOptions } from './index';

export const ChemistryDrawer = {
  drawSvgSync: function(content: string, id: string,
                        options: ISmilesOptions = {}): string {
    const { theme = 'light', stretch, scale = 1, fontSize = 37.5} = options;
    let config: IOptions;

    if (options) {
      config = Object.assign({}, options, {id: id})
    }

    if (fontSize) {
      const pt = Number(fontSize) * 3/4;
      const scale = pt/5;
      config.bondThickness = 0.6 * scale;
      config.bondLength = 15 * scale;
      config.bondSpacing = 0.18 * 15 * scale;
      config.fontSizeLarge = 5 * scale;
      config.fontSizeSmall = 3 * scale;
      config.padding = 5 * scale;
      console.log('fontSize=>', fontSize);
      console.log('pt=>', pt);
      console.log('scale=>', scale);
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
      if (!stretch && svgDrawer.svgWrapper?.drawingHeight) {
        svg.style.height = `${svgDrawer.svgWrapper?.drawingHeight * scale}px`;
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
