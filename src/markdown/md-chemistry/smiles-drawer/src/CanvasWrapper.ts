import MathHelper from './MathHelper';
import Vector2 from './Vector2';
// import Line from './Line';
// import Vertex from './Vertex';
// import Ring from './Ring';
import { getChargeText } from './UtilityFunctions';

/**
 * A class wrapping a canvas element.
 *
 * @property {HTMLElement} canvas The HTML element for the canvas associated with this CanvasWrapper instance.
 * @property {CanvasRenderingContext2D} ctx The CanvasRenderingContext2D of the canvas associated with this CanvasWrapper instance.
 * @property {Object} colors The colors object as defined in the SmilesDrawer options.
 * @property {Object} opts The SmilesDrawer options.
 * @property {Number} drawingWidth The width of the canvas.
 * @property {Number} drawingHeight The height of the canvas.
 * @property {Number} offsetX The horizontal offset required for centering the drawing.
 * @property {Number} offsetY The vertical offset required for centering the drawing.
 * @property {Number} fontLarge The large font size in pt.
 * @property {Number} fontSmall The small font size in pt.
 */
class CanvasWrapper {
	public canvas: any;
	public ctx: any;
	public themeManager: any;
	public opts: any;
	public drawingWidth: any;
	public drawingHeight: any;
	public offsetX: any;
	public offsetY: any;
	public fontLarge: any;
	public fontSmall: any;
	public hydrogenWidth: any;
	public halfHydrogenWidth: any;
	public halfBondThickness: any;
	public devicePixelRatio: any;
	public backingStoreRatio: any;
	public ratio: any;
	public colors: any;

    /**
     * The constructor for the class CanvasWrapper.
     *
     * @param {(String|HTMLElement)} target The canvas id or the canvas HTMLElement.
     * @param {ThemeManager} themeManager Theme manager for setting proper colors.
     * @param {Object} options The smiles drawer options object.
     */
    constructor(target, themeManager, options) {
        if (typeof target === 'string' || target instanceof String) {
            this.canvas = document.getElementById(target.toString());
        } else {
            this.canvas = target;
        }

        this.ctx = this.canvas.getContext('2d');
        this.themeManager = themeManager;
        this.opts = options;
        this.drawingWidth = 0.0;
        this.drawingHeight = 0.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;

        this.fontLarge = this.opts.fontSizeLarge + 'pt Helvetica, Arial, sans-serif';
        this.fontSmall = this.opts.fontSizeSmall + 'pt Helvetica, Arial, sans-serif';

        this.updateSize(this.opts.width, this.opts.height);

        this.ctx.font = this.fontLarge;
        this.hydrogenWidth = this.ctx.measureText('H').width;
        this.halfHydrogenWidth = this.hydrogenWidth / 2.0;
        this.halfBondThickness = this.opts.bondThickness / 2.0;

        // TODO: Find out why clear was here.
        // this.clear();
    }

    /**
     * Update the width and height of the canvas
     *
     * @param {Number} width
     * @param {Number} height
     */
    updateSize(width, height) {
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio ||
            this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio ||
            this.ctx.backingStorePixelRatio || 1;
        this.ratio = this.devicePixelRatio / this.backingStoreRatio;

        if (this.ratio !== 1) {
            this.canvas.width = width * this.ratio;
            this.canvas.height = height * this.ratio;
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            this.ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        } else {
            this.canvas.width = width * this.ratio;
            this.canvas.height = height * this.ratio;
        }
    }

    /**
     * Sets a provided theme.
     *
     * @param {Object} theme A theme from the smiles drawer options.
     */
    setTheme(theme) {
        this.colors = theme;
    }

