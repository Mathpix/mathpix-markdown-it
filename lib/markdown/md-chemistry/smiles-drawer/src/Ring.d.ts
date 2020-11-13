/**
 * A class representing a ring.
 *
 * @property {Number} id The id of this ring.
 * @property {Number[]} members An array containing the vertex ids of the ring members.
 * @property {Number[]} edges An array containing the edge ids of the edges between the ring members.
 * @property {Number[]} insiders An array containing the vertex ids of the vertices contained within the ring if it is a bridged ring.
 * @property {Number[]} neighbours An array containing the ids of neighbouring rings.
 * @property {Boolean} positioned A boolean indicating whether or not this ring has been positioned.
 * @property {Vector2} center The center of this ring.
 * @property {Ring[]} rings The rings contained within this ring if this ring is bridged.
 * @property {Boolean} isBridged A boolean whether or not this ring is bridged.
 * @property {Boolean} isPartOfBridged A boolean whether or not this ring is part of a bridge ring.
 * @property {Boolean} isSpiro A boolean whether or not this ring is part of a spiro.
 * @property {Boolean} isFused A boolean whether or not this ring is part of a fused ring.
 * @property {Number} centralAngle The central angle of this ring.
 * @property {Boolean} canFlip A boolean indicating whether or not this ring allows flipping of attached vertices to the inside of the ring.
 */
declare class Ring {
    id: any;
    members: any;
    membersS: any;
    edges: any;
    edgesR: any;
    elements: any;
    insiders: any;
    neighbours: any;
    positioned: any;
    center: any;
    rings: any;
    isBridged: any;
    isPartOfBridged: any;
    isSpiro: any;
    isFused: any;
    centralAngle: any;
    canFlip: any;
    isDrawed: any;
    isHaveElements: boolean;
    hasHydrogen: boolean;
    hasOuterDoubleBond: boolean;
    hasDoubleBondWithO: boolean;
    isStartedCheck: boolean;
    /**
     * The constructor for the class Ring.
     *
     * @param {Number[]} members An array containing the vertex ids of the members of the ring to be created.
     */
    constructor(members: any);
    /**
     * Clones this ring and returns the clone.
     *
     * @returns {Ring} A clone of this ring.
     */
    clone(): Ring;
    /**
     * Returns the size (number of members) of this ring.
     *
     * @returns {Number} The size (number of members) of this ring.
     */
    getSize(): any;
    /**
     * Gets the polygon representation (an array of the ring-members positional vectors) of this ring.
     *
     * @param {Vertex[]} vertices An array of vertices representing the current molecule.
     * @returns {Vector2[]} An array of the positional vectors of the ring members.
     */
    getPolygon(vertices: any): any[];
    /**
     * Returns the angle of this ring in relation to the coordinate system.
     *
     * @returns {Number} The angle in radians.
     */
    getAngle(): number;
    /**
     * Loops over the members of this ring from a given start position in a direction opposite to the vertex id passed as the previousId.
     *
     * @param {Vertex[]} vertices The vertices associated with the current molecule.
     * @param {Function} callback A callback with the current vertex id as a parameter.
     * @param {Number} startVertexId The vertex id of the start vertex.
     * @param {Number} previousVertexId The vertex id of the previous vertex (the loop calling the callback function will run in the opposite direction of this vertex).
     */
    eachMember(vertices: any, callback: any, startVertexId: any, previousVertexId: any): void;
    /**
     * Returns an array containing the neighbouring rings of this ring ordered by ring size.
     *
     * @param {RingConnection[]} ringConnections An array of ring connections associated with the current molecule.
     * @returns {Object[]} An array of neighbouring rings sorted by ring size. Example: { n: 5, neighbour: 1 }.
     */
    getOrderedNeighbours(ringConnections: any): any[];
    /**
     * Check whether this ring is an implicitly defined benzene-like (e.g. C1=CC=CC=C1) with 6 members and 3 double bonds.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Boolean} A boolean indicating whether or not this ring is an implicitly defined benzene-like.
     */
    isBenzeneLike(vertices: any): boolean;
    /**
     * Get the number of double bonds inside this ring.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Number} The number of double bonds inside this ring.
     */
    getDoubleBondCount(vertices: any): number;
    /**
     * Checks whether or not this ring contains a member with a given vertex id.
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Boolean} A boolean indicating whether or not this ring contains a member with the given vertex id.
     */
    contains(vertexId: any): boolean;
}
export default Ring;
