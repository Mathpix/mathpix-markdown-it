"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MathHelper_1 = require("./MathHelper");
var ArrayHelper_1 = require("./ArrayHelper");
var Vector2_1 = require("./Vector2");
var Line_1 = require("./Line");
var Edge_1 = require("./Edge");
var Atom_1 = require("./Atom");
var Ring_1 = require("./Ring");
var RingConnection_1 = require("./RingConnection");
var CanvasWrapper_1 = require("./CanvasWrapper");
var Graph_1 = require("./Graph");
var SSSR_1 = require("./SSSR");
var ThemeManager_1 = require("./ThemeManager");
;
;
/**
 * The main class of the application representing the smiles drawer
 *
 * @property {Graph} graph The graph associated with this SmilesDrawer.Drawer instance.
 * @property {Number} ringIdCounter An internal counter to keep track of ring ids.
 * @property {Number} ringConnectionIdCounter An internal counter to keep track of ring connection ids.
 * @property {CanvasWrapper} canvasWrapper The CanvasWrapper associated with this SmilesDrawer.Drawer instance.
 * @property {Number} totalOverlapScore The current internal total overlap score.
 * @property {Object} defaultOptions The default options.
 * @property {Object} opts The merged options.
 * @property {Object} theme The current theme.
 */
var Drawer = /** @class */ (function () {
    /**
     * The constructor for the class SmilesDrawer.
     *
     * @param {Object} options An object containing custom values for different options. It is merged with the default options.
     */
    function Drawer(options) {
        this.graph = null;
        this.doubleBondConfigCount = 0;
        this.doubleBondConfig = null;
        this.ringIdCounter = 0;
        this.ringConnectionIdCounter = 0;
        this.canvasWrapper = null;
        this.totalOverlapScore = 0;
        this.defaultOptions = {
            width: 500,
            height: 500,
            bondThickness: 0.6,
            bondLength: 15,
            shortBondLength: 0.8,
            bondSpacing: 0.18 * 15,
            dCircle: 2,
            atomVisualization: 'default',
            ringVisualization: 'default',
            ringAromaticVisualization: 'default',
            isomeric: true,
            debug: false,
            terminalCarbons: false,
            explicitHydrogens: true,
            overlapSensitivity: 0.42,
            overlapResolutionIterations: 1,
            compactDrawing: false,
            fontSizeLarge: 5,
            fontSizeSmall: 3,
            padding: 5.0,
            experimentalSSSR: false,
            kkThreshold: 0.1,
            kkInnerThreshold: 0.1,
            kkMaxIteration: 20000,
            kkMaxInnerIteration: 50,
            kkMaxEnergy: 1e9,
            themes: {
                dark: {
                    C: '#fff',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#fff',
                    BACKGROUND: '#141414'
                },
                light: {
                    C: '#222',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#222',
                    BACKGROUND: '#fff'
                }
            }
        };
        // @ts-ignore
        this.opts = this.extend(true, this.defaultOptions, options);
        this.opts.halfBondSpacing = this.opts.bondSpacing / 2.0;
        this.opts.bondLengthSq = this.opts.bondLength * this.opts.bondLength;
        this.opts.halfFontSizeLarge = this.opts.fontSizeLarge / 2.0;
        this.opts.quarterFontSizeLarge = this.opts.fontSizeLarge / 4.0;
        this.opts.fifthFontSizeSmall = this.opts.fontSizeSmall / 5.0;
        // Set the default theme.
        this.theme = this.opts.themes.dark;
    }
    /**
     * A helper method to extend the default options with user supplied ones.
     */
    Drawer.prototype.extend = function () {
        var that = this;
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
            deep = arguments[0];
            i++;
        }
        var merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        // @ts-ignore
                        extended[prop] = that.extend(true, extended[prop], obj[prop]);
                        // extended[prop] = that.extend();
                    }
                    else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        for (; i < length; i++) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    };
    ;
    /**
     * Draws the parsed smiles data to a canvas element.
     *
     * @param {Object} data The tree returned by the smiles parser.
     * @param {(String|HTMLElement)} target The id of the HTML canvas element the structure is drawn to - or the element itself.
     * @param {String} themeName='dark' The name of the theme to use. Built-in themes are 'light' and 'dark'.
     * @param {Boolean} infoOnly=false Only output info on the molecule without drawing anything to the canvas.
     */
    Drawer.prototype.draw = function (data, target, themeName, infoOnly) {
        if (themeName === void 0) { themeName = 'light'; }
        if (infoOnly === void 0) { infoOnly = false; }
        this.initDraw(data, themeName, infoOnly);
        if (!this.infoOnly) {
            this.themeManager = new ThemeManager_1.default(this.opts.themes, themeName);
            this.canvasWrapper = new CanvasWrapper_1.default(target, this.themeManager, this.opts);
        }
        if (!infoOnly) {
            this.processGraph();
            // Set the canvas to the appropriate size
            this.canvasWrapper.scale(this.graph.vertices);
            // Do the actual drawing
            this.drawEdges(this.opts.debug);
            this.drawVertices(this.opts.debug);
            this.canvasWrapper.reset();
            if (this.opts.debug) {
                console.log(this.graph);
                console.log(this.rings);
                console.log(this.ringConnections);
            }
        }
    };
    /**
     * Returns the number of rings this edge is a part of.
     *
     * @param {Number} edgeId The id of an edge.
     * @returns {Number} The number of rings the provided edge is part of.
     */
    Drawer.prototype.edgeRingCount = function (edgeId) {
        var edge = this.graph.edges[edgeId];
        var a = this.graph.vertices[edge.sourceId];
        var b = this.graph.vertices[edge.targetId];
        return Math.min(a.value.rings.length, b.value.rings.length);
    };
    /**
     * Returns an array containing the bridged rings associated with this  molecule.
     *
     * @returns {Ring[]} An array containing all bridged rings associated with this molecule.
     */
    Drawer.prototype.getBridgedRings = function () {
        var bridgedRings = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isBridged) {
                bridgedRings.push(this.rings[i]);
            }
        }
        return bridgedRings;
    };
    /**
     * Returns an array containing all fused rings associated with this molecule.
     *
     * @returns {Ring[]} An array containing all fused rings associated with this molecule.
     */
    Drawer.prototype.getFusedRings = function () {
        var fusedRings = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isFused) {
                fusedRings.push(this.rings[i]);
            }
        }
        return fusedRings;
    };
    /**
     * Returns an array containing all spiros associated with this molecule.
     *
     * @returns {Ring[]} An array containing all spiros associated with this molecule.
     */
    Drawer.prototype.getSpiros = function () {
        var spiros = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isSpiro) {
                spiros.push(this.rings[i]);
            }
        }
        return spiros;
    };
    /**
     * Returns a string containing a semicolon and new-line separated list of ring properties: Id; Members Count; Neighbours Count; IsSpiro; IsFused; IsBridged; Ring Count (subrings of bridged rings)
     *
     * @returns {String} A string as described in the method description.
     */
    Drawer.prototype.printRingInfo = function () {
        var result = '';
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];
            result += ring.id + ';';
            result += ring.members.length + ';';
            result += ring.neighbours.length + ';';
            result += ring.isSpiro ? 'true;' : 'false;';
            result += ring.isFused ? 'true;' : 'false;';
            result += ring.isBridged ? 'true;' : 'false;';
            result += ring.rings.length + ';';
            result += '\n';
        }
        return result;
    };
    /**
     * Rotates the drawing to make the widest dimension horizontal.
     */
    Drawer.prototype.rotateDrawing = function () {
        // Rotate the vertices to make the molecule align horizontally
        // Find the longest distance
        var a = 0;
        var b = 0;
        var maxDist = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertexA = this.graph.vertices[i];
            if (!vertexA.value.isDrawn) {
                continue;
            }
            for (var j = i + 1; j < this.graph.vertices.length; j++) {
                var vertexB = this.graph.vertices[j];
                if (!vertexB.value.isDrawn) {
                    continue;
                }
                var dist = vertexA.position.distanceSq(vertexB.position);
                if (dist > maxDist) {
                    maxDist = dist;
                    a = i;
                    b = j;
                }
            }
        }
        var angle = -Vector2_1.default.subtract(this.graph.vertices[a].position, this.graph.vertices[b].position).angle();
        if (!isNaN(angle)) {
            // Round to 30 degrees
            var remainder = angle % 0.523599;
            // Round either up or down in 30 degree steps
            if (remainder < 0.2617995) {
                angle = angle - remainder;
            }
            else {
                angle += 0.523599 - remainder;
            }
            // Finally, rotate everything
            for (var i = 0; i < this.graph.vertices.length; i++) {
                if (i === b) {
                    continue;
                }
                this.graph.vertices[i].position.rotateAround(angle, this.graph.vertices[b].position);
            }
            for (var i = 0; i < this.rings.length; i++) {
                this.rings[i].center.rotateAround(angle, this.graph.vertices[b].position);
            }
        }
    };
    /**
     * Returns the total overlap score of the current molecule.
     *
     * @returns {Number} The overlap score.
     */
    Drawer.prototype.getTotalOverlapScore = function () {
        return this.totalOverlapScore;
    };
    /**
     * Returns the ring count of the current molecule.
     *
     * @returns {Number} The ring count.
     */
    Drawer.prototype.getRingCount = function () {
        return this.rings.length;
    };
    /**
     * Checks whether or not the current molecule  a bridged ring.
     *
     * @returns {Boolean} A boolean indicating whether or not the current molecule  a bridged ring.
     */
    Drawer.prototype.hasBridgedRing = function () {
        return this.bridgedRing;
    };
    /**
     * Returns the number of heavy atoms (non-hydrogen) in the current molecule.
     *
     * @returns {Number} The heavy atom count.
     */
    Drawer.prototype.getHeavyAtomCount = function () {
        var hac = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            if (this.graph.vertices[i].value.element !== 'H') {
                hac++;
            }
        }
        return hac;
    };
    /**
     * Returns the molecular formula of the loaded molecule as a string.
     *
     * @returns {String} The molecular formula.
     */
    Drawer.prototype.getMolecularFormula = function () {
        var molecularFormula = '';
        var counts = new Map();
        // Initialize element count
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var atom = this.graph.vertices[i].value;
            if (counts.has(atom.element)) {
                counts.set(atom.element, counts.get(atom.element) + 1);
            }
            else {
                counts.set(atom.element, 1);
            }
            // Hydrogens attached to a chiral center were added as vertices,
            // those in non chiral brackets are added here
            if (atom.bracket && !atom.bracket.chirality) {
                if (counts.has('H')) {
                    counts.set('H', counts.get('H') + atom.bracket.hcount);
                }
                else {
                    counts.set('H', atom.bracket.hcount);
                }
            }
            // Add the implicit hydrogens according to valency, exclude
            // bracket atoms as they were handled and always have the number
            // of hydrogens specified explicitly
            if (!atom.bracket) {
                var nHydrogens = Atom_1.default.maxBonds[atom.element] - atom.bondCount;
                if (atom.isPartOfAromaticRing) {
                    nHydrogens--;
                }
                if (counts.has('H')) {
                    counts.set('H', counts.get('H') + nHydrogens);
                }
                else {
                    counts.set('H', nHydrogens);
                }
            }
        }
        if (counts.has('C')) {
            var count = counts.get('C');
            molecularFormula += 'C' + (count > 1 ? count : '');
            counts.delete('C');
        }
        if (counts.has('H')) {
            var count = counts.get('H');
            molecularFormula += 'H' + (count > 1 ? count : '');
            counts.delete('H');
        }
        var elements = Object.keys(Atom_1.default.atomicNumbers).sort();
        elements.map(function (e) {
            if (counts.has(e)) {
                var count = counts.get(e);
                molecularFormula += e + (count > 1 ? count : '');
            }
        });
        return molecularFormula;
    };
    /**
     * Returns the type of the ringbond (e.g. '=' for a double bond). The ringbond represents the break in a ring introduced when creating the MST. If the two vertices supplied as arguments are not part of a common ringbond, the method returns null.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {(String|null)} Returns the ringbond type or null, if the two supplied vertices are not connected by a ringbond.
     */
    Drawer.prototype.getRingbondType = function (vertexA, vertexB) {
        var _a;
        // Checks whether the two vertices are the ones connecting the ring
        // and what the bond type should be.
        if (vertexA.value.getRingbondCount() < 1 || vertexB.value.getRingbondCount() < 1) {
            return null;
        }
        for (var i = 0; i < vertexA.value.ringbonds.length; i++) {
            for (var j = 0; j < vertexB.value.ringbonds.length; j++) {
                // if(i != j) continue;
                if (vertexA.value.ringbonds[i].id === vertexB.value.ringbonds[j].id) {
                    // If the bonds are equal, it doesn't matter which bond is returned.
                    // if they are not equal, return the one that is not the default ("-")
                    if (((_a = vertexA.value.ringbonds[i]) === null || _a === void 0 ? void 0 : _a.bondType) === '-') {
                        return vertexB.value.ringbonds[j].bond;
                    }
                    else {
                        return vertexA.value.ringbonds[i].bond;
                    }
                }
            }
        }
        return null;
    };
    Drawer.prototype.initDraw = function (data, themeName, infoOnly) {
        this.data = data;
        this.infoOnly = infoOnly;
        this.ringIdCounter = 0;
        this.ringConnectionIdCounter = 0;
        this.graph = new Graph_1.default(data, this.opts.isomeric);
        this.rings = Array();
        this.ringConnections = Array();
        this.originalRings = Array();
        this.originalRingConnections = Array();
        this.bridgedRing = false;
        // Reset those, in case the previous drawn SMILES had a dangling \ or /
        this.doubleBondConfigCount = null;
        this.doubleBondConfig = null;
        this.initRings();
        this.initHydrogens();
    };
    Drawer.prototype.processGraph = function () {
        this.position();
        // Restore the ring information (removes bridged rings and replaces them with the original, multiple, rings)
        this.restoreRingInformation();
        // Atoms bonded to the same ring atom
        this.resolvePrimaryOverlaps();
        var overlapScore = this.getOverlapScore();
        this.totalOverlapScore = this.getOverlapScore().total;
        for (var o = 0; o < this.opts.overlapResolutionIterations; o++) {
            for (var i = 0; i < this.graph.edges.length; i++) {
                var edge = this.graph.edges[i];
                if (this.isEdgeRotatable(edge)) {
                    var subTreeDepthA = this.graph.getTreeDepth(edge.sourceId, edge.targetId);
                    var subTreeDepthB = this.graph.getTreeDepth(edge.targetId, edge.sourceId);
                    // Only rotate the shorter subtree
                    var a = edge.targetId;
                    var b = edge.sourceId;
                    if (subTreeDepthA > subTreeDepthB) {
                        a = edge.sourceId;
                        b = edge.targetId;
                    }
                    var subTreeOverlap = this.getSubtreeOverlapScore(b, a, overlapScore.vertexScores);
                    if (subTreeOverlap.value > this.opts.overlapSensitivity) {
                        var vertexA = this.graph.vertices[a];
                        var vertexB = this.graph.vertices[b];
                        var neighboursB = vertexB.getNeighbours(a);
                        if (neighboursB.length === 1) {
                            var neighbour = this.graph.vertices[neighboursB[0]];
                            var angle = neighbour.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper_1.default.toRad(120));
                            this.rotateSubtree(neighbour.id, vertexB.id, angle, vertexB.position);
                            // If the new overlap is bigger, undo change
                            var newTotalOverlapScore = this.getOverlapScore().total;
                            if (newTotalOverlapScore > this.totalOverlapScore) {
                                this.rotateSubtree(neighbour.id, vertexB.id, -angle, vertexB.position);
                            }
                            else {
                                this.totalOverlapScore = newTotalOverlapScore;
                            }
                        }
                        else if (neighboursB.length === 2) {
                            // Switch places / sides
                            // If vertex a is in a ring, do nothing
                            if (vertexB.value.rings.length !== 0 && vertexA.value.rings.length !== 0) {
                                continue;
                            }
                            var neighbourA = this.graph.vertices[neighboursB[0]];
                            var neighbourB = this.graph.vertices[neighboursB[1]];
                            if (neighbourA.value.rings.length === 1 && neighbourB.value.rings.length === 1) {
                                // Both neighbours in same ring. TODO: does this create problems with wedges? (up = down and vice versa?)
                                if (neighbourA.value.rings[0] !== neighbourB.value.rings[0]) {
                                    continue;
                                }
                                // TODO: Rotate circle
                            }
                            else if (neighbourA.value.rings.length !== 0 || neighbourB.value.rings.length !== 0) {
                                continue;
                            }
                            else {
                                var angleA = neighbourA.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper_1.default.toRad(120));
                                var angleB = neighbourB.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper_1.default.toRad(120));
                                this.rotateSubtree(neighbourA.id, vertexB.id, angleA, vertexB.position);
                                this.rotateSubtree(neighbourB.id, vertexB.id, angleB, vertexB.position);
                                var newTotalOverlapScore = this.getOverlapScore().total;
                                if (newTotalOverlapScore > this.totalOverlapScore) {
                                    this.rotateSubtree(neighbourA.id, vertexB.id, -angleA, vertexB.position);
                                    this.rotateSubtree(neighbourB.id, vertexB.id, -angleB, vertexB.position);
                                }
                                else {
                                    this.totalOverlapScore = newTotalOverlapScore;
                                }
                            }
                        }
                        overlapScore = this.getOverlapScore();
                    }
                }
            }
        }
        this.resolveSecondaryOverlaps(overlapScore.scores);
        if (this.opts.isomeric) {
            this.annotateStereochemistry();
        }
        // Initialize pseudo elements or shortcuts
        if (this.opts.compactDrawing && this.opts.atomVisualization === 'default') {
            this.initPseudoElements();
        }
        else {
            if (this.opts.atomVisualization === 'default') {
                this.initPseudoElements();
            }
        }
        this.rotateDrawing();
    };
    /**
     * Initializes rings and ringbonds for the current molecule.
     */
    Drawer.prototype.initRings = function () {
        var openBonds = new Map();
        // Close the open ring bonds (spanning tree -> graph)
        for (var i = this.graph.vertices.length - 1; i >= 0; i--) {
            var vertex = this.graph.vertices[i];
            if (vertex.value.ringbonds.length === 0) {
                continue;
            }
            for (var j = 0; j < vertex.value.ringbonds.length; j++) {
                var ringbondId = vertex.value.ringbonds[j].id;
                var ringbondBond = vertex.value.ringbonds[j].bond;
                // If the other ringbond id has not been discovered,
                // add it to the open bonds map and continue.
                // if the other ringbond id has already been discovered,
                // create a bond between the two atoms.
                if (!openBonds.has(ringbondId)) {
                    openBonds.set(ringbondId, [vertex.id, ringbondBond]);
                }
                else {
                    var sourceVertexId = vertex.id;
                    var targetVertexId = openBonds.get(ringbondId)[0];
                    var targetRingbondBond = openBonds.get(ringbondId)[1];
                    var edge = new Edge_1.default(sourceVertexId, targetVertexId, 1);
                    edge.setBondType(targetRingbondBond || ringbondBond || '-');
                    var edgeId = this.graph.addEdge(edge);
                    var targetVertex = this.graph.vertices[targetVertexId];
                    vertex.addRingbondChild(targetVertexId, j);
                    vertex.value.addNeighbouringElement(targetVertex.value.element);
                    targetVertex.addRingbondChild(sourceVertexId, j);
                    targetVertex.value.addNeighbouringElement(vertex.value.element);
                    vertex.edges.push(edgeId);
                    targetVertex.edges.push(edgeId);
                    openBonds.delete(ringbondId);
                }
            }
        }
        // Get the rings in the graph (the SSSR)
        var rings = SSSR_1.default.getRings(this.graph, this.opts.experimentalSSSR);
        if (rings === null) {
            return;
        }
        for (var i = 0; i < rings.length; i++) {
            var ringVertices = tslib_1.__spread(rings[i]);
            var ringId = this.addRing(new Ring_1.default(ringVertices));
            // Add the ring to the atoms
            for (var j = 0; j < ringVertices.length; j++) {
                this.graph.vertices[ringVertices[j]].value.rings.push(ringId);
            }
        }
        // Find connection between rings
        // Check for common vertices and create ring connections. This is a bit
        // ugly, but the ringcount is always fairly low (< 100)
        for (var i = 0; i < this.rings.length - 1; i++) {
            for (var j = i + 1; j < this.rings.length; j++) {
                var a = this.rings[i];
                var b = this.rings[j];
                var ringConnection = new RingConnection_1.default(a, b);
                // If there are no vertices in the ring connection, then there
                // is no ring connection
                if (ringConnection.vertices.size > 0) {
                    this.addRingConnection(ringConnection);
                }
            }
        }
        // Add neighbours to the rings
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];
            ring.neighbours = RingConnection_1.default.getNeighbours(this.ringConnections, ring.id);
        }
        // Anchor the ring to one of it's members, so that the ring center will always
        // be tied to a single vertex when doing repositionings
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];
            this.graph.vertices[ring.members[0]].value.addAnchoredRing(ring.id);
        }
        // Backup the ring information to restore after placing the bridged ring.
        // This is needed in order to identify aromatic rings and stuff like this in
        // rings that are member of the superring.
        this.backupRingInformation();
        // Replace rings contained by a larger bridged ring with a bridged ring
        while (this.rings.length > 0) {
            var id = -1;
            for (var i = 0; i < this.rings.length; i++) {
                var ring_1 = this.rings[i];
                if (this.isPartOfBridgedRing(ring_1.id) && !ring_1.isBridged) {
                    id = ring_1.id;
                }
            }
            if (id === -1) {
                break;
            }
            var ring = this.getRing(id);
            var involvedRings = this.getBridgedRingRings(ring.id);
            this.bridgedRing = true;
            this.createBridgedRing(involvedRings, ring.members[0]);
            // Remove the rings
            for (var i = 0; i < involvedRings.length; i++) {
                this.removeRing(involvedRings[i]);
            }
        }
    };
    Drawer.prototype.initHydrogens = function () {
        // Do not draw hydrogens except when they are connected to a stereocenter connected to two or more rings.
        if (!this.opts.explicitHydrogens) {
            for (var i = 0; i < this.graph.vertices.length; i++) {
                var vertex = this.graph.vertices[i];
                if (vertex.value.element !== 'H') {
                    continue;
                }
                // Hydrogens should have only one neighbour, so just take the first
                // Also set hasHydrogen true on connected atom
                var neighbour = this.graph.vertices[vertex.neighbours[0]];
                neighbour.value.hasHydrogen = true;
                if (!neighbour.value.isStereoCenter || neighbour.value.rings.length < 2 && !neighbour.value.bridgedRing ||
                    neighbour.value.bridgedRing && neighbour.value.originalRings.length < 2) {
                    vertex.value.isDrawn = false;
                }
            }
        }
    };
    /**
     * Returns all rings connected by bridged bonds starting from the ring with the supplied ring id.
     *
     * @param {Number} ringId A ring id.
     * @returns {Number[]} An array containing all ring ids of rings part of a bridged ring system.
     */
    Drawer.prototype.getBridgedRingRings = function (ringId) {
        var involvedRings = Array();
        var that = this;
        var recurse = function (r) {
            var ring = that.getRing(r);
            involvedRings.push(r);
            for (var i = 0; i < ring.neighbours.length; i++) {
                var n = ring.neighbours[i];
                if (involvedRings.indexOf(n) === -1 &&
                    n !== r &&
                    RingConnection_1.default.isBridge(that.ringConnections, that.graph.vertices, r, n)) {
                    recurse(n);
                }
            }
        };
        recurse(ringId);
        return ArrayHelper_1.default.unique(involvedRings);
    };
    /**
     * Checks whether or not a ring is part of a bridged ring.
     *
     * @param {Number} ringId A ring id.
     * @returns {Boolean} A boolean indicating whether or not the supplied ring (by id) is part of a bridged ring system.
     */
    Drawer.prototype.isPartOfBridgedRing = function (ringId) {
        for (var i = 0; i < this.ringConnections.length; i++) {
            if (this.ringConnections[i].containsRing(ringId) &&
                this.ringConnections[i].isBridge(this.graph.vertices)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Creates a bridged ring.
     *
     * @param {Number[]} ringIds An array of ids of rings involved in the bridged ring.
     * @param {Number} sourceVertexId The vertex id to start the bridged ring discovery from.
     * @returns {Ring} The bridged ring.
     */
    Drawer.prototype.createBridgedRing = function (ringIds, sourceVertexId) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
        var ringMembers = new Set();
        var vertices = new Set();
        var neighbours = new Set();
        for (var i = 0; i < ringIds.length; i++) {
            var ring_2 = this.getRing(ringIds[i]);
            ring_2.isPartOfBridged = true;
            for (var j = 0; j < ring_2.members.length; j++) {
                vertices.add(ring_2.members[j]);
            }
            for (var j = 0; j < ring_2.neighbours.length; j++) {
                var id = ring_2.neighbours[j];
                if (ringIds.indexOf(id) === -1) {
                    neighbours.add(ring_2.neighbours[j]);
                }
            }
        }
        // A vertex is part of the bridged ring if it only belongs to
        // one of the rings (or to another ring
        // which is not part of the bridged ring).
        var leftovers = new Set();
        try {
            for (var vertices_1 = tslib_1.__values(vertices), vertices_1_1 = vertices_1.next(); !vertices_1_1.done; vertices_1_1 = vertices_1.next()) {
                var id = vertices_1_1.value;
                var vertex = this.graph.vertices[id];
                var intersection = ArrayHelper_1.default.intersection(ringIds, vertex.value.rings);
                if (vertex.value.rings.length === 1 || intersection.length === 1) {
                    ringMembers.add(vertex.id);
                }
                else {
                    leftovers.add(vertex.id);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vertices_1_1 && !vertices_1_1.done && (_a = vertices_1.return)) _a.call(vertices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Vertices can also be part of multiple rings and lay on the bridged ring,
        // however, they have to have at least two neighbours that are not part of
        // two rings
        // let tmp = Array();
        var insideRing = Array();
        try {
            for (var leftovers_1 = tslib_1.__values(leftovers), leftovers_1_1 = leftovers_1.next(); !leftovers_1_1.done; leftovers_1_1 = leftovers_1.next()) {
                var id = leftovers_1_1.value;
                var vertex = this.graph.vertices[id];
                var onRing = false;
                for (var j_1 = 0; j_1 < vertex.edges.length; j_1++) {
                    if (this.edgeRingCount(vertex.edges[j_1]) === 1) {
                        onRing = true;
                    }
                }
                if (onRing) {
                    vertex.value.isBridgeNode = true;
                    ringMembers.add(vertex.id);
                }
                else {
                    vertex.value.isBridge = true;
                    ringMembers.add(vertex.id);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (leftovers_1_1 && !leftovers_1_1.done && (_b = leftovers_1.return)) _b.call(leftovers_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Create the ring
        var ring = new Ring_1.default(tslib_1.__spread(ringMembers));
        this.addRing(ring);
        ring.isBridged = true;
        ring.neighbours = tslib_1.__spread(neighbours);
        for (var i = 0; i < ringIds.length; i++) {
            ring.rings.push(this.getRing(ringIds[i]).clone());
        }
        for (var i = 0; i < ring.members.length; i++) {
            this.graph.vertices[ring.members[i]].value.bridgedRing = ring.id;
        }
        // Atoms inside the ring are no longer part of a ring but are now
        // associated with the bridged ring
        for (var i = 0; i < insideRing.length; i++) {
            var vertex = this.graph.vertices[insideRing[i]];
            vertex.value.rings = Array();
        }
        try {
            // Remove former rings from members of the bridged ring and add the bridged ring
            for (var ringMembers_1 = tslib_1.__values(ringMembers), ringMembers_1_1 = ringMembers_1.next(); !ringMembers_1_1.done; ringMembers_1_1 = ringMembers_1.next()) {
                var id = ringMembers_1_1.value;
                var vertex = this.graph.vertices[id];
                vertex.value.rings = ArrayHelper_1.default.removeAll(vertex.value.rings, ringIds);
                vertex.value.rings.push(ring.id);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (ringMembers_1_1 && !ringMembers_1_1.done && (_c = ringMembers_1.return)) _c.call(ringMembers_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // Remove all the ring connections no longer used
        for (var i = 0; i < ringIds.length; i++) {
            for (var j = i + 1; j < ringIds.length; j++) {
                this.removeRingConnectionsBetween(ringIds[i], ringIds[j]);
            }
        }
        try {
            // Update the ring connections and add this ring to the neighbours neighbours
            for (var neighbours_1 = tslib_1.__values(neighbours), neighbours_1_1 = neighbours_1.next(); !neighbours_1_1.done; neighbours_1_1 = neighbours_1.next()) {
                var id = neighbours_1_1.value;
                var connections = this.getRingConnections(id, ringIds);
                for (var j = 0; j < connections.length; j++) {
                    this.getRingConnection(connections[j]).updateOther(ring.id, id);
                }
                this.getRing(id).neighbours.push(ring.id);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (neighbours_1_1 && !neighbours_1_1.done && (_d = neighbours_1.return)) _d.call(neighbours_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return ring;
    };
    /**
     * Checks whether or not two vertices are in the same ring.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {Boolean} A boolean indicating whether or not the two vertices are in the same ring.
     */
    Drawer.prototype.areVerticesInSameRing = function (vertexA, vertexB) {
        // This is a little bit lighter (without the array and push) than
        // getCommonRings().length > 0
        for (var i = 0; i < vertexA.value.rings.length; i++) {
            for (var j = 0; j < vertexB.value.rings.length; j++) {
                if (vertexA.value.rings[i] === vertexB.value.rings[j]) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Returns an array of ring ids shared by both vertices.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {Number[]} An array of ids of rings shared by the two vertices.
     */
    Drawer.prototype.getCommonRings = function (vertexA, vertexB) {
        var commonRings = Array();
        for (var i = 0; i < vertexA.value.rings.length; i++) {
            for (var j = 0; j < vertexB.value.rings.length; j++) {
                if (vertexA.value.rings[i] == vertexB.value.rings[j]) {
                    commonRings.push(vertexA.value.rings[i]);
                }
            }
        }
        return commonRings;
    };
    /**
     * Returns the aromatic or largest ring shared by the two vertices.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @returns {(Ring|null)} If an aromatic common ring exists, that ring, else the largest (non-aromatic) ring, else null.
     */
    Drawer.prototype.getLargestOrAromaticCommonRing = function (vertexA, vertexB) {
        var commonRings = this.getCommonRings(vertexA, vertexB);
        var maxSize = 0;
        var largestCommonRing = null;
        if (commonRings.length === 1) {
            return this.getRing(commonRings[0]);
        }
        for (var i = 0; i < commonRings.length; i++) {
            var ring = this.getRing(commonRings[i]);
            var size = ring.getSize();
            // if (ring.elements.indexOf('S') !== -1) {
            //   return ring;
            // }
            if (ring.isBenzeneLike(this.graph.vertices)) {
                return ring;
            }
            else {
                if (size > maxSize) {
                    //NEED TO FIX
                    // if (( ring.edges.length < 1) //&& !ring.isHaveElements
                    // // && maxSize > 0
                    // ) {
                    //   continue;
                    // }
                    if (maxSize > 0) {
                        if (largestCommonRing.members.length === 5
                            && largestCommonRing.elements.indexOf('S') !== -1
                            && largestCommonRing.neighbours.length === 1
                            && ring.edges.length < 1) {
                            continue;
                        }
                        if (largestCommonRing.members.length === 6
                            && largestCommonRing.edges.length < 1 && ring.edges.length < 1
                            && largestCommonRing.hasDoubleBondWithO) {
                            continue;
                        }
                    }
                    maxSize = size;
                    largestCommonRing = ring;
                }
                else {
                    if (size === maxSize
                    // && size === 6
                    ) {
                        if (largestCommonRing.elements.indexOf('O') !== -1) {
                            largestCommonRing = ring;
                            continue;
                        }
                        if (largestCommonRing.hasDoubleBondWithO && !ring.hasDoubleBondWithO) {
                            largestCommonRing = ring;
                        }
                        else {
                            if (!ring.hasDoubleBondWithO &&
                                size === 6 &&
                                largestCommonRing.edges.length < 1 && ring.edges.length > 1) {
                                largestCommonRing = ring;
                            }
                        }
                    }
                }
            }
        }
        return largestCommonRing;
    };
    /**
     * Returns an array of vertices positioned at a specified location.
     *
     * @param {Vector2} position The position to search for vertices.
     * @param {Number} radius The radius within to search.
     * @param {Number} excludeVertexId A vertex id to be excluded from the search results.
     * @returns {Number[]} An array containing vertex ids in a given location.
     */
    Drawer.prototype.getVerticesAt = function (position, radius, excludeVertexId) {
        var locals = Array();
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            if (vertex.id === excludeVertexId || !vertex.positioned) {
                continue;
            }
            var distance = position.distanceSq(vertex.position);
            if (distance <= radius * radius) {
                locals.push(vertex.id);
            }
        }
        return locals;
    };
    /**
     * Returns the closest vertex (connected as well as unconnected).
     *
     * @param {Vertex} vertex The vertex of which to find the closest other vertex.
     * @returns {Vertex} The closest vertex.
     */
    Drawer.prototype.getClosestVertex = function (vertex) {
        var minDist = 99999;
        var minVertex = null;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var v = this.graph.vertices[i];
            if (v.id === vertex.id) {
                continue;
            }
            var distSq = vertex.position.distanceSq(v.position);
            if (distSq < minDist) {
                minDist = distSq;
                minVertex = v;
            }
        }
        return minVertex;
    };
    /**
     * Add a ring to this representation of a molecule.
     *
     * @param {Ring} ring A new ring.
     * @returns {Number} The ring id of the new ring.
     */
    Drawer.prototype.addRing = function (ring) {
        ring.id = this.ringIdCounter++;
        this.rings.push(ring);
        return ring.id;
    };
    /**
     * Removes a ring from the array of rings associated with the current molecule.
     *
     * @param {Number} ringId A ring id.
     */
    Drawer.prototype.removeRing = function (ringId) {
        this.rings = this.rings.filter(function (item) {
            return item.id !== ringId;
        });
        // Also remove ring connections involving this ring
        this.ringConnections = this.ringConnections.filter(function (item) {
            return item.firstRingId !== ringId && item.secondRingId !== ringId;
        });
        // Remove the ring as neighbour of other rings
        for (var i = 0; i < this.rings.length; i++) {
            var r = this.rings[i];
            r.neighbours = r.neighbours.filter(function (item) {
                return item !== ringId;
            });
        }
    };
    /**
     * Gets a ring object from the array of rings associated with the current molecule by its id. The ring id is not equal to the index, since rings can be added and removed when processing bridged rings.
     *
     * @param {Number} ringId A ring id.
     * @returns {Ring} A ring associated with the current molecule.
     */
    Drawer.prototype.getRing = function (ringId) {
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].id == ringId) {
                return this.rings[i];
            }
        }
    };
    /**
     * Add a ring connection to this representation of a molecule.
     *
     * @param {RingConnection} ringConnection A new ringConnection.
     * @returns {Number} The ring connection id of the new ring connection.
     */
    Drawer.prototype.addRingConnection = function (ringConnection) {
        ringConnection.id = this.ringConnectionIdCounter++;
        this.ringConnections.push(ringConnection);
        return ringConnection.id;
    };
    /**
     * Removes a ring connection from the array of rings connections associated with the current molecule.
     *
     * @param {Number} ringConnectionId A ring connection id.
     */
    Drawer.prototype.removeRingConnection = function (ringConnectionId) {
        this.ringConnections = this.ringConnections.filter(function (item) {
            return item.id !== ringConnectionId;
        });
    };
    /**
     * Removes all ring connections between two vertices.
     *
     * @param {Number} vertexIdA A vertex id.
     * @param {Number} vertexIdB A vertex id.
     */
    Drawer.prototype.removeRingConnectionsBetween = function (vertexIdA, vertexIdB) {
        var toRemove = Array();
        for (var i = 0; i < this.ringConnections.length; i++) {
            var ringConnection = this.ringConnections[i];
            if (ringConnection.firstRingId === vertexIdA && ringConnection.secondRingId === vertexIdB ||
                ringConnection.firstRingId === vertexIdB && ringConnection.secondRingId === vertexIdA) {
                toRemove.push(ringConnection.id);
            }
        }
        for (var i = 0; i < toRemove.length; i++) {
            this.removeRingConnection(toRemove[i]);
        }
    };
    /**
     * Get a ring connection with a given id.
     *
     * @param {Number} id
     * @returns {RingConnection} The ring connection with the specified id.
     */
    Drawer.prototype.getRingConnection = function (id) {
        for (var i = 0; i < this.ringConnections.length; i++) {
            if (this.ringConnections[i].id == id) {
                return this.ringConnections[i];
            }
        }
    };
    /**
     * Get the ring connections between a ring and a set of rings.
     *
     * @param {Number} ringId A ring id.
     * @param {Number[]} ringIds An array of ring ids.
     * @returns {Number[]} An array of ring connection ids.
     */
    Drawer.prototype.getRingConnections = function (ringId, ringIds) {
        var ringConnections = Array();
        for (var i = 0; i < this.ringConnections.length; i++) {
            var rc = this.ringConnections[i];
            for (var j = 0; j < ringIds.length; j++) {
                var id = ringIds[j];
                if (rc.firstRingId === ringId && rc.secondRingId === id ||
                    rc.firstRingId === id && rc.secondRingId === ringId) {
                    ringConnections.push(rc.id);
                }
            }
        }
        return ringConnections;
    };
    /**
     * Returns the overlap score of the current molecule based on its positioned vertices. The higher the score, the more overlaps occur in the structure drawing.
     *
     * @returns {Object} Returns the total overlap score and the overlap score of each vertex sorted by score (higher to lower). Example: { total: 99, scores: [ { id: 0, score: 22 }, ... ]  }
     */
    Drawer.prototype.getOverlapScore = function () {
        var total = 0.0;
        var overlapScores = new Float32Array(this.graph.vertices.length);
        for (var i = 0; i < this.graph.vertices.length; i++) {
            overlapScores[i] = 0;
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var j = this.graph.vertices.length;
            while (--j > i) {
                var a = this.graph.vertices[i];
                var b = this.graph.vertices[j];
                if (!a.value.isDrawn || !b.value.isDrawn) {
                    continue;
                }
                var dist = Vector2_1.default.subtract(a.position, b.position).lengthSq();
                if (dist < this.opts.bondLengthSq) {
                    var weighted = (this.opts.bondLength - Math.sqrt(dist)) / this.opts.bondLength;
                    total += weighted;
                    overlapScores[i] += weighted;
                    overlapScores[j] += weighted;
                }
            }
        }
        var sortable = Array();
        for (var i = 0; i < this.graph.vertices.length; i++) {
            sortable.push({
                id: i,
                score: overlapScores[i]
            });
        }
        sortable.sort(function (a, b) {
            return b.score - a.score;
        });
        return {
            total: total,
            scores: sortable,
            vertexScores: overlapScores
        };
    };
    /**
     * When drawing a double bond, choose the side to place the double bond. E.g. a double bond should always been drawn inside a ring.
     *
     * @param {Vertex} vertexA A vertex.
     * @param {Vertex} vertexB A vertex.
     * @param {Vector2[]} sides An array containing the two normals of the line spanned by the two provided vertices.
     * @returns {Object} Returns an object containing the following information: {
            totalSideCount: Counts the sides of each vertex in the molecule, is an array [ a, b ],
            totalPosition: Same as position, but based on entire molecule,
            sideCount: Counts the sides of each neighbour, is an array [ a, b ],
            position: which side to position the second bond, is 0 or 1, represents the index in the normal array. This is based on only the neighbours
            anCount: the number of neighbours of vertexA,
            bnCount: the number of neighbours of vertexB
        }
     */
    Drawer.prototype.chooseSide = function (vertexA, vertexB, sides) {
        // Check which side has more vertices
        // Get all the vertices connected to the both ends
        var an = vertexA.getNeighbours(vertexB.id);
        var bn = vertexB.getNeighbours(vertexA.id);
        var anCount = an.length;
        var bnCount = bn.length;
        // All vertices connected to the edge vertexA to vertexB
        var tn = ArrayHelper_1.default.merge(an, bn);
        // Only considering the connected vertices
        var sideCount = [0, 0];
        for (var i = 0; i < tn.length; i++) {
            var v = this.graph.vertices[tn[i]].position;
            if (v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                sideCount[0]++;
            }
            else {
                sideCount[1]++;
            }
        }
        // Considering all vertices in the graph, this is to resolve ties
        // from the above side counts
        var totalSideCount = [0, 0];
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var v = this.graph.vertices[i].position;
            if (v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                totalSideCount[0]++;
            }
            else {
                totalSideCount[1]++;
            }
        }
        return {
            totalSideCount: totalSideCount,
            totalPosition: totalSideCount[0] > totalSideCount[1] ? 0 : 1,
            sideCount: sideCount,
            position: sideCount[0] > sideCount[1] ? 0 : 1,
            anCount: anCount,
            bnCount: bnCount
        };
    };
    /**
     * Sets the center for a ring.
     *
     * @param {Ring} ring A ring.
     */
    Drawer.prototype.setRingCenter = function (ring) {
        var ringSize = ring.getSize();
        var total = new Vector2_1.default(0, 0);
        for (var i = 0; i < ringSize; i++) {
            total.add(this.graph.vertices[ring.members[i]].position);
        }
        ring.center = total.divide(ringSize);
    };
    /**
     * Gets the center of a ring contained within a bridged ring and containing a given vertex.
     *
     * @param {Ring} ring A bridged ring.
     * @param {Vertex} vertex A vertex.
     * @returns {Vector2} The center of the subring that containing the vertex.
     */
    Drawer.prototype.getSubringCenter = function (ring, vertex) {
        var rings = vertex.value.originalRings;
        var center = ring.center;
        var smallest = Number.MAX_VALUE;
        // Always get the smallest ring.
        for (var i = 0; i < rings.length; i++) {
            for (var j = 0; j < ring.rings.length; j++) {
                if (rings[i] === ring.rings[j].id) {
                    if (ring.rings[j].getSize() < smallest) {
                        center = ring.rings[j].center;
                        smallest = ring.rings[j].getSize();
                    }
                }
            }
        }
        return center;
    };
    /**
     * Draw the actual edges as bonds to the canvas.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    Drawer.prototype.drawEdges = function (debug) {
        var that = this;
        var drawn = Array(this.graph.edges.length);
        drawn.fill(false);
        this.graph.traverseBF(0, function (vertex) {
            var edges = that.graph.getEdges(vertex.id);
            for (var i = 0; i < edges.length; i++) {
                var edgeId = edges[i];
                if (!drawn[edgeId]) {
                    drawn[edgeId] = true;
                    that.drawEdge(edgeId, debug);
                }
            }
        });
        // Draw ring for implicitly defined aromatic rings
        if (!this.bridgedRing) {
            for (var i = 0; i < this.rings.length; i++) {
                var ring = this.rings[i];
                if (this.isRingAromatic(ring)) {
                    this.canvasWrapper.drawAromaticityRing(ring);
                }
            }
        }
    };
    /**
     * Draw the an edge as a bonds to the canvas.
     *
     * @param {Number} edgeId An edge id.
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    Drawer.prototype.drawEdge = function (edgeId, debug) {
        var that = this;
        var edge = this.graph.edges[edgeId];
        var vertexA = this.graph.vertices[edge.sourceId];
        var vertexB = this.graph.vertices[edge.targetId];
        var elementA = vertexA.value.element;
        var elementB = vertexB.value.element;
        if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && this.opts.atomVisualization === 'default') {
            return;
        }
        var a = vertexA.position;
        var b = vertexB.position;
        var normals = this.getEdgeNormals(edge);
        // Create a point on each side of the line
        var sides = ArrayHelper_1.default.clone(normals);
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if ((edge === null || edge === void 0 ? void 0 : edge.bondType) === '=' || this.getRingbondType(vertexA, vertexB) === '=' ||
            (edge.isPartOfAromaticRing && this.bridgedRing)) {
            // Always draw double bonds inside the ring
            var inRing = this.areVerticesInSameRing(vertexA, vertexB);
            var s = this.chooseSide(vertexA, vertexB, sides);
            if (inRing) {
                // Always draw double bonds inside a ring
                // if the bond is shared by two rings, it is drawn in the larger
                // problem: smaller ring is aromatic, bond is still drawn in larger -> fix this
                var lcr = this.getLargestOrAromaticCommonRing(vertexA, vertexB);
                var center = lcr.center;
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                // Choose the normal that is on the same side as the center
                var line = null;
                if (center.sameSideAs(vertexA.position, vertexB.position, Vector2_1.default.add(a, normals[0]))) {
                    line = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                }
                else {
                    line = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                }
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                // The shortened edge
                if (edge.isPartOfAromaticRing) {
                    this.canvasWrapper.drawLine(line, true);
                }
                else {
                    this.canvasWrapper.drawLine(line);
                }
                // The normal edge
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if (edge.center || vertexA.isTerminal() && vertexB.isTerminal()) {
                normals[0].multiplyScalar(that.opts.halfBondSpacing);
                normals[1].multiplyScalar(that.opts.halfBondSpacing);
                var lineA = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                var lineB = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                this.canvasWrapper.drawLine(lineA);
                this.canvasWrapper.drawLine(lineB);
            }
            else if (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1) {
                // Both lines are the same length here
                // Add the spacing to the edges (which are of unit length)
                normals[0].multiplyScalar(that.opts.halfBondSpacing);
                normals[1].multiplyScalar(that.opts.halfBondSpacing);
                var lineA = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                var lineB = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                this.canvasWrapper.drawLine(lineA);
                this.canvasWrapper.drawLine(lineB);
            }
            else if (s.sideCount[0] > s.sideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if (s.sideCount[0] < s.sideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if (s.totalSideCount[0] > s.totalSideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if (s.totalSideCount[0] <= s.totalSideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else {
            }
        }
        else if ((edge === null || edge === void 0 ? void 0 : edge.bondType) === '#') {
            normals[0].multiplyScalar(that.opts.bondSpacing / 1.5);
            normals[1].multiplyScalar(that.opts.bondSpacing / 1.5);
            var lineA = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
            var lineB = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
            this.canvasWrapper.drawLine(lineA);
            this.canvasWrapper.drawLine(lineB);
            this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
        }
        else if ((edge === null || edge === void 0 ? void 0 : edge.bondType) === '.') {
            // TODO: Something... maybe... version 2?
        }
        else {
            var isChiralCenterA = vertexA.value.isStereoCenter;
            var isChiralCenterB = vertexB.value.isStereoCenter;
            if (edge.wedge === 'up') {
                this.canvasWrapper.drawWedge(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
            else if (edge.wedge === 'down') {
                this.canvasWrapper.drawDashedWedge(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
            else {
                this.canvasWrapper.drawLine(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
        }
        if (debug) {
            var midpoint = Vector2_1.default.midpoint(a, b);
            this.canvasWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
        }
    };
    /**
     * Draws the vertices representing atoms to the canvas.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug messages to the canvas.
     */
    Drawer.prototype.drawVertices = function (debug) {
        var i = this.graph.vertices.length;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            var atom = vertex.value;
            var charge = 0;
            var isotope = 0;
            var bondCount = vertex.value.bondCount;
            var element = atom.element;
            var hydrogens = Atom_1.default.maxBonds[element] - bondCount;
            var dir = vertex.getTextDirection(this.graph.vertices);
            var isTerminal = this.opts.terminalCarbons || element !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
            var isCarbon = atom.element === 'C';
            // This is a HACK to remove all hydrogens from nitrogens in aromatic rings, as this
            // should be the most common state. This has to be fixed by kekulization
            if (atom.element === 'N' && atom.isPartOfAromaticRing) {
                hydrogens = 0;
            }
            if (atom.bracket) {
                hydrogens = atom.bracket.hcount;
                charge = atom.bracket.charge;
                isotope = atom.bracket.isotope;
            }
            if (this.opts.atomVisualization === 'allballs') {
                this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, element);
            }
            else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) || this.graph.vertices.length === 1) {
                if (this.opts.atomVisualization === 'default') {
                    this.canvasWrapper.drawText(vertex.position.x, vertex.position.y, element, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements());
                }
                else if (this.opts.atomVisualization === 'balls') {
                    this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, element);
                }
            }
            else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
                // If there is a carbon which bonds are in a straight line, draw a dot
                var a = this.graph.vertices[vertex.neighbours[0]].position;
                var b = this.graph.vertices[vertex.neighbours[1]].position;
                var angle = Vector2_1.default.threePointangle(vertex.position, a, b);
                if (Math.abs(Math.PI - angle) < 0.1) {
                    this.canvasWrapper.drawPoint(vertex.position.x, vertex.position.y, element);
                }
            }
            if (debug) {
                var value = 'v: ' + vertex.id + ' ' + ArrayHelper_1.default.print(atom.ringbonds);
                this.canvasWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
            }
            else {
                // this.canvasWrapper.drawDebugText(vertex.position.x, vertex.position.y, vertex.value.chirality);
            }
        }
        // Draw the ring centers for debug purposes
        if (this.opts.debug) {
            for (var i = 0; i < this.rings.length; i++) {
                var center = this.rings[i].center;
                this.canvasWrapper.drawDebugPoint(center.x, center.y, 'r: ' + this.rings[i].id);
            }
        }
    };
    /**
     * Position the vertices according to their bonds and properties.
     */
    Drawer.prototype.position = function () {
        var startVertex = null;
        // Always start drawing at a bridged ring if there is one
        // If not, start with a ring
        // else, start with 0
        for (var i = 0; i < this.graph.vertices.length; i++) {
            if (this.graph.vertices[i].value.bridgedRing !== null) {
                startVertex = this.graph.vertices[i];
                break;
            }
        }
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isBridged) {
                startVertex = this.graph.vertices[this.rings[i].members[0]];
            }
        }
        if (this.rings.length > 0 && startVertex === null) {
            startVertex = this.graph.vertices[this.rings[0].members[0]];
        }
        if (startVertex === null) {
            startVertex = this.graph.vertices[0];
        }
        this.createNextBond(startVertex, null, 0.0);
    };
    /**
     * Stores the current information associated with rings.
     */
    Drawer.prototype.backupRingInformation = function () {
        this.originalRings = Array();
        this.originalRingConnections = Array();
        for (var i = 0; i < this.rings.length; i++) {
            this.originalRings.push(this.rings[i]);
        }
        for (var i = 0; i < this.ringConnections.length; i++) {
            this.originalRingConnections.push(this.ringConnections[i]);
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            this.graph.vertices[i].value.backupRings();
        }
    };
    /**
     * Restores the most recently backed up information associated with rings.
     */
    Drawer.prototype.restoreRingInformation = function () {
        // Get the subring centers from the bridged rings
        var bridgedRings = this.getBridgedRings();
        this.rings = Array();
        this.ringConnections = Array();
        for (var i = 0; i < bridgedRings.length; i++) {
            var bridgedRing = bridgedRings[i];
            for (var j = 0; j < bridgedRing.rings.length; j++) {
                var ring = bridgedRing.rings[j];
                this.originalRings[ring.id].center = ring.center;
            }
        }
        for (var i = 0; i < this.originalRings.length; i++) {
            this.rings.push(this.originalRings[i]);
        }
        for (var i = 0; i < this.originalRingConnections.length; i++) {
            this.ringConnections.push(this.originalRingConnections[i]);
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            this.graph.vertices[i].value.restoreRings();
        }
    };
    // TODO: This needs some cleaning up
    /**
     * Creates a new ring, that is, positiones all the vertices inside a ring.
     *
     * @param {Ring} ring The ring to position.
     * @param {(Vector2|null)} [center=null] The center of the ring to be created.
     * @param {(Vertex|null)} [startVertex=null] The first vertex to be positioned inside the ring.
     * @param {(Vertex|null)} [previousVertex=null] The last vertex that was positioned.
     * @param {Boolean} [previousVertex=false] A boolean indicating whether or not this ring was force positioned already - this is needed after force layouting a ring, in order to draw rings connected to it.
     */
    Drawer.prototype.createRing = function (ring, center, startVertex, previousVertex) {
        if (center === void 0) { center = null; }
        if (startVertex === void 0) { startVertex = null; }
        if (previousVertex === void 0) { previousVertex = null; }
        if (ring.positioned) {
            return;
        }
        center = center ? center : new Vector2_1.default(0, 0);
        var orderedNeighbours = ring.getOrderedNeighbours(this.ringConnections);
        var startingAngle = startVertex ? Vector2_1.default.subtract(startVertex.position, center).angle() : 0;
        var radius = MathHelper_1.default.polyCircumradius(this.opts.bondLength, ring.getSize());
        var angle = MathHelper_1.default.centralAngle(ring.getSize());
        ring.centralAngle = angle;
        var a = startingAngle;
        var that = this;
        var startVertexId = (startVertex) ? startVertex.id : null;
        if (ring.members.indexOf(startVertexId) === -1) {
            if (startVertex) {
                startVertex.positioned = false;
            }
            startVertexId = ring.members[0];
        }
        // If the ring is bridged, then draw the vertices inside the ring
        // using a force based approach
        if (ring.isBridged) {
            this.graph.kkLayout(ring.members.slice(), center, startVertex.id, ring, this.opts.bondLength, this.opts.kkThreshold, this.opts.kkInnerThreshold, this.opts.kkMaxIteration, this.opts.kkMaxInnerIteration, this.opts.kkMaxEnergy);
            ring.positioned = true;
            // Update the center of the bridged ring
            this.setRingCenter(ring);
            center = ring.center;
            // Setting the centers for the subrings
            for (var i = 0; i < ring.rings.length; i++) {
                this.setRingCenter(ring.rings[i]);
            }
        }
        else {
            ring.eachMember(this.graph.vertices, function (v) {
                var vertex = that.graph.vertices[v];
                if (!vertex.positioned) {
                    vertex.setPosition(center.x + Math.cos(a) * radius, center.y + Math.sin(a) * radius);
                }
                a += angle;
                if (!ring.isBridged || ring.rings.length < 3) {
                    vertex.angle = a;
                    vertex.positioned = true;
                }
            }, startVertexId, (previousVertex) ? previousVertex.id : null);
        }
        ring.positioned = true;
        ring.center = center;
        // Draw neighbours in decreasing order of connectivity
        for (var i = 0; i < orderedNeighbours.length; i++) {
            var neighbour = this.getRing(orderedNeighbours[i].neighbour);
            if (neighbour.positioned) {
                continue;
            }
            var vertices = RingConnection_1.default.getVertices(this.ringConnections, ring.id, neighbour.id);
            if (vertices.length === 2) {
                // This ring is a fused ring
                ring.isFused = true;
                neighbour.isFused = true;
                var vertexA = this.graph.vertices[vertices[0]];
                var vertexB = this.graph.vertices[vertices[1]];
                // Get middle between vertex A and B
                var midpoint = Vector2_1.default.midpoint(vertexA.position, vertexB.position);
                // Get the normals to the line between A and B
                var normals = Vector2_1.default.normals(vertexA.position, vertexB.position);
                // Normalize the normals
                normals[0].normalize();
                normals[1].normalize();
                // Set length from middle of side to center (the apothem)
                var r = MathHelper_1.default.polyCircumradius(this.opts.bondLength, neighbour.getSize());
                var apothem = MathHelper_1.default.apothem(r, neighbour.getSize());
                normals[0].multiplyScalar(apothem).add(midpoint);
                normals[1].multiplyScalar(apothem).add(midpoint);
                // Pick the normal which results in a larger distance to the previous center
                // Also check whether it's inside another ring
                var nextCenter = normals[0];
                if (Vector2_1.default.subtract(center, normals[1]).lengthSq() > Vector2_1.default.subtract(center, normals[0]).lengthSq()) {
                    nextCenter = normals[1];
                }
                // Get the vertex (A or B) which is in clock-wise direction of the other
                var posA = Vector2_1.default.subtract(vertexA.position, nextCenter);
                var posB = Vector2_1.default.subtract(vertexB.position, nextCenter);
                if (posA.clockwise(posB) === -1) {
                    if (!neighbour.positioned) {
                        this.createRing(neighbour, nextCenter, vertexA, vertexB);
                    }
                }
                else {
                    if (!neighbour.positioned) {
                        this.createRing(neighbour, nextCenter, vertexB, vertexA);
                    }
                }
            }
            else if (vertices.length === 1) {
                // This ring is a spiro
                ring.isSpiro = true;
                neighbour.isSpiro = true;
                var vertexA = this.graph.vertices[vertices[0]];
                // Get the vector pointing from the shared vertex to the new centpositioner
                var nextCenter = Vector2_1.default.subtract(center, vertexA.position);
                nextCenter.invert();
                nextCenter.normalize();
                // Get the distance from the vertex to the center
                var r = MathHelper_1.default.polyCircumradius(this.opts.bondLength, neighbour.getSize());
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertexA.position);
                if (!neighbour.positioned) {
                    this.createRing(neighbour, nextCenter, vertexA);
                }
            }
        }
        // Next, draw atoms that are not part of a ring that are directly attached to this ring
        for (var i = 0; i < ring.members.length; i++) {
            var ringMember = this.graph.vertices[ring.members[i]];
            var ringMemberNeighbours = ringMember.neighbours;
            // If there are multiple, the ovlerap will be resolved in the appropriate step
            for (var j = 0; j < ringMemberNeighbours.length; j++) {
                var v = this.graph.vertices[ringMemberNeighbours[j]];
                if (v.positioned) {
                    continue;
                }
                v.value.isConnectedToRing = true;
                this.createNextBond(v, ringMember, 0.0);
            }
        }
    };
    /**
     * Rotate an entire subtree by an angle around a center.
     *
     * @param {Number} vertexId A vertex id (the root of the sub-tree).
     * @param {Number} parentVertexId A vertex id in the previous direction of the subtree that is to rotate.
     * @param {Number} angle An angle in randians.
     * @param {Vector2} center The rotational center.
     */
    Drawer.prototype.rotateSubtree = function (vertexId, parentVertexId, angle, center) {
        var that = this;
        this.graph.traverseTree(vertexId, parentVertexId, function (vertex) {
            vertex.position.rotateAround(angle, center);
            for (var i = 0; i < vertex.value.anchoredRings.length; i++) {
                var ring = that.rings[vertex.value.anchoredRings[i]];
                if (ring) {
                    ring.center.rotateAround(angle, center);
                }
            }
        });
    };
    /**
     * Gets the overlap score of a subtree.
     *
     * @param {Number} vertexId A vertex id (the root of the sub-tree).
     * @param {Number} parentVertexId A vertex id in the previous direction of the subtree.
     * @param {Number[]} vertexOverlapScores An array containing the vertex overlap scores indexed by vertex id.
     * @returns {Object} An object containing the total overlap score and the center of mass of the subtree weighted by overlap score { value: 0.2, center: new Vector2() }.
     */
    Drawer.prototype.getSubtreeOverlapScore = function (vertexId, parentVertexId, vertexOverlapScores) {
        var that = this;
        var score = 0;
        var center = new Vector2_1.default(0, 0);
        var count = 0;
        this.graph.traverseTree(vertexId, parentVertexId, function (vertex) {
            if (!vertex.value.isDrawn) {
                return;
            }
            var s = vertexOverlapScores[vertex.id];
            if (s > that.opts.overlapSensitivity) {
                score += s;
                count++;
            }
            var position = that.graph.vertices[vertex.id].position.clone();
            position.multiplyScalar(s);
            center.add(position);
        });
        center.divide(score);
        return {
            value: score / count,
            center: center
        };
    };
    /**
     * Returns the current (positioned vertices so far) center of mass.
     *
     * @returns {Vector2} The current center of mass.
     */
    Drawer.prototype.getCurrentCenterOfMass = function () {
        var total = new Vector2_1.default(0, 0);
        var count = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            if (vertex.positioned) {
                total.add(vertex.position);
                count++;
            }
        }
        return total.divide(count);
    };
    /**
     * Returns the current (positioned vertices so far) center of mass in the neighbourhood of a given position.
     *
     * @param {Vector2} vec The point at which to look for neighbours.
     * @param {Number} [r=currentBondLength*2.0] The radius of vertices to include.
     * @returns {Vector2} The current center of mass.
     */
    Drawer.prototype.getCurrentCenterOfMassInNeigbourhood = function (vec, r) {
        if (r === void 0) { r = this.opts.bondLength * 2.0; }
        var total = new Vector2_1.default(0, 0);
        var count = 0;
        var rSq = r * r;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            if (vertex.positioned && vec.distanceSq(vertex.position) < rSq) {
                total.add(vertex.position);
                count++;
            }
        }
        return total.divide(count);
    };
    /**
     * Resolve primary (exact) overlaps, such as two vertices that are connected to the same ring vertex.
     */
    Drawer.prototype.resolvePrimaryOverlaps = function () {
        var overlaps = Array();
        var done = Array(this.graph.vertices.length);
        // Looking for overlaps created by two bonds coming out of a ring atom, which both point straight
        // away from the ring and are thus perfectly overlapping.
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];
            for (var j = 0; j < ring.members.length; j++) {
                var vertex = this.graph.vertices[ring.members[j]];
                if (done[vertex.id]) {
                    continue;
                }
                done[vertex.id] = true;
                var nonRingNeighbours = this.getNonRingNeighbours(vertex.id);
                if (nonRingNeighbours.length > 1) {
                    // Look for rings where there are atoms with two bonds outside the ring (overlaps)
                    var rings = Array();
                    for (var k = 0; k < vertex.value.rings.length; k++) {
                        rings.push(vertex.value.rings[k]);
                    }
                    overlaps.push({
                        common: vertex,
                        rings: rings,
                        vertices: nonRingNeighbours
                    });
                }
                else if (nonRingNeighbours.length === 1 && vertex.value.rings.length === 2) {
                    // Look for bonds coming out of joined rings to adjust the angle, an example is: C1=CC(=CC=C1)[C@]12SCCN1CC1=CC=CC=C21
                    // where the angle has to be adjusted to account for fused ring
                    var rings = Array();
                    for (var k = 0; k < vertex.value.rings.length; k++) {
                        rings.push(vertex.value.rings[k]);
                    }
                    overlaps.push({
                        common: vertex,
                        rings: rings,
                        vertices: nonRingNeighbours
                    });
                }
            }
        }
        for (var i = 0; i < overlaps.length; i++) {
            var overlap = overlaps[i];
            if (overlap.vertices.length === 2) {
                var a = overlap.vertices[0];
                var b = overlap.vertices[1];
                if (!a.value.isDrawn || !b.value.isDrawn) {
                    continue;
                }
                var angle = (2 * Math.PI - this.getRing(overlap.rings[0]).getAngle()) / 6.0;
                this.rotateSubtree(a.id, overlap.common.id, angle, overlap.common.position);
                this.rotateSubtree(b.id, overlap.common.id, -angle, overlap.common.position);
                // Decide which way to rotate the vertices depending on the effect it has on the overlap score
                var overlapScore = this.getOverlapScore();
                var subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                var subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);
                var total = subTreeOverlapA.value + subTreeOverlapB.value;
                this.rotateSubtree(a.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                this.rotateSubtree(b.id, overlap.common.id, 2.0 * angle, overlap.common.position);
                overlapScore = this.getOverlapScore();
                subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);
                if (subTreeOverlapA.value + subTreeOverlapB.value > total) {
                    this.rotateSubtree(a.id, overlap.common.id, 2.0 * angle, overlap.common.position);
                    this.rotateSubtree(b.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                }
            }
            else if (overlap.vertices.length === 1) {
                if (overlap.rings.length === 2) {
                    // TODO: Implement for more overlap resolution
                    // console.log(overlap);
                }
            }
        }
    };
    /**
     * Resolve secondary overlaps. Those overlaps are due to the structure turning back on itself.
     *
     * @param {Object[]} scores An array of objects sorted descending by score.
     * @param {Number} scores[].id A vertex id.
     * @param {Number} scores[].score The overlap score associated with the vertex id.
     */
    Drawer.prototype.resolveSecondaryOverlaps = function (scores) {
        for (var i = 0; i < scores.length; i++) {
            if (scores[i].score > this.opts.overlapSensitivity) {
                var vertex = this.graph.vertices[scores[i].id];
                if (vertex.isTerminal()) {
                    var closest = this.getClosestVertex(vertex);
                    if (closest) {
                        // If one of the vertices is the first one, the previous vertex is not the central vertex but the dummy
                        // so take the next rather than the previous, which is vertex 1
                        var closestPosition = null;
                        if (closest.isTerminal()) {
                            closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.previousPosition;
                        }
                        else {
                            closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.position;
                        }
                        var vertexPreviousPosition = vertex.id === 0 ? this.graph.vertices[1].position : vertex.previousPosition;
                        vertex.position.rotateAwayFrom(closestPosition, vertexPreviousPosition, MathHelper_1.default.toRad(20));
                    }
                }
            }
        }
    };
    /**
     * Get the last non-null or 0 angle vertex.
     * @param {Number} vertexId A vertex id.
     * @returns {Vertex} The last vertex with an angle that was not 0 or null.
     */
    Drawer.prototype.getLastVertexWithAngle = function (vertexId) {
        var angle = 0;
        var vertex = null;
        while (!angle && vertexId) {
            vertex = this.graph.vertices[vertexId];
            angle = vertex.angle;
            vertexId = vertex.parentVertexId;
        }
        return vertex;
    };
    /**
     * Positiones the next vertex thus creating a bond.
     *
     * @param {Vertex} vertex A vertex.
     * @param {Vertex} [previousVertex=null] The previous vertex which has been positioned.
     * @param {Number} [angle=0.0] The (global) angle of the vertex.
     * @param {Boolean} [originShortest=false] Whether the origin is the shortest subtree in the branch.
     * @param {Boolean} [skipPositioning=false] Whether or not to skip positioning and just check the neighbours.
     */
    Drawer.prototype.createNextBond = function (vertex, previousVertex, angle, originShortest, skipPositioning) {
        var _a, _b;
        if (previousVertex === void 0) { previousVertex = null; }
        if (angle === void 0) { angle = 0.0; }
        if (originShortest === void 0) { originShortest = false; }
        if (skipPositioning === void 0) { skipPositioning = false; }
        if (vertex.positioned && !skipPositioning) {
            return;
        }
        // If the double bond config was set on this vertex, do not check later
        var doubleBondConfigSet = false;
        // Keeping track of configurations around double bonds
        if (previousVertex) {
            var edge = this.graph.getEdge(vertex.id, previousVertex.id);
            if (((edge === null || edge === void 0 ? void 0 : edge.bondType) === '/' || (edge === null || edge === void 0 ? void 0 : edge.bondType) === '\\') && ++this.doubleBondConfigCount % 2 === 1) {
                if (this.doubleBondConfig === null) {
                    this.doubleBondConfig = edge.bondType;
                    doubleBondConfigSet = true;
                    // Switch if the bond is a branch bond and previous vertex is the first
                    // TODO: Why is it different with the first vertex?
                    if (previousVertex.parentVertexId === null && vertex.value.branchBond) {
                        if (this.doubleBondConfig === '/') {
                            this.doubleBondConfig = '\\';
                        }
                        else if (this.doubleBondConfig === '\\') {
                            this.doubleBondConfig = '/';
                        }
                    }
                }
            }
        }
        // If the current node is the member of one ring, then point straight away
        // from the center of the ring. However, if the current node is a member of
        // two rings, point away from the middle of the centers of the two rings
        if (!skipPositioning) {
            if (!previousVertex) {
                // Add a (dummy) previous position if there is no previous vertex defined
                // Since the first vertex is at (0, 0), create a vector at (bondLength, 0)
                // and rotate it by 90°
                var dummy = new Vector2_1.default(this.opts.bondLength, 0);
                dummy.rotate(MathHelper_1.default.toRad(-60));
                vertex.previousPosition = dummy;
                vertex.setPosition(this.opts.bondLength, 0);
                vertex.angle = MathHelper_1.default.toRad(-60);
                // Do not position the vertex if it belongs to a bridged ring that is positioned using a layout algorithm.
                if (vertex.value.bridgedRing === null) {
                    vertex.positioned = true;
                }
            }
            else if (previousVertex.value.rings.length > 0) {
                var neighbours = previousVertex.neighbours;
                var joinedVertex = null;
                var pos = new Vector2_1.default(0.0, 0.0);
                if (previousVertex.value.bridgedRing === null && previousVertex.value.rings.length > 1) {
                    for (var i = 0; i < neighbours.length; i++) {
                        var neighbour = this.graph.vertices[neighbours[i]];
                        if (ArrayHelper_1.default.containsAll(neighbour.value.rings, previousVertex.value.rings)) {
                            joinedVertex = neighbour;
                            break;
                        }
                    }
                }
                if (joinedVertex === null) {
                    for (var i = 0; i < neighbours.length; i++) {
                        var v = this.graph.vertices[neighbours[i]];
                        if (v.positioned && this.areVerticesInSameRing(v, previousVertex)) {
                            pos.add(Vector2_1.default.subtract(v.position, previousVertex.position));
                        }
                    }
                    pos.invert().normalize().multiplyScalar(this.opts.bondLength).add(previousVertex.position);
                }
                else {
                    pos = joinedVertex.position.clone().rotateAround(Math.PI, previousVertex.position);
                }
                vertex.previousPosition = previousVertex.position;
                vertex.setPositionFromVector(pos);
                vertex.positioned = true;
            }
            else {
                // If the previous vertex was not part of a ring, draw a bond based
                // on the global angle of the previous bond
                var v = new Vector2_1.default(this.opts.bondLength, 0);
                v.rotate(angle);
                v.add(previousVertex.position);
                vertex.setPositionFromVector(v);
                vertex.previousPosition = previousVertex.position;
                vertex.positioned = true;
            }
        }
        // Go to next vertex
        // If two rings are connected by a bond ...
        if (vertex.value.bridgedRing !== null) {
            var nextRing = this.getRing(vertex.value.bridgedRing);
            if (!nextRing.positioned) {
                var nextCenter = Vector2_1.default.subtract(vertex.previousPosition, vertex.position);
                nextCenter.invert();
                nextCenter.normalize();
                var r = MathHelper_1.default.polyCircumradius(this.opts.bondLength, nextRing.members.length);
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertex.position);
                this.createRing(nextRing, nextCenter, vertex);
            }
        }
        else if (vertex.value.rings.length > 0) {
            var nextRing = this.getRing(vertex.value.rings[0]);
            if (!nextRing.positioned) {
                var nextCenter = Vector2_1.default.subtract(vertex.previousPosition, vertex.position);
                nextCenter.invert();
                nextCenter.normalize();
                var r = MathHelper_1.default.polyCircumradius(this.opts.bondLength, nextRing.getSize());
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertex.position);
                this.createRing(nextRing, nextCenter, vertex);
            }
        }
        else {
            // Draw the non-ring vertices connected to this one
            // let isStereoCenter = vertex.value.isStereoCenter;
            var tmpNeighbours = vertex.getNeighbours();
            var neighbours = Array();
            // Remove neighbours that are not drawn
            for (var i = 0; i < tmpNeighbours.length; i++) {
                if (this.graph.vertices[tmpNeighbours[i]].value.isDrawn) {
                    neighbours.push(tmpNeighbours[i]);
                }
            }
            // Remove the previous vertex (which has already been drawn)
            if (previousVertex) {
                neighbours = ArrayHelper_1.default.remove(neighbours, previousVertex.id);
            }
            var previousAngle = vertex.getAngle();
            if (neighbours.length === 1) {
                var nextVertex = this.graph.vertices[neighbours[0]];
                // Make a single chain always cis except when there's a tribble (yes, this is a Star Trek reference) bond
                // or if there are successive double bonds. Added a ring check because if there is an aromatic ring the ring bond inside the ring counts as a double bond and leads to =-= being straight.
                if ((((_a = vertex.value) === null || _a === void 0 ? void 0 : _a.bondType) === '#' || (previousVertex && ((_b = previousVertex.value) === null || _b === void 0 ? void 0 : _b.bondType) === '#')) ||
                    vertex.value.bondType === '=' && previousVertex && previousVertex.value.rings.length === 0 &&
                        previousVertex.value.bondType === '=' && vertex.value.branchBond !== '-') {
                    vertex.value.drawExplicit = false;
                    if (previousVertex) {
                        var straightEdge1 = this.graph.getEdge(vertex.id, previousVertex.id);
                        straightEdge1.center = true;
                    }
                    var straightEdge2 = this.graph.getEdge(vertex.id, nextVertex.id);
                    straightEdge2.center = true;
                    if (vertex.value.bondType === '#' || previousVertex && previousVertex.value.bondType === '#') {
                        nextVertex.angle = 0.0;
                    }
                    nextVertex.drawExplicit = true;
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                }
                else if (previousVertex && previousVertex.value.rings.length > 0) {
                    // If coming out of a ring, always draw away from the center of mass
                    var proposedAngleA = MathHelper_1.default.toRad(60);
                    var proposedAngleB = -proposedAngleA;
                    var proposedVectorA = new Vector2_1.default(this.opts.bondLength, 0);
                    var proposedVectorB = new Vector2_1.default(this.opts.bondLength, 0);
                    proposedVectorA.rotate(proposedAngleA).add(vertex.position);
                    proposedVectorB.rotate(proposedAngleB).add(vertex.position);
                    // let centerOfMass = this.getCurrentCenterOfMassInNeigbourhood(vertex.position, 100);
                    var centerOfMass = this.getCurrentCenterOfMass();
                    var distanceA = proposedVectorA.distanceSq(centerOfMass);
                    var distanceB = proposedVectorB.distanceSq(centerOfMass);
                    nextVertex.angle = distanceA < distanceB ? proposedAngleB : proposedAngleA;
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                }
                else {
                    var a = vertex.angle;
                    // Take the min and max if the previous angle was in a 4-neighbourhood (90° angles)
                    // TODO: If a is null or zero, it should be checked whether or not this one should go cis or trans, that is,
                    //       it should go into the oposite direction of the last non-null or 0 previous vertex / angle.
                    if (previousVertex && previousVertex.neighbours.length > 3) {
                        if (a > 0) {
                            a = Math.min(1.0472, a);
                        }
                        else if (a < 0) {
                            a = Math.max(-1.0472, a);
                        }
                        else {
                            a = 1.0472;
                        }
                    }
                    else if (!a) {
                        var v = this.getLastVertexWithAngle(vertex.id);
                        a = v.angle;
                        if (!a) {
                            a = 1.0472;
                        }
                    }
                    // Handle configuration around double bonds
                    if (previousVertex && !doubleBondConfigSet) {
                        var bondType = this.graph.getEdge(vertex.id, nextVertex.id).bondType;
                        if (bondType === '/') {
                            if (this.doubleBondConfig === '/') {
                                // Nothing to do since it will be trans per default
                            }
                            else if (this.doubleBondConfig === '\\') {
                                a = -a;
                            }
                            this.doubleBondConfig = null;
                        }
                        else if (bondType === '\\') {
                            if (this.doubleBondConfig === '/') {
                                a = -a;
                            }
                            else if (this.doubleBondConfig === '\\') {
                                // Nothing to do since it will be trans per default
                            }
                            this.doubleBondConfig = null;
                        }
                    }
                    if (originShortest) {
                        nextVertex.angle = a;
                    }
                    else {
                        nextVertex.angle = -a;
                    }
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                }
            }
            else if (neighbours.length === 2) {
                // If the previous vertex comes out of a ring, it doesn't have an angle set
                var a = vertex.angle;
                if (!a) {
                    a = 1.0472;
                }
                // Check for the longer subtree - always go with cis for the longer subtree
                var subTreeDepthA = this.graph.getTreeDepth(neighbours[0], vertex.id);
                var subTreeDepthB = this.graph.getTreeDepth(neighbours[1], vertex.id);
                var l = this.graph.vertices[neighbours[0]];
                var r = this.graph.vertices[neighbours[1]];
                l.value.subtreeDepth = subTreeDepthA;
                r.value.subtreeDepth = subTreeDepthB;
                // Also get the subtree for the previous direction (this is important when
                // the previous vertex is the shortest path)
                var subTreeDepthC = this.graph.getTreeDepth(previousVertex ? previousVertex.id : null, vertex.id);
                if (previousVertex) {
                    previousVertex.value.subtreeDepth = subTreeDepthC;
                }
                var cis = 0;
                var trans = 1;
                // Carbons go always cis
                if (r.value.element === 'C' && l.value.element !== 'C' && subTreeDepthB > 1 && subTreeDepthA < 5) {
                    cis = 1;
                    trans = 0;
                }
                else if (r.value.element !== 'C' && l.value.element === 'C' && subTreeDepthA > 1 && subTreeDepthB < 5) {
                    cis = 0;
                    trans = 1;
                }
                else if (subTreeDepthB > subTreeDepthA) {
                    cis = 1;
                    trans = 0;
                }
                var cisVertex = this.graph.vertices[neighbours[cis]];
                var transVertex = this.graph.vertices[neighbours[trans]];
                // let edgeCis = this.graph.getEdge(vertex.id, cisVertex.id);
                // let edgeTrans = this.graph.getEdge(vertex.id, transVertex.id);
                // If the origin tree is the shortest, make them the main chain
                var originShortest_1 = false;
                if (subTreeDepthC < subTreeDepthA && subTreeDepthC < subTreeDepthB) {
                    originShortest_1 = true;
                }
                transVertex.angle = a;
                cisVertex.angle = -a;
                if (this.doubleBondConfig === '\\') {
                    if (transVertex.value.branchBond === '\\') {
                        transVertex.angle = -a;
                        cisVertex.angle = a;
                    }
                }
                else if (this.doubleBondConfig === '/') {
                    if (transVertex.value.branchBond === '/') {
                        transVertex.angle = -a;
                        cisVertex.angle = a;
                    }
                }
                this.createNextBond(transVertex, vertex, previousAngle + transVertex.angle, originShortest_1);
                this.createNextBond(cisVertex, vertex, previousAngle + cisVertex.angle, originShortest_1);
            }
            else if (neighbours.length === 3) {
                // The vertex with the longest sub-tree should always go straight
                var d1 = this.graph.getTreeDepth(neighbours[0], vertex.id);
                var d2 = this.graph.getTreeDepth(neighbours[1], vertex.id);
                var d3 = this.graph.getTreeDepth(neighbours[2], vertex.id);
                var s = this.graph.vertices[neighbours[0]];
                var l = this.graph.vertices[neighbours[1]];
                var r = this.graph.vertices[neighbours[2]];
                s.value.subtreeDepth = d1;
                l.value.subtreeDepth = d2;
                r.value.subtreeDepth = d3;
                if (d2 > d1 && d2 > d3) {
                    s = this.graph.vertices[neighbours[1]];
                    l = this.graph.vertices[neighbours[0]];
                    r = this.graph.vertices[neighbours[2]];
                }
                else if (d3 > d1 && d3 > d2) {
                    s = this.graph.vertices[neighbours[2]];
                    l = this.graph.vertices[neighbours[0]];
                    r = this.graph.vertices[neighbours[1]];
                }
                // Create a cross if more than one subtree is of length > 1
                // or the vertex is connected to a ring
                if (previousVertex &&
                    previousVertex.value.rings.length < 1 &&
                    s.value.rings.length < 1 &&
                    l.value.rings.length < 1 &&
                    r.value.rings.length < 1 &&
                    this.graph.getTreeDepth(l.id, vertex.id) === 1 &&
                    this.graph.getTreeDepth(r.id, vertex.id) === 1 &&
                    this.graph.getTreeDepth(s.id, vertex.id) > 1) {
                    s.angle = -vertex.angle;
                    if (vertex.angle >= 0) {
                        l.angle = MathHelper_1.default.toRad(30);
                        r.angle = MathHelper_1.default.toRad(90);
                    }
                    else {
                        l.angle = -MathHelper_1.default.toRad(30);
                        r.angle = -MathHelper_1.default.toRad(90);
                    }
                    this.createNextBond(s, vertex, previousAngle + s.angle);
                    this.createNextBond(l, vertex, previousAngle + l.angle);
                    this.createNextBond(r, vertex, previousAngle + r.angle);
                }
                else {
                    s.angle = 0.0;
                    l.angle = MathHelper_1.default.toRad(90);
                    r.angle = -MathHelper_1.default.toRad(90);
                    this.createNextBond(s, vertex, previousAngle + s.angle);
                    this.createNextBond(l, vertex, previousAngle + l.angle);
                    this.createNextBond(r, vertex, previousAngle + r.angle);
                }
            }
            else if (neighbours.length === 4) {
                // The vertex with the longest sub-tree should always go to the reflected opposide direction
                var d1 = this.graph.getTreeDepth(neighbours[0], vertex.id);
                var d2 = this.graph.getTreeDepth(neighbours[1], vertex.id);
                var d3 = this.graph.getTreeDepth(neighbours[2], vertex.id);
                var d4 = this.graph.getTreeDepth(neighbours[3], vertex.id);
                var w = this.graph.vertices[neighbours[0]];
                var x = this.graph.vertices[neighbours[1]];
                var y = this.graph.vertices[neighbours[2]];
                var z = this.graph.vertices[neighbours[3]];
                w.value.subtreeDepth = d1;
                x.value.subtreeDepth = d2;
                y.value.subtreeDepth = d3;
                z.value.subtreeDepth = d4;
                if (d2 > d1 && d2 > d3 && d2 > d4) {
                    w = this.graph.vertices[neighbours[1]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[2]];
                    z = this.graph.vertices[neighbours[3]];
                }
                else if (d3 > d1 && d3 > d2 && d3 > d4) {
                    w = this.graph.vertices[neighbours[2]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[1]];
                    z = this.graph.vertices[neighbours[3]];
                }
                else if (d4 > d1 && d4 > d2 && d4 > d3) {
                    w = this.graph.vertices[neighbours[3]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[1]];
                    z = this.graph.vertices[neighbours[2]];
                }
                w.angle = -MathHelper_1.default.toRad(36);
                x.angle = MathHelper_1.default.toRad(36);
                y.angle = -MathHelper_1.default.toRad(108);
                z.angle = MathHelper_1.default.toRad(108);
                this.createNextBond(w, vertex, previousAngle + w.angle);
                this.createNextBond(x, vertex, previousAngle + x.angle);
                this.createNextBond(y, vertex, previousAngle + y.angle);
                this.createNextBond(z, vertex, previousAngle + z.angle);
            }
        }
    };
    /**
     * Gets the vetex sharing the edge that is the common bond of two rings.
     *
     * @param {Vertex} vertex A vertex.
     * @returns {(Number|null)} The id of a vertex sharing the edge that is the common bond of two rings with the vertex provided or null, if none.
     */
    Drawer.prototype.getCommonRingbondNeighbour = function (vertex) {
        var neighbours = vertex.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = this.graph.vertices[neighbours[i]];
            if (ArrayHelper_1.default.containsAll(neighbour.value.rings, vertex.value.rings)) {
                return neighbour;
            }
        }
        return null;
    };
    /**
     * Check if a vector is inside any ring.
     *
     * @param {Vector2} vec A vector.
     * @returns {Boolean} A boolean indicating whether or not the point (vector) is inside any of the rings associated with the current molecule.
     */
    Drawer.prototype.isPointInRing = function (vec) {
        for (var i = 0; i < this.rings.length; i++) {
            var ring = this.rings[i];
            if (!ring.positioned) {
                continue;
            }
            var radius = MathHelper_1.default.polyCircumradius(this.opts.bondLength, ring.getSize());
            var radiusSq = radius * radius;
            if (vec.distanceSq(ring.center) < radiusSq) {
                return true;
            }
        }
        return false;
    };
    /**
     * Check whether or not an edge is part of a ring.
     *
     * @param {Edge} edge An edge.
     * @returns {Boolean} A boolean indicating whether or not the edge is part of a ring.
     */
    Drawer.prototype.isEdgeInRing = function (edge) {
        var source = this.graph.vertices[edge.sourceId];
        var target = this.graph.vertices[edge.targetId];
        return this.areVerticesInSameRing(source, target);
    };
    /**
     * Check whether or not an edge is rotatable.
     *
     * @param {Edge} edge An edge.
     * @returns {Boolean} A boolean indicating whether or not the edge is rotatable.
     */
    Drawer.prototype.isEdgeRotatable = function (edge) {
        var vertexA = this.graph.vertices[edge.sourceId];
        var vertexB = this.graph.vertices[edge.targetId];
        // Only single bonds are rotatable
        if (edge.bondType !== '-') {
            return false;
        }
        // Do not rotate edges that have a further single bond to each side - do that!
        // If the bond is terminal, it doesn't make sense to rotate it
        // if (vertexA.getNeighbourCount() + vertexB.getNeighbourCount() < 5) {
        //   return false;
        // }
        if (vertexA.isTerminal() || vertexB.isTerminal()) {
            return false;
        }
        // Ringbonds are not rotatable
        if (vertexA.value.rings.length > 0 && vertexB.value.rings.length > 0 &&
            this.areVerticesInSameRing(vertexA, vertexB)) {
            return false;
        }
        return true;
    };
    /**
     * Check whether or not a ring is an implicitly defined aromatic ring (lower case smiles).
     *
     * @param {Ring} ring A ring.
     * @returns {Boolean} A boolean indicating whether or not a ring is implicitly defined as aromatic.
     */
    Drawer.prototype.isRingAromatic = function (ring) {
        for (var i = 0; i < ring.members.length; i++) {
            var vertex = this.graph.vertices[ring.members[i]];
            if (!vertex.value.isPartOfAromaticRing) {
                return false;
            }
        }
        return true;
    };
    /**
     * Get the normals of an edge.
     *
     * @param {Edge} edge An edge.
     * @returns {Vector2[]} An array containing two vectors, representing the normals.
     */
    Drawer.prototype.getEdgeNormals = function (edge) {
        var v1 = this.graph.vertices[edge.sourceId].position;
        var v2 = this.graph.vertices[edge.targetId].position;
        // Get the normalized normals for the edge
        var normals = Vector2_1.default.units(v1, v2);
        return normals;
    };
    /**
     * Returns an array of vertices that are neighbouring a vertix but are not members of a ring (including bridges).
     *
     * @param {Number} vertexId A vertex id.
     * @returns {Vertex[]} An array of vertices.
     */
    Drawer.prototype.getNonRingNeighbours = function (vertexId) {
        var nrneighbours = Array();
        var vertex = this.graph.vertices[vertexId];
        var neighbours = vertex.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            var neighbour = this.graph.vertices[neighbours[i]];
            var nIntersections = ArrayHelper_1.default.intersection(vertex.value.rings, neighbour.value.rings).length;
            if (nIntersections === 0 && neighbour.value.isBridge == false) {
                nrneighbours.push(neighbour);
            }
        }
        return nrneighbours;
    };
    /**
     * Annotaed stereochemistry information for visualization.
     */
    Drawer.prototype.annotateStereochemistry = function () {
        var maxDepth = 10;
        // For each stereo-center
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            if (!vertex.value.isStereoCenter) {
                continue;
            }
            var neighbours = vertex.getNeighbours();
            var nNeighbours = neighbours.length;
            var priorities = Array(nNeighbours);
            for (var j = 0; j < nNeighbours; j++) {
                var visited = new Uint8Array(this.graph.vertices.length);
                var priority = Array(Array());
                visited[vertex.id] = 1;
                this.visitStereochemistry(neighbours[j], vertex.id, visited, priority, maxDepth, 0);
                // Sort each level according to atomic number
                for (var k = 0; k < priority.length; k++) {
                    priority[k].sort(function (a, b) {
                        return b - a;
                    });
                }
                priorities[j] = [j, priority];
            }
            var maxLevels = 0;
            var maxEntries = 0;
            for (var j = 0; j < priorities.length; j++) {
                if (priorities[j][1].length > maxLevels) {
                    maxLevels = priorities[j][1].length;
                }
                for (var k = 0; k < priorities[j][1].length; k++) {
                    if (priorities[j][1][k].length > maxEntries) {
                        maxEntries = priorities[j][1][k].length;
                    }
                }
            }
            for (var j = 0; j < priorities.length; j++) {
                var diff = maxLevels - priorities[j][1].length;
                for (var k = 0; k < diff; k++) {
                    priorities[j][1].push([]);
                }
                // Break ties by the position in the SMILES string as per specification
                priorities[j][1].push([neighbours[j]]);
                // Make all same length. Fill with zeroes.
                for (var k = 0; k < priorities[j][1].length; k++) {
                    var diff_1 = maxEntries - priorities[j][1][k].length;
                    for (var l = 0; l < diff_1; l++) {
                        priorities[j][1][k].push(0);
                    }
                }
            }
            priorities.sort(function (a, b) {
                for (var j = 0; j < a[1].length; j++) {
                    for (var k = 0; k < a[1][j].length; k++) {
                        if (a[1][j][k] > b[1][j][k]) {
                            return -1;
                        }
                        else if (a[1][j][k] < b[1][j][k]) {
                            return 1;
                        }
                    }
                }
                return 0;
            });
            var order = new Uint8Array(nNeighbours);
            for (var j = 0; j < nNeighbours; j++) {
                order[j] = priorities[j][0];
                vertex.value.priority = j;
            }
            // Check the angles between elements 0 and 1, and 0 and 2 to determine whether they are
            // drawn cw or ccw
            // TODO: OC(Cl)=[C@]=C(C)F currently fails here, however this is, IMHO, not a valid SMILES.
            var posA = this.graph.vertices[neighbours[order[0]]].position;
            var posB = this.graph.vertices[neighbours[order[1]]].position;
            // let posC = this.graph.vertices[neighbours[order[2]]].position;
            var cwA = posA.relativeClockwise(posB, vertex.position);
            // let cwB = posA.relativeClockwise(posC, vertex.position);
            // If the second priority is clockwise from the first, the ligands are drawn clockwise, since
            // The hydrogen can be drawn on either side
            var isCw = cwA === -1;
            var rotation = vertex.value.bracket.chirality === '@' ? -1 : 1;
            var rs = MathHelper_1.default.parityOfPermutation(order) * rotation === 1 ? 'R' : 'S';
            // Flip the hydrogen direction when the drawing doesn't match the chirality.
            var wedgeA = 'down';
            var wedgeB = 'up';
            if (isCw && rs !== 'R' || !isCw && rs !== 'S') {
                vertex.value.hydrogenDirection = 'up';
                wedgeA = 'up';
                wedgeB = 'down';
            }
            if (vertex.value.hasHydrogen) {
                this.graph.getEdge(vertex.id, neighbours[order[order.length - 1]]).wedge = wedgeA;
            }
            // Get the shortest subtree to flip up / down. Ignore lowest priority
            // The rules are following:
            // 1. Do not draw wedge between two stereocenters
            // 2. Heteroatoms
            // 3. Draw outside ring
            // 4. Shortest subtree
            var wedgeOrder = new Array(neighbours.length - 1);
            var showHydrogen = vertex.value.rings.length > 1 && vertex.value.hasHydrogen;
            var offset = vertex.value.hasHydrogen ? 1 : 0;
            for (var j = 0; j < order.length - offset; j++) {
                wedgeOrder[j] = new Uint32Array(2);
                var neighbour = this.graph.vertices[neighbours[order[j]]];
                wedgeOrder[j][0] += neighbour.value.isStereoCenter ? 0 : 100000;
                // wedgeOrder[j][0] += neighbour.value.rings.length > 0 ? 0 : 10000;
                // Only add if in same ring, unlike above
                wedgeOrder[j][0] += this.areVerticesInSameRing(neighbour, vertex) ? 0 : 10000;
                wedgeOrder[j][0] += neighbour.value.isHeteroAtom() ? 1000 : 0;
                wedgeOrder[j][0] -= neighbour.value.subtreeDepth === 0 ? 1000 : 0;
                wedgeOrder[j][0] += 1000 - neighbour.value.subtreeDepth;
                wedgeOrder[j][1] = neighbours[order[j]];
            }
            wedgeOrder.sort(function (a, b) {
                if (a[0] > b[0]) {
                    return -1;
                }
                else if (a[0] < b[0]) {
                    return 1;
                }
                return 0;
            });
            // If all neighbours are in a ring, do not draw wedge, the hydrogen will be drawn.
            if (!showHydrogen) {
                var wedgeId = wedgeOrder[0][1];
                if (vertex.value.hasHydrogen) {
                    this.graph.getEdge(vertex.id, wedgeId).wedge = wedgeB;
                }
                else {
                    var wedge = wedgeB;
                    for (var j = order.length - 1; j >= 0; j--) {
                        if (wedge === wedgeA) {
                            wedge = wedgeB;
                        }
                        else {
                            wedge = wedgeA;
                        }
                        if (neighbours[order[j]] === wedgeId) {
                            break;
                        }
                    }
                    this.graph.getEdge(vertex.id, wedgeId).wedge = wedge;
                }
            }
            vertex.value.chirality = rs;
        }
    };
    /**
     *
     *
     * @param {Number} vertexId The id of a vertex.
     * @param {(Number|null)} previousVertexId The id of the parent vertex of the vertex.
     * @param {Uint8Array} visited An array containing the visited flag for all vertices in the graph.
     * @param {Array} priority An array of arrays storing the atomic numbers for each level.
     * @param {Number} maxDepth The maximum depth.
     * @param {Number} depth The current depth.
     */
    Drawer.prototype.visitStereochemistry = function (vertexId, previousVertexId, visited, priority, maxDepth, depth, parentAtomicNumber) {
        if (parentAtomicNumber === void 0) { parentAtomicNumber = 0; }
        visited[vertexId] = 1;
        var vertex = this.graph.vertices[vertexId];
        var atomicNumber = vertex.value.getAtomicNumber();
        if (priority.length <= depth) {
            priority.push(Array());
        }
        for (var i = 0; i < this.graph.getEdge(vertexId, previousVertexId).weight; i++) {
            priority[depth].push(parentAtomicNumber * 1000 + atomicNumber);
        }
        var neighbours = this.graph.vertices[vertexId].neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            if (visited[neighbours[i]] !== 1 && depth < maxDepth - 1) {
                this.visitStereochemistry(neighbours[i], vertexId, visited.slice(), priority, maxDepth, depth + 1, atomicNumber);
            }
        }
        // Valences are filled with hydrogens and passed to the next level.
        if (depth < maxDepth - 1) {
            var bonds = 0;
            for (var i = 0; i < neighbours.length; i++) {
                bonds += this.graph.getEdge(vertexId, neighbours[i]).weight;
            }
            for (var i = 0; i < vertex.value.getMaxBonds() - bonds; i++) {
                if (priority.length <= depth + 1) {
                    priority.push(Array());
                }
                priority[depth + 1].push(atomicNumber * 1000 + 1);
            }
        }
    };
    /**
     * Creates pseudo-elements (such as Et, Me, Ac, Bz, ...) at the position of the carbon sets
     * the involved atoms not to be displayed.
     */
    Drawer.prototype.initPseudoElements = function () {
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            var neighbourIds = vertex.neighbours;
            var neighbours = Array(neighbourIds.length);
            for (var j = 0; j < neighbourIds.length; j++) {
                neighbours[j] = this.graph.vertices[neighbourIds[j]];
            }
            // Ignore atoms that have less than 3 neighbours, except if
            // the vertex is connected to a ring and has two neighbours
            if (vertex.getNeighbourCount() < 3 || vertex.value.rings.length > 0) {
                continue;
            }
            // TODO: This exceptions should be handled more elegantly (via config file?)
            // Ignore phosphates (especially for triphosphates)
            if (vertex.value.element === 'P') {
                continue;
            }
            // Ignore also guanidine
            if (vertex.value.element === 'C' && neighbours.length === 3 &&
                neighbours[0].value.element === 'N' && neighbours[1].value.element === 'N' && neighbours[2].value.element === 'N') {
                continue;
            }
            // Continue if there are less than two heteroatoms
            // or if a neighbour has more than 1 neighbour
            var heteroAtomCount = 0;
            var ctn = 0;
            for (var j = 0; j < neighbours.length; j++) {
                var neighbour = neighbours[j];
                var neighbouringElement = neighbour.value.element;
                var neighbourCount = neighbour.getNeighbourCount();
                if (neighbouringElement !== 'C' && neighbouringElement !== 'H' &&
                    neighbourCount === 1) {
                    heteroAtomCount++;
                }
                if (neighbourCount > 1) {
                    ctn++;
                }
            }
            if (ctn > 1 || heteroAtomCount < 2) {
                continue;
            }
            // Get the previous atom (the one which is not terminal)
            var previous = null;
            for (var j = 0; j < neighbours.length; j++) {
                var neighbour = neighbours[j];
                if (neighbour.getNeighbourCount() > 1) {
                    previous = neighbour;
                }
            }
            for (var j = 0; j < neighbours.length; j++) {
                var neighbour = neighbours[j];
                if (neighbour.getNeighbourCount() > 1) {
                    continue;
                }
                if (this.opts.compactDrawing) {
                    neighbour.value.isDrawn = false;
                }
                var hydrogens = Atom_1.default.maxBonds[neighbour.value.element] - neighbour.value.bondCount;
                var charge = '';
                if (neighbour.value.bracket) {
                    hydrogens = neighbour.value.bracket.hcount;
                    charge = neighbour.value.bracket.charge || 0;
                }
                if (this.opts.compactDrawing) {
                    vertex.value.attachPseudoElement(neighbour.value.element, previous ? previous.value.element : null, hydrogens, charge);
                }
                else {
                    vertex.value.hasPseudoElements = true;
                }
            }
        }
        // The second pass
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var vertex = this.graph.vertices[i];
            var atom = vertex.value;
            var element = atom.element;
            if (element === 'C' || element === 'H' || !atom.isDrawn) {
                continue;
            }
            var neighbourIds = vertex.neighbours;
            var neighbours = Array(neighbourIds.length);
            for (var j = 0; j < neighbourIds.length; j++) {
                neighbours[j] = this.graph.vertices[neighbourIds[j]];
            }
            for (var j = 0; j < neighbours.length; j++) {
                var neighbour = neighbours[j].value;
                if (!neighbour.hasAttachedPseudoElements || neighbour.getAttachedPseudoElementsCount() !== 2) {
                    continue;
                }
                var pseudoElements = neighbour.getAttachedPseudoElements();
                if (pseudoElements.hasOwnProperty('0O') && pseudoElements.hasOwnProperty('3C')) {
                    neighbour.isDrawn = false;
                    vertex.value.attachPseudoElement('Ac', '', 0);
                }
            }
        }
    };
    return Drawer;
}());
exports.default = Drawer;
//# sourceMappingURL=Drawer.js.map