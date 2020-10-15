"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Graph_1 = require("./Graph");
/** A class encapsulating the functionality to find the smallest set of smallest rings in a graph. */
var SSSR = /** @class */ (function () {
    function SSSR() {
    }
    /**
     * Returns an array containing arrays, each representing a ring from the smallest set of smallest rings in the graph.
     *
     * @param {Graph} graph A Graph object.
     * @param {Boolean} [experimental=false] Whether or not to use experimental SSSR.
     * @returns {Array[]} An array containing arrays, each representing a ring from the smallest set of smallest rings in the group.
     */
    SSSR.getRings = function (graph, experimental) {
        var e_1, _a;
        if (experimental === void 0) { experimental = false; }
        var adjacencyMatrix = graph.getComponentsAdjacencyMatrix();
        if (adjacencyMatrix.length === 0) {
            return null;
        }
        var connectedComponents = Graph_1.default.getConnectedComponents(adjacencyMatrix);
        var rings = Array();
        for (var i = 0; i < connectedComponents.length; i++) {
            var connectedComponent = connectedComponents[i];
            var ccAdjacencyMatrix = graph.getSubgraphAdjacencyMatrix(tslib_1.__spread(connectedComponent));
            var arrBondCount = new Uint16Array(ccAdjacencyMatrix.length);
            var arrRingCount = new Uint16Array(ccAdjacencyMatrix.length);
            for (var j = 0; j < ccAdjacencyMatrix.length; j++) {
                arrRingCount[j] = 0;
                arrBondCount[j] = 0;
                for (var k = 0; k < ccAdjacencyMatrix[j].length; k++) {
                    arrBondCount[j] += ccAdjacencyMatrix[j][k];
                }
            }
            // Get the edge number and the theoretical number of rings in SSSR
            var nEdges = 0;
            for (var j = 0; j < ccAdjacencyMatrix.length; j++) {
                for (var k = j + 1; k < ccAdjacencyMatrix.length; k++) {
                    nEdges += ccAdjacencyMatrix[j][k];
                }
            }
            var nSssr = nEdges - ccAdjacencyMatrix.length + 1;
            // console.log(nEdges, ccAdjacencyMatrix.length, nSssr);
            // console.log(SSSR.getEdgeList(ccAdjacencyMatrix));
            // console.log(ccAdjacencyMatrix);
            // If all vertices have 3 incident edges, calculate with different formula (see Euler)
            var allThree = true;
            for (var j = 0; j < arrBondCount.length; j++) {
                if (arrBondCount[j] !== 3) {
                    allThree = false;
                }
            }
            if (allThree) {
                nSssr = 2.0 + nEdges - ccAdjacencyMatrix.length;
            }
            // All vertices are part of one ring if theres only one ring.
            if (nSssr === 1) {
                rings.push(tslib_1.__spread(connectedComponent));
                continue;
            }
            if (experimental) {
                nSssr = 999;
            }
            var _b = SSSR.getPathIncludedDistanceMatrices(ccAdjacencyMatrix), d = _b.d, pe = _b.pe, pe_prime = _b.pe_prime;
            var c = SSSR.getRingCandidates(d, pe, pe_prime);
            var sssr = SSSR.getSSSR(c, d, ccAdjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nSssr);
            for (var j = 0; j < sssr.length; j++) {
                var ring = Array(sssr[j].size);
                var index = 0;
                try {
                    for (var _c = (e_1 = void 0, tslib_1.__values(sssr[j])), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var val = _d.value;
                        // Get the original id of the vertex back
                        ring[index++] = connectedComponent[val];
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                rings.push(ring);
            }
        }
        // So, for some reason, this would return three rings for C1CCCC2CC1CCCC2, which is wrong
        // As I don't have time to fix this properly, it will stay in. I'm sorry next person who works
        // on it. At that point it might be best to reimplement the whole SSSR thing...
        return rings;
    };
    /**
     * Creates a printable string from a matrix (2D array).
     *
     * @param {Array[]} matrix A 2D array.
     * @returns {String} A string representing the matrix.
     */
    SSSR.matrixToString = function (matrix) {
        var str = '';
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                str += matrix[i][j] + ' ';
            }
            str += '\n';
        }
        return str;
    };
    /**
     * Returnes the two path-included distance matrices used to find the sssr.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Object} The path-included distance matrices. { p1, p2 }
     */
    SSSR.getPathIncludedDistanceMatrices = function (adjacencyMatrix) {
        var length = adjacencyMatrix.length;
        var d = Array(length);
        var pe = Array(length);
        var pe_prime = Array(length);
        var l = 0;
        var m = 0;
        var n = 0;
        var i = length;
        while (i--) {
            d[i] = Array(length);
            pe[i] = Array(length);
            pe_prime[i] = Array(length);
            var j = length;
            while (j--) {
                d[i][j] = (i === j || adjacencyMatrix[i][j] === 1) ? adjacencyMatrix[i][j] : Number.POSITIVE_INFINITY;
                if (d[i][j] === 1) {
                    pe[i][j] = [[[i, j]]];
                }
                else {
                    pe[i][j] = Array();
                }
                pe_prime[i][j] = Array();
            }
        }
        var k = length;
        var j;
        while (k--) {
            i = length;
            while (i--) {
                j = length;
                while (j--) {
                    var previousPathLength = d[i][j];
                    var newPathLength = d[i][k] + d[k][j];
                    if (previousPathLength > newPathLength) {
                        var l, m, n;
                        if (previousPathLength === newPathLength + 1) {
                            pe_prime[i][j] = [pe[i][j].length];
                            l = pe[i][j].length;
                            while (l--) {
                                pe_prime[i][j][l] = [pe[i][j][l].length];
                                m = pe[i][j][l].length;
                                while (m--) {
                                    pe_prime[i][j][l][m] = [pe[i][j][l][m].length];
                                    n = pe[i][j][l][m].length;
                                    while (n--) {
                                        pe_prime[i][j][l][m][n] = [pe[i][j][l][m][0], pe[i][j][l][m][1]];
                                    }
                                }
                            }
                        }
                        else {
                            pe_prime[i][j] = Array();
                        }
                        d[i][j] = newPathLength;
                        pe[i][j] = [[]];
                        l = pe[i][k][0].length;
                        while (l--) {
                            pe[i][j][0].push(pe[i][k][0][l]);
                        }
                        l = pe[k][j][0].length;
                        while (l--) {
                            pe[i][j][0].push(pe[k][j][0][l]);
                        }
                    }
                    else if (previousPathLength === newPathLength) {
                        if (pe[i][k].length && pe[k][j].length) {
                            var l;
                            if (pe[i][j].length) {
                                var tmp = Array();
                                l = pe[i][k][0].length;
                                while (l--) {
                                    tmp.push(pe[i][k][0][l]);
                                }
                                l = pe[k][j][0].length;
                                while (l--) {
                                    tmp.push(pe[k][j][0][l]);
                                }
                                pe[i][j].push(tmp);
                            }
                            else {
                                var tmp = Array();
                                l = pe[i][k][0].length;
                                while (l--) {
                                    tmp.push(pe[i][k][0][l]);
                                }
                                l = pe[k][j][0].length;
                                while (l--) {
                                    tmp.push(pe[k][j][0][l]);
                                }
                                pe[i][j][0] = tmp;
                            }
                        }
                    }
                    else if (previousPathLength === newPathLength - 1) {
                        var l;
                        if (pe_prime[i][j].length) {
                            var tmp = Array();
                            l = pe[i][k][0].length;
                            while (l--) {
                                tmp.push(pe[i][k][0][l]);
                            }
                            l = pe[k][j][0].length;
                            while (l--) {
                                tmp.push(pe[k][j][0][l]);
                            }
                            pe_prime[i][j].push(tmp);
                        }
                        else {
                            var tmp = Array();
                            l = pe[i][k][0].length;
                            while (l--) {
                                tmp.push(pe[i][k][0][l]);
                            }
                            l = pe[k][j][0].length;
                            while (l--) {
                                tmp.push(pe[k][j][0][l]);
                            }
                            pe_prime[i][j][0] = tmp;
                        }
                    }
                }
            }
        }
        return {
            d: d,
            pe: pe,
            pe_prime: pe_prime
        };
    };
    /**
     * Get the ring candidates from the path-included distance matrices.
     *
     * @param {Array[]} d The distance matrix.
     * @param {Array[]} pe A matrix containing the shortest paths.
     * @param {Array[]} pe_prime A matrix containing the shortest paths + one vertex.
     * @returns {Array[]} The ring candidates.
     */
    SSSR.getRingCandidates = function (d, pe, pe_prime) {
        var length = d.length;
        var candidates = Array();
        var c = 0;
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (d[i][j] === 0 || (pe[i][j].length === 1 && pe_prime[i][j] === 0)) {
                    continue;
                }
                else {
                    // c is the number of vertices in the cycle.
                    if (pe_prime[i][j].length !== 0) {
                        c = 2 * (d[i][j] + 0.5);
                    }
                    else {
                        c = 2 * d[i][j];
                    }
                    if (c !== Infinity) {
                        candidates.push([c, pe[i][j], pe_prime[i][j]]);
                    }
                }
            }
        }
        // Candidates have to be sorted by c
        candidates.sort(function (a, b) {
            return a[0] - b[0];
        });
        return candidates;
    };
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
    SSSR.getSSSR = function (c, d, adjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nsssr) {
        var cSssr = Array();
        var allBonds = Array();
        for (var i = 0; i < c.length; i++) {
            if (c[i][0] % 2 !== 0) {
                for (var j = 0; j < c[i][2].length; j++) {
                    var bonds = c[i][1][0].concat(c[i][2][j]);
                    // Some bonds are added twice, resulting in [[u, v], [u, v]] instead of [u, v].
                    // TODO: This is a workaround, fix later. Probably should be a set rather than an array, however the computational overhead
                    //       is probably bigger compared to leaving it like this.
                    for (var k = 0; k < bonds.length; k++) {
                        if (bonds[k][0].constructor === Array)
                            bonds[k] = bonds[k][0];
                    }
                    var atoms = SSSR.bondsToAtoms(bonds);
                    if (SSSR.getBondCount(atoms, adjacencyMatrix) === atoms.size && !SSSR.pathSetsContain(cSssr, atoms, bonds, allBonds, arrBondCount, arrRingCount)) {
                        cSssr.push(atoms);
                        allBonds = allBonds.concat(bonds);
                    }
                    if (cSssr.length > nsssr) {
                        return cSssr;
                    }
                }
            }
            else {
                for (var j = 0; j < c[i][1].length - 1; j++) {
                    var bonds = c[i][1][j].concat(c[i][1][j + 1]);
                    // Some bonds are added twice, resulting in [[u, v], [u, v]] instead of [u, v].
                    // TODO: This is a workaround, fix later. Probably should be a set rather than an array, however the computational overhead
                    //       is probably bigger compared to leaving it like this.
                    for (var k = 0; k < bonds.length; k++) {
                        if (bonds[k][0].constructor === Array)
                            bonds[k] = bonds[k][0];
                    }
                    var atoms = SSSR.bondsToAtoms(bonds);
                    if (SSSR.getBondCount(atoms, adjacencyMatrix) === atoms.size && !SSSR.pathSetsContain(cSssr, atoms, bonds, allBonds, arrBondCount, arrRingCount)) {
                        cSssr.push(atoms);
                        allBonds = allBonds.concat(bonds);
                    }
                    if (cSssr.length > nsssr) {
                        return cSssr;
                    }
                }
            }
        }
        return cSssr;
    };
    /**
     * Returns the number of edges in a graph defined by an adjacency matrix.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Number} The number of edges in the graph defined by the adjacency matrix.
     */
    SSSR.getEdgeCount = function (adjacencyMatrix) {
        var edgeCount = 0;
        var length = adjacencyMatrix.length;
        var i = length - 1;
        while (i--) {
            var j = length;
            while (j--) {
                if (adjacencyMatrix[i][j] === 1) {
                    edgeCount++;
                }
            }
        }
        return edgeCount;
    };
    /**
     * Returns an edge list constructed form an adjacency matrix.
     *
     * @param {Array[]} adjacencyMatrix An adjacency matrix.
     * @returns {Array[]} An edge list. E.g. [ [ 0, 1 ], ..., [ 16, 2 ] ]
     */
    SSSR.getEdgeList = function (adjacencyMatrix) {
        var length = adjacencyMatrix.length;
        var edgeList = Array();
        var i = length - 1;
        while (i--) {
            var j = length;
            while (j--) {
                if (adjacencyMatrix[i][j] === 1) {
                    edgeList.push([i, j]);
                }
            }
        }
        return edgeList;
    };
    /**
     * Return a set of vertex indices contained in an array of bonds.
     *
     * @param {Array} bonds An array of bonds. A bond is defined as [ sourceVertexId, targetVertexId ].
     * @returns {Set<Number>} An array of vertices.
     */
    SSSR.bondsToAtoms = function (bonds) {
        var atoms = new Set();
        var i = bonds.length;
        while (i--) {
            atoms.add(bonds[i][0]);
            atoms.add(bonds[i][1]);
        }
        return atoms;
    };
    /**
    * Returns the number of bonds within a set of atoms.
    *
    * @param {Set<Number>} atoms An array of atom ids.
    * @param {Array[]} adjacencyMatrix An adjacency matrix.
    * @returns {Number} The number of bonds in a set of atoms.
    */
    SSSR.getBondCount = function (atoms, adjacencyMatrix) {
        var e_2, _a, e_3, _b;
        var count = 0;
        try {
            for (var atoms_1 = tslib_1.__values(atoms), atoms_1_1 = atoms_1.next(); !atoms_1_1.done; atoms_1_1 = atoms_1.next()) {
                var u = atoms_1_1.value;
                try {
                    for (var atoms_2 = (e_3 = void 0, tslib_1.__values(atoms)), atoms_2_1 = atoms_2.next(); !atoms_2_1.done; atoms_2_1 = atoms_2.next()) {
                        var v = atoms_2_1.value;
                        if (u === v) {
                            continue;
                        }
                        count += adjacencyMatrix[u][v];
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (atoms_2_1 && !atoms_2_1.done && (_b = atoms_2.return)) _b.call(atoms_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (atoms_1_1 && !atoms_1_1.done && (_a = atoms_1.return)) _a.call(atoms_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return count / 2;
    };
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
    SSSR.pathSetsContain = function (pathSets, pathSet, bonds, allBonds, arrBondCount, arrRingCount) {
        var e_4, _a, e_5, _b;
        var i = pathSets.length;
        while (i--) {
            if (SSSR.isSupersetOf(pathSet, pathSets[i])) {
                return true;
            }
            if (pathSets[i].size !== pathSet.size) {
                continue;
            }
            if (SSSR.areSetsEqual(pathSets[i], pathSet)) {
                return true;
            }
        }
        // Check if the edges from the candidate are already all contained within the paths of the set of paths.
        // TODO: For some reason, this does not replace the isSupersetOf method above -> why?
        var count = 0;
        var allContained = false;
        i = bonds.length;
        while (i--) {
            var j = allBonds.length;
            while (j--) {
                if (bonds[i][0] === allBonds[j][0] && bonds[i][1] === allBonds[j][1] ||
                    bonds[i][1] === allBonds[j][0] && bonds[i][0] === allBonds[j][1]) {
                    count++;
                }
                if (count === bonds.length) {
                    allContained = true;
                }
            }
        }
        // If all the bonds and thus vertices are already contained within other rings
        // check if there's one vertex with ringCount < bondCount
        var specialCase = false;
        if (allContained) {
            try {
                for (var pathSet_1 = tslib_1.__values(pathSet), pathSet_1_1 = pathSet_1.next(); !pathSet_1_1.done; pathSet_1_1 = pathSet_1.next()) {
                    var element = pathSet_1_1.value;
                    if (arrRingCount[element] < arrBondCount[element]) {
                        specialCase = true;
                        break;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (pathSet_1_1 && !pathSet_1_1.done && (_a = pathSet_1.return)) _a.call(pathSet_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        if (allContained && !specialCase) {
            return true;
        }
        try {
            // Update the ring counts for the vertices
            for (var pathSet_2 = tslib_1.__values(pathSet), pathSet_2_1 = pathSet_2.next(); !pathSet_2_1.done; pathSet_2_1 = pathSet_2.next()) {
                var element = pathSet_2_1.value;
                arrRingCount[element]++;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (pathSet_2_1 && !pathSet_2_1.done && (_b = pathSet_2.return)) _b.call(pathSet_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return false;
    };
    /**
     * Checks whether or not two sets are equal (contain the same elements).
     *
     * @param {Set<Number>} setA A set.
     * @param {Set<Number>} setB A set.
     * @returns {Boolean} A boolean indicating whether or not the two sets are equal.
     */
    SSSR.areSetsEqual = function (setA, setB) {
        var e_6, _a;
        if (setA.size !== setB.size) {
            return false;
        }
        try {
            for (var setA_1 = tslib_1.__values(setA), setA_1_1 = setA_1.next(); !setA_1_1.done; setA_1_1 = setA_1.next()) {
                var element = setA_1_1.value;
                if (!setB.has(element)) {
                    return false;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (setA_1_1 && !setA_1_1.done && (_a = setA_1.return)) _a.call(setA_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return true;
    };
    /**
     * Checks whether or not a set (setA) is a superset of another set (setB).
     *
     * @param {Set<Number>} setA A set.
     * @param {Set<Number>} setB A set.
     * @returns {Boolean} A boolean indicating whether or not setB is a superset of setA.
     */
    SSSR.isSupersetOf = function (setA, setB) {
        var e_7, _a;
        try {
            for (var setB_1 = tslib_1.__values(setB), setB_1_1 = setB_1.next(); !setB_1_1.done; setB_1_1 = setB_1.next()) {
                var element = setB_1_1.value;
                if (!setA.has(element)) {
                    return false;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (setB_1_1 && !setB_1_1.done && (_a = setB_1.return)) _a.call(setB_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return true;
    };
    return SSSR;
}());
exports.default = SSSR;
//# sourceMappingURL=SSSR.js.map