import ArrayHelper from './ArrayHelper';
import Vector2 from './Vector2';
// import Vertex from './Vertex';
import RingConnection from './RingConnection';

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
class Ring {
	public id: any;
	public members: any;
	public membersS: any;
	public edges: any;
	public edgesR: any;
	public elements: any;
	public insiders: any;
	public neighbours: any;
	public positioned: any;
	public center: any;
	public rings: any;
	public isBridged: any;
	public isPartOfBridged: any;
	public isSpiro: any;
	public isFused: any;
	public centralAngle: any;
	public canFlip: any;
	public isDrawed: any;
	public isHaveElements: boolean;
	public hasHydrogen: boolean;
	public hasOuterDoubleBond: boolean;
	public hasDoubleBondWithO: boolean;
	public isStartedCheck: boolean;

    /**
     * The constructor for the class Ring.
     *
     * @param {Number[]} members An array containing the vertex ids of the members of the ring to be created.
     */
    constructor(members) {
        this.id = null;
        this.members = members;
        this.membersS = [];
        this.edges = [];
        this.edgesR = [];
        this.elements = [];
        this.insiders = [];
        this.neighbours = [];
        this.positioned = false;
        this.center = new Vector2(0, 0);
        this.rings = [];
        this.isBridged = false;
        this.isPartOfBridged = false;
        this.isSpiro = false;
        this.isFused = false;
        this.centralAngle = 0.0;
        this.canFlip = true;
        this.isDrawed = false;
        this.isHaveElements = false;
        this.hasHydrogen = false;
        this.hasOuterDoubleBond = false;
        this.hasDoubleBondWithO = false;
        this.isStartedCheck = false;
    }

    /**
     * Clones this ring and returns the clone.
     *
     * @returns {Ring} A clone of this ring.
     */
    clone() {
        let clone = new Ring(this.members);

        clone.id = this.id;
        clone.insiders = ArrayHelper.clone(this.insiders);
        clone.neighbours = ArrayHelper.clone(this.neighbours);
        clone.positioned = this.positioned;
        clone.center = this.center.clone();
        clone.rings = ArrayHelper.clone(this.rings);
        clone.isBridged = this.isBridged;
        clone.isPartOfBridged = this.isPartOfBridged;
        clone.isSpiro = this.isSpiro;
        clone.isFused = this.isFused;
        clone.centralAngle = this.centralAngle;
        clone.canFlip = this.canFlip;

        return clone;
    }

    /**
     * Returns the size (number of members) of this ring.
     *
     * @returns {Number} The size (number of members) of this ring.
     */
    getSize() {
        return this.members.length;
    }

    /**
     * Gets the polygon representation (an array of the ring-members positional vectors) of this ring.
     *
     * @param {Vertex[]} vertices An array of vertices representing the current molecule.
     * @returns {Vector2[]} An array of the positional vectors of the ring members.
     */
    getPolygon(vertices) {
        let polygon = [];

        for (let i = 0; i < this.members.length; i++) {
            polygon.push(vertices[this.members[i]].position);
        }

        return polygon;
    }

    /**
     * Returns the angle of this ring in relation to the coordinate system.
     *
     * @returns {Number} The angle in radians.
     */
    getAngle() {
        return Math.PI - this.centralAngle;
    }

    /**
     * Loops over the members of this ring from a given start position in a direction opposite to the vertex id passed as the previousId.
     *
     * @param {Vertex[]} vertices The vertices associated with the current molecule.
     * @param {Function} callback A callback with the current vertex id as a parameter.
     * @param {Number} startVertexId The vertex id of the start vertex.
     * @param {Number} previousVertexId The vertex id of the previous vertex (the loop calling the callback function will run in the opposite direction of this vertex).
     */
    eachMember(vertices, callback, startVertexId, previousVertexId) {
        startVertexId = startVertexId || startVertexId === 0 ? startVertexId : this.members[0];
        let current = startVertexId;
        let max = 0;

        while (current != null && max < 100) {
            let prev = current;

            callback(prev);
            current = vertices[current].getNextInRing(vertices, this.id, previousVertexId);
            previousVertexId = prev;

            // Stop while loop when arriving back at the start vertex
            if (current == startVertexId) {
                current = null;
            }

            max++;
        }
    }

    /**
     * Returns an array containing the neighbouring rings of this ring ordered by ring size.
     *
     * @param {RingConnection[]} ringConnections An array of ring connections associated with the current molecule.
     * @returns {Object[]} An array of neighbouring rings sorted by ring size. Example: { n: 5, neighbour: 1 }.
     */
    getOrderedNeighbours(ringConnections) {
        let orderedNeighbours = Array(this.neighbours.length);

        for (let i = 0; i < this.neighbours.length; i++) {
            let vertices = RingConnection.getVertices(ringConnections, this.id, this.neighbours[i]);

            orderedNeighbours[i] = {
                n: vertices.length,
                neighbour: this.neighbours[i]
            };
        }

        orderedNeighbours.sort(function (a, b) {
            // Sort highest to lowest
            return b.n - a.n;
        });

        return orderedNeighbours;
    }

    /**
     * Check whether this ring is an implicitly defined benzene-like (e.g. C1=CC=CC=C1) with 6 members and 3 double bonds.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Boolean} A boolean indicating whether or not this ring is an implicitly defined benzene-like.
     */
    isBenzeneLike(vertices) {
        let db = this.getDoubleBondCount(vertices);
        let length = this.members.length;

        return db === 3 && length === 6 ||
               db === 2 && length === 5 ;
    }

    /**
     * Get the number of double bonds inside this ring.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Number} The number of double bonds inside this ring.
     */
    getDoubleBondCount(vertices) {
        let doubleBondCount = 0;

        for (let i = 0; i < this.members.length; i++) {
            let atom = vertices[this.members[i]].value;

            if (atom.bondType === '=' || atom.branchBond === '=') {
                doubleBondCount++;
            }
        }

        return doubleBondCount;
    }

    /**
     * Checks whether or not this ring contains a member with a given vertex id.
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Boolean} A boolean indicating whether or not this ring contains a member with the given vertex id.
     */
    contains(vertexId) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i] == vertexId) {
                return true;
            }
        }

        return false;
    }
}

export default Ring;
