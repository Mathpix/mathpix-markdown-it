import { LiteElement } from "mathjax-full/js/adaptors/lite/Element";

export interface IMathDimensions {
  containerWidth: string,
  widthEx: number,
  heightEx: number,
  viewBoxHeight: number,
  viewBoxHeightAndDepth: number
}

interface INodeAttributes {
  containerWidth: string,
  svgViewBox: string,
  svgWidth: string,
  svgMinWidth: string,
  svgHeight: string
}

const getAttribute = (element: HTMLElement | SVGSVGElement | LiteElement, attribute: string): string => {
  if (element instanceof LiteElement) {
    return element.attributes?.[attribute] || '';
  } else if (element instanceof HTMLElement  || element instanceof SVGSVGElement) {
    return element.getAttribute(attribute) || '';
  }
  return '';
};

const getStyle = (element: HTMLElement | SVGSVGElement | LiteElement, style: string): string => {
  if (element instanceof LiteElement) {
    return element.styles?.get(style) || '';
  } else if (element instanceof HTMLElement || element instanceof SVGSVGElement) {
    return element.style?.[style] || '';
  }
  return '';
};

export const getNodeAttributes = (node: LiteElement | HTMLElement): INodeAttributes => {
  let attributes: INodeAttributes = {
    containerWidth: '',
    svgViewBox: '',
    svgWidth: '',
    svgMinWidth: '',
    svgHeight: ''
  }
  try {
    if (node instanceof LiteElement) {
      attributes.containerWidth = getAttribute(node, 'width');
      let svgElement: LiteElement = node.children?.length
        ? node.children.find((item: LiteElement) => item.kind === 'svg') as LiteElement
        : null;
      if (svgElement) {
        attributes.svgWidth = getAttribute(svgElement, 'width');
        attributes.svgMinWidth = getStyle(svgElement, 'min-width');
        attributes.svgHeight = getAttribute(svgElement, 'height');
        attributes.svgViewBox = getAttribute(svgElement, 'viewBox');
      }
    } else {
      if (node instanceof HTMLElement) {
        attributes.containerWidth = getAttribute(node, 'width');
        const svgElements = node.getElementsByTagName('svg');
        const svgElement: SVGSVGElement = svgElements.length ? svgElements[0]  : null;
        if (svgElement) {
          attributes.svgWidth = getAttribute(svgElement, 'width');
          attributes.svgMinWidth = getStyle(svgElement, 'min-width');
          attributes.svgHeight = getAttribute(svgElement, 'height');
          attributes.svgViewBox = getAttribute(svgElement, 'viewBox');
        }
      }
    }
    return attributes;
  } catch (err) {
    console.log("[ERROR]=>[getNodeAttributes]=>", err);
    return attributes;
  }
}

export const getMathDimensions = (node: LiteElement | HTMLElement): IMathDimensions => {
  let { containerWidth, svgViewBox, svgWidth, svgMinWidth, svgHeight} = getNodeAttributes(node);
  const normalizeExValue = (value: string): number => {
    const normalizedValue: number = value ? Number(value.replace(/ex/g, '')) : 0;
    return isNaN(normalizedValue) ? 0 : normalizedValue;
  };
  if (svgWidth === '100%') {
    svgWidth = svgMinWidth;
  }
  let widthEx: number = normalizeExValue(svgWidth);
  let heightEx: number = normalizeExValue(svgHeight);
  let viewBoxValues: string[] = svgViewBox ? svgViewBox.split(' ') : [];
  let viewBoxHeight: number = viewBoxValues?.length > 3 ? Math.abs(Number(viewBoxValues[1]))/1000 : 0;
  let viewBoxHeightAndDepth: number = viewBoxValues?.length > 3 ? Math.abs(Number(viewBoxValues[3]))/1000 : 0;
  return {
    containerWidth: containerWidth,
    widthEx: widthEx,
    heightEx: heightEx,
    viewBoxHeight: viewBoxHeight,
    viewBoxHeightAndDepth: viewBoxHeightAndDepth
  }
}
