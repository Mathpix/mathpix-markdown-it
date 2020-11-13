"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArrayHelper_1 = require("./ArrayHelper");
var Vector2_1 = require("./Vector2");
// import Vertex from './Vertex';
var RingConnection_1 = require("./RingConnection");
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
var Ring = /** @class */ (function () {
    /**
     * The constructor for the class Ring.
     *
     * @param {Number[]} members An array containing the vertex ids of the members of the ring to be created.
     */
    function Ring(members) {
        this.id = null;
        this.members = members;
        this.membersS = [];
        this.edges = [];
        this.edgesR = [];
        this.elements = [];
        this.insiders = [];
        this.neighbours = [];
        this.positioned = false;
        this.center = new Vector2_1.default(0, 0);
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
    Ring.prototype.clone = function () {
        var clone = new Ring(this.members);
        clone.id = this.id;
        clone.insiders = ArrayHelper_1.default.clone(this.insiders);
        clone.neighbours = ArrayHelper_1.default.clone(this.neighbours);
        clone.positioned = this.positioned;
        clone.center = this.center.clone();
        clone.rings = ArrayHelper_1.default.clone(this.rings);
        clone.isBridged = this.isBridged;
        clone.isPartOfBridged = this.isPartOfBridged;
        clone.isSpiro = this.isSpiro;
        clone.isFused = this.isFused;
        clone.centralAngle = this.centralAngle;
        clone.canFlip = this.canFlip;
        return clone;
    };
    /**
     * Returns the size (number of members) of this ring.
     *
     * @returns {Number} The size (number of members) of this ring.
     */
    Ring.prototype.getSize = function () {
        return this.members.length;
    };
    /**
     * Gets the polygon representation (an array of the ring-members positional vectors) of this ring.
     *
     * @param {Vertex[]} vertices An array of vertices representing the current molecule.
     * @returns {Vector2[]} An array of the positional vectors of the ring members.
     */
    Ring.prototype.getPolygon = function (vertices) {
        var polygon = [];
        for (var i = 0; i < this.members.length; i++) {
            polygon.push(vertices[this.members[i]].position);
        }
        return polygon;
    };
    /**
     * Returns the angle of this ring in relation to the coordinate system.
     *
     * @returns {Number} The angle in radians.
     */
    Ring.prototype.getAngle = function () {
        return Math.PI - this.centralAngle;
    };
    /**
     * Loops over the members of this ring from a given start position in a direction opposite to the vertex id passed as the previousId.
     *
     * @param {Vertex[]} vertices The vertices associated with the current molecule.
     * @param {Function} callback A callback with the current vertex id as a parameter.
     * @param {Number} startVertexId The vertex id of the start vertex.
     * @param {Number} previousVertexId The vertex id of the previous vertex (the loop calling the callback function will run in the opposite direction of this vertex).
     */
    Ring.prototype.eachMember = function (vertices, callback, startVertexId, previousVertexId) {
        startVertexId = startVertexId || startVertexId === 0 ? startVertexId : this.members[0];
        var current = startVertexId;
        var max = 0;
        while (current != null && max < 100) {
            var prev = current;
            callback(prev);
            current = vertices[current].getNextInRing(vertices, this.id, previousVertexId);
            previousVertexId = prev;
            // Stop while loop when arriving back at the start vertex
            if (current == startVertexId) {
                current = null;
            }
            max++;
        }
    };
    /**
     * Returns an array containing the neighbouring rings of this ring ordered by ring size.
     *
     * @param {RingConnection[]} ringConnections An array of ring connections associated with the current molecule.
     * @returns {Object[]} An array of neighbouring rings sorted by ring size. Example: { n: 5, neighbour: 1 }.
     */
    Ring.prototype.getOrderedNeighbours = function (ringConnections) {
        var orderedNeighbours = Array(this.neighbours.length);
        for (var i = 0; i < this.neighbours.length; i++) {
            var vertices = RingConnection_1.default.getVertices(ringConnections, this.id, this.neighbours[i]);
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
    };
    /**
     * Check whether this ring is an implicitly defined benzene-like (e.g. C1=CC=CC=C1) with 6 members and 3 double bonds.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Boolean} A boolean indicating whether or not this ring is an implicitly defined benzene-like.
     */
    Ring.prototype.isBenzeneLike = function (vertices) {
        var db = this.getDoubleBondCount(vertices);
        var length = this.members.length;
        return db === 3 && length === 6 ||
            db === 2 && length === 5;
    };
    /**
     * Get the number of double bonds inside this ring.
     *
     * @param {Vertex[]} vertices An array of vertices associated with the current molecule.
     * @returns {Number} The number of double bonds inside this ring.
     */
    Ring.prototype.getDoubleBondCount = function (vertices) {
        var doubleBondCount = 0;
        for (var i = 0; i < this.members.length; i++) {
            var atom = vertices[this.members[i]].value;
            if (atom.bondType === '=' || atom.branchBond === '=') {
                doubleBondCount++;
            }
        }
        return doubleBondCount;
    };
    /**
     * Checks whether or not this ring contains a member with a given vertex id.
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Boolean} A boolean indicating whether or not this ring contains a member with the given vertex id.
     */
    Ring.prototype.contains = function (vertexId) {
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i] == vertexId) {
                return true;
            }
        }
        return false;
    };
    return Ring;
}());
exports.default = Ring;
//# sourceMappingURL=Ring.js.map