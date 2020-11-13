/**
 * A class representing a vertex.
 *
 * @property {Number} id The id of this vertex.
 * @property {Atom} value The atom associated with this vertex.
 * @property {Vector2} position The position of this vertex.
 * @property {Vector2} previousPosition The position of the previous vertex.
 * @property {Number|null} parentVertexId The id of the previous vertex.
 * @property {Number[]} children The ids of the children of this vertex.
 * @property {Number[]} spanningTreeChildren The ids of the children of this vertex as defined in the spanning tree defined by the SMILES.
 * @property {Number[]} edges The ids of edges associated with this vertex.
 * @property {Boolean} positioned A boolean indicating whether or not this vertex has been positioned.
 * @property {Number} angle The angle of this vertex.
 * @property {Number} dir The direction of this vertex.
 * @property {Number} neighbourCount The number of neighbouring vertices.
 * @property {Number[]} neighbours The vertex ids of neighbouring vertices.
 * @property {String[]} neighbouringElements The element symbols associated with neighbouring vertices.
 * @property {Boolean} forcePositioned A boolean indicating whether or not this vertex was positioned using a force-based approach.
 */
declare class Vertex {
    id: any;
    value: any;
    position: any;
    previousPosition: any;
    parentVertexId: any;
    children: any;
    spanningTreeChildren: any;
    edges: any;
    positioned: any;
    angle: any;
    dir: any;
    neighbourCount: any;
    neighbours: any;
    neighbouringElements: any;
    forcePositioned: any;
    hasDoubleBondWithO: boolean;
    isAtomVertex: boolean;
    /**
     * The constructor for the class Vertex.
     *
     * @param {Atom} value The value associated with this vertex.
     * @param {Number} [x=0] The initial x coordinate of the positional vector of this vertex.
     * @param {Number} [y=0] The initial y coordinate of the positional vector of this vertex.
     */
    constructor(value: any, x?: number, y?: number);
    /**
     * Set the 2D coordinates of the vertex.
     *
     * @param {Number} x The x component of the coordinates.
     * @param {Number} y The y component of the coordinates.
     *
     */
    setPosition(x: any, y: any): void;
    /**
     * Set the 2D coordinates of the vertex from a Vector2.
     *
     * @param {Vector2} v A 2D vector.
     *
     */
    setPositionFromVector(v: any): void;
    /**
     * Add a child vertex id to this vertex.
     * @param {Number} vertexId The id of a vertex to be added as a child to this vertex.
     */
    addChild(vertexId: any): void;
    /**
     * Add a child vertex id to this vertex as the second child of the neighbours array,
     * except this vertex is the first vertex of the SMILE string, then it is added as the first.
     * This is used to get the correct ordering of neighbours for parity calculations.
     * If a hydrogen is implicitly attached to the chiral center, insert as the third child.
     * @param {Number} vertexId The id of a vertex to be added as a child to this vertex.
     * @param {Number} ringbondIndex The index of the ringbond.
     */
    addRingbondChild(vertexId: any, ringbondIndex: any): void;
    /**
     * Set the vertex id of the parent.
     *
     * @param {Number} parentVertexId The parents vertex id.
     */
    setParentVertexId(parentVertexId: any): void;
    /**
     * Returns true if this vertex is terminal (has no parent or child vertices), otherwise returns false. Always returns true if associated value has property hasAttachedPseudoElements set to true.
     *
     * @returns {Boolean} A boolean indicating whether or not this vertex is terminal.
     */
    isTerminal(): boolean;
    /**
     * Clones this vertex and returns the clone.
     *
     * @returns {Vertex} A clone of this vertex.
     */
    clone(): Vertex;
    /**
     * Returns true if this vertex and the supplied vertex both have the same id, else returns false.
     *
     * @param {Vertex} vertex The vertex to check.
     * @returns {Boolean} A boolean indicating whether or not the two vertices have the same id.
     */
    equals(vertex: any): boolean;
    /**
     * Returns the angle of this vertexes positional vector. If a reference vector is supplied in relations to this vector, else in relations to the coordinate system.
     *
     * @param {Vector2} [referenceVector=null] - The reference vector.
     * @param {Boolean} [returnAsDegrees=false] - If true, returns angle in degrees, else in radians.
     * @returns {Number} The angle of this vertex.
     */
    getAngle(referenceVector?: any, returnAsDegrees?: boolean): any;
    /**
     * Returns the suggested text direction when text is added at the position of this vertex.
     *
     * @param {Vertex[]} vertices The array of vertices for the current molecule.
     * @returns {String} The suggested direction of the text.
     */
    getTextDirection(vertices: any): "left" | "right" | "up" | "down";
    /**
     * Returns an array of ids of neighbouring vertices.
     *
     * @param {Number} [vertexId=null] If a value is supplied, the vertex with this id is excluded from the returned indices.
     * @returns {Number[]} An array containing the ids of neighbouring vertices.
     */
    getNeighbours(vertexId?: any): any;
    /**
     * Returns an array of ids of neighbouring vertices that will be drawn (vertex.value.isDrawn === true).
     *
     * @param {Vertex[]} vertices An array containing the vertices associated with the current molecule.
     * @returns {Number[]} An array containing the ids of neighbouring vertices that will be drawn.
     */
    getDrawnNeighbours(vertices: any): any[];
    /**
     * Returns the number of neighbours of this vertex.
     *
     * @returns {Number} The number of neighbours.
     */
    getNeighbourCount(): any;
    /**
     * Returns a list of ids of vertices neighbouring this one in the original spanning tree, excluding the ringbond connections.
     *
     * @param {Number} [vertexId=null] If supplied, the vertex with this id is excluded from the array returned.
     * @returns {Number[]} An array containing the ids of the neighbouring vertices.
     */
    getSpanningTreeNeighbours(vertexId?: any): any[];
    /**
     * Gets the next vertex in the ring in opposide direction to the supplied vertex id.
     *
     * @param {Vertex[]} vertices The array of vertices for the current molecule.
     * @param {Number} ringId The id of the ring containing this vertex.
     * @param {Number} previousVertexId The id of the previous vertex. The next vertex will be opposite from the vertex with this id as seen from this vertex.
     * @returns {Number} The id of the next vertex in the ring.
     */
    getNextInRing(vertices: any, ringId: any, previousVertexId: any): any;
}
export default Vertex;
