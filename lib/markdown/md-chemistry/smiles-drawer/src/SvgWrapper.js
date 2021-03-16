"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MathHelper_1 = require("./MathHelper");
var UtilityFunctions_1 = require("./UtilityFunctions");
var Line_1 = require("./Line");
var Vector2_1 = require("./Vector2");
var Atom_1 = require("./Atom");
var SvgWrapper = /** @class */ (function () {
    function SvgWrapper(themeManager, target, options) {
        if (typeof target === 'string' || target instanceof String) {
            this.svg = document.getElementById(target.toString());
        }
        else {
            this.svg = target;
        }
        this.opts = options;
        this.gradientId = 0;
        // maintain a list of line elements and their corresponding gradients
        // maintain a list of vertex elements
        this.paths = [];
        this.vertices = [];
        this.gradients = [];
        // maintain the offset for drawing purposes
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        // maintain the dimensions
        this.drawingWidth = 0;
        this.drawingHeight = 0;
        this.halfBondThickness = this.opts.bondThickness / 2.0;
        // for managing color schemes
        this.themeManager = themeManager;
        // create the mask
        this.maskElements = [];
        var mask = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mask.setAttributeNS(null, 'x', '0');
        mask.setAttributeNS(null, 'y', '0');
        mask.setAttributeNS(null, 'width', '100%');
        mask.setAttributeNS(null, 'height', '100%');
        mask.setAttributeNS(null, 'fill', 'white');
        this.maskElements.push(mask);
        // clear the svg element
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }
    SvgWrapper.prototype.constructSvg = function () {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        // TODO: add the defs element to put gradients in
        var elementClassName = this.opts.id ? 'element-' + this.opts.id : 'element';
        var subClassName = this.opts.id ? 'sub-' + this.opts.id : 'sub';
        var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'), masks = document.createElementNS('http://www.w3.org/2000/svg', 'mask'), style = document.createElementNS('http://www.w3.org/2000/svg', 'style'), paths = document.createElementNS('http://www.w3.org/2000/svg', 'g'), vertices = document.createElementNS('http://www.w3.org/2000/svg', 'g'), pathChildNodes = this.paths;
        // give the mask an id
        if (this.opts.id) {
            masks.setAttributeNS(null, 'id', 'text-mask-' + this.opts.id);
        }
        else {
            masks.setAttributeNS(null, 'id', 'text-mask');
        }
        // create the css styles
        style.appendChild(document.createTextNode("\n                ." + elementClassName + " {\n                    font: " + (this.opts.fontSizeLargePx ? this.opts.fontSizeLargePx + 'px' : this.opts.fontSizeLarge + 'pt') + " Helvetica, Arial, sans-serif;\n                    alignment-baseline: 'middle';\n                }\n                ." + subClassName + " {\n                    font: " + (this.opts.fontSizeSmallPx ? this.opts.fontSizeSmallPx + 'px' : this.opts.fontSizeSmall + 'pt') + " Helvetica, Arial, sans-serif;\n                }\n            "));
        try {
            for (var pathChildNodes_1 = tslib_1.__values(pathChildNodes), pathChildNodes_1_1 = pathChildNodes_1.next(); !pathChildNodes_1_1.done; pathChildNodes_1_1 = pathChildNodes_1.next()) {
                var path = pathChildNodes_1_1.value;
                paths.appendChild(path);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pathChildNodes_1_1 && !pathChildNodes_1_1.done && (_a = pathChildNodes_1.return)) _a.call(pathChildNodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var _e = tslib_1.__values(this.vertices), _f = _e.next(); !_f.done; _f = _e.next()) {
                var vertex = _f.value;
                vertices.appendChild(vertex);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _g = tslib_1.__values(this.maskElements), _h = _g.next(); !_h.done; _h = _g.next()) {
                var mask = _h.value;
                masks.appendChild(mask);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var _j = tslib_1.__values(this.gradients), _k = _j.next(); !_k.done; _k = _j.next()) {
                var gradient = _k.value;
                defs.appendChild(gradient);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (this.opts.id) {
            paths.setAttributeNS(null, 'mask', "url(#text-mask-" + this.opts.id + ")");
        }
        else {
            paths.setAttributeNS(null, 'mask', 'url(#text-mask)');
        }
        if (this.svg) {
            this.svg.appendChild(defs);
            this.svg.appendChild(masks);
            this.svg.appendChild(style);
            this.svg.appendChild(paths);
            this.svg.appendChild(vertices);
            return this.svg;
        }
        else {
            var container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            container.appendChild(defs);
            container.appendChild(masks);
            container.appendChild(style);
            container.appendChild(paths);
            container.appendChild(vertices);
            return container;
        }
    };
    /**
     * Create a linear gradient to apply to a line
     *
     * @param {Line} line the line to apply the gradiation to.
     */
    SvgWrapper.prototype.createGradient = function (line) {
        // create the gradient and add it
        var gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient'), gradientUrl = "line-" + this.gradientId++, l = line.getLeftVector(), r = line.getRightVector(), fromX = l.x + this.offsetX, fromY = l.y + this.offsetY, toX = r.x + this.offsetX, toY = r.y + this.offsetY;
        if (this.opts.id) {
            gradientUrl = "line-" + this.opts.id + "-" + this.gradientId++;
        }
        gradient.setAttributeNS(null, 'id', gradientUrl);
        gradient.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
        gradient.setAttributeNS(null, 'x1', fromX);
        gradient.setAttributeNS(null, 'y1', fromY);
        gradient.setAttributeNS(null, 'x2', toX);
        gradient.setAttributeNS(null, 'y2', toY);
        var firstColor = this.opts.disableGradient
            ? this.themeManager.getColor(this.themeManager.getColor('C'))
            : this.themeManager.getColor(line.getLeftElement()) || this.themeManager.getColor('C');
        var secondColor = this.opts.disableGradient
            ? this.themeManager.getColor(this.themeManager.getColor('C'))
            : this.themeManager.getColor(line.getRightElement() || this.themeManager.getColor('C'));
        var firstStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        firstStop.setAttributeNS(null, 'stop-color', firstColor);
        firstStop.setAttributeNS(null, 'offset', '20%');
        var secondStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        secondStop.setAttributeNS(null, 'stop-color', secondColor);
        secondStop.setAttributeNS(null, 'offset', '100%');
        gradient.appendChild(firstStop);
        gradient.appendChild(secondStop);
        this.gradients.push(gradient);
        return gradientUrl;
    };
    /**
     * Create a tspan element for sub or super scripts that styles the text
     * appropriately as one of those text types.
     *
     * @param {String} text the actual text
     * @param {String} shift the type of text, either 'sub', or 'super'
     */
    SvgWrapper.prototype.createSubSuperScripts = function (text, shift) {
        var subClassName = this.opts.id ? 'sub-' + this.opts.id : 'sub';
        var elem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        elem.setAttributeNS(null, 'baseline-shift', shift);
        elem.appendChild(document.createTextNode(text));
        elem.setAttributeNS(null, 'class', subClassName);
        return elem;
    };
    /**
     * Determine drawing dimensiosn based on vertex positions.
     *
     * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
     */
    SvgWrapper.prototype.determineDimensions = function (vertices) {
        // Figure out the final size of the image
        var maxX = -Number.MAX_VALUE;
        var maxY = -Number.MAX_VALUE;
        var minX = Number.MAX_VALUE;
        var minY = Number.MAX_VALUE;
        for (var i = 0; i < vertices.length; i++) {
            if (!vertices[i].value.isDrawn) {
                continue;
            }
            var p = vertices[i].position;
            if (maxX < p.x)
                maxX = p.x;
            if (maxY < p.y)
                maxY = p.y;
            if (minX > p.x)
                minX = p.x;
            if (minY > p.y)
                minY = p.y;
        }
        // Add padding
        var padding = this.opts.padding;
        maxX += padding * 4;
        maxY += padding * 2;
        minX -= padding * 4;
        minY -= padding * 2;
        this.drawingWidth = maxX - minX;
        this.drawingHeight = maxY - minY;
        // let scaleX = this.svg.clientWidth
        //   ? this.svg.clientWidth / this.drawingWidth
        //   : this.opts.width / this.drawingWidth;
        // let scaleY = this.svg.clientHeight
        //   ? this.svg.clientHeight / this.drawingHeight
        //   : this.opts.height / this.drawingHeight;
        // let scale = (scaleX < scaleY) ? scaleX : scaleY;
        var viewBoxDim = Math.round(this.drawingWidth > this.drawingHeight ? this.drawingWidth : this.drawingHeight);
        // this.svg.setAttributeNS(null, 'viewBox', `0 0 ${viewBoxDim} ${viewBoxDim}`);
        this.svg.setAttributeNS(null, 'viewBox', "0 0 " + viewBoxDim + " " + this.drawingHeight);
        this.offsetX = -minX;
        this.offsetY = -minY;
        // Center
        // if (scaleX < scaleY) {
        //   if (this.svg.clientHeight ) {
        //     this.offsetY += this.svg.clientHeight / (2.0 * scale) - this.drawingHeight / 2.0;
        //   } else {
        //     this.offsetY += this.opts.height / (2.0 * scale) - this.drawingHeight / 2.0;
        //   }
        // } else {
        //   if (this.svg.clientWidth) {
        //     this.offsetX += this.svg.clientWidth / (2.0 * scale) - this.drawingWidth / 2.0;
        //   } else {
        //     this.offsetX += this.opts.width / (2.0 * scale) - this.drawingWidth / 2.0;
        //   }
        //
        // }
    };
    /**
     * Draw an svg ellipse as a ball.
     *
     * @param {Number} x The x position of the text.
     * @param {Number} y The y position of the text.
     * @param {String} elementName The name of the element (single-letter).
     */
    SvgWrapper.prototype.drawBall = function (x, y, elementName) {
        var ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttributeNS(null, 'cx', x + this.offsetX);
        ball.setAttributeNS(null, 'cy', y + this.offsetY);
        ball.setAttributeNS(null, 'r', (this.opts.bondLength / 4.5).toString());
        ball.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
        this.vertices.push(ball);
    };
    /**
     * Draw a dashed wedge on the canvas.
     *
     * @param {Line} line A line.
     */
    SvgWrapper.prototype.drawDashedWedge = function (line) {
        if (isNaN(line.from.x) || isNaN(line.from.y) ||
            isNaN(line.to.x) || isNaN(line.to.y)) {
            return;
        }
        var 
        // offsetX = this.offsetX,
        // offsetY = this.offsetY,
        l = line.getLeftVector().clone(), r = line.getRightVector().clone(), normals = Vector2_1.default.normals(l, r);
        normals[0].normalize();
        normals[1].normalize();
        var isRightChiralCenter = line.getRightChiral(), start, end;
        if (isRightChiralCenter) {
            start = r;
            end = l;
        }
        else {
            start = l;
            end = r;
        }
        var dir = Vector2_1.default.subtract(end, start).normalize(), length = line.getLength(), step = 1.25 / (length / (this.opts.bondThickness * 3.0));
        // changed = false;
        var gradient = this.createGradient(line);
        for (var t = 0.0; t < 1.0; t += step) {
            var to = Vector2_1.default.multiplyScalar(dir, t * length), startDash = Vector2_1.default.add(start, to), width = 1.5 * t, dashOffset = Vector2_1.default.multiplyScalar(normals[0], width);
            startDash.subtract(dashOffset);
            var endDash = startDash.clone();
            endDash.add(Vector2_1.default.multiplyScalar(dashOffset, 2.0));
            this.drawLine(new Line_1.default(startDash, endDash), null, gradient);
        }
    };
    /**
     * Draws a debug dot at a given coordinate and adds text.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordindate.
     * @param {String} [debugText=''] A string.
     * @param {String} [color='#f00'] A color in hex form.
     */
    SvgWrapper.prototype.drawDebugPoint = function (x, y, debugText, color) {
        if (debugText === void 0) { debugText = ''; }
        if (color === void 0) { color = '#f00'; }
        var point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttributeNS(null, 'cx', x + this.offsetX);
        point.setAttributeNS(null, 'cy', y + this.offsetY);
        point.setAttributeNS(null, 'r', '2');
        point.setAttributeNS(null, 'fill', '#f00');
        this.vertices.push(point);
        this.drawDebugText(x, y, debugText);
    };
    /**
     * Draws a debug text message at a given position
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {String} text The debug text.
     */
    SvgWrapper.prototype.drawDebugText = function (x, y, text) {
        var color = this.opts.disableColors
            ? this.themeManager.getColor('C')
            : '#ff0000';
        var textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttributeNS(null, 'x', x + this.offsetX);
        textElem.setAttributeNS(null, 'y', y + this.offsetY);
        textElem.setAttributeNS(null, 'class', 'debug');
        textElem.setAttributeNS(null, 'fill', color);
        textElem.setAttributeNS(null, 'style', "\n                font: 5px Droid Sans, sans-serif;\n            ");
        textElem.appendChild(document.createTextNode(text));
        this.vertices.push(textElem);
    };
    /**
     * Draws a line.
     *
     * @param {Line} line A line.
     * @param {Boolean} dashed defaults to false.
     * @param {String} gradient gradient url. Defaults to null.
     */
    SvgWrapper.prototype.drawLine = function (line, dashed, gradient) {
        if (dashed === void 0) { dashed = false; }
        if (gradient === void 0) { gradient = null; }
        var 
        // opts = this.opts,
        stylesArr = [
            ['stroke-linecap', 'round'],
            ['stroke-dasharray', dashed ? '5, 5' : 'none'],
            ['stroke-width', this.opts.bondThickness],
        ], l = line.getLeftVector(), r = line.getRightVector(), fromX = l.x + this.offsetX, fromY = l.y + this.offsetY, toX = r.x + this.offsetX, toY = r.y + this.offsetY;
        var styles = stylesArr.map(function (sub) { return sub.join(':'); }).join(';'), lineElem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElem.setAttributeNS(null, 'x1', fromX);
        lineElem.setAttributeNS(null, 'y1', fromY);
        lineElem.setAttributeNS(null, 'x2', toX);
        lineElem.setAttributeNS(null, 'y2', toY);
        lineElem.setAttributeNS(null, 'style', styles);
        this.paths.push(lineElem);
        if (gradient == null) {
            // gradient = this.createGradient(line, fromX, fromY, toX, toY);
            gradient = this.createGradient(line);
        }
        lineElem.setAttributeNS(null, 'stroke', "url('#" + gradient + "')");
    };
    /**
     * Draw a point.
     *
     * @param {Number} x The x position of the point.
     * @param {Number} y The y position of the point.
     * @param {String} elementName The name of the element (single-letter).
     */
    SvgWrapper.prototype.drawPoint = function (x, y, elementName) {
        // let ctx = this.ctx;
        var offsetX = this.offsetX;
        var offsetY = this.offsetY;
        // first create a mask
        var mask = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        mask.setAttributeNS(null, 'cx', x + offsetX);
        mask.setAttributeNS(null, 'cy', y + offsetY);
        mask.setAttributeNS(null, 'r', '1.5');
        mask.setAttributeNS(null, 'fill', 'black');
        this.maskElements.push(mask);
        // now create the point
        var point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttributeNS(null, 'cx', x + offsetX);
        point.setAttributeNS(null, 'cy', y + offsetY);
        point.setAttributeNS(null, 'r', '0.75');
        point.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
        this.vertices.push(point);
    };
    /**
     * Draw a text to the canvas.
     *
     * @param {Number} x The x position of the text.
     * @param {Number} y The y position of the text.
     * @param {String} elementName The name of the element (single-letter).
     * @param {Number} hydrogens The number of hydrogen atoms.
     * @param {String} direction The direction of the text in relation to the associated vertex.
     * @param {Boolean} isTerminal A boolean indicating whether or not the vertex is terminal.
     * @param {Number} charge The charge of the atom.
     * @param {Number} isotope The isotope number.
     * @param {Object} attachedPseudoElement A map with containing information for pseudo elements or concatinated elements. The key is comprised of the element symbol and the hydrogen count.
     * @param {String} attachedPseudoElement.element The element symbol.
     * @param {Number} attachedPseudoElement.count The number of occurences that match the key.
     * @param {Number} attachedPseudoElement.hyrogenCount The number of hydrogens attached to each atom matching the key.
     */
    SvgWrapper.prototype.drawText = function (x, y, elementName, hydrogens, direction, isTerminal, charge, isotope, attachedPseudoElement, isCentre) {
        if (attachedPseudoElement === void 0) { attachedPseudoElement = {}; }
        var dFont = this.opts.fontSizeLarge / 2;
        var coeffWidth = Atom_1.getAtomCoefficientForWidth(elementName);
        var radius = dFont + dFont / this.opts.dCircle;
        radius += (direction === 'down' || direction === 'up') && coeffWidth !== -1
            ? direction === 'down'
                ? dFont / (2 * coeffWidth)
                : dFont / coeffWidth
            : 0;
        var elementClassName = this.opts.id ? 'element-' + this.opts.id : 'element';
        var offsetX = this.offsetX, offsetY = this.offsetY, pos = {
            x: x + offsetX,
            y: y + offsetY,
        }, textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text'), writingMode = 'horizontal-tb', letterSpacing = 'normal', textOrientation = 'mixed', textDirection = 'direction: ltr;', xShift = -dFont, yShift = dFont;
        var writingModeOld = this.opts.supportSvg1
            ? 'rl-tb'
            : '';
        var textOrientationOld = '';
        var mask = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        mask.setAttributeNS(null, 'cx', pos.x);
        mask.setAttributeNS(null, 'cy', pos.y);
        mask.setAttributeNS(null, 'r', (radius).toString());
        mask.setAttributeNS(null, 'fill', 'black');
        this.maskElements.push(mask);
        // determine writing mode
        if (/up|down/.test(direction) && !isTerminal) {
            writingMode = 'vertical-rl';
            textOrientation = 'upright';
            writingModeOld = this.opts.supportSvg1
                ? 'tb'
                : '';
            textOrientationOld = 'glyph-orientation-vertical: 0;'; // Need for Arora
            letterSpacing = '-1px';
        }
        if (direction === 'down' && (!isTerminal || isCentre || elementName.length === 2)) {
            xShift = 0;
            if (elementName.length === 2) {
                yShift = dFont;
            }
            else {
                yShift = -dFont - dFont / 2;
            }
        }
        else if (direction === 'up' && !isTerminal) {
            xShift = 0;
            if (isCentre && elementName.length === 2) {
                yShift = dFont;
            }
            else {
                if (elementName.length === 2) {
                    yShift = dFont;
                }
                else {
                    yShift += dFont / 2;
                }
            }
        }
        else if (direction === 'left') {
            xShift = dFont;
        }
        else if (direction === 'right') {
            if (isCentre && elementName.length === 2) {
                xShift -= dFont / 2;
            }
            else {
                xShift += dFont / 4;
            }
        }
        if (direction === 'left' || (direction === 'up' && !isTerminal)) {
            textDirection = 'direction: rtl; unicode-bidi: bidi-override;';
        }
        // now the text element
        textElem.setAttributeNS(null, 'x', pos.x + xShift);
        textElem.setAttributeNS(null, 'y', pos.y + yShift);
        textElem.setAttributeNS(null, 'class', elementClassName);
        textElem.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
        if (this.opts.supportSvg1
            && (writingModeOld || textOrientationOld)) {
            textElem.setAttributeNS(null, 'style', "\n                  text-anchor: start;\n                  writing-mode: " + writingModeOld + ";\n                  " + (textOrientationOld ? textOrientationOld : '') + "\n                  writing-mode: " + writingMode + ";\n                  text-orientation: " + textOrientation + ";\n                  letter-spacing: " + letterSpacing + ";\n                  " + textDirection + "\n              ");
        }
        else {
            textElem.setAttributeNS(null, 'style', "\n                text-anchor: start;\n                writing-mode: " + writingMode + ";\n                text-orientation: " + textOrientation + ";\n                letter-spacing: " + letterSpacing + ";\n                " + textDirection + "\n            ");
        }
        var textNode = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        // special case for element names that are 2 letters
        if (elementName.length > 1) {
            var textAnchor = /up|down/.test(direction) ? 'middle' : 'start';
            textNode.setAttributeNS(null, 'style', "\n                unicode-bidi: plaintext;\n                writing-mode: lr-tb;\n                letter-spacing: normal;\n                text-anchor: " + textAnchor + ";\n            ");
        }
        var isAdded = false;
        if (this.opts.supportSvg1
            && hydrogens === 1 && (direction === 'left' || (direction === 'up' && !isTerminal))) {
            if (direction === 'up' && !isTerminal) {
                textNode.appendChild(document.createTextNode('H' + elementName));
            }
            else {
                textNode.appendChild(document.createTextNode(elementName + 'H'));
            }
            isAdded = true;
        }
        else {
            textNode.appendChild(document.createTextNode(elementName));
        }
        textElem.appendChild(textNode);
        // Charge
        if (charge) {
            var chargeElem = this.createSubSuperScripts(UtilityFunctions_1.getChargeText(charge), 'super');
            textNode.appendChild(chargeElem);
        }
        // let isotopeText = '0';
        if (isotope > 0) {
            var isotopeElem = this.createSubSuperScripts(isotope.toString(), 'super');
            textNode.appendChild(isotopeElem);
        }
        // TODO: Better handle exceptions
        // Exception for nitro (draw nitro as NO2 instead of N+O-O)
        if (charge === 1 && elementName === 'N' && attachedPseudoElement.hasOwnProperty('0O') &&
            attachedPseudoElement.hasOwnProperty('0O-1')) {
            attachedPseudoElement = {
                '0O': {
                    element: 'O',
                    count: 2,
                    hydrogenCount: 0,
                    previousElement: 'C',
                    charge: ''
                }
            };
            charge = 0;
        }
        if (!isAdded && hydrogens > 0) {
            var hydrogenElem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            hydrogenElem.setAttributeNS(null, 'style', 'unicode-bidi: plaintext;');
            hydrogenElem.appendChild(document.createTextNode('H'));
            textElem.appendChild(hydrogenElem);
            if (hydrogens > 1) {
                var hydrogenCountElem = this.createSubSuperScripts(hydrogens, 'sub');
                hydrogenElem.appendChild(hydrogenCountElem);
            }
        }
        for (var key in attachedPseudoElement) {
            if (!attachedPseudoElement.hasOwnProperty(key)) {
                continue;
            }
            var element = attachedPseudoElement[key].element, elementCount = attachedPseudoElement[key].count, hydrogenCount = attachedPseudoElement[key].hydrogenCount, elementCharge = attachedPseudoElement[key].charge, pseudoElementElem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            pseudoElementElem.setAttributeNS(null, 'style', 'unicode-bidi: plaintext;');
            pseudoElementElem.appendChild(document.createTextNode(element));
            pseudoElementElem.setAttributeNS(null, 'fill', this.themeManager.getColor(element));
            if (elementCharge !== 0) {
                var elementChargeElem = this.createSubSuperScripts(UtilityFunctions_1.getChargeText(elementCharge), 'super');
                pseudoElementElem.appendChild(elementChargeElem);
            }
            if (hydrogenCount > 0) {
                var pseudoHydrogenElem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                pseudoHydrogenElem.setAttributeNS(null, 'style', 'unicode-bidi: plaintext;');
                pseudoHydrogenElem.appendChild(document.createTextNode('H'));
                pseudoElementElem.appendChild(pseudoHydrogenElem);
                if (hydrogenCount > 1) {
                    var hydrogenCountElem = this.createSubSuperScripts(hydrogenCount, 'sub');
                    pseudoHydrogenElem.appendChild(hydrogenCountElem);
                }
            }
            if (elementCount > 1) {
                var elementCountElem = this.createSubSuperScripts(elementCount, 'sub');
                pseudoElementElem.appendChild(elementCountElem);
            }
            textElem.appendChild(pseudoElementElem);
        }
        this.vertices.push(textElem);
    };
    /**
     * @param {Line} line the line object to create the wedge from
     */
    SvgWrapper.prototype.drawWedge = function (line) {
        var offsetX = this.offsetX, offsetY = this.offsetY, l = line.getLeftVector().clone(), r = line.getRightVector().clone();
        l.x += offsetX;
        l.y += offsetY;
        r.x += offsetX;
        r.y += offsetY;
        var normals = Vector2_1.default.normals(l, r);
        normals[0].normalize();
        normals[1].normalize();
        var isRightChiralCenter = line.getRightChiral();
        var start = l, end = r;
        if (isRightChiralCenter) {
            start = r;
            end = l;
        }
        var t = Vector2_1.default.add(start, Vector2_1.default.multiplyScalar(normals[0], this.halfBondThickness)), u = Vector2_1.default.add(end, Vector2_1.default.multiplyScalar(normals[0], 1.5 + this.halfBondThickness)), v = Vector2_1.default.add(end, Vector2_1.default.multiplyScalar(normals[1], 1.5 + this.halfBondThickness)), w = Vector2_1.default.add(start, Vector2_1.default.multiplyScalar(normals[1], this.halfBondThickness));
        var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'), 
        // gradient = this.createGradient(line, l.x, l.y, r.x, r.y);
        gradient = this.createGradient(line);
        polygon.setAttributeNS(null, 'points', t.x + "," + t.y + " " + u.x + "," + u.y + " " + v.x + "," + v.y + " " + w.x + "," + w.y);
        polygon.setAttributeNS(null, 'fill', "url('#" + gradient + "')");
        this.paths.push(polygon);
    };
    /**
     * Draws a ring inside a provided ring, indicating aromaticity.
     *
     * @param {Ring} ring A ring.
     */
    SvgWrapper.prototype.drawAromaticityRing = function (ring) {
        var ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        var radius = MathHelper_1.default.apothemFromSideLength(this.opts.bondLength, ring.getSize());
        ball.setAttributeNS(null, 'cx', ring.center.x + this.offsetX);
        ball.setAttributeNS(null, 'cy', ring.center.y + this.offsetY);
        ball.setAttributeNS(null, 'r', (radius - this.opts.bondSpacing).toString());
        ball.setAttributeNS(null, 'stroke', this.themeManager.getColor('C'));
        ball.setAttributeNS(null, 'stroke-width', this.opts.bondThickness);
        ball.setAttributeNS(null, 'fill', 'transparent');
        this.vertices.push(ball);
    };
    return SvgWrapper;
}());
exports.default = SvgWrapper;
//# sourceMappingURL=SvgWrapper.js.map