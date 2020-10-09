// import Vertex from './Vertex';
// import Ring from './Ring';

/**
 * A class representing a ring connection.
 *
 * @property {Number} id The id of this ring connection.
 * @property {Number} firstRingId A ring id.
 * @property {Number} secondRingId A ring id.
 * @property {Set<Number>} vertices A set containing the vertex ids participating in the ring connection.
 */
class RingConnection {
	public id: any;
	public firstRingId: any;
	public secondRingId: any;
	public vertices: any;

    /**
     * The constructor for the class RingConnection.
     *
     * @param {Ring} firstRing A ring.
     * @param {Ring} secondRing A ring.
     */
    constructor(firstRing, secondRing) {
        this.id = null;
        this.firstRingId = firstRing.id;
        this.secondRingId = secondRing.id;
        this.vertices = new Set();

        for (var m = 0; m < firstRing.members.length; m++) {
            let c = firstRing.members[m];

            for (let n = 0; n < secondRing.members.length; n++) {
                let d = secondRing.members[n];

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
    addVertex(vertexId) {
        this.vertices.add(vertexId);
    }

    /**
     * Update the ring id of this ring connection that is not the ring id supplied as the second argument.
     *
     * @param {Number} ringId A ring id. The new ring id to be set.
     * @param {Number} otherRingId A ring id. The id that is NOT to be updated.
     */
    updateOther(ringId, otherRingId) {
        if (this.firstRingId === otherRingId) {
            this.secondRingId = ringId;
        } else {
            this.firstRingId = ringId;
        }
    }

    /**
     * Returns a boolean indicating whether or not a ring with a given id is participating in this ring connection.
     *
     * @param {Number} ringId A ring id.
     * @returns {Boolean} A boolean indicating whether or not a ring with a given id participates in this ring connection.
     */
    containsRing(ringId) {
        return this.firstRingId === ringId || this.secondRingId === ringId;
    }

    /**
     * Checks whether or not this ring connection is a bridge in a bridged ring.
     *
     * @param {Vertex[]} vertices The array of vertices associated with the current molecule.
     * @returns {Boolean} A boolean indicating whether or not this ring connection is a bridge.
     */
    isBridge(vertices) {
      if (this.vertices.size > 2) {
          return true;
      }

      for (let vertexId of this.vertices) {
          if(vertices[vertexId].value.rings.length > 2) {
              return true;
          }
      }

      return false;
    }

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
    static isBridge(ringConnections, vertices, firstRingId, secondRingId) {
      let ringConnection = null;

      for (let i = 0; i < ringConnections.length; i++) {
          ringConnection = ringConnections[i];

          if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
              ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
              return ringConnection.isBridge(vertices);
          }
      }

      return false;
    }

    /**
     * Retruns the neighbouring rings of a given ring.
     *
     * @static
     * @param {RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
     * @param {Number} ringId A ring id.
     * @returns {Number[]} An array of ring ids of neighbouring rings.
     */
    static getNeighbours(ringConnections, ringId) {
        let neighbours = [];

        for (let i = 0; i < ringConnections.length; i++) {
            let ringConnection = ringConnections[i];

            if (ringConnection.firstRingId === ringId) {
                neighbours.push(ringConnection.secondRingId);
            } else if (ringConnection.secondRingId === ringId) {
                neighbours.push(ringConnection.firstRingId);
            }
        }

        return neighbours;
    }

    /**
     * Returns an array of vertex ids associated with a given ring connection.
     *
     * @static
     * @param {RingConnection[]} ringConnections An array of ring connections containing ring connections associated with the current molecule.
     * @param {Number} firstRingId A ring id.
     * @param {Number} secondRingId A ring id.
     * @returns {Number[]} An array of vertex ids associated with the ring connection.
     */
    static getVertices(ringConnections, firstRingId, secondRingId): any {
        for (let i = 0; i < ringConnections.length; i++) {
            let ringConnection = ringConnections[i];
            if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
                ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                return [...ringConnection.vertices];
            }
        }
    }
}

export default RingConnection;
