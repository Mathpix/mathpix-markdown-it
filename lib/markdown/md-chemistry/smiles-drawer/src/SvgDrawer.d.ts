declare class SvgDrawer {
    preprocessor: any;
    themeManager: any;
    svgWrapper: any;
    bridgedRing: any;
    constructor(options: any);
    /**
     * Draws the parsed smiles data to an svg element.
     *
     * @param {Object} data The tree returned by the smiles parser.
     * @param {(String|HTMLElement)} target The id of the HTML svg element the structure is drawn to - or the element itself.
     * @param {String} themeName='dark' The name of the theme to use. Built-in themes are 'light' and 'dark'.
     * @param {Boolean} infoOnly=false Only output info on the molecule without drawing anything to the canvas.
  
     * @returns {Oject} The dimensions of the drawing in { width, height }
     */
    draw(data: any, target: any, themeName?: string, infoOnly?: boolean): any;
    putEdgesForRings(): void;
    putEdgesLForRings(): void;
    checkEdgesRingsOnHaveLine(): void;
    getEdgeBetweenVertexAB(vA: any, vB: any): {
        item: any;
        isBetweenRings: boolean;
    };
    isRing_ONN(ring: any): boolean;
    isRing_NNN(ring: any): boolean;
    isHydrogenVertices(arr: any): boolean;
    findStartNbyEdges(members: any, elements: any): number;
    isThiadiazole(ring: any): boolean;
    vertexHasBondType(vertex: any): boolean;
    neighboursHasDoubleLine(vertex: any, members: any, edgesR: any): void;
    isBridgeCommonRing(ringId: any, vertexA: any, vertexB: any): any;
    drawCommonRing(ringId: any, iEdge: any): void;
    checkNeighboursEdges(edge: any, vertexA: any, vertexB: any): boolean;
    /**
     * Draw the actual edges as bonds.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    drawEdges(debug: any): void;
    /**
     * Draw the an edge as a bond.
     *
     * @param {Number} edgeId An edge id.
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    drawEdge(edgeId: any, debug: any): void;
    /**
     * Draws the vertices representing atoms to the canvas.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug messages to the canvas.
     */
    drawVertices(debug: any): void;
    /**
     * Returns the total overlap score of the current molecule.
     *
     * @returns {Number} The overlap score.
     */
    getTotalOverlapScore(): any;
    /**
     * Returns the molecular formula of the loaded molecule as a string.
     *
     * @returns {String} The molecular formula.
     */
    getMolecularFormula(): any;
    /**
     * @param {Array} normals list of normals to multiply
     * @param {Number} spacing value to multiply normals by
     */
    multiplyNormals(normals: any, spacing: any): void;
}
export default SvgDrawer;