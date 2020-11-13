import Vector2 from './Vector2';
import Ring from './Ring';
export interface IThemeColols {
    C: string;
    O: string;
    N: string;
    F: string;
    CL: string;
    BR: string;
    I: string;
    P: string;
    S: string;
    B: string;
    SI: string;
    H: string;
    BACKGROUND: string;
}
export interface ISmilesOptionsDef {
    width?: number;
    height?: number;
    bondThickness?: number;
    bondLength?: number;
    shortBondLength?: number;
    bondSpacing?: number;
    dCircle?: number;
    atomVisualization?: string;
    ringVisualization?: string;
    ringAromaticVisualization?: string;
    isomeric?: boolean;
    debug?: boolean;
    terminalCarbons?: boolean;
    explicitHydrogens?: boolean;
    overlapSensitivity?: number;
    overlapResolutionIterations?: number;
    compactDrawing?: boolean;
    fontSizeLarge?: number;
    fontSizeSmall?: number;
    padding?: number;
    experimentalSSSR?: boolean;
    kkThreshold?: number;
    kkInnerThreshold?: number;
    kkMaxIteration?: number;
    kkMaxInnerIteration?: number;
    kkMaxEnergy?: number;
    themes?: {
        dark: IThemeColols;
        light: IThemeColols;
    };
}
export interface IOptions extends ISmilesOptionsDef {
    id?: string;
    theme?: string;
    halfBondSpacing?: number;
    bondLengthSq?: number;
    halfFontSizeLarge?: number;
    quarterFontSizeLarge?: number;
    fifthFontSizeSmall?: number;
}
/**
 * The main class of the application representing the smiles drawer
 *
 * @property {Graph} graph The graph associated with this SmilesDrawer.Drawer instance.
 * @property {Number} ringIdCounter An internal counter to keep track of ring ids.
 * @property {Number} ringConnectionIdCounter An internal counter to keep track of ring connection ids.
 * @property {CanvasWrapper} canvasWrapper The CanvasWrapper associated with this SmilesDrawer.Drawer instance.
 * @property {Number} totalOverlapScore The current internal total overlap score.
 * @property {Object} defaultOptions The default options.
 * @property {Object} opts The merged options.
 * @property {Object} theme The current theme.
 */
