"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
// we use the drawer to do all the preprocessing. then we take over the drawing
// portion to output to svg
var ArrayHelper_1 = require("./ArrayHelper");
var Atom_1 = require("./Atom");
var Drawer_1 = require("./Drawer");
var Line_1 = require("./Line");
var SvgWrapper_1 = require("./SvgWrapper");
var ThemeManager_1 = require("./ThemeManager");
var Vector2_1 = require("./Vector2");
var utils_1 = require("../../../utils");
var SvgDrawer = /** @class */ (function () {
    function SvgDrawer(options) {
        this.preprocessor = new Drawer_1.default(options);
    }
    /**
     * Draws the parsed smiles data to an svg element.
     *
     * @param {Object} data The tree returned by the smiles parser.
     * @param {(String|HTMLElement)} target The id of the HTML svg element the structure is drawn to - or the element itself.
     * @param {String} themeName='dark' The name of the theme to use. Built-in themes are 'light' and 'dark'.
     * @param {Boolean} infoOnly=false Only output info on the molecule without drawing anything to the canvas.
  
     * @returns {Oject} The dimensions of the drawing in { width, height }
     */
    SvgDrawer.prototype.draw = function (data, target, themeName, infoOnly) {
        if (themeName === void 0) { themeName = 'light'; }
        if (infoOnly === void 0) { infoOnly = false; }
        var preprocessor = this.preprocessor;
        preprocessor.initDraw(data, themeName, infoOnly);
        if (!infoOnly) {
            this.themeManager = new ThemeManager_1.default(this.preprocessor.opts.themes, themeName);
            this.svgWrapper = new SvgWrapper_1.default(this.themeManager, target, this.preprocessor.opts);
        }
        preprocessor.processGraph();
        // Set the canvas to the appropriate size
        this.svgWrapper.determineDimensions(preprocessor.graph.vertices);
        this.putEdgesForRings();
        this.putEdgesLForRings();
        this.checkEdgesRingsOnHaveLine();
        // Do the actual drawing
        this.drawEdges(preprocessor.opts.debug);
        this.drawVertices(preprocessor.opts.debug);
        if (preprocessor.opts.debug) {
            console.log(preprocessor.graph);
            console.log(preprocessor.rings);
            console.log(preprocessor.ringConnections);
        }
        return this.svgWrapper.constructSvg();
    };
    SvgDrawer.prototype.putEdgesForRings = function () {
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var graph = preprocessor.graph;
        var edges = preprocessor.graph.edges;
        var _loop_1 = function (i) {
            var ring = rings[i];
            var members = ring.membersS;
            for (var j = 0; j < members.length; j++) {
                var v = members[j];
                var vertex = graph.vertices[v];
                if (!ring.isHaveElements && vertex.value.element !== 'C') {
                    ring.isHaveElements = true;
                }
                ring.elements.push(vertex.value.element);
                var v2 = j < members.length - 1
                    ? members[j + 1]
                    : members[0];
                var _a = this_1.getEdgeBetweenVertexAB(v, v2), item = _a.item, isBetweenRings = _a.isBetweenRings;
                var edge = edges[item];
                if (edge === null || edge === void 0 ? void 0 : edge.isPartOfAromaticRing) {
                    if (ring.edges.indexOf(item) === -1) {
                        ring.edges.push(item);
                        edge.isPartOfRing = true;
                    }
                    if (isBetweenRings) {
                        if (ring.edgesR.indexOf(item) === -1) {
                            ring.edgesR.push(item);
                        }
                    }
                }
            }
            if (ring.edgesR.length) {
                var arr_1 = tslib_1.__spread(ring.edges);
                ring.edgesR.map(function (item) {
                    var index = arr_1.indexOf(item);
                    if (index > -1) {
                        arr_1.splice(index, 1);
                    }
                });
                if (!arr_1.length || arr_1.length < 1) {
                    ring.edges = [];
                }
            }
        };
        var this_1 = this;
        for (var i = 0; i < rings.length; i++) {
            _loop_1(i);
        }
    };
    ;
    SvgDrawer.prototype.putEdgesLForRings = function () {
        var _this = this;
        var _a;
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var graph = preprocessor.graph;
        var edges = preprocessor.graph.edges;
        var _loop_2 = function (i) {
            var ring = rings[i];
            if (this_2.isThiadiazole(ring)) {
                return "continue";
            }
            if (ring.elements.indexOf('S') !== -1
                || ring.elements.indexOf('O') !== -1
                || ring.elements.indexOf('N') !== -1) {
                ring.edges.map(function (item) {
                    var edge = edges[item];
                    var vertexA = graph.vertices[edge.targetId];
                    var vertexB = graph.vertices[edge.sourceId];
                    if (vertexA.value.element !== 'S' && vertexA.value.element !== 'O'
                        && vertexB.value.element !== 'S' && vertexB.value.element !== 'O'
                        && !(vertexA.value.element === 'N' && vertexB.value.element === 'N')
                        && !_this.isBridgeCommonRing(ring.id, vertexA, vertexB)) {
                        if (ring.edgesL.indexOf(item) === -1) {
                            ring.edgesL.push(item);
                        }
                        _this.neighboursHasDoubleLine(vertexA, ring.members, ring.edges);
                    }
                });
            }
            if ((_a = ring.edgesL) === null || _a === void 0 ? void 0 : _a.length) {
                ring.edgesL = ring.edgesL.sort(function (a, b) {
                    return a - b;
                });
            }
        };
        var this_2 = this;
        for (var i = 0; i < rings.length; i++) {
            _loop_2(i);
        }
    };
    ;
    SvgDrawer.prototype.checkEdgesRingsOnHaveLine = function () {
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var edges = preprocessor.graph.edges;
        for (var i = 0; i < rings.length; i++) {
            var ring = rings[i];
            if (ring.isDrawed) {
                continue;
            }
            if (ring.elements
                && (ring.elements.indexOf('S') !== -1
                    || ring.elements.indexOf('O') !== -1
                    || ring.elements.indexOf('N') !== -1)) {
                for (var index = 0; index < ring.edgesL.length; index++) {
                    var item = ring.edgesL[index];
                    if (edges[item].isHaveLine) {
                        continue;
                    }
                    var iindex = index + 1;
                    if (iindex & 1) {
                        edges[item].isHaveLine = true;
                    }
                }
            }
            else {
                for (var index = 0; index < ring.edges.length; index++) {
                    var item = ring.edges[index];
                    if (edges[item].isHaveLine) {
                        continue;
                    }
                    var iindex = index + 1;
                    if (iindex & 1) {
                        edges[item].isHaveLine = true;
                    }
                }
            }
        }
    };
    ;
    SvgDrawer.prototype.getEdgeBetweenVertexAB = function (vA, vB) {
        var _a, _b;
        var vertexA = this.preprocessor.graph.vertices[vA];
        var vertexB = this.preprocessor.graph.vertices[vB];
        var edgesA = tslib_1.__spread(vertexA.edges);
        var edgesB = tslib_1.__spread(vertexB.edges);
        var edges = edgesA.filter(function (i) { return edgesB.indexOf(i) >= 0; });
        return {
            item: edges[0],
            isBetweenRings: ((_a = vertexA.value.rings) === null || _a === void 0 ? void 0 : _a.length) > 1 && ((_b = vertexB.value.rings) === null || _b === void 0 ? void 0 : _b.length) > 1
        };
    };
    SvgDrawer.prototype.isThiadiazole = function (ring) {
        var _this = this;
        var elements = ring.elements;
        var graph = this.preprocessor.graph;
        if (elements.length !== 5) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N' || item === 'S'; });
        if ((arr === null || arr === void 0 ? void 0 : arr.length) === 3
            || arr.indexOf('S') !== -1) {
            var members_1 = ring.membersS;
            var indexS = elements.indexOf('S');
            if (indexS !== -1) {
                var vS = members_1[indexS];
                var vertex = graph.vertices[vS];
                vertex.edges.map(function (item) {
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isNotHaveLine = true;
                    }
                });
                var neighbours = vertex.neighbours;
                neighbours.map(function (item) {
                    if (members_1.indexOf(item) !== -1) {
                        var vertexN = graph.vertices[item];
                        vertexN.edges.map(function (ed) {
                            if (ring.edges.indexOf(ed) !== -1) {
                                var edge = _this.preprocessor.graph.edges[ed];
                                edge.isHaveLine = true;
                            }
                        });
                    }
                });
            }
            ring.isDrawed = true;
            return true;
        }
        return false;
    };
    SvgDrawer.prototype.neighboursHasDoubleLine = function (vertex, members, edgesR) {
        var _this = this;
        var _a;
        if (vertex.value.bondType === "=") {
            var edges = vertex.edges;
            edges.map(function (item) {
                if (edgesR.indexOf(item) !== -1) {
                    var edge = _this.preprocessor.graph.edges[item];
                    edge.isNotHaveLine = true;
                }
            });
            return;
        }
        var neighbours = vertex.neighbours;
        neighbours = neighbours.filter(function (item) { return members.indexOf(item) === -1; });
        if (neighbours === null || neighbours === void 0 ? void 0 : neighbours.length) {
            for (var i = 0; i < neighbours.length; i++) {
                var vn = this.preprocessor.graph.vertices[neighbours[i]];
                if (((_a = vn.value) === null || _a === void 0 ? void 0 : _a.branchBond) === '=') {
                    var edges = vertex.edges;
                    edges.map(function (item) {
                        if (edgesR.indexOf(item) !== -1) {
                            var edge = _this.preprocessor.graph.edges[item];
                            edge.isNotHaveLine = true;
                        }
                    });
                }
            }
        }
    };
    SvgDrawer.prototype.isBridgeCommonRing = function (ringId, vertexA, vertexB) {
        var commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
        if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) > 1) {
            var index = commonRings.indexOf(ringId);
            if (index > -1) {
                commonRings.splice(index, 1);
            }
            if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) === 1) {
                return this.preprocessor.rings[commonRings[0]].isBridged;
            }
        }
        return false;
    };
    SvgDrawer.prototype.checkNeighboursEdges = function (edge, vertexA, vertexB) {
        var res = false;
        if (utils_1.arraysCompare(vertexA.value.rings, vertexB.value.rings)) {
            var edgesA = vertexA.edges;
            var edgesB = vertexB.edges;
            for (var i = 0; i < edgesA.length; i++) {
                if (edgesA[i] === edge.id) {
                    continue;
                }
                var e = this.preprocessor.graph.edges[edgesA[i]];
                if (!e.isNotHaveLine && e.isHaveLine) {
                    res = true;
                    break;
                }
            }
            if (res) {
                return res;
            }
            for (var i = 0; i < edgesB.length; i++) {
                if (edgesB[i] === edge.id) {
                    continue;
                }
                var e = this.preprocessor.graph.edges[edgesB[i]];
                if (!e.isNotHaveLine && e.isHaveLine) {
                    res = true;
                    break;
                }
            }
        }
        return false;
    };
    /**
     * Draw the actual edges as bonds.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    SvgDrawer.prototype.drawEdges = function (debug) {
        var _this = this;
        var preprocessor = this.preprocessor, graph = preprocessor.graph, rings = preprocessor.rings, drawn = Array(this.preprocessor.graph.edges.length);
        drawn.fill(false);
        graph.traverseBF(0, function (vertex) {
            var edges = graph.getEdges(vertex.id);
            for (var i = 0; i < edges.length; i++) {
                var edgeId = edges[i];
                if (!drawn[edgeId]) {
                    drawn[edgeId] = true;
                    _this.drawEdge(edgeId, debug);
                }
            }
        });
        // Draw ring for implicitly defined aromatic rings
        if (!this.preprocessor.bridgedRing
            && this.preprocessor.opts.ringVisualization === 'circle') {
            for (var i = 0; i < rings.length; i++) {
                var ring = rings[i];
                if (preprocessor.isRingAromatic(ring)) {
                    this.svgWrapper.drawAromaticityRing(ring);
                }
            }
        }
    };
    /**
     * Draw the an edge as a bond.
     *
     * @param {Number} edgeId An edge id.
     * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
     */
    SvgDrawer.prototype.drawEdge = function (edgeId, debug) {
        var preprocessor = this.preprocessor, opts = preprocessor.opts, svgWrapper = this.svgWrapper, edge = preprocessor.graph.edges[edgeId], vertexA = preprocessor.graph.vertices[edge.sourceId], vertexB = preprocessor.graph.vertices[edge.targetId], elementA = vertexA.value.element, elementB = vertexB.value.element;
        if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && preprocessor.opts.atomVisualization === 'default') {
            return;
        }
        var a = vertexA.position, b = vertexB.position, normals = preprocessor.getEdgeNormals(edge), 
        // Create a point on each side of the line
        sides = ArrayHelper_1.default.clone(normals);
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' ||
            (edge.isPartOfAromaticRing && preprocessor.bridgedRing)
            || (edge.isPartOfRing && opts.ringVisualization !== 'circle')) {
            // Always draw double bonds inside the ring
            var inRing = preprocessor.areVerticesInSameRing(vertexA, vertexB);
            var s = preprocessor.chooseSide(vertexA, vertexB, sides);
            if (inRing) {
                // Always draw double bonds inside a ring
                // if the bond is shared by two rings, it is drawn in the larger
                // problem: smaller ring is aromatic, bond is still drawn in larger -> fix this
                var lcr = preprocessor.getLargestOrAromaticCommonRing(vertexA, vertexB);
                var center = lcr.center;
                normals[0].multiplyScalar(opts.bondSpacing);
                normals[1].multiplyScalar(opts.bondSpacing);
                // Choose the normal that is on the same side as the center
                var line = null;
                if (center.sameSideAs(vertexA.position, vertexB.position, Vector2_1.default.add(a, normals[0]))) {
                    line = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                }
                else {
                    line = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                }
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                // The shortened edge
                if (edge.isPartOfAromaticRing) {
                    if (opts.ringVisualization !== 'aromatic') {
                        if (!edge.isNotHaveLine && edge.isHaveLine
                            && !this.checkNeighboursEdges(edge, vertexA, vertexB)) {
                            svgWrapper.drawLine(line);
                        }
                    }
                    else {
                        svgWrapper.drawLine(line, true);
                    }
                }
                else {
                    // preprocessor.canvasWrapper.drawLine(line);
                    svgWrapper.drawLine(line);
                }
                svgWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if ((edge.center || vertexA.isTerminal() && vertexB.isTerminal()) ||
                (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1)) {
                this.multiplyNormals(normals, opts.halfBondSpacing);
                var lineA = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB), lineB = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                svgWrapper.drawLine(lineA);
                svgWrapper.drawLine(lineB);
            }
            else if ((s.sideCount[0] > s.sideCount[1]) ||
                (s.totalSideCount[0] > s.totalSideCount[1])) {
                this.multiplyNormals(normals, opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                svgWrapper.drawLine(line);
                svgWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
            else if ((s.sideCount[0] < s.sideCount[1]) ||
                (s.totalSideCount[0] <= s.totalSideCount[1])) {
                this.multiplyNormals(normals, opts.bondSpacing);
                var line = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                svgWrapper.drawLine(line);
                svgWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
            }
        }
        else if ((edge === null || edge === void 0 ? void 0 : edge.bondType) === '#') {
            normals[0].multiplyScalar(opts.bondSpacing / 1.5);
            normals[1].multiplyScalar(opts.bondSpacing / 1.5);
            var lineA = new Line_1.default(Vector2_1.default.add(a, normals[0]), Vector2_1.default.add(b, normals[0]), elementA, elementB);
            var lineB = new Line_1.default(Vector2_1.default.add(a, normals[1]), Vector2_1.default.add(b, normals[1]), elementA, elementB);
            svgWrapper.drawLine(lineA);
            svgWrapper.drawLine(lineB);
            svgWrapper.drawLine(new Line_1.default(a, b, elementA, elementB));
        }
        else if ((edge === null || edge === void 0 ? void 0 : edge.bondType) === '.') {
            // TODO: Something... maybe... version 2?
        }
        else {
            var isChiralCenterA = vertexA.value.isStereoCenter;
            var isChiralCenterB = vertexB.value.isStereoCenter;
            if (edge.wedge === 'up') {
                svgWrapper.drawWedge(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
            else if (edge.wedge === 'down') {
                svgWrapper.drawDashedWedge(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
            else {
                svgWrapper.drawLine(new Line_1.default(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
        }
        if (debug) {
            var midpoint = Vector2_1.default.midpoint(a, b);
            svgWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
        }
    };
    /**
     * Draws the vertices representing atoms to the canvas.
     *
     * @param {Boolean} debug A boolean indicating whether or not to draw debug messages to the canvas.
     */
    SvgDrawer.prototype.drawVertices = function (debug) {
        var preprocessor = this.preprocessor, opts = preprocessor.opts, graph = preprocessor.graph, rings = preprocessor.rings, svgWrapper = this.svgWrapper;
        var i = graph.vertices.length;
        for (var i = 0; i < graph.vertices.length; i++) {
            var vertex = graph.vertices[i];
            var atom = vertex.value;
            var charge = 0;
            var isotope = 0;
            var bondCount = vertex.value.bondCount;
            var element = atom.element;
            var hydrogens = Atom_1.default.maxBonds[element] - bondCount;
            var dir = vertex.getTextDirection(graph.vertices);
            var isTerminal = opts.terminalCarbons || element !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
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
            if (opts.atomVisualization === 'allballs') {
                svgWrapper.drawBall(vertex.position.x, vertex.position.y, element);
            }
            else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) || graph.vertices.length === 1) {
                if (opts.atomVisualization === 'default') {
                    svgWrapper.drawText(vertex.position.x, vertex.position.y, element, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements());
                }
                else if (opts.atomVisualization === 'balls') {
                    svgWrapper.drawBall(vertex.position.x, vertex.position.y, element);
                }
            }
            else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
                // If there is a carbon which bonds are in a straight line, draw a dot
                var a = graph.vertices[vertex.neighbours[0]].position;
                var b = graph.vertices[vertex.neighbours[1]].position;
                var angle = Vector2_1.default.threePointangle(vertex.position, a, b);
                if (Math.abs(Math.PI - angle) < 0.1) {
                    svgWrapper.drawPoint(vertex.position.x, vertex.position.y, element);
                }
            }
            if (debug) {
                var value = 'v: ' + vertex.id + ' ' + ArrayHelper_1.default.print(atom.ringbonds);
                svgWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
            }
            else {
                svgWrapper.drawDebugText(vertex.position.x, vertex.position.y, vertex.value.chirality);
            }
        }
        // Draw the ring centers for debug purposes
        if (opts.debug) {
            for (var i = 0; i < rings.length; i++) {
                var center = rings[i].center;
                svgWrapper.drawDebugPoint(center.x, center.y, 'r: ' + rings[i].id);
            }
        }
    };
    /**
     * Returns the total overlap score of the current molecule.
     *
     * @returns {Number} The overlap score.
     */
    SvgDrawer.prototype.getTotalOverlapScore = function () {
        return this.preprocessor.getTotalOverlapScore();
    };
    /**
     * Returns the molecular formula of the loaded molecule as a string.
     *
     * @returns {String} The molecular formula.
     */
    SvgDrawer.prototype.getMolecularFormula = function () {
        return this.preprocessor.getMolecularFormula();
    };
    /**
     * @param {Array} normals list of normals to multiply
     * @param {Number} spacing value to multiply normals by
     */
    SvgDrawer.prototype.multiplyNormals = function (normals, spacing) {
        normals[0].multiplyScalar(spacing);
        normals[1].multiplyScalar(spacing);
    };
    return SvgDrawer;
}());
exports.default = SvgDrawer;
//# sourceMappingURL=SvgDrawer.js.map