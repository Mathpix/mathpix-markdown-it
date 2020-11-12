"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A class representing an edge.
 *
 * @property {Number} id The id of this edge.
 * @property {Number} sourceId The id of the source vertex.
 * @property {Number} targetId The id of the target vertex.
 * @property {Number} weight The weight of this edge. That is, the degree of the bond (single bond = 1, double bond = 2, etc).
 * @property {String} [bondType='-'] The bond type of this edge.
 * @property {Boolean} [isPartOfAromaticRing=false] Whether or not this edge is part of an aromatic ring.
 * @property {Boolean} [center=false] Wheter or not the bond is centered. For example, this affects straight double bonds.
 * @property {String} [wedge=''] Wedge direction. Either '', 'up' or 'down'
 */
var Edge = /** @class */ (function () {
    /**
     * The constructor for the class Edge.
     *
     * @param {Number} sourceId A vertex id.
     * @param {Number} targetId A vertex id.
     * @param {Number} [weight=1] The weight of the edge.
     */
    function Edge(sourceId, targetId, weight) {
        if (weight === void 0) { weight = 1; }
        this.id = null;
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.weight = weight;
        this.bondType = '-';
        this.isPartOfAromaticRing = false;
        this.center = false;
        this.wedge = '';
        this.isDraw = false;
        this.isNotHaveLine = false;
        this.isChecked = false;
        this.isNotReDraw = false;
        this.isHaveLine = false;
        this.isBeforeHaveLine = false;
        this.isBeforeNotHaveLine = false;
        this.isPartOfRing = false;
        this.neighbours = [];
        this.rings = [];
        this.sourceHasOuterDoubleBond = false;
        this.targetHasOuterDoubleBond = false;
        this.isAtomVertex = false;
        this.isAtomSlat = false;
        this.isBottomSlat = false;
    }
    /**
     * Set the bond type of this edge. This also sets the edge weight.
     * @param {String} bondType
     */
    Edge.prototype.setBondType = function (bondType) {
        this.bondType = bondType;
        this.weight = Edge.bonds[bondType];
    };
    Object.defineProperty(Edge, "bonds", {
        /**
         * An object mapping the bond type to the number of bonds.
         *
         * @returns {Object} The object containing the map.
         */
        get: function () {
            return {
                '.': 1,
                '-': 1,
                '/': 1,
                '\\': 1,
                '=': 2,
                '#': 3,
                '$': 4
            };
        },
        enumerable: false,
        configurable: true
    });
    return Edge;
}());
exports.default = Edge;
//# sourceMappingURL=Edge.js.map