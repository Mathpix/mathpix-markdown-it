"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMathDimensions = exports.getNodeAttributes = void 0;
var Element_1 = require("mathjax-full/js/adaptors/lite/Element");
var getAttribute = function (element, attribute) {
    var _a;
    if (element instanceof Element_1.LiteElement) {
        return ((_a = element.attributes) === null || _a === void 0 ? void 0 : _a[attribute]) || '';
    }
    else if (element instanceof HTMLElement || element instanceof SVGSVGElement) {
        return element.getAttribute(attribute) || '';
    }
    return '';
};
var getStyle = function (element, style) {
    var _a, _b;
    if (element instanceof Element_1.LiteElement) {
        return ((_a = element.styles) === null || _a === void 0 ? void 0 : _a.get(style)) || '';
    }
    else if (element instanceof HTMLElement || element instanceof SVGSVGElement) {
        return ((_b = element.style) === null || _b === void 0 ? void 0 : _b[style]) || '';
    }
    return '';
};
var getNodeAttributes = function (node) {
    var _a;
    var attributes = {
        containerWidth: '',
        svgViewBox: '',
        svgWidth: '',
        svgMinWidth: '',
        svgHeight: ''
    };
    try {
        if (node instanceof Element_1.LiteElement) {
            attributes.containerWidth = getAttribute(node, 'width');
            var svgElement = ((_a = node.children) === null || _a === void 0 ? void 0 : _a.length)
                ? node.children.find(function (item) { return item.kind === 'svg'; })
                : null;
            if (svgElement) {
                attributes.svgWidth = getAttribute(svgElement, 'width');
                attributes.svgMinWidth = getStyle(svgElement, 'min-width');
                attributes.svgHeight = getAttribute(svgElement, 'height');
                attributes.svgViewBox = getAttribute(svgElement, 'viewBox');
            }
        }
        else {
            if (node instanceof HTMLElement) {
                attributes.containerWidth = getAttribute(node, 'width');
                var svgElements = node.getElementsByTagName('svg');
                var svgElement = svgElements.length ? svgElements[0] : null;
                if (svgElement) {
                    attributes.svgWidth = getAttribute(svgElement, 'width');
                    attributes.svgMinWidth = getStyle(svgElement, 'min-width');
                    attributes.svgHeight = getAttribute(svgElement, 'height');
                    attributes.svgViewBox = getAttribute(svgElement, 'viewBox');
                }
            }
        }
        return attributes;
    }
    catch (err) {
        console.log("[ERROR]=>[getNodeAttributes]=>", err);
        return attributes;
    }
};
exports.getNodeAttributes = getNodeAttributes;
var getMathDimensions = function (node) {
    var _a = (0, exports.getNodeAttributes)(node), containerWidth = _a.containerWidth, svgViewBox = _a.svgViewBox, svgWidth = _a.svgWidth, svgMinWidth = _a.svgMinWidth, svgHeight = _a.svgHeight;
    var normalizeExValue = function (value) {
        var normalizedValue = value ? Number(value.replace(/ex/g, '')) : 0;
        return isNaN(normalizedValue) ? 0 : normalizedValue;
    };
    if (svgWidth === '100%') {
        svgWidth = svgMinWidth;
    }
    var widthEx = normalizeExValue(svgWidth);
    var heightEx = normalizeExValue(svgHeight);
    var viewBoxValues = svgViewBox ? svgViewBox.split(' ') : [];
    var viewBoxHeight = (viewBoxValues === null || viewBoxValues === void 0 ? void 0 : viewBoxValues.length) > 3 ? Math.abs(Number(viewBoxValues[1])) / 1000 : 0;
    var viewBoxHeightAndDepth = (viewBoxValues === null || viewBoxValues === void 0 ? void 0 : viewBoxValues.length) > 3 ? Math.abs(Number(viewBoxValues[3])) / 1000 : 0;
    return {
        containerWidth: containerWidth,
        widthEx: widthEx,
        heightEx: heightEx,
        viewBoxHeight: viewBoxHeight,
        viewBoxHeightAndDepth: viewBoxHeightAndDepth
    };
};
exports.getMathDimensions = getMathDimensions;
//# sourceMappingURL=utils.js.map