/**
 * A class representing the molecular graph.
 *
 * @property {Vertex[]} vertices The vertices of the graph.
 * @property {Edge[]} edges The edges of this graph.
 * @property {Object} vertexIdsToEdgeId A map mapping vertex ids to the edge between the two vertices. The key is defined as vertexAId + '_' + vertexBId.
 * @property {Boolean} isometric A boolean indicating whether or not the SMILES associated with this graph is isometric.
 */
declare class Graph {
    vertices: any;
    edges: any;
    vertexIdsToEdgeId: any;
    isomeric: any;
    _time: any;
    /**
     * The constructor of the class Graph.
     *
     * @param {Object} parseTree A SMILES parse tree.
     * @param {Boolean} [isomeric=false] A boolean specifying whether or not the SMILES is isomeric.
     */
    constructor(parseTree: any, isomeric?: boolean);
    /**
     * PRIVATE FUNCTION. Initializing the graph from the parse tree.
     *
     * @param {Object} node The current node in the parse tree.
     * @param {Number} parentVertexId=null The id of the previous vertex.
     * @param {Boolean} isBranch=false Whether or not the bond leading to this vertex is a branch bond. Branches are represented by parentheses in smiles (e.g. CC(O)C).
     */
    _init(node: any, order?: number, parentVertexId?: any, isBranch?: boolean): void;
    /**
     * Clears all the elements in this graph (edges and vertices).
     */
    clear(): void;
    /**
     * Add a vertex to the graph.
     *
     * @param {Vertex} vertex A new vertex.
     * @returns {Number} The vertex id of the new vertex.
     */
    addVertex(vertex: any): any;
    /**
     * Add an edge to the graph.
     *
     * @param {Edge} edge A new edge.
     * @returns {Number} The edge id of the new edge.
     */
    addEdge(edge: any): any;
    /**
     * Returns the edge between two given vertices.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     * @returns {(Edge|null)} The edge or, if no edge can be found, null.
     */
    getEdge(vertexIdA: any, vertexIdB: any): any;
    /**
     * Returns the ids of edges connected to a vertex.
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Number[]} An array containing the ids of edges connected to the vertex.
     */
    getEdges(vertexId: any): any[];
    /**
     * Check whether or not two vertices are connected by an edge.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     * @returns {Boolean} A boolean indicating whether or not two vertices are connected by an edge.
     */
    hasEdge(vertexIdA: any, vertexIdB: any): boolean;
    /**
     * Returns an array containing the vertex ids of this graph.
     *
     * @returns {Number[]} An array containing all vertex ids of this graph.
     */
    getVertexList(): any[];
    /**
     * Returns an array containing source, target arrays of this graphs edges.
     *
     * @returns {Array[]} An array containing source, target arrays of this graphs edges. Example: [ [ 2, 5 ], [ 6, 9 ] ].
     */
    getEdgeList(): any[];
    /**
     * Get the adjacency matrix of the graph.
     *
     * @returns {Array[]} The adjancency matrix of the molecular graph.
     */
    getAdjacencyMatrix(): any[];
    /**
     * Get the adjacency matrix of the graph with all bridges removed (thus the components). Thus the remaining vertices are all part of ring systems.
     *
     * @returns {Array[]} The adjancency matrix of the molecular graph with all bridges removed.
     */
    getComponentsAdjacencyMatrix(): any[];
    /**
     * Get the adjacency matrix of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The adjancency matrix of the subgraph.
     */
    getSubgraphAdjacencyMatrix(vertexIds: any): any[];
    /**
     * Get the distance matrix of the graph.
     *
     * @returns {Array[]} The distance matrix of the graph.
     */
    getDistanceMatrix(): any[];
    /**
     * Get the distance matrix of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The distance matrix of the subgraph.
     */
    getSubgraphDistanceMatrix(vertexIds: any): any[];
    /**
     * Get the adjacency list of the graph.
     *
     * @returns {Array[]} The adjancency list of the graph.
     */
    getAdjacencyList(): any[];
    /**
     * Get the adjacency list of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The adjancency list of the subgraph.
     */
    getSubgraphAdjacencyList(vertexIds: any): any[];
    /**
     * Returns an array containing the edge ids of bridges. A bridge splits the graph into multiple components when removed.
     *
     * @returns {Number[]} An array containing the edge ids of the bridges.
     */
    getBridges(): any[];
    /**
     * Traverses the graph in breadth-first order.
     *
     * @param {Number} startVertexId The id of the starting vertex.
     * @param {Function} callback The callback function to be called on every vertex.
     */
    traverseBF(startVertexId: any, callback: any): void;
    /**
     * Get the depth of a subtree in the direction opposite to the vertex specified as the parent vertex.
     *
     * @param {Number} vertexId A vertex id.
     * @param {Number} parentVertexId The id of a neighbouring vertex.
     * @returns {Number} The depth of the sub-tree.
     */
    getTreeDepth(vertexId: any, parentVertexId: any): number;
    /**
     * Traverse a sub-tree in the graph.
     *
     * @param {Number} vertexId A vertex id.
     * @param {Number} parentVertexId A neighbouring vertex.
     * @param {Function} callback The callback function that is called with each visited as an argument.
     * @param {Number} [maxDepth=999999] The maximum depth of the recursion.
     * @param {Boolean} [ignoreFirst=false] Whether or not to ignore the starting vertex supplied as vertexId in the callback.
     * @param {Number} [depth=1] The current depth in the tree.
     * @param {Uint8Array} [visited=null] An array holding a flag on whether or not a node has been visited.
     */
    traverseTree(vertexId: any, parentVertexId: any, callback: any, maxDepth?: number, ignoreFirst?: boolean, depth?: number, visited?: any): void;
    /**
     * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
     * There are undocumented layout parameters. They are undocumented for a reason, so be very careful.
     *
     * @param {Number[]} vertexIds An array containing vertexIds to be placed using the force based layout.
     * @param {Vector2} center The center of the layout.
     * @param {Number} startVertexId A vertex id. Should be the starting vertex - e.g. the first to be positioned and connected to a previously place vertex.
     * @param {Ring} ring The bridged ring associated with this force-based layout.
     */
    kkLayout(vertexIds: any, center: any, startVertexId: any, ring: any, bondLength: any, threshold?: number, innerThreshold?: number, maxIteration?: number, maxInnerIteration?: number, maxEnergy?: number): void;
    /**
     * PRIVATE FUNCTION used by getBridges().
     */
    _bridgeDfs(u: any, visited: any, disc: any, low: any, parent: any, adj: any, outBridges: any): void;
    /**
     * Returns the connected components of the graph.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Set[]} Connected components as sets.
     */
    static getConnectedComponents(adjacencyMatrix: any): any[];
    /**
     * Returns the number of connected components for the graph.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Number} The number of connected components of the supplied graph.
     */
    static getConnectedComponentCount(adjacencyMatrix: any): number;
    /**
     * PRIVATE FUNCTION used by getConnectedComponentCount().
     */
    static _ccCountDfs(u: any, visited: any, adjacencyMatrix: any): void;
    /**
     * PRIVATE FUNCTION used by getConnectedComponents().
     */
    static _ccGetDfs(u: any, visited: any, adjacencyMatrix: any, component: any): void;
}
export default Graph;
