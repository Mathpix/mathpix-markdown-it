import SmilesDrawer from './smiles-drawer';
import { IOptions } from './smiles-drawer/src/Drawer';
import { ISmilesOptions } from './index';
import { initDocument } from '../dom-adaptor';
import { setFontSize, setDisableColors, setThemesByDefault, getScale } from './chemistry-options';

export const ChemistryDrawer = {
  drawSvgSync: function(content: string, id: string,
                        options: ISmilesOptions = {}): string {
    initDocument();
    const { theme = 'light', stretch, fontSize = 14,
      disableColors = true, autoScale, useCurrentColor = true
    } = options;
    let scale = options.scale || 1;
    let config: IOptions = {};

    if (autoScale) {
      scale = getScale(fontSize);
    } else {
      config = setFontSize(fontSize,{});
    }

    const darkTextColor = useCurrentColor ? 'currentColor' : '#fff';
    const lightTextColor = useCurrentColor ? 'currentColor' : '#222';
    if (disableColors) {
      config = setDisableColors(config, darkTextColor, lightTextColor);
    } else {
      config = setThemesByDefault(config, darkTextColor, lightTextColor);
    }

    if (options) {
      config = Object.assign(config, options, {id: id})
    }

    return SmilesDrawer.parse(content, (tree) => {
      const svgDrawer = new SmilesDrawer.SvgDrawer(config);

      const output_svg = document.createElement('svg');
      const svgId: string = 'smiles-' + id;
      output_svg.id = svgId;
      output_svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      const svg = svgDrawer.draw(tree, output_svg, theme, false);

      if (!stretch && svgDrawer.svgWrapper?.drawingWidth) {
        svg.style.width = `${svgDrawer.svgWrapper?.drawingWidth * scale}px`;
      }
      if (!stretch && !options.isTesting && svgDrawer.svgWrapper?.drawingHeight) {
        svg.style.height = `${svgDrawer.svgWrapper?.drawingHeight * scale}px`;
      }
      svg.style.overflow = 'visible';

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
