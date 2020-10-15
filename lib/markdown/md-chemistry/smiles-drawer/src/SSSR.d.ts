/** A class encapsulating the functionality to find the smallest set of smallest rings in a graph. */
declare class SSSR {
    d: any;
    pe: any;
    pe_prime: any;
    /**
     * Returns an array containing arrays, each representing a ring from the smallest set of smallest rings in the graph.
     *
     * @param {Graph} graph A Graph object.
     * @param {Boolean} [experimental=false] Whether or not to use experimental SSSR.
     * @returns {Array[]} An array containing arrays, each representing a ring from the smallest set of smallest rings in the group.
     */
    static getRings(graph: any, experimental?: boolean): any[];
    /**
     * Creates a printable string from a matrix (2D array).
     *
     * @param {Array[]} matrix A 2D array.
     * @returns {String} A string representing the matrix.
     */
    static matrixToString(matrix: any): string;
    /**
     * Returnes the two path-included distance matrices used to find the sssr.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Object} The path-included distance matrices. { p1, p2 }
     */
    static getPathIncludedDistanceMatrices(adjacencyMatrix: any): {
        d: any[];
        pe: any[];
        pe_prime: any[];
    };
    /**
     * Get the ring candidates from the path-included distance matrices.
     *
     * @param {Array[]} d The distance matrix.
     * @param {Array[]} pe A matrix containing the shortest paths.
     * @param {Array[]} pe_prime A matrix containing the shortest paths + one vertex.
     * @returns {Array[]} The ring candidates.
     */
    static getRingCandidates(d: any, pe: any, pe_prime: any): any[];
    /**
     * Searches the candidates for the smallest set of smallest rings.
     *
     * @param {Array[]} c The candidates.
     * @param {Array[]} d The distance matrix.
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @param {Array[]} pe A matrix containing the shortest paths.
     * @param {Array[]} pe_prime A matrix containing the shortest paths + one vertex.
     * @param {Uint16Array} arrBondCount A matrix containing the bond count of each vertex.
     * @param {Uint16Array} arrRingCount A matrix containing the number of rings associated with each vertex.
     * @param {Number} nsssr The theoretical number of rings in the graph.
     * @returns {Set[]} The smallest set of smallest rings.
     */
    static getSSSR(c: any, d: any, adjacencyMatrix: any, pe: any, pe_prime: any, arrBondCount: any, arrRingCount: any, nsssr: any): any[];
    /**
     * Returns the number of edges in a graph defined by an adjacency matrix.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Number} The number of edges in the graph defined by the adjacency matrix.
     */
    static getEdgeCount(adjacencyMatrix: any): number;
    /**
     * Returns an edge list constructed form an adjacency matrix.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Array[]} An edge list. E.g. [ [ 0, 1 ], ..., [ 16, 2 ] ]
     */
    static getEdgeList(adjacencyMatrix: any): any[];
    /**
     * Return a set of vertex indices contained in an array of bonds.
     *
     * @param {Array} bonds An array of bonds. A bond is defined as [ sourceVertexId, targetVertexId ].
     * @returns {Set<Number>} An array of vertices.
     */
    static bondsToAtoms(bonds: any): Set<unknown>;
    /**
    * Returns the number of bonds within a set of atoms.
    *
    * @param {Set<Number>} atoms An array of atom ids.
    * @param {Array[]} adjacencyMatrix An adjacency matrix.
    * @returns {Number} The number of bonds in a set of atoms.
    */
    static getBondCount(atoms: any, adjacencyMatrix: any): number;
    /**
     * Checks whether or not a given path already exists in an array of paths.
     *
     * @param {Set[]} pathSets An array of sets each representing a path.
     * @param {Set<Number>} pathSet A set representing a path.
     * @param {Array[]} bonds The bonds associated with the current path.
     * @param {Array[]} allBonds All bonds currently associated with rings in the SSSR set.
     * @param {Uint16Array} arrBondCount A matrix containing the bond count of each vertex.
     * @param {Uint16Array} arrRingCount A matrix containing the number of rings associated with each vertex.
     * @returns {Boolean} A boolean indicating whether or not a give path is contained within a set.
     */
    static pathSetsContain(pathSets: any, pathSet: any, bonds: any, allBonds: any, arrBondCount: any, arrRingCount: any): boolean;
    /**
     * Checks whether or not two sets are equal (contain the same elements).
     *
     * @param {Set<Number>} setA A set.
     * @param {Set<Number>} setB A set.
     * @returns {Boolean} A boolean indicating whether or not the two sets are equal.
     */
    static areSetsEqual(setA: any, setB: any): boolean;
    /**
     * Checks whether or not a set (setA) is a superset of another set (setB).
     *
     * @param {Set<Number>} setA A set.
     * @param {Set<Number>} setB A set.
     * @returns {Boolean} A boolean indicating whether or not setB is a superset of setA.
     */
    static isSupersetOf(setA: any, setB: any): boolean;
}
export default SSSR;