declare class Drawer {
    graph: any;
    doubleBondConfigCount: any;
    doubleBondConfig: any;
    ringIdCounter: any;
    ringConnectionIdCounter: any;
    canvasWrapper: any;
    totalOverlapScore: any;
    defaultOptions: ISmilesOptionsDef;
    opts: IOptions;
    theme: any;
    infoOnly: any;
    themeManager: any;
    rings: any;
    ringConnections: any;
    bridgedRing: any;
    data: any;
    originalRings: any;
    originalRingConnections: any;
    /**
     * The constructor for the class SmilesDrawer.
     *
     * @param {Object} options An object containing custom values for different options. It is merged with the default options.
     */
    constructor(options: any);
    /**
     * A helper method to extend the default options with user supplied ones.
     */
    extend(): {};
    /**
     * Draws the parsed smiles data to a canvas element.
     *
     * @param {Object} data The tree returned by the smiles parser.
     * @param {(String|HTMLElement)} target The id of the HTML canvas element the structure is drawn to - or the element itself.
     * @param {String} themeName='dark' The name of the theme to use. Built-in themes are 'light' and 'dark'.
     * @param {Boolean} infoOnly=false Only output info on the molecule without drawing anything to the canvas.
     */
    draw(data: any, target: any, themeName?: string, infoOnly?: boolean): void;
    /**
     * Returns the number of rings this edge is a part of.
     *
     * @param {Number} edgeId The id of an edge.
     * @returns {Number} The number of rings the provided edge is part of.
     */
    edgeRingCount(edgeId: any): number;
    /**
     * Returns an array containing the bridged rings associated with this  molecule.
     *
     * @returns {Ring[]} An array containing all bridged rings associated with this molecule.
     */
    getBridgedRings(): any[];
    /**
     * Returns an array containing all fused rings associated with this molecule.
     *
     * @returns {Ring[]} An array containing all fused rings associated with this molecule.
     */
    getFusedRings(): any[];
    /**
     * Returns an array containing all spiros associated with this molecule.
     *
     * @returns {Ring[]} An array containing all spiros associated with this molecule.
     */
    getSpiros(): any[];
    /**
     * Returns a string containing a semicolon and new-line separated list of ring properties: Id; Members Count; Neighbours Count; IsSpiro; IsFused; IsBridged; Ring Count (subrings of bridged rings)
     *
     * @returns {String} A string as described in the method description.
     */
    printRingInfo(): string;
    /**
     * Rotates the drawing to make the widest dimension horizontal.
     */
    rotateDrawing(): void;
    /**
     * Returns the total overlap score of the current molecule.
     *
     * @returns {Number} The overlap score.
     */
    getTotalOverlapScore(): any;
    /**
     * Returns the ring count of the current molecule.
     *
     * @returns {Number} The ring count.
     */
    getRingCount(): any;
    /**
     * Checks whether or not the current molecule  a bridged ring.
     *
     * @returns {Boolean} A boolean indicating whether or not the current molecule  a bridged ring.
     */
    hasBridgedRing(): any;
    /**
     * Returns the number of heavy atoms (non-hydrogen) in the current molecule.
     *
     * @returns {Number} The heavy atom count.
     */
    getHeavyAtomCount(): number;
    /**
     * Returns the molecular formula of the loaded molecule as a string.
     *
     * @returns {String} The molecular formula.
     */
    getMolecularFormula(): string;
    /**
     * Returns the type of the ringbond (e.g. '=' for a double bond). The ringbond represents the break in a ring introduced when creating the MST. If the two vertices supplied as arguments are not part of a common ringbond, the method returns null.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {(String|null)} Returns the ringbond type or null, if the two supplied vertices are not connected by a ringbond.
     */
    getRingbondType(vertexA: any, vertexB: any): any;
    initDraw(data: any, themeName: any, infoOnly: any): void;
    processGraph(): void;
    /**
     * Initializes rings and ringbonds for the current molecule.
     */
    initRings(): void;
    initHydrogens(): void;
    /**
     * Returns all rings connected by bridged bonds starting from the ring with the supplied ring id.
     *
     * @param {Number} ringId A ring id.
     * @returns {Number[]} An array containing all ring ids of rings part of a bridged ring system.
     */
    getBridgedRingRings(ringId: any): any;
    /**
     * Checks whether or not a ring is part of a bridged ring.
     *
     * @param {Number} ringId A ring id.
     * @returns {Boolean} A boolean indicating whether or not the supplied ring (by id) is part of a bridged ring system.
     */
    isPartOfBridgedRing(ringId: any): boolean;
    /**
     * Creates a bridged ring.
     *
     * @param {Number[]} ringIds An array of ids of rings involved in the bridged ring.
     * @param {Number} sourceVertexId The vertex id to start the bridged ring discovery from.
     * @returns {Ring} The bridged ring.
     */
    createBridgedRing(ringIds: any, sourceVertexId: any): Ring;
    /**
     * Checks whether or not two vertices are in the same ring.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {Boolean} A boolean indicating whether or not the two vertices are in the same ring.
     */
    areVerticesInSameRing(vertexA: any, vertexB: any): boolean;
    /**
     * Returns an array of ring ids shared by both vertices.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {Number[]} An array of ids of rings shared by the two vertices.
     */
    getCommonRings(vertexA: any, vertexB: any): any[];
    /**
     * Returns the aromatic or largest ring shared by the two vertices.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {(Ring|null)} If an aromatic common ring exists, that ring, else the largest (non-aromatic) ring, else null.
     */
    getLargestOrAromaticCommonRing(vertexA: any, vertexB: any): any;
    /**
     * Returns an array of vertices positioned at a specified location.
     *
     * @param {Vector2} position The position to search for vertices.
     * @param {Number} radius The radius within to search.
     * @param {Number} excludeVertexId A vertex id to be excluded from the search results.
     * @returns {Number[]} An array containing vertex ids in a given location.
     */
    getVerticesAt(position: any, radius: any, excludeVertexId: any): any[];
    /**
     * Returns the closest vertex (connected as well as unconnected).
     *
     * @param {Vertex} vertex The vertex of which to find the closest other vertex.
     * @returns {Vertex} The closest vertex.
     */
    getClosestVertex(vertex: any): any;
    /**
     * Add a ring to this representation of a molecule.
     *
     * @param {Ring} ring A new ring.
     * @returns {Number} The ring id of the new ring.
     */
    addRing(ring: any): any;
    /**
     * Removes a ring from the array of rings associated with the current molecule.
     *
     * @param {Number} ringId A ring id.
     */
    removeRing(ringId: any): void;
    /**
     * Gets a ring object from the array of rings associated with the current molecule by its id. The ring id is not equal to the index, since rings can be added and removed when processing bridged rings.
     *
     * @param {Number} ringId A ring id.
     * @returns {Ring} A ring associated with the current molecule.
     */
    getRing(ringId: any): any;
    /**
     * Add a ring connection to this representation of a molecule.
     *
     * @param {RingConnection} ringConnection A new ringConnection.
     * @returns {Number} The ring connection id of the new ring connection.
     */
    addRingConnection(ringConnection: any): any;
    /**
     * Removes a ring connection from the array of rings connections associated with the current molecule.
     *
     * @param {Number} ringConnectionId A ring connection id.
     */
    removeRingConnection(ringConnectionId: any): void;
    /**
     * Removes all ring connections between two vertices.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     */
    removeRingConnectionsBetween(vertexIdA: any, vertexIdB: any): void;
    /**
     * Get a ring connection with a given id.
     *
     * @param {Number} id
     * @returns {RingConnection} The ring connection with the specified id.
     */
    getRingConnection(id: any): any;
    /**
     * Get the ring connections between a ring and a set of rings.
     *
     * @param {Number} ringId A ring id.
     * @param {Number[]} ringIds An array of ring ids.
     * @returns {Number[]} An array of ring connection ids.
     */
    getRingConnections(ringId: any, ringIds: any): any[];
    /**
     * Returns the overlap score of the current molecule based on its positioned vertices. The higher the score, the more overlaps occur in the structure drawing.
     *
     * @returns {Object} Returns the total overlap score and the overlap score of each vertex sorted by score (higher to lower). Example: { total: 99, scores: [ { id: 0, score: 22 }, ... ]  }
     */
    getOverlapScore(): {
        total: number;
        scores: any[];
        vertexScores: Float32Array;
    };
    /**
     * When drawing a double bond, choose the side to place the double bond. E.g. a double bond should always been drawn inside a ring.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @param {Vector2[]} sides An array containing the two normals of the line spanned by the two provided vertices.
     * @returns {Object} Returns an object containing the following information: {
            totalSideCount: Counts the sides of each vertex in the molecule, is an array [ a, b ],
            totalPosition: Same as position, but based on entire molecule,
            sideCount: Counts the sides of each neighbour, is an array [ a, b ],
            position: which side to position the second bond, is 0 or 1, represents the index in the normal array. This is based on only the neighbours
            anCount: the number of neighbours of vertexA,
            bnCount: the number of neighbours of vertexB
        }
     */
    chooseSide(vertexA: any, vertexB: any, sides: any): {
        totalSideCount: number[];
        totalPosition: number;
        sideCount: number[];
        position: number;
        anCount: any;
        bnCount: any;
    };
    /**
     * Sets the center for a ring.
     *
     * @param {Ring} ring A ring.
     */
    setRingCenter(ring: any): void;
    /**
     * Gets the center of a ring contained within a bridged ring and containing a given vertex.
     *
     * @param {Ring} ring A bridged ring.
     * @param {Vertex} vertex A vertex.
     * @returns {Vector2} The center of the subring that containing the vertex.
     */
    getSubringCenter(ring: any, vertex: any): any;
    /**
     * Draw the actual edges as bonds to the canvas.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    drawEdges(debug: any): void;
    /**
     * Draw the an edge as a bonds to the canvas.
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
     * Position the vertices according to their bonds and properties.
     */
    position(): void;
    /**
     * Stores the current information associated with rings.
     */
    backupRingInformation(): void;
    /**
     * Restores the most recently backed up information associated with rings.
     */
    restoreRingInformation(): void;
    /**
     * Creates a new ring, that is, positiones all the vertices inside a ring.
     *
     * @param {Ring} ring The ring to position.
     * @param {(Vector2|null)} [center=null] The center of the ring to be created.
     * @param {(Vertex|null)} [startVertex=null] The first vertex to be positioned inside the ring.
     * @param {(Vertex|null)} [previousVertex=null] The last vertex that was positioned.
     * @param {Boolean} [previousVertex=false] A boolean indicating whether or not this ring was force positioned already - this is needed after force layouting a ring, in order to draw rings connected to it.
     */
    createRing(ring: any, center?: any, startVertex?: any, previousVertex?: any): void;
    /**
     * Rotate an entire subtree by an angle around a center.
     *
     * @param {Number} vertexId A vertex id (the root of the sub-tree).
     * @param {Number} parentVertexId A vertex id in the previous direction of the subtree that is to rotate.
     * @param {Number} angle An angle in randians.
     * @param {Vector2} center The rotational center.
     */
    rotateSubtree(vertexId: any, parentVertexId: any, angle: any, center: any): void;
    /**
     * Gets the overlap score of a subtree.
     *
     * @param {Number} vertexId A vertex id (the root of the sub-tree).
     * @param {Number} parentVertexId A vertex id in the previous direction of the subtree.
     * @param {Number[]} vertexOverlapScores An array containing the vertex overlap scores indexed by vertex id.
     * @returns {Object} An object containing the total overlap score and the center of mass of the subtree weighted by overlap score { value: 0.2, center: new Vector2() }.
     */
    getSubtreeOverlapScore(vertexId: any, parentVertexId: any, vertexOverlapScores: any): {
        value: number;
        center: Vector2;
    };
    /**
     * Returns the current (positioned vertices so far) center of mass.
     *
     * @returns {Vector2} The current center of mass.
     */
    getCurrentCenterOfMass(): Vector2;
    /**
     * Returns the current (positioned vertices so far) center of mass in the neighbourhood of a given position.
     *
     * @param {Vector2} vec The point at which to look for neighbours.
     * @param {Number} [r=currentBondLength*2.0] The radius of vertices to include.
     * @returns {Vector2} The current center of mass.
     */
    getCurrentCenterOfMassInNeigbourhood(vec: any, r?: number): Vector2;
    /**
     * Resolve primary (exact) overlaps, such as two vertices that are connected to the same ring vertex.
     */
    resolvePrimaryOverlaps(): void;
    /**
     * Resolve secondary overlaps. Those overlaps are due to the structure turning back on itself.
     *
     * @param {Object[]} scores An array of objects sorted descending by score.
     * @param {Number} scores[].id A vertex id.
     * @param {Number} scores[].score The overlap score associated with the vertex id.
     */
    resolveSecondaryOverlaps(scores: any): void;
    /**
     * Get the last non-null or 0 angle vertex.
     * @param {Number} vertexId A vertex id.
     * @returns {Vertex} The last vertex with an angle that was not 0 or null.
     */
    getLastVertexWithAngle(vertexId: any): any;
    /**
     * Positiones the next vertex thus creating a bond.
     *
     * @param {Vertex} vertex A vertex.
     * @param {Vertex} [previousVertex=null] The previous vertex which has been positioned.
     * @param {Number} [angle=0.0] The (global) angle of the vertex.
     * @param {Boolean} [originShortest=false] Whether the origin is the shortest subtree in the branch.
     * @param {Boolean} [skipPositioning=false] Whether or not to skip positioning and just check the neighbours.
     */
    createNextBond(vertex: any, previousVertex?: any, angle?: number, originShortest?: boolean, skipPositioning?: boolean): void;
    /**
     * Gets the vetex sharing the edge that is the common bond of two rings.
     *
     * @param {Vertex} vertex A vertex.
     * @returns {(Number|null)} The id of a vertex sharing the edge that is the common bond of two rings with the vertex provided or null, if none.
     */
    getCommonRingbondNeighbour(vertex: any): any;
    /**
     * Check if a vector is inside any ring.
     *
     * @param {Vector2} vec A vector.
     * @returns {Boolean} A boolean indicating whether or not the point (vector) is inside any of the rings associated with the current molecule.
     */
    isPointInRing(vec: any): boolean;
    /**
     * Check whether or not an edge is part of a ring.
     *
     * @param {Edge} edge An edge.
     * @returns {Boolean} A boolean indicating whether or not the edge is part of a ring.
     */
    isEdgeInRing(edge: any): boolean;
    /**
     * Check whether or not an edge is rotatable.
     *
     * @param {Edge} edge An edge.
     * @returns {Boolean} A boolean indicating whether or not the edge is rotatable.
     */
    isEdgeRotatable(edge: any): boolean;
    /**
     * Check whether or not a ring is an implicitly defined aromatic ring (lower case smiles).
     *
     * @param {Ring} ring A ring.
     * @returns {Boolean} A boolean indicating whether or not a ring is implicitly defined as aromatic.
     */
    isRingAromatic(ring: any): boolean;
    /**
     * Get the normals of an edge.
     *
     * @param {Edge} edge An edge.
     * @returns {Vector2[]} An array containing two vectors, representing the normals.
     */
    getEdgeNormals(edge: any): Vector2[];
    /**
     * Returns an array of vertices that are neighbouring a vertix but are not members of a ring (including bridges).
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Vertex[]} An array of vertices.
     */
    getNonRingNeighbours(vertexId: any): any[];
    /**
     * Annotaed stereochemistry information for visualization.
     */
    annotateStereochemistry(): void;
    /**
     *
     *
     * @param {Number} vertexId The id of a vertex.
     * @param {(Number|null)} previousVertexId The id of the parent vertex of the vertex.
     * @param {Uint8Array} visited An array containing the visited flag for all vertices in the graph.
     * @param {Array} priority An array of arrays storing the atomic numbers for each level.
     * @param {Number} maxDepth The maximum depth.
     * @param {Number} depth The current depth.
     */
    visitStereochemistry(vertexId: any, previousVertexId: any, visited: any, priority: any, maxDepth: any, depth: any, parentAtomicNumber?: number): void;
    /**
     * Creates pseudo-elements (such as Et, Me, Ac, Bz, ...) at the position of the carbon sets
     * the involved atoms not to be displayed.
     */
    initPseudoElements(): void;
}
export default Drawer;