    /**
     * Scale the canvas based on vertex positions.
     *
     * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
     */
    scale(vertices) {
        // Figure out the final size of the image
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;

        for (var i = 0; i < vertices.length; i++) {
            if (!vertices[i].value.isDrawn) {
                continue;
            }

            let p = vertices[i].position;

            if (maxX < p.x) maxX = p.x;
            if (maxY < p.y) maxY = p.y;
            if (minX > p.x) minX = p.x;
            if (minY > p.y) minY = p.y;
        }

        // Add padding
        var padding = this.opts.padding;
        maxX += padding;
        maxY += padding;
        minX -= padding;
        minY -= padding;

        this.drawingWidth = maxX - minX;
        this.drawingHeight = maxY - minY;

        var scaleX = this.canvas.offsetWidth / this.drawingWidth;
        var scaleY = this.canvas.offsetHeight / this.drawingHeight;

        var scale = (scaleX < scaleY) ? scaleX : scaleY;

        this.ctx.scale(scale, scale);

        this.offsetX = -minX;
        this.offsetY = -minY;

        // Center
        if (scaleX < scaleY) {
            this.offsetY += this.canvas.offsetHeight / (2.0 * scale) - this.drawingHeight / 2.0;
        } else {
            this.offsetX += this.canvas.offsetWidth / (2.0 * scale) - this.drawingWidth / 2.0;
        }
    }

