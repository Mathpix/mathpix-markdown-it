
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
class Edge {
	public id: any;
	public sourceId: any;
	public targetId: any;
	public weight: any;
	public bondType: any;
	public isPartOfAromaticRing: any;
	public center: any;
	public wedge: any;
	public isDraw: boolean;
	public isNotHaveLine: boolean;
	public isChecked: boolean;
	public isNotReDraw: boolean;
	public isHaveLine: boolean;
	public isBeforeHaveLine: boolean;
	public isBeforeNotHaveLine: boolean;
  public isPartOfRing: boolean;
  public neighbours: any;
  public rings: any;
  public sourceHasOuterDoubleBond: boolean;
  public targetHasOuterDoubleBond: boolean;
  public isAtomVertex: boolean;
  public isAtomSlat: boolean;
  public isBottomSlat: boolean;

    /**
     * The constructor for the class Edge.
     *
     * @param {Number} sourceId A vertex id.
     * @param {Number} targetId A vertex id.
     * @param {Number} [weight=1] The weight of the edge.
     */
    constructor(sourceId, targetId, weight = 1) {
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
    setBondType(bondType) {
      this.bondType = bondType;
      this.weight = Edge.bonds[bondType];
    }

    /**
     * An object mapping the bond type to the number of bonds.
     *
     * @returns {Object} The object containing the map.
     */
    static get bonds() {
        return {
            '.': 1,
            '-': 1,
            '/': 1,
            '\\': 1,
            '=': 2,
            '#': 3,
            '$': 4
        }
    }
}

export default Edge;
