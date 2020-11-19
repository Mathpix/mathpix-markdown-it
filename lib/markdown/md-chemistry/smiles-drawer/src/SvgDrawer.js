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
        //need to checking of correct aromatic ring
        this.putEdgesLForRings();
        this.checkAllEdgesRings();
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
            ring.membersS = this_1.sortMembers(ring);
            if (ring.neighbours.length) {
                ring.neighbours.map(function (item) {
                    var nRing = rings[item];
                    if (nRing && nRing.neighbours.indexOf(ring.id) === -1) {
                        nRing.neighbours.push(ring.id);
                    }
                });
            }
            var members = ring.membersS;
            for (var j = 0; j < members.length; j++) {
                var v = members[j];
                var vertex = graph.vertices[v];
                if (this_1.isHydrogenVertices([v])) {
                    ring.hasHydrogen = true;
                }
                if (this_1.isVertexHasDoubleBondWithO(ring, v)) {
                    ring.hasDoubleBondWithO = true;
                }
                if (!ring.isHaveElements && vertex.value.element !== 'C') {
                    ring.isHaveElements = true;
                }
                ring.elements.push(vertex.value.element);
                var v2 = j < members.length - 1
                    ? members[j + 1]
                    : members[0];
                var _a = this_1.getEdgeBetweenVertexAB(v, v2), item = _a.item, isBetweenRings = _a.isBetweenRings;
                var edge = edges[item];
                if (edge) {
                    var vertexA = graph.vertices[edge.sourceId];
                    var vertexB = graph.vertices[edge.targetId];
                    if (!this_1.edgeHaveDoubleBound(edge) && vertexA.neighbourCount > 2
                        && vertexA.neighbourCount < vertexA.value.bondCount) {
                        edge.sourceHasOuterDoubleBond = true;
                        ring.hasOuterDoubleBond = true;
                    }
                    if (!this_1.edgeHaveDoubleBound(edge) && vertexB.neighbourCount > 2
                        && vertexB.neighbourCount < vertexB.value.bondCount) {
                        edge.targetHasOuterDoubleBond = true;
                        ring.hasOuterDoubleBond = true;
                    }
                }
                if (edge === null || edge === void 0 ? void 0 : edge.isPartOfAromaticRing) {
                    if (ring.edges.indexOf(item) === -1) {
                        if (ring.edges.length > 0) {
                            var prev = edges[ring.edges[ring.edges.length - 1]];
                            if (prev.neighbours.indexOf(item) === -1) {
                                prev.neighbours.push(item);
                            }
                            if (edge.neighbours.indexOf(prev.id) === -1) {
                                edge.neighbours.push(prev.id);
                            }
                        }
                        ring.edges.push(item);
                        edge.isPartOfRing = true;
                        if (edge.rings.indexOf(ring.id) === -1) {
                            edge.rings.push(ring.id);
                        }
                    }
                    if (isBetweenRings) {
                        if (ring.edgesR.indexOf(item) === -1) {
                            ring.edgesR.push(item);
                        }
                    }
                }
            }
            //Edit last and first Edges
            if (ring.edges.length > 0) {
                var first = edges[ring.edges[0]];
                var last = edges[ring.edges[ring.edges.length - 1]];
                if (first.neighbours.indexOf(last.id) === -1) {
                    first.neighbours.push(last.id);
                }
                if (last.neighbours.indexOf(first.id) === -1) {
                    last.neighbours.push(first.id);
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
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        for (var i = 0; i < rings.length; i++) {
            var ring = rings[i];
            if (this.isRing_SNN(ring)) {
                continue;
            }
            if (this.isRing_ONN(ring)) {
                continue;
            }
            if (this.isRing_NNN(ring)) {
                continue;
            }
        }
    };
    ;
    SvgDrawer.prototype.checkAllEdgesRings = function () {
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var graph = preprocessor.graph;
        var edges = preprocessor.graph.edges;
        var arr = [];
        var arrBottoms = [];
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            if (edge.rings.length > 1) {
                if (arr.indexOf(edge.id) === -1) {
                    arr.push(edge.id);
                }
            }
            if (this.edgeHaveDoubleBound(edge)) {
                edge.isHaveLine = true;
                edge.isChecked = true;
                continue;
            }
            var currentRing = edge.rings.length === 1
                ? rings[edge.rings]
                : null;
            var vertexA = graph.vertices[edge.sourceId];
            var vertexB = graph.vertices[edge.targetId];
            if (currentRing && !this.ringStartedCheck(currentRing)) {
                if (this.ringStartedCheckForEdge(currentRing, edge)) {
                    edge.isChecked = true;
                    currentRing.isStartedCheck = true;
                    continue;
                }
                if (!edge.isAtomSlat &&
                    currentRing.members.length === 6 && this.ringHasAtoms_N(currentRing)
                    && edge.sourceId === Math.min.apply(Math, tslib_1.__spread(currentRing.members))
                    && vertexB.value.element === 'N' &&
                    currentRing.elements.filter(function (item) { return item === 'N'; }).length > 2) {
                    edge.isChecked = true;
                    currentRing.isStartedCheck = true;
                    continue;
                }
            }
            if ((edge.isBottomSlat && (!edge.isBeforeHaveLine || edge.rings.length > 1)
                || this.edgeNeighboursAreAtomSlat(edge)
                || (currentRing && currentRing.members.length >= 5 && edge.rings.length === 1
                    && (this.getVertexElementFromRing(currentRing) !== '' || currentRing.members.length === 6)
                    && vertexA.value.rings.length > 1 && vertexB.value.rings.length > 1))
                && !(vertexA.value.element === 'N' && vertexB.value.element === 'N' && (currentRing === null || currentRing === void 0 ? void 0 : currentRing.members.length) > 5)) {
                if (edge.isBottomSlat && currentRing && currentRing.neighbours.length === 1
                    && rings[currentRing.neighbours[0]].members.length === 5
                    && this.getVertexElementFromRing(rings[currentRing.neighbours[0]]) === 'N'
                    && currentRing.members.length === 6 && this.getVertexElementFromRing(currentRing) === 'N') {
                }
                else {
                    if (arrBottoms.indexOf(edge.id) === -1) {
                        arrBottoms.push(edge.id);
                    }
                    if (currentRing) {
                        currentRing.isStartedCheck = true;
                    }
                    continue;
                }
            }
            if (edge.isAtomVertex) {
                continue;
            }
            if (!edge.isPartOfRing || edge.isChecked) {
                continue;
            }
            if (!edge.isChecked) {
                this.checkEdge(edge, vertexA, vertexB, arr, currentRing);
                if (currentRing) {
                    currentRing.isStartedCheck = true;
                }
            }
        }
        if (this.preprocessor.opts.debug) {
            console.log('arr=>', arr);
        }
        if (arr.length) {
            for (var i = 0; i < arr.length; i++) {
                var edge = edges[arr[i]];
                if (edge.isChecked && (edge.isHaveLine || edge.isNotHaveLine)) {
                    continue;
                }
                var vertexA = graph.vertices[edge.targetId];
                var vertexB = graph.vertices[edge.sourceId];
                if (this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)
                    || (vertexA.value.element === 'N' && vertexA.neighbourCount === 3)
                    || (vertexB.value.element === 'N' && vertexB.neighbourCount === 3)) {
                    edge.isNotHaveLine = true;
                    continue;
                }
                edge.isHaveLine = true;
                edge.isChecked = true;
            }
        }
        if (this.preprocessor.opts.debug) {
            console.log('arrBottoms=>', arrBottoms);
        }
        if (arrBottoms.length) {
            for (var i = 0; i < arrBottoms.length; i++) {
                var edge = edges[arrBottoms[i]];
                if (edge.isChecked) {
                    continue;
                }
                var vertexA = graph.vertices[edge.targetId];
                var vertexB = graph.vertices[edge.sourceId];
                if (this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)
                    || (vertexA.value.element === 'N' && vertexA.neighbourCount === 3 && vertexA.neighbourCount !== vertexA.value.bondCount)
                    || (vertexB.value.element === 'N' && vertexB.neighbourCount === 3 && vertexB.neighbourCount !== vertexB.value.bondCount)) {
                    edge.isNotHaveLine = true;
                    continue;
                }
                edge.isHaveLine = true;
                edge.isChecked = true;
            }
        }
    };
    ;
    SvgDrawer.prototype.checkEdge = function (edge, vertexA, vertexB, arr, ring) {
        var _a, _b;
        var atoms = ['O', 'S', 'Se', 'As'];
        var vertexA_NotOS = atoms.indexOf(vertexA.value.element) === -1;
        var vertexB_NotOS = atoms.indexOf(vertexB.value.element) === -1;
        var vertexA_NotN = !(vertexA.value.element === 'N' && vertexA.neighbourCount === 3 && !(((_a = vertexA.value.bracket) === null || _a === void 0 ? void 0 : _a.charge) === 1)
            && !this.checkVertex_N(vertexA));
        var vertexB_NotN = !(vertexB.value.element === 'N' && vertexB.neighbourCount === 3 && !(((_b = vertexB.value.bracket) === null || _b === void 0 ? void 0 : _b.charge) === 1)
            && !this.checkVertex_N(vertexB));
        if (this.edgeHaveDoubleBound(edge)) {
            edge.isHaveLine = true;
            edge.isChecked = true;
            if (ring && !ring.isStartedCheck) {
                var prev = false;
                for (var i = 0; i < ring.edges.length; i++) {
                    if (ring.edges[i] === edge.id) {
                        prev = true;
                        continue;
                    }
                    if (!prev) {
                        var rEdge = this.preprocessor.graph.edges[ring.edges[i]];
                        rEdge.isBeforeHaveLine = true;
                        prev = true;
                    }
                    else {
                        prev = false;
                    }
                }
            }
            return;
        }
        if (this.checkVertex_N(vertexA)) {
            if (!this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)) {
                edge.isHaveLine = true;
                edge.isChecked = true;
                return;
            }
        }
        if (this.edgeHaveDoubleBound(edge) ||
            vertexA_NotOS && vertexB_NotOS
                && vertexA_NotN && vertexB_NotN
                && !(vertexA.neighbourCount > 2 && vertexA.neighbourCount < vertexA.value.bondCount)
                && !(vertexB.neighbourCount > 2 && vertexB.neighbourCount < vertexB.value.bondCount)
                && (!vertexA.hasDoubleBondWithO || this.checkVertex_N(vertexA))
                && (!vertexB.hasDoubleBondWithO || this.checkVertex_N(vertexB))
                && !this.isHydrogenVertices([vertexA.id, vertexB.id])
                && !this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)) {
            if (!edge.isBeforeNotHaveLine) {
                edge.isHaveLine = true;
            }
            edge.isChecked = true;
            if (ring && !ring.isStartedCheck
                && ring.members.length === 6
                && !ring.hasDoubleBondWithO
                && !ring.hasOuterDoubleBond) {
                var prev = false;
                for (var i = 0; i < ring.edges.length; i++) {
                    if (ring.edges[i] === edge.id) {
                        prev = true;
                        continue;
                    }
                    var rEdge = this.preprocessor.graph.edges[ring.edges[i]];
                    if (!prev) {
                        rEdge.isBeforeHaveLine = true;
                        prev = true;
                    }
                    else {
                        rEdge.isBeforeNotHaveLine = true;
                        prev = false;
                    }
                }
            }
        }
        else {
            edge.isNotHaveLine = true;
            edge.isChecked = true;
        }
    };
    ;
    SvgDrawer.prototype.edgeHaveDoubleBound = function (edge, vertexA, vertexB) {
        if (vertexA === void 0) { vertexA = null; }
        if (vertexB === void 0) { vertexB = null; }
        if (!vertexA) {
            vertexA = this.preprocessor.graph.vertices[edge.sourceId];
        }
        if (!vertexB) {
            vertexB = this.preprocessor.graph.vertices[edge.targetId];
        }
        if (edge.bondType === '=' && !edge.isPartOfRing
            && vertexB.value.element === 'N') {
            return false;
        }
        return edge.bondType === '=' || this.preprocessor.getRingbondType(vertexA, vertexB) === '=';
    };
    SvgDrawer.prototype.edgesHaveDoubleBound = function (edges, checkAtom) {
        var res = false;
        for (var i = 0; i < edges.length; i++) {
            var edge = this.preprocessor.graph.edges[edges[i]];
            var vertexA = this.preprocessor.graph.vertices[edge.sourceId];
            var vertexB = this.preprocessor.graph.vertices[edge.targetId];
            if (edge.bondType === '=' || this.preprocessor.getRingbondType(vertexA, vertexB) === '='
                || (checkAtom && (vertexA.value.element === 'O' ||
                    vertexA.value.neighbouringElements.indexOf('F') !== -1))) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.edgeNeighboursHaveDoubleBound = function (edge, vertexA, vertexB) {
        var res = false;
        var eNeighbours = [].concat(vertexA.edges, vertexB.edges);
        for (var i = 0; i < eNeighbours.length; i++) {
            var edge_1 = this.preprocessor.graph.edges[eNeighbours[i]];
            if (edge_1.isHaveLine || this.edgeHaveDoubleBound(edge_1)) {
                res = true;
                break;
            }
        }
        return res;
    };
    ;
    SvgDrawer.prototype.ringHasAtoms_N = function (ring) {
        var res = false;
        for (var i = 0; i < ring.members.length; i++) {
            var vertex = this.preprocessor.graph.vertices[ring.members[i]];
            if (vertex.value.element === 'N' && vertex.neighbourCount === 3) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.ringStartedCheck = function (ring) {
        var res = false;
        for (var i = 0; i < ring.edges.length; i++) {
            var edge = this.preprocessor.graph.edges[ring.edges[i]];
            if (edge.isChecked) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.isVertexNeighboursHasDoubleBond = function (vertexId, ring) {
        var vertexA = this.preprocessor.graph.vertices[vertexId];
        var neighbours = vertexA.neighbours.filter(function (item) { return ring.members.indexOf(item) === -1; });
        var res = false;
        for (var i = 0; i < neighbours.length; i++) {
            var vertex = this.preprocessor.graph.vertices[neighbours[i]];
            if (this.edgesHaveDoubleBound(vertex.edges, true)) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.getVertexElementFromRing = function (ring) {
        var res = '';
        for (var i = 0; i < ring.members.length; i++) {
            var vertex = this.preprocessor.graph.vertices[ring.members[i]];
            if (vertex.isAtomVertex) {
                if (this.isHydrogenVertices([vertex.id])) {
                    res = vertex.value.element + 'H';
                }
                else {
                    res = vertex.value.element;
                }
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.ringStartedCheckForEdge = function (ring, edge) {
        var _a, _b, _c;
        var res = false;
        if (ring.isStartedCheck) {
            return false;
        }
        if (ring.members.length === 6) {
            if (ring.neighbours.length === 1) {
                var commonEdge = this.preprocessor.graph.edges[ring.edgesR[0]];
                if (commonEdge) {
                    var rN = commonEdge.rings.filter(function (item) { return item !== ring.id; });
                    var nRing = this.preprocessor.rings[rN[0]];
                    var index = ring.edges.indexOf(commonEdge.id);
                    if (this.preprocessor.opts.debug) {
                        console.log('>>>>>>> commonEdge=> ', commonEdge);
                        console.log('>>>>>>> index=> ', index);
                    }
                    if (index === 0) {
                        if (!nRing.edges.length) {
                            return true;
                        }
                    }
                    if (index === 3) {
                        if (commonEdge.isBottomSlat && ((_a = nRing.members) === null || _a === void 0 ? void 0 : _a.length) === 5) {
                            return true;
                        }
                        if (this.edgeHaveDoubleBound(commonEdge)
                            || (commonEdge && commonEdge.isBottomSlat && ((_b = commonEdge === null || commonEdge === void 0 ? void 0 : commonEdge.members) === null || _b === void 0 ? void 0 : _b.length) === 5)) {
                            res = true;
                        }
                        if (commonEdge.isAtomVertex && ((_c = nRing.members) === null || _c === void 0 ? void 0 : _c.length) === 5) {
                            return true;
                        }
                    }
                    if (index === 2 && commonEdge.isAtomSlat) {
                        if (this.isVertexNeighboursHasDoubleBond(edge.sourceId, ring)) {
                            if (nRing.members.length === 6) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                    if (index === 4 && commonEdge.isAtomSlat) {
                        if (nRing && nRing.members.length === 5
                            && nRing.hasHydrogen
                            && nRing.elements.indexOf('S') === -1
                            && nRing.elements.indexOf('O') === -1) {
                            return true;
                        }
                    }
                    if ((index === 1) && commonEdge.isAtomSlat) {
                        if (this.isVertexNeighboursHasDoubleBond(edge.sourceId, ring)) {
                            res = false;
                        }
                        else {
                            if (nRing.members.length === 5) {
                                return false;
                            }
                            if (index === 4) {
                                var rN_1 = commonEdge.rings.filter(function (item) { return item !== ring.id; });
                                var nRing_1 = this.preprocessor.rings[rN_1[0]];
                                if (nRing_1 && nRing_1.members.length > 5) {
                                    return false;
                                }
                            }
                            res = true;
                        }
                    }
                }
            }
        }
        return res;
    };
    SvgDrawer.prototype.edgeNeighboursAreAtomSlat = function (edge) {
        var res = false;
        if (edge.neighbours.length === 2) {
            return this.preprocessor.graph.edges[edge.neighbours[0]].isAtomSlat
                && this.preprocessor.graph.edges[edge.neighbours[1]].isAtomSlat;
        }
        return res;
    };
    SvgDrawer.prototype.sortMembers = function (ring) {
        var members = tslib_1.__spread(ring.members).sort(function (a, b) { return a - b; });
        var arr = [];
        var edgesAll = [];
        var prev;
        for (var i = 0; i < members.length; i++) {
            var v = members[i];
            if (i === 0) {
                arr.push(v);
                prev = v;
            }
            var vertex = this.preprocessor.graph.vertices[prev];
            var neighbours = vertex.neighbours.filter(function (item) { return members.indexOf(item) !== -1 && arr.indexOf(item) === -1; });
            var vNext = void 0;
            if (neighbours === null || neighbours === void 0 ? void 0 : neighbours.length) {
                if (neighbours.length > 1) {
                    vNext = Math.min.apply(Math, tslib_1.__spread(neighbours));
                }
                else {
                    vNext = neighbours[0];
                }
            }
            else {
                vNext = arr[0];
            }
            var vertexIds = vertex.id + '_' + vNext;
            var ed = this.preprocessor.graph.vertexIdsToEdgeId[vertexIds];
            prev = vNext;
            if (ed || ed === 0) {
                if (edgesAll.indexOf(vNext) === -1) {
                    edgesAll.push(ed);
                }
                if (arr.indexOf(vNext) === -1) {
                    arr.push(vNext);
                }
            }
        }
        return arr;
    };
    SvgDrawer.prototype.getEdgeBetweenVertexAB = function (vA, vB) {
        var _a, _b;
        var vertexA = this.preprocessor.graph.vertices[vA];
        var vertexB = this.preprocessor.graph.vertices[vB];
        var edgesA = tslib_1.__spread(vertexA.edges);
        var edgesB = tslib_1.__spread(vertexB.edges);
        var edges = edgesA.filter(function (i) { return edgesB.indexOf(i) >= 0; });
        var isBetweenRings = ((_a = vertexA.value.rings) === null || _a === void 0 ? void 0 : _a.length) > 1
            && ((_b = vertexB.value.rings) === null || _b === void 0 ? void 0 : _b.length) > 1
            && utils_1.arraysCompare(vertexA.value.rings, vertexB.value.rings);
        var rings = isBetweenRings
            ? vertexA.value.rings
            : [];
        return {
            item: edges[0],
            isBetweenRings: isBetweenRings,
            bRings: rings
        };
    };
    SvgDrawer.prototype.isRing_SNN = function (ring) {
        var _this = this;
        var elements = ring.elements;
        var graph = this.preprocessor.graph;
        var arrE = tslib_1.__spread(ring.edges);
        if (elements.length < 5) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N' || item === 'S'; });
        if ((arr === null || arr === void 0 ? void 0 : arr.length) > 0 && arr.indexOf('S') !== -1) {
            var members_1 = ring.membersS;
            var indexS = elements.indexOf('S');
            if (indexS !== -1) {
                var vS = members_1[indexS];
                var vertex = graph.vertices[vS];
                vertex.isAtomVertex = true;
                vertex.edges.map(function (item) {
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isAtomVertex = true;
                        utils_1.arrayDelElement(arrE, item);
                    }
                });
                var neighbours = vertex.neighbours;
                neighbours.map(function (item) {
                    if (members_1.indexOf(item) !== -1) {
                        var vertexN = graph.vertices[item];
                        var vertexNEdges = vertexN.edges.filter(function (ed) { return ring.edges.indexOf(ed) !== -1; });
                        vertexNEdges.map(function (ed) {
                            var edge = _this.preprocessor.graph.edges[ed];
                            if (!edge.isAtomVertex) {
                                edge.isAtomSlat = true;
                            }
                            utils_1.arrayDelElement(arrE, ed);
                        });
                    }
                });
                if (elements.length === 5 && (arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1) {
                    this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
                }
                else {
                    if (elements.length === 6) {
                        arrE.map(function (item) {
                            _this.preprocessor.graph.edges[item].isBottomSlat = true;
                        });
                    }
                }
                ring.isDrawed = true;
                return true;
            }
        }
        return false;
    };
    SvgDrawer.prototype.isRing_ONN = function (ring) {
        var _this = this;
        var elements = ring.elements;
        var arrE = tslib_1.__spread(ring.edges);
        var graph = this.preprocessor.graph;
        if (elements.length < 5) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N' || item === 'O'; });
        if (((arr === null || arr === void 0 ? void 0 : arr.length) > 0
            && arr.indexOf('O') !== -1)) {
            var members_2 = ring.membersS;
            var indexS = this.findStartElementbyEdges(members_2, elements, 'O');
            if (indexS !== -1) {
                var vS = members_2[indexS];
                var vertex = graph.vertices[vS];
                vertex.isAtomVertex = true;
                vertex.edges.map(function (item) {
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isAtomVertex = true;
                        utils_1.arrayDelElement(arrE, item);
                    }
                });
                var neighbours = vertex.neighbours.filter(function (item) { return members_2.indexOf(item) !== -1; });
                neighbours.map(function (item) {
                    var vertexN = graph.vertices[item];
                    vertexN.edges.map(function (ed) {
                        if (ring.edges.indexOf(ed) !== -1) {
                            var edge = _this.preprocessor.graph.edges[ed];
                            if (!edge.isAtomVertex) {
                                edge.isAtomSlat = true;
                            }
                            utils_1.arrayDelElement(arrE, ed);
                        }
                    });
                });
            }
            if (elements.length === 5 && (arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1) {
                this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
            }
            else {
                if (elements.length === 6) {
                    arrE.map(function (item) {
                        _this.preprocessor.graph.edges[item].isBottomSlat = true;
                    });
                }
            }
            return true;
        }
        return false;
    };
    SvgDrawer.prototype.isRing_NNN = function (ring) {
        var _this = this;
        var elements = ring.elements;
        var arrE = tslib_1.__spread(ring.edges);
        var graph = this.preprocessor.graph;
        if (elements.length < 5) {
            return false;
        }
        if (ring.isDrawed) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N'; });
        if ((arr === null || arr === void 0 ? void 0 : arr.length) > 0) {
            var members_3 = ring.membersS;
            var indexS = this.findStartNbyEdges(members_3, elements).indexS;
            var vS = -1;
            if (indexS !== -1) {
                vS = members_3[indexS];
            }
            if (vS !== -1) {
                var vertex = graph.vertices[vS];
                vertex.isAtomVertex = true;
                vertex.edges
                    .filter(function (e, i, a) { return a.indexOf(e) == i; })
                    .map(function (item) {
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isAtomVertex = true;
                        utils_1.arrayDelElement(arrE, item);
                    }
                });
                var neighbours = vertex.neighbours.filter(function (item) { return members_3.indexOf(item) !== -1; });
                neighbours.map(function (item) {
                    var vertexN = graph.vertices[item];
                    var vEdges = vertexN.edges.filter(function (ed) { return ring.edges.indexOf(ed) !== -1 && arrE.indexOf(ed) !== -1; });
                    vEdges.map(function (ed) {
                        var edge = _this.preprocessor.graph.edges[ed];
                        if (!edge.isAtomVertex) {
                            edge.isAtomSlat = true;
                        }
                        utils_1.arrayDelElement(arrE, ed);
                    });
                });
                if (elements.length === 5 && (arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1) {
                    this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
                }
                else {
                    if (elements.length === 6) {
                        arrE.map(function (item) {
                            _this.preprocessor.graph.edges[item].isBottomSlat = true;
                        });
                    }
                }
                return true;
            }
        }
        return false;
    };
    SvgDrawer.prototype.isHydrogenVertices = function (arr) {
        var res = false;
        for (var i = 0; i < arr.length; i++) {
            if (this.preprocessor.graph.vertices[arr[i]].value.bracket
                && Number(this.preprocessor.graph.vertices[arr[i]].value.bracket.hcount) > 0) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.isVertexHasDoubleBondWithO = function (ring, v) {
        var res = false;
        var vertex = this.preprocessor.graph.vertices[v];
        var vEdges = vertex.edges.filter(function (item) { return ring.edges.indexOf(item) === -1; });
        if (vEdges.length > 1) {
            for (var i = 0; i < vEdges.length; i++) {
                var edge = this.preprocessor.graph.edges[vEdges[i]];
                var vertexB = this.preprocessor.graph.vertices[edge.targetId];
                if (this.edgeHaveDoubleBound(edge) && vertexB.value.element === 'O') {
                    vertex.hasDoubleBondWithO = true;
                    res = true;
                }
            }
        }
        return res;
    };
    ;
    SvgDrawer.prototype.checkVertex_N = function (vertex) {
        if (vertex.value.element !== 'N') {
            return false;
        }
        var neighbours = this.preprocessor.graph.vertices[vertex.id].neighbours;
        var bonds = 0;
        for (var j = 0; j < neighbours.length; j++) {
            bonds += this.preprocessor.graph.getEdge(vertex.id, neighbours[j]).weight;
        }
        if (bonds > vertex.value.getMaxBonds()) {
            return true;
        }
        return false;
    };
    SvgDrawer.prototype.findStartNbyEdges = function (members, elements) {
        var _a;
        var res = -1;
        var isHydrogen = false;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] !== 'N') {
                continue;
            }
            var v = members[i];
            var vertex = this.preprocessor.graph.vertices[v];
            if (((_a = vertex.value.bracket) === null || _a === void 0 ? void 0 : _a.charge) === 1) {
                continue;
            }
            var edges = vertex.edges.filter(function (e, i, a) { return a.indexOf(e) == i; });
            if (this.checkVertex_N(vertex)) {
                continue;
            }
            if (edges.length > 2) {
                res = i;
                if (vertex.value.rings.length > 1) {
                    continue;
                }
                else {
                    break;
                }
            }
            if (members.length >= 5 && this.isHydrogenVertices([v])) {
                res = i;
                isHydrogen = true;
                break;
            }
        }
        return { indexS: res, isHydrogen: isHydrogen };
    };
    SvgDrawer.prototype.findStartElementbyEdges = function (members, elements, element) {
        var _a;
        var res = -1;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i] !== element) {
                continue;
            }
            var v = members[i];
            var vertex = this.preprocessor.graph.vertices[v];
            if (((_a = vertex.value.bracket) === null || _a === void 0 ? void 0 : _a.charge) === 1) {
                continue;
            }
            res = i;
        }
        return res;
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
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' || this.edgeHaveDoubleBound(edge) ||
            (edge.isPartOfAromaticRing && preprocessor.bridgedRing
                && edge.isPartOfRing)
            || (edge.isPartOfRing
                && opts.ringVisualization === 'default')) {
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
                    if (opts.ringAromaticVisualization === 'dashed' && preprocessor.bridgedRing) {
                        svgWrapper.drawLine(line, true);
                    }
                    else {
                        if (((edge.isHaveLine && !edge.isNotHaveLine)
                            || (edge.bondType === '=' || this.edgeHaveDoubleBound(edge)))) {
                            svgWrapper.drawLine(line);
                        }
                    }
                }
                else {
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
    SvgDrawer.prototype.allNeighboursHasDoubleLine = function (vertex) {
        var edges = vertex.edges;
        if (edges.length < 2 || vertex.value.rings.length) {
            return false;
        }
        var res = true;
        for (var i = 0; i < edges.length; i++) {
            var edge = this.preprocessor.graph.edges[edges[i]];
            if (edge.bondType !== '=') {
                res = false;
                break;
            }
        }
        return res;
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
            var isShowC = element === 'C' && this.allNeighboursHasDoubleLine(vertex);
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
            else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements) || isShowC) || graph.vertices.length === 1) {
                if (opts.atomVisualization === 'default') {
                    var isCentre = atom.hasPseudoElements && vertex.neighbours.length === 4 && !vertex.value.rings.length;
                    svgWrapper.drawText(vertex.position.x, vertex.position.y, element, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements(), isCentre);
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