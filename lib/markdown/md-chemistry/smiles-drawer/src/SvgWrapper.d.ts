declare class SvgWrapper {
    svg: any;
    opts: any;
    gradientId: any;
    paths: any;
    vertices: any;
    gradients: any;
    offsetX: any;
    offsetY: any;
    drawingWidth: any;
    drawingHeight: any;
    halfBondThickness: any;
    themeManager: any;
    maskElements: any;
    ctx: any;
    constructor(themeManager: any, target: any, options: any);
    constructSvg(): any;
    /**
     * Create a linear gradient to apply to a line
     *
     * @param {Line} line the line to apply the gradiation to.
     */
    createGradient(line: any): string;
    /**
     * Create a tspan element for sub or super scripts that styles the text
     * appropriately as one of those text types.
     *
     * @param {String} text the actual text
     * @param {String} shift the type of text, either 'sub', or 'super'
     */
    createSubSuperScripts(text: any, shift: any): SVGTSpanElement;
    /**
     * Determine drawing dimensiosn based on vertex positions.
     *
     * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
     */
    determineDimensions(vertices: any): void;
    /**
     * Draw an svg ellipse as a ball.
     *
     * @param {Number} x The x position of the text.
     * @param {Number} y The y position of the text.
     * @param {String} elementName The name of the element (single-letter).
     */
    drawBall(x: any, y: any, elementName: any): void;
    /**
     * Draw a dashed wedge on the canvas.
     *
     * @param {Line} line A line.
     */
    drawDashedWedge(line: any): void;
    /**
     * Draws a debug dot at a given coordinate and adds text.
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordindate.
     * @param {String} [debugText=''] A string.
     * @param {String} [color='#f00'] A color in hex form.
     */
    drawDebugPoint(x: any, y: any, debugText?: string, color?: string): void;
    /**
     * Draws a debug text message at a given position
     *
     * @param {Number} x The x coordinate.
     * @param {Number} y The y coordinate.
     * @param {String} text The debug text.
     */
    drawDebugText(x: any, y: any, text: any): void;
    /**
     * Draws a line.
     *
     * @param {Line} line A line.
     * @param {Boolean} dashed defaults to false.
     * @param {String} gradient gradient url. Defaults to null.
     */
    drawLine(line: any, dashed?: boolean, gradient?: any): void;
    /**
     * Draw a point.
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
    drawText(x: any, y: any, elementName: any, hydrogens: any, direction: any, isTerminal: any, charge: any, isotope: any, attachedPseudoElement: {}, isCentre: any): void;
    /**
     * @param {Line} line the line object to create the wedge from
     */
    drawWedge(line: any): void;
    /**
     * Draws a ring inside a provided ring, indicating aromaticity.
     *
     * @param {Ring} ring A ring.
     */
    drawAromaticityRing(ring: any): void;
}
export default SvgWrapper;
