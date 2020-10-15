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
declare class CanvasWrapper {
    canvas: any;
    ctx: any;
    themeManager: any;
    opts: any;
    drawingWidth: any;
    drawingHeight: any;
    offsetX: any;
    offsetY: any;
    fontLarge: any;
    fontSmall: any;
    hydrogenWidth: any;
    halfHydrogenWidth: any;
    halfBondThickness: any;
    devicePixelRatio: any;
    backingStoreRatio: any;
    ratio: any;
    colors: any;
    /**
     * The constructor for the class CanvasWrapper.
     *
     * @param {(String|HTMLElement)} target The canvas id or the canvas HTMLElement.
     * @param {ThemeManager} themeManager Theme manager for setting proper colors.
     * @param {Object} options The smiles drawer options object.
     */
    constructor(target: any, themeManager: any, options: any);
    /**
     * Update the width and height of the canvas
     *
     * @param {Number} width
     * @param {Number} height
     */
    updateSize(width: any, height: any): void;
    /**
     * Sets a provided theme.
     *
     * @param {Object} theme A theme from the smiles drawer options.
     */
    setTheme(theme: any): void;
    /**
     * Scale the canvas based on vertex positions.
     *
     * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
     */
    scale(vertices: any): void;
    /**
     * Resets the transform of the canvas.
     */
    reset(): void;
    /**
     * Returns the hex code of a color associated with a key from the current theme.
     *
     * @param {String} key The color key in the theme (e.g. C, N, BACKGROUND, ...).
     * @returns {String} A color hex value.
     */
    getColor(key: any): any;
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
    drawCircle(x: any, y: any, radius: any, color: any, fill?: boolean, debug?: boolean, debugText?: string): void;
    /**
     * Draw a line to a canvas.
     *
     * @param {Line} line A line.
     * @param {Boolean} [dashed=false] Whether or not the line is dashed.
     * @param {Number} [alpha=1.0] The alpha value of the color.
     */
    drawLine(line: any, dashed?: boolean, alpha?: number): void;
    /**
     * Draw a wedge on the canvas.
     *
     * @param {Line} line A line.
     * @param {Number} width The wedge width.
     */
    drawWedge(line: any, width?: number): void;
    /**
     * Draw a dashed wedge on the canvas.
     *
     * @param {Line} line A line.
     */
    drawDashedWedge(line: any): void;
    /**
     * Draws a debug text message at a given position
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {String} text The debug text.
     */
    drawDebugText(x: any, y: any, text: any): void;
    /**
     * Draw a ball to the canvas.
     *
     * @param {Number} x The x position of the text.
     * @param {Number} y The y position of the text.
     * @param {String} elementName The name of the element (single-letter).
     */
    drawBall(x: any, y: any, elementName: any): void;
    /**
     * Draw a point to the canvas.
     *
     * @param {Number} x The x position of the point.
     * @param {Number} y The y position of the point.
     * @param {String} elementName The name of the element (single-letter).
     */
    drawPoint(x: any, y: any, elementName: any): void;
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
    drawText(x: any, y: any, elementName: any, hydrogens: any, direction: any, isTerminal: any, charge: any, isotope: any, attachedPseudoElement?: {}): void;
    /**
     * Translate the integer indicating the charge to the appropriate text.
     * @param {Number} charge The integer indicating the charge.
     * @returns {String} A string representing a charge.
     */
    getChargeText(charge: any): "" | "-" | "+" | "2+" | "2-";
    /**
     * Draws a dubug dot at a given coordinate and adds text.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordindate.
     * @param {String} [debugText=''] A string.
     * @param {String} [color='#f00'] A color in hex form.
     */
    drawDebugPoint(x: any, y: any, debugText?: string, color?: string): void;
    /**
     * Draws a ring inside a provided ring, indicating aromaticity.
     *
     * @param {Ring} ring A ring.
     */
    drawAromaticityRing(ring: any): void;
    /**
     * Clear the canvas.
     *
     */
    clear(): void;
}
export default CanvasWrapper;
