"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathHelper_1 = require("./MathHelper");
var ArrayHelper_1 = require("./ArrayHelper");
var Vector2_1 = require("./Vector2");
// import Atom from './Atom';
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
var Vertex = /** @class */ (function () {
    /**
     * The constructor for the class Vertex.
     *
     * @param {Atom} value The value associated with this vertex.
     * @param {Number} [x=0] The initial x coordinate of the positional vector of this vertex.
     * @param {Number} [y=0] The initial y coordinate of the positional vector of this vertex.
     */
    function Vertex(value, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.id = null;
        this.value = value;
        this.position = new Vector2_1.default(x ? x : 0, y ? y : 0);
        this.previousPosition = new Vector2_1.default(0, 0);
        this.parentVertexId = null;
        this.children = Array();
        this.spanningTreeChildren = Array();
        this.edges = Array();
        this.positioned = false;
        this.angle = null;
        this.dir = 1.0;
        this.neighbourCount = 0;
        this.neighbours = Array();
        this.neighbouringElements = Array();
        this.forcePositioned = false;
        this.hasDoubleBondWithO = false;
        this.isAtomVertex = false;
    }
    /**
     * Set the 2D coordinates of the vertex.
     *
     * @param {Number} x The x component of the coordinates.
     * @param {Number} y The y component of the coordinates.
     *
     */
    Vertex.prototype.setPosition = function (x, y) {
        this.position.x = x;
        this.position.y = y;
    };
    /**
     * Set the 2D coordinates of the vertex from a Vector2.
     *
     * @param {Vector2} v A 2D vector.
     *
     */
    Vertex.prototype.setPositionFromVector = function (v) {
        this.position.x = v.x;
        this.position.y = v.y;
    };
    /**
     * Add a child vertex id to this vertex.
     * @param {Number} vertexId The id of a vertex to be added as a child to this vertex.
     */
    Vertex.prototype.addChild = function (vertexId) {
        this.children.push(vertexId);
        this.neighbours.push(vertexId);
        this.neighbourCount++;
    };
    /**
     * Add a child vertex id to this vertex as the second child of the neighbours array,
     * except this vertex is the first vertex of the SMILE string, then it is added as the first.
     * This is used to get the correct ordering of neighbours for parity calculations.
     * If a hydrogen is implicitly attached to the chiral center, insert as the third child.
     * @param {Number} vertexId The id of a vertex to be added as a child to this vertex.
     * @param {Number} ringbondIndex The index of the ringbond.
     */
    Vertex.prototype.addRingbondChild = function (vertexId, ringbondIndex) {
        this.children.push(vertexId);
        if (this.value.bracket) {
            var index = 1;
            if (this.id === 0 && this.value.bracket.hcount === 0) {
                index = 0;
            }
            if (this.value.bracket.hcount === 1 && ringbondIndex === 0) {
                index = 2;
            }
            if (this.value.bracket.hcount === 1 && ringbondIndex === 1) {
                if (this.neighbours.length < 3) {
                    index = 2;
                }
                else {
                    index = 3;
                }
            }
            if (this.value.bracket.hcount === null && ringbondIndex === 0) {
                index = 1;
            }
            if (this.value.bracket.hcount === null && ringbondIndex === 1) {
                if (this.neighbours.length < 3) {
                    index = 1;
                }
                else {
                    index = 2;
                }
            }
            this.neighbours.splice(index, 0, vertexId);
        }
        else {
            this.neighbours.push(vertexId);
        }
        this.neighbourCount++;
    };
    /**
     * Set the vertex id of the parent.
     *
     * @param {Number} parentVertexId The parents vertex id.
     */
    Vertex.prototype.setParentVertexId = function (parentVertexId) {
        this.neighbourCount++;
        this.parentVertexId = parentVertexId;
        this.neighbours.push(parentVertexId);
    };
    /**
     * Returns true if this vertex is terminal (has no parent or child vertices), otherwise returns false. Always returns true if associated value has property hasAttachedPseudoElements set to true.
     *
     * @returns {Boolean} A boolean indicating whether or not this vertex is terminal.
     */
    Vertex.prototype.isTerminal = function () {
        if (this.value.hasAttachedPseudoElements) {
            return true;
        }
        return (this.parentVertexId === null && this.children.length < 2) || this.children.length === 0;
    };
    /**
     * Clones this vertex and returns the clone.
     *
     * @returns {Vertex} A clone of this vertex.
     */
    Vertex.prototype.clone = function () {
        var clone = new Vertex(this.value, this.position.x, this.position.y);
        clone.id = this.id;
        clone.previousPosition = new Vector2_1.default(this.previousPosition.x, this.previousPosition.y);
        clone.parentVertexId = this.parentVertexId;
        clone.children = ArrayHelper_1.default.clone(this.children);
        clone.spanningTreeChildren = ArrayHelper_1.default.clone(this.spanningTreeChildren);
        clone.edges = ArrayHelper_1.default.clone(this.edges);
        clone.positioned = this.positioned;
        clone.angle = this.angle;
        clone.forcePositioned = this.forcePositioned;
        return clone;
    };
    /**
     * Returns true if this vertex and the supplied vertex both have the same id, else returns false.
     *
     * @param {Vertex} vertex The vertex to check.
     * @returns {Boolean} A boolean indicating whether or not the two vertices have the same id.
     */
    Vertex.prototype.equals = function (vertex) {
        return this.id === vertex.id;
    };
    /**
     * Returns the angle of this vertexes positional vector. If a reference vector is supplied in relations to this vector, else in relations to the coordinate system.
     *
     * @param {Vector2} [referenceVector=null] - The reference vector.
     * @param {Boolean} [returnAsDegrees=false] - If true, returns angle in degrees, else in radians.
     * @returns {Number} The angle of this vertex.
     */
    Vertex.prototype.getAngle = function (referenceVector, returnAsDegrees) {
        if (referenceVector === void 0) { referenceVector = null; }
        if (returnAsDegrees === void 0) { returnAsDegrees = false; }
        var u = null;
        if (!referenceVector) {
            u = Vector2_1.default.subtract(this.position, this.previousPosition);
        }
        else {
            u = Vector2_1.default.subtract(this.position, referenceVector);
        }
        if (returnAsDegrees) {
            return MathHelper_1.default.toDeg(u.angle());
        }
        return u.angle();
    };
    /**
     * Returns the suggested text direction when text is added at the position of this vertex.
     *
     * @param {Vertex[]} vertices The array of vertices for the current molecule.
     * @returns {String} The suggested direction of the text.
     */
    Vertex.prototype.getTextDirection = function (vertices) {
        var neighbours = this.getDrawnNeighbours(vertices);
        var angles = Array();
        for (var i = 0; i < neighbours.length; i++) {
            angles.push(this.getAngle(vertices[neighbours[i]].position));
        }
        var textAngle = MathHelper_1.default.meanAngle(angles);
        // Round to 0, 90, 180 or 270 degree
        var halfPi = Math.PI / 2.0;
        textAngle = Math.round(Math.round(textAngle / halfPi) * halfPi);
        if (textAngle === 2) {
            return 'down';
        }
        else if (textAngle === -2) {
            return 'up';
        }
        else if (textAngle === 0 || textAngle === -0) {
            return 'right'; // is checking for -0 necessary?
        }
        else if (textAngle === 3 || textAngle === -3) {
            return 'left';
        }
        else {
            return 'down'; // default to down
        }
    };
    /**
     * Returns an array of ids of neighbouring vertices.
     *
     * @param {Number} [vertexId=null] If a value is supplied, the vertex with this id is excluded from the returned indices.
     * @returns {Number[]} An array containing the ids of neighbouring vertices.
     */
    Vertex.prototype.getNeighbours = function (vertexId) {
        if (vertexId === void 0) { vertexId = null; }
        if (vertexId === null) {
            return this.neighbours.slice();
        }
        var arr = Array();
        for (var i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i] !== vertexId) {
                arr.push(this.neighbours[i]);
            }
        }
        return arr;
    };
    /**
     * Returns an array of ids of neighbouring vertices that will be drawn (vertex.value.isDrawn === true).
     *
     * @param {Vertex[]} vertices An array containing the vertices associated with the current molecule.
     * @returns {Number[]} An array containing the ids of neighbouring vertices that will be drawn.
     */
    Vertex.prototype.getDrawnNeighbours = function (vertices) {
        var arr = Array();
        for (var i = 0; i < this.neighbours.length; i++) {
            if (vertices[this.neighbours[i]].value.isDrawn) {
                arr.push(this.neighbours[i]);
            }
        }
        return arr;
    };
    /**
     * Returns the number of neighbours of this vertex.
     *
     * @returns {Number} The number of neighbours.
     */
    Vertex.prototype.getNeighbourCount = function () {
        return this.neighbourCount;
    };
    /**
     * Returns a list of ids of vertices neighbouring this one in the original spanning tree, excluding the ringbond connections.
     *
     * @param {Number} [vertexId=null] If supplied, the vertex with this id is excluded from the array returned.
     * @returns {Number[]} An array containing the ids of the neighbouring vertices.
     */
    Vertex.prototype.getSpanningTreeNeighbours = function (vertexId) {
        if (vertexId === void 0) { vertexId = null; }
        var neighbours = Array();
        for (var i = 0; i < this.spanningTreeChildren.length; i++) {
            if (vertexId === undefined || vertexId != this.spanningTreeChildren[i]) {
                neighbours.push(this.spanningTreeChildren[i]);
            }
        }
        if (this.parentVertexId != null) {
            if (vertexId === undefined || vertexId != this.parentVertexId) {
                neighbours.push(this.parentVertexId);
            }
        }
        return neighbours;
    };
    /**
     * Gets the next vertex in the ring in opposide direction to the supplied vertex id.
     *
     * @param {Vertex[]} vertices The array of vertices for the current molecule.
     * @param {Number} ringId The id of the ring containing this vertex.
     * @param {Number} previousVertexId The id of the previous vertex. The next vertex will be opposite from the vertex with this id as seen from this vertex.
     * @returns {Number} The id of the next vertex in the ring.
     */
    Vertex.prototype.getNextInRing = function (vertices, ringId, previousVertexId) {
        var neighbours = this.getNeighbours();
        for (var i = 0; i < neighbours.length; i++) {
            if (ArrayHelper_1.default.contains(vertices[neighbours[i]].value.rings, {
                value: ringId
            }) &&
                neighbours[i] != previousVertexId) {
                return neighbours[i];
            }
        }
        return null;
    };
    return Vertex;
}());
exports.default = Vertex;
//# sourceMappingURL=Vertex.js.map