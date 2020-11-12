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
declare class Edge {
    id: any;
    sourceId: any;
    targetId: any;
    weight: any;
    bondType: any;
    isPartOfAromaticRing: any;
    center: any;
    wedge: any;
    isDraw: boolean;
    isNotHaveLine: boolean;
    isChecked: boolean;
    isNotReDraw: boolean;
    isHaveLine: boolean;
    isBeforeHaveLine: boolean;
    isBeforeNotHaveLine: boolean;
    isPartOfRing: boolean;
    neighbours: any;
    rings: any;
    sourceHasOuterDoubleBond: boolean;
    targetHasOuterDoubleBond: boolean;
    isAtomVertex: boolean;
    isAtomSlat: boolean;
    isBottomSlat: boolean;
    /**
     * The constructor for the class Edge.
     *
     * @param {Number} sourceId A vertex id.
     * @param {Number} targetId A vertex id.
     * @param {Number} [weight=1] The weight of the edge.
     */
    constructor(sourceId: any, targetId: any, weight?: number);
    /**
     * Set the bond type of this edge. This also sets the edge weight.
     * @param {String} bondType
     */
    setBondType(bondType: any): void;
    /**
     * An object mapping the bond type to the number of bonds.
     *
     * @returns {Object} The object containing the map.
     */
    static get bonds(): {
        '.': number;
        '-': number;
        '/': number;
        '\\': number;
        '=': number;
        '#': number;
        $: number;
    };
}
export default Edge;
