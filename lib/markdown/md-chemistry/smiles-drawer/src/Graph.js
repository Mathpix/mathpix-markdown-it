"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MathHelper_1 = require("./MathHelper");
// import Vector2 from './Vector2';
var Vertex_1 = require("./Vertex");
var Edge_1 = require("./Edge");
// import Ring from './Ring';
var Atom_1 = require("./Atom");
/**
 * A class representing the molecular graph.
 *
 * @property {Vertex[]} vertices The vertices of the graph.
 * @property {Edge[]} edges The edges of this graph.
 * @property {Object} vertexIdsToEdgeId A map mapping vertex ids to the edge between the two vertices. The key is defined as vertexAId + '_' + vertexBId.
 * @property {Boolean} isometric A boolean indicating whether or not the SMILES associated with this graph is isometric.
 */
var Graph = /** @class */ (function () {
    /**
     * The constructor of the class Graph.
     *
     * @param {Object} parseTree A SMILES parse tree.
     * @param {Boolean} [isomeric=false] A boolean specifying whether or not the SMILES is isomeric.
     */
    function Graph(parseTree, isomeric) {
        if (isomeric === void 0) { isomeric = false; }
        this.vertices = Array();
        this.edges = Array();
        this.vertexIdsToEdgeId = {};
        this.isomeric = isomeric;
        // Used for the bridge detection algorithm
        this._time = 0;
        this._init(parseTree);
    }
    /**
     * PRIVATE FUNCTION. Initializing the graph from the parse tree.
     *
     * @param {Object} node The current node in the parse tree.
     * @param {Number} parentVertexId=null The id of the previous vertex.
     * @param {Boolean} isBranch=false Whether or not the bond leading to this vertex is a branch bond. Branches are represented by parentheses in smiles (e.g. CC(O)C).
     */
    Graph.prototype._init = function (node, order, parentVertexId, isBranch) {
        if (order === void 0) { order = 0; }
        if (parentVertexId === void 0) { parentVertexId = null; }
        if (isBranch === void 0) { isBranch = false; }
        // Create a new vertex object
        var atom = new Atom_1.default(node.atom.element ? node.atom.element : node.atom, node.bond);
        atom.branchBond = node.branchBond;
        atom.ringbonds = node.ringbonds;
        atom.bracket = node.atom.element ? node.atom : null;
        var vertex = new Vertex_1.default(atom);
        var parentVertex = this.vertices[parentVertexId];
        this.addVertex(vertex);
        // Add the id of this node to the parent as child
        if (parentVertexId !== null) {
            vertex.setParentVertexId(parentVertexId);
            vertex.value.addNeighbouringElement(parentVertex.value.element);
            parentVertex.addChild(vertex.id);
            parentVertex.value.addNeighbouringElement(atom.element);
            // In addition create a spanningTreeChildren property, which later will
            // not contain the children added through ringbonds
            parentVertex.spanningTreeChildren.push(vertex.id);
            // Add edge between this node and its parent
            var edge = new Edge_1.default(parentVertexId, vertex.id, 1);
            // let vertexId = null;
            if (isBranch) {
                edge.setBondType(vertex.value.branchBond || '-');
                // vertexId = vertex.id;
                edge.setBondType(vertex.value.branchBond || '-');
                // vertexId = vertex.id;
            }
            else {
                edge.setBondType(parentVertex.value.bondType || '-');
                // vertexId = parentVertex.id;
            }
            // let edgeId =
            this.addEdge(edge);
        }
        var offset = node.ringbondCount + 1;
        if (atom.bracket) {
            offset += atom.bracket.hcount;
        }
        var stereoHydrogens = 0;
        if (atom.bracket && atom.bracket.chirality) {
            atom.isStereoCenter = true;
            stereoHydrogens = atom.bracket.hcount;
            for (var i = 0; i < stereoHydrogens; i++) {
                this._init({
                    atom: 'H',
                    isBracket: 'false',
                    branches: Array(),
                    branchCount: 0,
                    ringbonds: Array(),
                    ringbondCount: false,
                    next: null,
                    hasNext: false,
                    bond: '-'
                }, i, vertex.id, true);
            }
        }
        for (var i = 0; i < node.branchCount; i++) {
            this._init(node.branches[i], i + offset, vertex.id, true);
        }
        if (node.hasNext) {
            this._init(node.next, node.branchCount + offset, vertex.id);
        }
    };
    /**
     * Clears all the elements in this graph (edges and vertices).
     */
    Graph.prototype.clear = function () {
        this.vertices = Array();
        this.edges = Array();
        this.vertexIdsToEdgeId = {};
    };
    /**
     * Add a vertex to the graph.
     *
     * @param {Vertex} vertex A new vertex.
     * @returns {Number} The vertex id of the new vertex.
     */
    Graph.prototype.addVertex = function (vertex) {
        vertex.id = this.vertices.length;
        this.vertices.push(vertex);
        return vertex.id;
    };
    /**
     * Add an edge to the graph.
     *
     * @param {Edge} edge A new edge.
     * @returns {Number} The edge id of the new edge.
     */
    Graph.prototype.addEdge = function (edge) {
        var source = this.vertices[edge.sourceId];
        var target = this.vertices[edge.targetId];
        edge.id = this.edges.length;
        this.edges.push(edge);
        this.vertexIdsToEdgeId[edge.sourceId + '_' + edge.targetId] = edge.id;
        this.vertexIdsToEdgeId[edge.targetId + '_' + edge.sourceId] = edge.id;
        edge.isPartOfAromaticRing = source.value.isPartOfAromaticRing && target.value.isPartOfAromaticRing;
        source.value.bondCount += edge.weight;
        target.value.bondCount += edge.weight;
        source.edges.push(edge.id);
        target.edges.push(edge.id);
        return edge.id;
    };
    /**
     * Returns the edge between two given vertices.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     * @returns {(Edge|null)} The edge or, if no edge can be found, null.
     */
    Graph.prototype.getEdge = function (vertexIdA, vertexIdB) {
        var edgeId = this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB];
        return edgeId === undefined ? null : this.edges[edgeId];
    };
    /**
     * Returns the ids of edges connected to a vertex.
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Number[]} An array containing the ids of edges connected to the vertex.
     */
    Graph.prototype.getEdges = function (vertexId) {
        var edgeIds = Array();
        var vertex = this.vertices[vertexId];
        for (var i = 0; i < vertex.neighbours.length; i++) {
            edgeIds.push(this.vertexIdsToEdgeId[vertexId + '_' + vertex.neighbours[i]]);
        }
        return edgeIds;
    };
    /**
     * Check whether or not two vertices are connected by an edge.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     * @returns {Boolean} A boolean indicating whether or not two vertices are connected by an edge.
     */
    Graph.prototype.hasEdge = function (vertexIdA, vertexIdB) {
        return this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB] !== undefined;
    };
    /**
     * Returns an array containing the vertex ids of this graph.
     *
     * @returns {Number[]} An array containing all vertex ids of this graph.
     */
    Graph.prototype.getVertexList = function () {
        var arr = [this.vertices.length];
        for (var i = 0; i < this.vertices.length; i++) {
            arr[i] = this.vertices[i].id;
        }
        return arr;
    };
    /**
     * Returns an array containing source, target arrays of this graphs edges.
     *
     * @returns {Array[]} An array containing source, target arrays of this graphs edges. Example: [ [ 2, 5 ], [ 6, 9 ] ].
     */
    Graph.prototype.getEdgeList = function () {
        var arr = Array(this.edges.length);
        for (var i = 0; i < this.edges.length; i++) {
            arr[i] = [this.edges[i].sourceId, this.edges[i].targetId];
        }
        return arr;
    };
    /**
     * Get the adjacency matrix of the graph.
     *
     * @returns {Array[]} The adjancency matrix of the molecular graph.
     */
    Graph.prototype.getAdjacencyMatrix = function () {
        var length = this.vertices.length;
        var adjacencyMatrix = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
        }
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
            adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
        }
        return adjacencyMatrix;
    };
    /**
     * Get the adjacency matrix of the graph with all bridges removed (thus the components). Thus the remaining vertices are all part of ring systems.
     *
     * @returns {Array[]} The adjancency matrix of the molecular graph with all bridges removed.
     */
    Graph.prototype.getComponentsAdjacencyMatrix = function () {
        var length = this.vertices.length;
        var adjacencyMatrix = Array(length);
        var bridges = this.getBridges();
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
        }
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
            adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
        }
        for (var i = 0; i < bridges.length; i++) {
            adjacencyMatrix[bridges[i][0]][bridges[i][1]] = 0;
            adjacencyMatrix[bridges[i][1]][bridges[i][0]] = 0;
        }
        return adjacencyMatrix;
    };
    /**
     * Get the adjacency matrix of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The adjancency matrix of the subgraph.
     */
    Graph.prototype.getSubgraphAdjacencyMatrix = function (vertexIds) {
        var length = vertexIds.length;
        var adjacencyMatrix = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                    adjacencyMatrix[i][j] = 1;
                }
            }
        }
        return adjacencyMatrix;
    };
    /**
     * Get the distance matrix of the graph.
     *
     * @returns {Array[]} The distance matrix of the graph.
     */
    Graph.prototype.getDistanceMatrix = function () {
        var length = this.vertices.length;
        var adja = this.getAdjacencyMatrix();
        var dist = Array(length);
        for (var i = 0; i < length; i++) {
            dist[i] = Array(length);
            dist[i].fill(Infinity);
        }
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (adja[i][j] === 1) {
                    dist[i][j] = 1;
                }
            }
        }
        for (var k = 0; k < length; k++) {
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    };
    /**
     * Get the distance matrix of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The distance matrix of the subgraph.
     */
    Graph.prototype.getSubgraphDistanceMatrix = function (vertexIds) {
        var length = vertexIds.length;
        var adja = this.getSubgraphAdjacencyMatrix(vertexIds);
        var dist = Array(length);
        for (var i = 0; i < length; i++) {
            dist[i] = Array(length);
            dist[i].fill(Infinity);
        }
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (adja[i][j] === 1) {
                    dist[i][j] = 1;
                }
            }
        }
        for (var k = 0; k < length; k++) {
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
        return dist;
    };
    /**
     * Get the adjacency list of the graph.
     *
     * @returns {Array[]} The adjancency list of the graph.
     */
    Graph.prototype.getAdjacencyList = function () {
        var length = this.vertices.length;
        var adjacencyList = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyList[i] = [];
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(this.vertices[i].id, this.vertices[j].id)) {
                    adjacencyList[i].push(j);
                }
            }
        }
        return adjacencyList;
    };
    /**
     * Get the adjacency list of a subgraph.
     *
     * @param {Number[]} vertexIds An array containing the vertex ids contained within the subgraph.
     * @returns {Array[]} The adjancency list of the subgraph.
     */
    Graph.prototype.getSubgraphAdjacencyList = function (vertexIds) {
        var length = vertexIds.length;
        var adjacencyList = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyList[i] = Array();
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                    adjacencyList[i].push(j);
                }
            }
        }
        return adjacencyList;
    };
    /**
     * Returns an array containing the edge ids of bridges. A bridge splits the graph into multiple components when removed.
     *
     * @returns {Number[]} An array containing the edge ids of the bridges.
     */
    Graph.prototype.getBridges = function () {
        var length = this.vertices.length;
        var visited = new Array(length);
        var disc = new Array(length);
        var low = new Array(length);
        var parent = new Array(length);
        var adj = this.getAdjacencyList();
        var outBridges = Array();
        visited.fill(false);
        parent.fill(null);
        this._time = 0;
        for (var i = 0; i < length; i++) {
            if (!visited[i]) {
                this._bridgeDfs(i, visited, disc, low, parent, adj, outBridges);
            }
        }
        return outBridges;
    };
    /**
     * Traverses the graph in breadth-first order.
     *
     * @param {Number} startVertexId The id of the starting vertex.
     * @param {Function} callback The callback function to be called on every vertex.
     */
    Graph.prototype.traverseBF = function (startVertexId, callback) {
        var length = this.vertices.length;
        var visited = new Array(length);
        visited.fill(false);
        var queue = [startVertexId];
        while (queue.length > 0) {
            // JavaScripts shift() is O(n) ... bad JavaScript, bad!
            var u = queue.shift();
            var vertex = this.vertices[u];
            callback(vertex);
            for (var i = 0; i < vertex.neighbours.length; i++) {
                var v = vertex.neighbours[i];
                if (!visited[v]) {
                    visited[v] = true;
                    queue.push(v);
                }
            }
        }
    };
    /**
     * Get the depth of a subtree in the direction opposite to the vertex specified as the parent vertex.
     *
     * @param {Number} vertexId A vertex id.
     * @param {Number} parentVertexId The id of a neighbouring vertex.
     * @returns {Number} The depth of the sub-tree.
     */
    Graph.prototype.getTreeDepth = function (vertexId, parentVertexId) {
        if (vertexId === null || parentVertexId === null) {
            return 0;
        }
        var neighbours = this.vertices[vertexId].getSpanningTreeNeighbours(parentVertexId);
        var max = 0;
        for (var i = 0; i < neighbours.length; i++) {
            var childId = neighbours[i];
            var d = this.getTreeDepth(childId, vertexId);
            if (d > max) {
                max = d;
            }
        }
        return max + 1;
    };
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
    Graph.prototype.traverseTree = function (vertexId, parentVertexId, callback, maxDepth, ignoreFirst, depth, visited) {
        if (maxDepth === void 0) { maxDepth = 999999; }
        if (ignoreFirst === void 0) { ignoreFirst = false; }
        if (depth === void 0) { depth = 1; }
        if (visited === void 0) { visited = null; }
        if (visited === null) {
            visited = new Uint8Array(this.vertices.length);
        }
        if (depth > maxDepth + 1 || visited[vertexId] === 1) {
            return;
        }
        visited[vertexId] = 1;
        var vertex = this.vertices[vertexId];
        var neighbours = vertex.getNeighbours(parentVertexId);
        if (!ignoreFirst || depth > 1) {
            callback(vertex);
        }
        for (var i = 0; i < neighbours.length; i++) {
            this.traverseTree(neighbours[i], vertexId, callback, maxDepth, ignoreFirst, depth + 1, visited);
        }
    };
    /**
     * Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs. https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
     * There are undocumented layout parameters. They are undocumented for a reason, so be very careful.
     *
     * @param {Number[]} vertexIds An array containing vertexIds to be placed using the force based layout.
     * @param {Vector2} center The center of the layout.
     * @param {Number} startVertexId A vertex id. Should be the starting vertex - e.g. the first to be positioned and connected to a previously place vertex.
     * @param {Ring} ring The bridged ring associated with this force-based layout.
     */
    Graph.prototype.kkLayout = function (vertexIds, center, startVertexId, ring, bondLength, threshold, innerThreshold, maxIteration, maxInnerIteration, maxEnergy) {
        var _a, _b;
        if (threshold === void 0) { threshold = 0.1; }
        if (innerThreshold === void 0) { innerThreshold = 0.1; }
        if (maxIteration === void 0) { maxIteration = 2000; }
        if (maxInnerIteration === void 0) { maxInnerIteration = 50; }
        if (maxEnergy === void 0) { maxEnergy = 1e9; }
        var edgeStrength = bondLength;
        // Add vertices that are directly connected to the ring
        var i = vertexIds.length;
        while (i--) {
            var vertex = this.vertices[vertexIds[i]];
            var j = vertex.neighbours.length;
        }
        var matDist = this.getSubgraphDistanceMatrix(vertexIds);
        var length = vertexIds.length;
        // Initialize the positions. Place all vertices on a ring around the center
        var radius = MathHelper_1.default.polyCircumradius(500, length);
        var angle = MathHelper_1.default.centralAngle(length);
        var a = 0.0;
        var arrPositionX = new Float32Array(length);
        var arrPositionY = new Float32Array(length);
        var arrPositioned = Array(length);
        i = length;
        while (i--) {
            var vertex = this.vertices[vertexIds[i]];
            if (!vertex.positioned) {
                arrPositionX[i] = center.x + Math.cos(a) * radius;
                arrPositionY[i] = center.y + Math.sin(a) * radius;
            }
            else {
                arrPositionX[i] = vertex.position.x;
                arrPositionY[i] = vertex.position.y;
            }
            arrPositioned[i] = vertex.positioned;
            a += angle;
        }
        // Create the matrix containing the lengths
        var matLength = Array(length);
        i = length;
        while (i--) {
            matLength[i] = new Array(length);
            var j = length;
            while (j--) {
                matLength[i][j] = bondLength * matDist[i][j];
            }
        }
        // Create the matrix containing the spring strenghts
        var matStrength = Array(length);
        i = length;
        while (i--) {
            matStrength[i] = Array(length);
            var j = length;
            while (j--) {
                matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2.0);
            }
        }
        // Create the matrix containing the energies
        var matEnergy = Array(length);
        var arrEnergySumX = new Float32Array(length);
        var arrEnergySumY = new Float32Array(length);
        i = length;
        while (i--) {
            matEnergy[i] = Array(length);
        }
        i = length;
        var ux, uy, dEx, dEy, vx, vy, denom;
        while (i--) {
            ux = arrPositionX[i];
            uy = arrPositionY[i];
            dEx = 0.0;
            dEy = 0.0;
            var j_1 = length;
            while (j_1--) {
                if (i === j_1) {
                    continue;
                }
                vx = arrPositionX[j_1];
                vy = arrPositionY[j_1];
                denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                matEnergy[i][j_1] = [
                    matStrength[i][j_1] * ((ux - vx) - matLength[i][j_1] * (ux - vx) * denom),
                    matStrength[i][j_1] * ((uy - vy) - matLength[i][j_1] * (uy - vy) * denom)
                ];
                matEnergy[j_1][i] = matEnergy[i][j_1];
                dEx += matEnergy[i][j_1][0];
                dEy += matEnergy[i][j_1][1];
            }
            arrEnergySumX[i] = dEx;
            arrEnergySumY[i] = dEy;
        }
        // Utility functions, maybe inline them later
        var energy = function (index) {
            return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
        };
        var highestEnergy = function () {
            var maxEnergy = 0.0;
            var maxEnergyId = 0;
            var maxDEX = 0.0;
            var maxDEY = 0.0;
            i = length;
            while (i--) {
                var _a = tslib_1.__read(energy(i), 3), delta_1 = _a[0], dEX_1 = _a[1], dEY_1 = _a[2];
                if (delta_1 > maxEnergy && arrPositioned[i] === false) {
                    maxEnergy = delta_1;
                    maxEnergyId = i;
                    maxDEX = dEX_1;
                    maxDEY = dEY_1;
                }
            }
            return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
        };
        var update = function (index, dEX, dEY) {
            var dxx = 0.0;
            var dyy = 0.0;
            var dxy = 0.0;
            var ux = arrPositionX[index];
            var uy = arrPositionY[index];
            var arrL = matLength[index];
            var arrK = matStrength[index];
            i = length;
            while (i--) {
                if (i === index) {
                    continue;
                }
                var vx_1 = arrPositionX[i];
                var vy_1 = arrPositionY[i];
                var l = arrL[i];
                var k = arrK[i];
                var m = (ux - vx_1) * (ux - vx_1);
                var denom_1 = 1.0 / Math.pow(m + (uy - vy_1) * (uy - vy_1), 1.5);
                dxx += k * (1 - l * (uy - vy_1) * (uy - vy_1) * denom_1);
                dyy += k * (1 - l * m * denom_1);
                dxy += k * (l * (ux - vx_1) * (uy - vy_1) * denom_1);
            }
            // Prevent division by zero
            if (dxx === 0) {
                dxx = 0.1;
            }
            if (dyy === 0) {
                dyy = 0.1;
            }
            if (dxy === 0) {
                dxy = 0.1;
            }
            var dy = (dEX / dxx + dEY / dxy);
            dy /= (dxy / dxx - dyy / dxy); // had to split this onto two lines because the syntax highlighter went crazy.
            var dx = -(dxy * dy + dEX) / dxx;
            arrPositionX[index] += dx;
            arrPositionY[index] += dy;
            // Update the energies
            var arrE = matEnergy[index];
            dEX = 0.0;
            dEY = 0.0;
            ux = arrPositionX[index];
            uy = arrPositionY[index];
            var vx, vy, prevEx, prevEy, denom;
            i = length;
            while (i--) {
                if (index === i) {
                    continue;
                }
                vx = arrPositionX[i];
                vy = arrPositionY[i];
                // Store old energies
                prevEx = arrE[i][0];
                prevEy = arrE[i][1];
                denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                dx = arrK[i] * ((ux - vx) - arrL[i] * (ux - vx) * denom);
                dy = arrK[i] * ((uy - vy) - arrL[i] * (uy - vy) * denom);
                arrE[i] = [dx, dy];
                dEX += dx;
                dEY += dy;
                arrEnergySumX[i] += dx - prevEx;
                arrEnergySumY[i] += dy - prevEy;
            }
            arrEnergySumX[index] = dEX;
            arrEnergySumY[index] = dEY;
        };
        // Setting up variables for the while loops
        var maxEnergyId = 0;
        var dEX = 0.0;
        var dEY = 0.0;
        var delta = 0.0;
        var iteration = 0;
        var innerIteration = 0;
        while (maxEnergy > threshold && maxIteration > iteration) {
            iteration++;
            _a = tslib_1.__read(highestEnergy(), 4), maxEnergyId = _a[0], maxEnergy = _a[1], dEX = _a[2], dEY = _a[3];
            delta = maxEnergy;
            innerIteration = 0;
            while (delta > innerThreshold && maxInnerIteration > innerIteration) {
                innerIteration++;
                update(maxEnergyId, dEX, dEY);
                _b = tslib_1.__read(energy(maxEnergyId), 3), delta = _b[0], dEX = _b[1], dEY = _b[2];
            }
        }
        i = length;
        while (i--) {
            var index = vertexIds[i];
            var vertex = this.vertices[index];
            vertex.position.x = arrPositionX[i];
            vertex.position.y = arrPositionY[i];
            vertex.positioned = true;
            vertex.forcePositioned = true;
        }
    };
    /**
     * PRIVATE FUNCTION used by getBridges().
     */
    Graph.prototype._bridgeDfs = function (u, visited, disc, low, parent, adj, outBridges) {
        visited[u] = true;
        disc[u] = low[u] = ++this._time;
        for (var i = 0; i < adj[u].length; i++) {
            var v = adj[u][i];
            if (!visited[v]) {
                parent[v] = u;
                this._bridgeDfs(v, visited, disc, low, parent, adj, outBridges);
                low[u] = Math.min(low[u], low[v]);
                // If low > disc, we have a bridge
                if (low[v] > disc[u]) {
                    outBridges.push([u, v]);
                }
            }
            else if (v !== parent[u]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    };
    /**
     * Returns the connected components of the graph.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Set[]} Connected components as sets.
     */
    Graph.getConnectedComponents = function (adjacencyMatrix) {
        var length = adjacencyMatrix.length;
        var visited = new Array(length);
        var components = new Array();
        // let count = 0;
        visited.fill(false);
        for (var u = 0; u < length; u++) {
            if (!visited[u]) {
                var component = Array();
                visited[u] = true;
                component.push(u);
                // count++;
                Graph._ccGetDfs(u, visited, adjacencyMatrix, component);
                if (component.length > 1) {
                    components.push(component);
                }
            }
        }
        return components;
    };
    /**
     * Returns the number of connected components for the graph.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Number} The number of connected components of the supplied graph.
     */
    Graph.getConnectedComponentCount = function (adjacencyMatrix) {
        var length = adjacencyMatrix.length;
        var visited = new Array(length);
        var count = 0;
        visited.fill(false);
        for (var u = 0; u < length; u++) {
            if (!visited[u]) {
                visited[u] = true;
                count++;
                Graph._ccCountDfs(u, visited, adjacencyMatrix);
            }
        }
        return count;
    };
    /**
     * PRIVATE FUNCTION used by getConnectedComponentCount().
     */
    Graph._ccCountDfs = function (u, visited, adjacencyMatrix) {
        for (var v = 0; v < adjacencyMatrix[u].length; v++) {
            var c = adjacencyMatrix[u][v];
            if (!c || visited[v] || u === v) {
                continue;
            }
            visited[v] = true;
            Graph._ccCountDfs(v, visited, adjacencyMatrix);
        }
    };
    /**
     * PRIVATE FUNCTION used by getConnectedComponents().
     */
    Graph._ccGetDfs = function (u, visited, adjacencyMatrix, component) {
        for (var v = 0; v < adjacencyMatrix[u].length; v++) {
            var c = adjacencyMatrix[u][v];
            if (!c || visited[v] || u === v) {
                continue;
            }
            visited[v] = true;
            component.push(v);
            Graph._ccGetDfs(v, visited, adjacencyMatrix, component);
        }
    };
    return Graph;
}());
exports.default = Graph;
//# sourceMappingURL=Graph.js.map