    /**
     * Resets the transform of the canvas.
     */
    reset() {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    /**
     * Returns the hex code of a color associated with a key from the current theme.
     *
     * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
     * @returns {String} A color hex value.
     */
    getColor(key) {
        key = key.toUpperCase();

        if (key in this.colors) {
            return this.colors[key];
        }

        return this.colors['C'];
    }

    /**
     * Draws a circle to a canvas context.
     * @param {Number} x The x coordinate of the circles center.
     * @param {Number} y The y coordinate of the circles center.
     * @param {Number} radius The radius of the circle
     * @param {String} color A hex encoded color.
     * @param {Boolean} [fill=true] Whether to fill or stroke the circle.
     * @param {Boolean} [debug=false] Draw in debug mode.
     * @param {String} [debugText=''] A debug message.
     */
    drawCircle(x, y, radius, color, fill = true, debug = false, debugText = '') {
        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, radius, 0, MathHelper.twoPI, true);
        ctx.closePath();

        if (debug) {
            if (fill) {
                ctx.fillStyle = '#f00';
                ctx.fill();
            } else {
                ctx.strokeStyle = '#f00';
                ctx.stroke();
            }

            this.drawDebugText(x, y, debugText);
        } else {
            if (fill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    /**
     * Draw a line to a canvas.
     *
     * @param {Line} line A line.
     * @param {Boolean} [dashed=false] Whether or not the line is dashed.
     * @param {Number} [alpha=1.0] The alpha value of the color.
     */
    drawLine(line, dashed = false, alpha = 1.0) {
        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        // Add a shadow behind the line
        let shortLine = line.clone().shorten(4.0);

        let l = shortLine.getLeftVector().clone();
        let r = shortLine.getRightVector().clone();

        l.x += offsetX;
        l.y += offsetY;

        r.x += offsetX;
        r.y += offsetY;

        // Draw the "shadow"
        if (!dashed) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.moveTo(l.x, l.y);
            ctx.lineTo(r.x, r.y);
            ctx.lineCap = 'round';
            ctx.lineWidth = this.opts.bondThickness + 1.2;
            ctx.strokeStyle = this.themeManager.getColor('BACKGROUND');
            ctx.stroke();
            ctx.globalCompositeOperation = 'source-over';
            ctx.restore();
        }

        l = line.getLeftVector().clone();
        r = line.getRightVector().clone();

        l.x += offsetX;
        l.y += offsetY;

        r.x += offsetX;
        r.y += offsetY;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(r.x, r.y);
        ctx.lineCap = 'round';
        ctx.lineWidth = this.opts.bondThickness;

        let gradient = this.ctx.createLinearGradient(l.x, l.y, r.x, r.y);
        gradient.addColorStop(0.4, this.themeManager.getColor(line.getLeftElement()) ||
            this.themeManager.getColor('C'));
        gradient.addColorStop(0.6, this.themeManager.getColor(line.getRightElement()) ||
            this.themeManager.getColor('C'));

        if (dashed) {
            ctx.setLineDash([1, 1.5]);
            ctx.lineWidth = this.opts.bondThickness / 1.5;
        }

        if (alpha < 1.0) {
            ctx.globalAlpha = alpha;
        }

        ctx.strokeStyle = gradient;

        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draw a wedge on the canvas.
     *
     * @param {Line} line A line.
     * @param {Number} width The wedge width.
     */
    drawWedge(line, width = 1.0) {
        if (isNaN(line.from.x) || isNaN(line.from.y) ||
            isNaN(line.to.x) || isNaN(line.to.y)) {
            return;
        }

        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        // Add a shadow behind the line
        let shortLine = line.clone().shorten(5.0);

        let l = shortLine.getLeftVector().clone();
        let r = shortLine.getRightVector().clone();

        l.x += offsetX;
        l.y += offsetY;

        r.x += offsetX;
        r.y += offsetY;

        l = line.getLeftVector().clone();
        r = line.getRightVector().clone();

        l.x += offsetX;
        l.y += offsetY;

        r.x += offsetX;
        r.y += offsetY;

        ctx.save();

        let normals = Vector2.normals(l, r);

        normals[0].normalize();
        normals[1].normalize();

        let isRightChiralCenter = line.getRightChiral();

        let start = l;
        let end = r;

        if (isRightChiralCenter) {
            start = r;
            end = l;
        }

        let t = Vector2.add(start, Vector2.multiplyScalar(normals[0], this.halfBondThickness));
        let u = Vector2.add(end, Vector2.multiplyScalar(normals[0], 1.5 + this.halfBondThickness));
        let v = Vector2.add(end, Vector2.multiplyScalar(normals[1], 1.5 + this.halfBondThickness));
        let w = Vector2.add(start, Vector2.multiplyScalar(normals[1], this.halfBondThickness));

        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(u.x, u.y);
        ctx.lineTo(v.x, v.y);
        ctx.lineTo(w.x, w.y);

        let gradient = this.ctx.createRadialGradient(r.x, r.y, this.opts.bondLength, r.x, r.y, 0);
        gradient.addColorStop(0.4, this.themeManager.getColor(line.getLeftElement()) ||
            this.themeManager.getColor('C'));
        gradient.addColorStop(0.6, this.themeManager.getColor(line.getRightElement()) ||
            this.themeManager.getColor('C'));

        ctx.fillStyle = gradient;

        ctx.fill();
        ctx.restore();
    }

    /**
     * Draw a dashed wedge on the canvas.
     *
     * @param {Line} line A line.
     */
    drawDashedWedge(line) {
        if (isNaN(line.from.x) || isNaN(line.from.y) ||
            isNaN(line.to.x) || isNaN(line.to.y)) {
            return;
        }

        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        let l = line.getLeftVector().clone();
        let r = line.getRightVector().clone();

        l.x += offsetX;
        l.y += offsetY;

        r.x += offsetX;
        r.y += offsetY;

        ctx.save();

        let normals = Vector2.normals(l, r);

        normals[0].normalize();
        normals[1].normalize();


        let isRightChiralCenter = line.getRightChiral();

        let start;
        let end;
        let sStart;
        let sEnd;

        let shortLine = line.clone();

        if (isRightChiralCenter) {
            start = r;
            end = l;

            shortLine.shortenRight(1.0);

            sStart = shortLine.getRightVector().clone();
            sEnd = shortLine.getLeftVector().clone();
        } else {
            start = l;
            end = r;

            shortLine.shortenLeft(1.0);

            sStart = shortLine.getLeftVector().clone();
            sEnd = shortLine.getRightVector().clone();
        }

        sStart.x += offsetX;
        sStart.y += offsetY;
        sEnd.x += offsetX;
        sEnd.y += offsetY;

        let dir = Vector2.subtract(end, start).normalize();
        ctx.strokeStyle = this.themeManager.getColor('C');
        ctx.lineCap = 'round';
        ctx.lineWidth = this.opts.bondThickness;
        ctx.beginPath();
        let length = line.getLength();
        let step = 1.25 / (length / (this.opts.bondThickness * 3.0));

        let changed = false;
        for (var t = 0.0; t < 1.0; t += step) {
            let to = Vector2.multiplyScalar(dir, t * length);
            let startDash = Vector2.add(start, to);
            let width = 1.5 * t;
            let dashOffset = Vector2.multiplyScalar(normals[0], width);

            if (!changed && t > 0.5) {
              ctx.stroke();
              ctx.beginPath();
              ctx.strokeStyle = this.themeManager.getColor(line.getRightElement()) || this.themeManager.getColor('C');
                changed = true;
            }

            startDash.subtract(dashOffset);
            ctx.moveTo(startDash.x, startDash.y);
            startDash.add(Vector2.multiplyScalar(dashOffset, 2.0));
            ctx.lineTo(startDash.x, startDash.y);
        }

        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws a debug text message at a given position
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {String} text The debug text.
     */
    drawDebugText(x, y, text) {
        let ctx = this.ctx;

        ctx.save();
        ctx.font = '5px Droid Sans, sans-serif';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#ff0000';
        ctx.fillText(text, x + this.offsetX, y + this.offsetY);
        ctx.restore();
    }

    /**
     * Draw a ball to the canvas.
     *
     * @param {Number} x The x position of the text.
     * @param {Number} y The y position of the text.
     * @param {String} elementName The name of the element (single-letter).
     */
    drawBall(x, y, elementName) {
        let ctx = this.ctx;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + this.offsetX, y + this.offsetY, this.opts.bondLength / 4.5, 0, MathHelper.twoPI, false);
        ctx.fillStyle = this.themeManager.getColor(elementName);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Draw a point to the canvas.
     *
     * @param {Number} x The x position of the point.
     * @param {Number} y The y position of the point.
     * @param {String} elementName The name of the element (single-letter).
     */
    drawPoint(x, y, elementName) {
        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, 1.5, 0, MathHelper.twoPI, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        ctx.beginPath();
        ctx.arc(x + this.offsetX, y + this.offsetY, 0.75, 0, MathHelper.twoPI, false);
        ctx.fillStyle = this.themeManager.getColor(elementName);
        ctx.fill();
        ctx.restore();
    }

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
    drawText(x, y, elementName, hydrogens, direction, isTerminal, charge, isotope, attachedPseudoElement = {}) {
        let ctx = this.ctx;
        let offsetX = this.offsetX;
        let offsetY = this.offsetY;

        ctx.save();

        ctx.textAlign = 'start';
        ctx.textBaseline = 'alphabetic';

        let pseudoElementHandled = false;

        // Charge
        let chargeText = ''
        let chargeWidth = 0;

        if (charge) {
            chargeText = getChargeText(charge);

            ctx.font = this.fontSmall;
            chargeWidth = ctx.measureText(chargeText).width;
        }

        let isotopeText = '0';
        let isotopeWidth = 0;

        if (isotope > 0) {
            isotopeText = isotope.toString();
            ctx.font = this.fontSmall;
            isotopeWidth = ctx.measureText(isotopeText).width;
        }


        // TODO: Better handle exceptions
        // Exception for nitro (draw nitro as NO2 instead of N+O-O)
        if (charge === 1 && elementName === 'N' && attachedPseudoElement.hasOwnProperty('0O') &&
            attachedPseudoElement.hasOwnProperty('0O-1')) {
            attachedPseudoElement = { '0O': { element: 'O', count: 2, hydrogenCount: 0, previousElement: 'C', charge: '' } }
            charge = 0;
        }


        ctx.font = this.fontLarge;
        ctx.fillStyle = this.themeManager.getColor('BACKGROUND');

        let dim = ctx.measureText(elementName);

        dim.totalWidth = dim.width + chargeWidth;
        dim.height = parseInt(this.fontLarge, 10);

        let r = (dim.width > this.opts.fontSizeLarge) ? dim.width : this.opts.fontSizeLarge;
        r /= 1.5;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, r, 0, MathHelper.twoPI, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        let cursorPos = -dim.width / 2.0;
        let cursorPosLeft = -dim.width / 2.0;

        ctx.fillStyle = this.themeManager.getColor(elementName);
        ctx.fillText(elementName, x + offsetX + cursorPos, y + this.opts.halfFontSizeLarge + offsetY);
        cursorPos += dim.width;

        if (charge) {
            ctx.font = this.fontSmall;
            ctx.fillText(chargeText, x + offsetX + cursorPos, y - this.opts.fifthFontSizeSmall + offsetY);
            cursorPos += chargeWidth;
        }

        if (isotope > 0) {
            ctx.font = this.fontSmall;
            ctx.fillText(isotopeText, x + offsetX + cursorPosLeft - isotopeWidth, y - this.opts.fifthFontSizeSmall + offsetY);
            cursorPosLeft -= isotopeWidth;
        }

        ctx.font = this.fontLarge;

        let hydrogenWidth = 0;
        let hydrogenCountWidth = 0;

        if (hydrogens === 1) {
            let hx = x + offsetX;
            let hy = y + offsetY + this.opts.halfFontSizeLarge;

            hydrogenWidth = this.hydrogenWidth;
            cursorPosLeft -= hydrogenWidth;

            if (direction === 'left') {
                hx += cursorPosLeft;
            } else if (direction === 'right') {
                hx += cursorPos;
            } else if (direction === 'up' && isTerminal) {
                hx += cursorPos;
            } else if (direction === 'down' && isTerminal) {
                hx += cursorPos;
            } else if (direction === 'up' && !isTerminal) {
                hy -= this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                hx -= this.halfHydrogenWidth;
            } else if (direction === 'down' && !isTerminal) {
                hy += this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                hx -= this.halfHydrogenWidth;
            }

            ctx.fillText('H', hx, hy);

            cursorPos += hydrogenWidth;
        } else if (hydrogens > 1) {
            let hx = x + offsetX;
            let hy = y + offsetY + this.opts.halfFontSizeLarge;

            hydrogenWidth = this.hydrogenWidth;
            ctx.font = this.fontSmall;
            hydrogenCountWidth = ctx.measureText(hydrogens).width;
            cursorPosLeft -= hydrogenWidth + hydrogenCountWidth;

            if (direction === 'left') {
                hx += cursorPosLeft;
            } else if (direction === 'right') {
                hx += cursorPos;
            } else if (direction === 'up' && isTerminal) {
                hx += cursorPos;
            } else if (direction === 'down' && isTerminal) {
                hx += cursorPos;
            } else if (direction === 'up' && !isTerminal) {
                hy -= this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                hx -= this.halfHydrogenWidth;
            } else if (direction === 'down' && !isTerminal) {
                hy += this.opts.fontSizeLarge + this.opts.quarterFontSizeLarge;
                hx -= this.halfHydrogenWidth;
            }

            ctx.font = this.fontLarge;
            ctx.fillText('H', hx, hy)

            ctx.font = this.fontSmall;
            ctx.fillText(hydrogens, hx + this.halfHydrogenWidth + hydrogenCountWidth, hy + this.opts.fifthFontSizeSmall);

            cursorPos += hydrogenWidth + this.halfHydrogenWidth + hydrogenCountWidth;
        }

        if (pseudoElementHandled) {
            ctx.restore();
            return;
        }

        for (let key in attachedPseudoElement) {
            if (!attachedPseudoElement.hasOwnProperty(key)) {
                continue;
            }

            let openParenthesisWidth = 0;
            let closeParenthesisWidth = 0;

            let element = attachedPseudoElement[key].element;
            let elementCount = attachedPseudoElement[key].count;
            let hydrogenCount = attachedPseudoElement[key].hydrogenCount;
            let elementCharge = attachedPseudoElement[key].charge;

            ctx.font = this.fontLarge;

            if (elementCount > 1 && hydrogenCount > 0) {
                openParenthesisWidth = ctx.measureText('(').width;
                closeParenthesisWidth = ctx.measureText(')').width;
            }

            let elementWidth = ctx.measureText(element).width;
            let elementCountWidth = 0;

            let elementChargeText = '';
            let elementChargeWidth = 0;

            hydrogenWidth = 0;

            if (hydrogenCount > 0) {
                hydrogenWidth = this.hydrogenWidth;
            }

            ctx.font = this.fontSmall;

            if (elementCount > 1) {
                elementCountWidth = ctx.measureText(elementCount).width;
            }

            if (elementCharge !== 0) {
                elementChargeText = getChargeText(elementCharge);
                elementChargeWidth = ctx.measureText(elementChargeText).width;
            }

            hydrogenCountWidth = 0;

            if (hydrogenCount > 1) {
                hydrogenCountWidth = ctx.measureText(hydrogenCount).width;
            }

            ctx.font = this.fontLarge;

            let hx = x + offsetX;
            let hy = y + offsetY + this.opts.halfFontSizeLarge;

            ctx.fillStyle = this.themeManager.getColor(element);

            if (elementCount > 0) {
                cursorPosLeft -= elementCountWidth;
            }

            if (elementCount > 1 && hydrogenCount > 0) {
                if (direction === 'left') {
                    cursorPosLeft -= closeParenthesisWidth;
                    ctx.fillText(')', hx + cursorPosLeft, hy);
                } else {
                    ctx.fillText('(', hx + cursorPos, hy);
                    cursorPos += openParenthesisWidth;
                }
            }

            if (direction === 'left') {
                cursorPosLeft -= elementWidth;
                ctx.fillText(element, hx + cursorPosLeft, hy)
            } else {
                ctx.fillText(element, hx + cursorPos, hy)
                cursorPos += elementWidth;
            }

            if (hydrogenCount > 0) {
                if (direction === 'left') {
                    cursorPosLeft -= hydrogenWidth + hydrogenCountWidth;
                    ctx.fillText('H', hx + cursorPosLeft, hy)

                    if (hydrogenCount > 1) {
                        ctx.font = this.fontSmall;
                        ctx.fillText(hydrogenCount, hx + cursorPosLeft + hydrogenWidth, hy + this.opts.fifthFontSizeSmall);
                    }
                } else {
                    ctx.fillText('H', hx + cursorPos, hy)
                    cursorPos += hydrogenWidth;

                    if (hydrogenCount > 1) {
                        ctx.font = this.fontSmall;
                        ctx.fillText(hydrogenCount, hx + cursorPos, hy + this.opts.fifthFontSizeSmall);
                        cursorPos += hydrogenCountWidth;
                    }
                }
            }

            ctx.font = this.fontLarge;

            if (elementCount > 1 && hydrogenCount > 0) {
                if (direction === 'left') {
                    cursorPosLeft -= openParenthesisWidth;
                    ctx.fillText('(', hx + cursorPosLeft, hy);
                } else {
                    ctx.fillText(')', hx + cursorPos, hy);
                    cursorPos += closeParenthesisWidth;
                }
            }

            ctx.font = this.fontSmall;

            if (elementCount > 1) {
                if (direction === 'left') {
                    ctx.fillText(elementCount, hx + cursorPosLeft +
                        openParenthesisWidth + closeParenthesisWidth + hydrogenWidth +
                        hydrogenCountWidth + elementWidth, hy + this.opts.fifthFontSizeSmall);
                } else {
                    ctx.fillText(elementCount, hx + cursorPos, hy + this.opts.fifthFontSizeSmall);
                    cursorPos += elementCountWidth;
                }
            }

            if (elementCharge !== 0) {
                if (direction === 'left') {
                    ctx.fillText(elementChargeText, hx + cursorPosLeft +
                        openParenthesisWidth + closeParenthesisWidth + hydrogenWidth +
                        hydrogenCountWidth + elementWidth, y - this.opts.fifthFontSizeSmall + offsetY);
                } else {
                    ctx.fillText(elementChargeText, hx + cursorPos, y - this.opts.fifthFontSizeSmall + offsetY);
                    cursorPos += elementChargeWidth;
                }
            }
        }

        ctx.restore();
    }

    /**
     * Translate the integer indicating the charge to the appropriate text.
     * @param {Number} charge The integer indicating the charge.
     * @returns {String} A string representing a charge.
     */
    getChargeText(charge) {
        if (charge === 1) {
            return '+'
        } else if (charge === 2) {
            return '2+';
        } else if (charge === -1) {
            return '-';
        } else if (charge === -2) {
            return '2-';
        } else {
            return '';
        }
    }

    /**
     * Draws a dubug dot at a given coordinate and adds text.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordindate.
     * @param {String} [debugText=''] A string.
     * @param {String} [color='#f00'] A color in hex form.
     */
    drawDebugPoint(x, y, debugText = '', color = '#f00') {
        this.drawCircle(x, y, 2, color, true, true, debugText);
    }

    /**
     * Draws a ring inside a provided ring, indicating aromaticity.
     *
     * @param {Ring} ring A ring.
     */
    drawAromaticityRing(ring) {
        let ctx = this.ctx;
        let radius = MathHelper.apothemFromSideLength(this.opts.bondLength, ring.getSize());

        ctx.save();
        ctx.strokeStyle = this.themeManager.getColor('C');
        ctx.lineWidth = this.opts.bondThickness;
        ctx.beginPath();
        ctx.arc(ring.center.x + this.offsetX, ring.center.y + this.offsetY,
            radius - this.opts.bondSpacing, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Clear the canvas.
     *
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
    }

}

export default CanvasWrapper;
