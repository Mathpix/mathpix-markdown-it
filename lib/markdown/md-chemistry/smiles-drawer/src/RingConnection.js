"use strict";
// import Vertex from './Vertex';
// import Ring from './Ring';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * A class representing a ring connection.
 *
 * @property {Number} id The id of this ring connection.
 * @property {Number} firstRingId A ring id.
 * @property {Number} secondRingId A ring id.
 * @property {Set<Number>} vertices A set containing the vertex ids participating in the ring connection.
 */
var RingConnection = /** @class */ (function () {
    /**
     * The constructor for the class RingConnection.
     *
     * @param {Ring} firstRing A ring.
     * @param {Ring} secondRing A ring.
     */
    function RingConnection(firstRing, secondRing) {
        this.id = null;
        this.firstRingId = firstRing.id;
        this.secondRingId = secondRing.id;
        this.vertices = new Set();
        for (var m = 0; m < firstRing.members.length; m++) {
            var c = firstRing.members[m];
            for (var n = 0; n < secondRing.members.length; n++) {
                var d = secondRing.members[n];
                if (c === d) {
                    this.addVertex(c);
                }
            }
        }
    }
    /**
     * Adding a vertex to the ring connection.
     *
     * @param {Number} vertexId A vertex id.
     */
    RingConnection.prototype.addVertex = function (vertexId) {
        this.vertices.add(vertexId);
    };
    /**
     * Update the ring id of this ring connection that is not the ring id supplied as the second argument.
     *
     * @param {Number} ringId A ring id. The new ring id to be set.
     * @param {Number} otherRingId A ring id. The id that is NOT to be updated.
     */
    RingConnection.prototype.updateOther = function (ringId, otherRingId) {
        if (this.firstRingId === otherRingId) {
            this.secondRingId = ringId;
        }
        else {
            this.firstRingId = ringId;
        }
    };
    /**
     * Returns a boolean indicating whether or not a ring with a given id is participating in this ring connection.
     *
     * @param {Number} ringId A ring id.
     * @returns {Boolean} A boolean indicating whether or not a ring with a given id participates in this ring connection.
     */
    RingConnection.prototype.containsRing = function (ringId) {
        return this.firstRingId === ringId || this.secondRingId === ringId;
    };
    /**
     * Checks whether or not this ring connection is a bridge in a bridged ring.
     *
     * @param {Vertex[]} vertices The array of vertices associated with the current molecule.
     * @returns {Boolean} A boolean indicating whether or not this ring connection is a bridge.
     */
    RingConnection.prototype.isBridge = function (vertices) {
        var e_1, _a;
        if (this.vertices.size > 2) {
            return true;
        }
        try {
            for (var _b = tslib_1.__values(this.vertices), _c = _b.next(); !_c.done; _c = _b.next()) {
                var vertexId = _c.value;
                if (vertices[vertexId].value.rings.length > 2) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * Checks whether or not two rings are connected by a bridged bond.
     *
     * @static
     * @param {RingConnection[]} ringConnections An array of ring connections containing the ring connections associated with the current molecule.
     * @param {Vertex[]} vertices An array of vertices containing the vertices associated with the current molecule.
     * @param {Number} firstRingId A ring id.
     * @param {Number} secondRingId A ring id.
     * @returns {Boolean} A boolean indicating whether or not two rings ar connected by a bridged bond.
     */
    RingConnection.isBridge = function (ringConnections, vertices, firstRingId, secondRingId) {
        var ringConnection = null;
        for (var i = 0; i < ringConnections.length; i++) {
            ringConnection = ringConnections[i];
            if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
                ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                return ringConnection.isBridge(vertices);
            }
        }
        return false;
    };
    /**
     * Retruns the neighbouring rings of a given ring.
     *
     * @static
     * @param {RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
     * @param {Number} ringId A ring id.
     * @returns {Number[]} An array of ring ids of neighbouring rings.
     */
    RingConnection.getNeighbours = function (ringConnections, ringId) {
        var neighbours = [];
        for (var i = 0; i < ringConnections.length; i++) {
            var ringConnection = ringConnections[i];
            if (ringConnection.firstRingId === ringId) {
                neighbours.push(ringConnection.secondRingId);
            }
            else if (ringConnection.secondRingId === ringId) {
                neighbours.push(ringConnection.firstRingId);
            }
        }
        return neighbours;
    };
    /**
     * Returns an array of vertex ids associated with a given ring connection.
     *
     * @static
     * @param {RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
     * @param {Number} firstRingId A ring id.
     * @param {Number} secondRingId A ring id.
     * @returns {Number[]} An array of vertex ids associated with the ring connection.
     */
    RingConnection.getVertices = function (ringConnections, firstRingId, secondRingId) {
        for (var i = 0; i < ringConnections.length; i++) {
            var ringConnection = ringConnections[i];
            if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
                ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                return tslib_1.__spread(ringConnection.vertices);
            }
        }
    };
    return RingConnection;
}());
exports.default = RingConnection;
//# sourceMappingURL=RingConnection.js.map