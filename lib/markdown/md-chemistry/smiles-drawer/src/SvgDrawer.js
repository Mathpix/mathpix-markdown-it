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
                //DoubleBondWithO
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
                    if (edge.bondType !== '=' && vertexA.neighbourCount > 2
                        && vertexA.neighbourCount < vertexA.value.bondCount) {
                        edge.sourceHasOuterDoubleBond = true;
                        ring.hasOuterDoubleBond = true;
                    }
                    if (edge.bondType !== '=' && vertexB.neighbourCount > 2
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
        var _this = this;
        var _a;
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var graph = preprocessor.graph;
        var edges = preprocessor.graph.edges;
        var _loop_2 = function (i) {
            var ring = rings[i];
            if (this_2.isRing_SNN(ring)) {
                return "continue";
            }
            if (this_2.isRing_ONN(ring)) {
                return "continue";
            }
            if (this_2.isRing_NNN(ring)) {
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
        var _this = this;
        var preprocessor = this.preprocessor;
        var rings = preprocessor.rings;
        var edges = preprocessor.graph.edges;
        var commonRings = [];
        var _loop_3 = function (i) {
            var ring = rings[i];
            if (ring.isDrawed) {
                return "continue";
            }
            if (preprocessor.opts.debug) {
                console.log('Draw ring=>', ring);
            }
            if (ring.elements
                && (ring.elements.indexOf('S') !== -1
                    || ring.elements.indexOf('O') !== -1
                    || (ring.elements.indexOf('N') !== -1 && ring.elements.length === 5))) {
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
                //isNeighboursVerticesHaveDoubleLine
                var rEdges = ring.edges;
                if (ring.neighbours.length === 1) {
                    var nRing = rings[ring.neighbours[0]];
                    if (nRing.edges.length < 1
                        && (nRing.elements.indexOf('O') !== -1 || nRing.neighbours.length > 1)) {
                        var edgeR = edges[ring.edgesR[0]];
                        if (edgeR && this_3.isNeighboursVerticesHaveDoubleLine(edgeR, ring)) {
                            rEdges = utils_1.arrayResortFromElement(ring.edges, edgeR.id, true);
                        }
                    }
                }
                var prevHaveLine = false;
                var _loop_4 = function (index) {
                    var item = rEdges[index];
                    if (this_3.edgeCanNotHaveLine(edges[item])) {
                        prevHaveLine = false;
                        return "continue";
                    }
                    if (index === 0) {
                        var vertexA = preprocessor.graph.vertices[edges[item].sourceId];
                        var needToNext = false;
                        if (vertexA.value.element === 'N') {
                            needToNext = true;
                        }
                        else {
                            for (var j = 0; j < vertexA.edges.length; j++) {
                                if (edges[vertexA.edges[j]].isHaveLine) {
                                    needToNext = true;
                                    break;
                                }
                            }
                        }
                        if (needToNext) {
                            prevHaveLine = false;
                            return "continue";
                        }
                        else {
                            if (ring.neighbours.length < 1) {
                                if (!ring.hasDoubleBondWithO) {
                                    prevHaveLine = true;
                                }
                            }
                        }
                    }
                    if (!prevHaveLine) {
                        prevHaveLine = true;
                        if (ring.edgesR.indexOf(item) !== -1) {
                            var iRing = edges[item].rings.filter(function (r) { return r !== ring.id; });
                            var rhasHydrogen_1 = false;
                            var rhasOuterDoubleBond_1 = false;
                            iRing.map(function (item) {
                                var nRing = rings[item];
                                if (!rhasHydrogen_1 && nRing.hasHydrogen) {
                                    rhasHydrogen_1 = true;
                                }
                                if (!rhasOuterDoubleBond_1 && nRing.hasOuterDoubleBond) {
                                    rhasOuterDoubleBond_1 = true;
                                }
                            });
                            // const nRing = rings[iRing];
                            if (ring.elements.indexOf('N') !== -1
                                || (ring.elements.filter(function (item) { return item !== 'C'; }).length === 0
                                    && rEdges.length > 5
                                    && !rhasHydrogen_1 && !rhasOuterDoubleBond_1)) {
                                ring.isDrawed = true;
                                if (this_3.isNeighboursVerticesHaveCommonRing(edges[item], ring)) {
                                    edges[item].isNotHaveLine = false;
                                    edges[item].isHaveLine = true;
                                    this_3.drawCommonRing(ring.id, item, {
                                        isCommonEdgeHaveLine: true,
                                        isHydro: false,
                                        isNotSetLast: false,
                                        isNotResort: false,
                                        indexStart: 2,
                                        isHasFirst: true
                                    });
                                }
                                else {
                                    this_3.drawCommonRing(ring.id, item, { isCommonEdgeHaveLine: true });
                                }
                            }
                            else {
                                if (rEdges.length === 6) {
                                    // edges[item].isHaveLine = true;
                                    this_3.drawCommonRing(ring.id, item, { isCommonEdgeHaveLine: true });
                                }
                            }
                        }
                        else {
                            edges[item].isHaveLine = true;
                        }
                    }
                    else {
                        prevHaveLine = false;
                        if (ring.edgesR.indexOf(item) !== -1) {
                            if (commonRings.indexOf(item) === -1) {
                                commonRings.push(item);
                            }
                        }
                    }
                };
                for (var index = 0; index < rEdges.length; index++) {
                    _loop_4(index);
                }
                if (commonRings.length > 0) {
                    commonRings.map(function (ed) {
                        _this.drawCommonRing(ring.id, ed, {
                            isCommonEdgeHaveLine: false,
                            isHydro: true,
                            isNotSetLast: false,
                            isNotResort: true
                        });
                    });
                    commonRings = [];
                }
            }
        };
        var this_3 = this;
        for (var i = 0; i < rings.length; i++) {
            _loop_3(i);
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
        if (elements.length !== 5) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N' || item === 'S'; });
        if ((arr === null || arr === void 0 ? void 0 : arr.length) > 0 && arr.indexOf('S') !== -1) {
            var members_1 = ring.membersS;
            var indexS = elements.indexOf('S');
            if (indexS !== -1) {
                var vS = members_1[indexS];
                var vertex_1 = graph.vertices[vS];
                vertex_1.edges.map(function (item) {
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isNotHaveLine = true;
                        if (vertex_1.value.element === 'O') {
                            _this.drawCommonRing(ring.id, item, {
                                isCommonEdgeHaveLine: false, isHydro: false, isNotSetLast: true, isNotResort: false, indexStart: 2, reDraw: true
                            });
                        }
                        else {
                            _this.drawCommonRing(ring.id, item, {
                                isCommonEdgeHaveLine: false, isHydro: false, isNotSetLast: true, isNotResort: false, indexStart: 0, reDraw: false
                            });
                        }
                    }
                });
                ring.isDrawed = true;
                var neighbours = vertex_1.neighbours;
                neighbours.map(function (item) {
                    if (members_1.indexOf(item) !== -1) {
                        var vertexN = graph.vertices[item];
                        if (!_this.vertexHasBondType(vertexN)) {
                            vertexN.edges.map(function (ed) {
                                if (ring.edges.indexOf(ed) !== -1) {
                                    var edge = _this.preprocessor.graph.edges[ed];
                                    edge.isNotReDraw = true;
                                    if (_this.edgeVerticesAlreadyHasDoubleLine(edge)) {
                                        edge.isNotHaveLine = true;
                                    }
                                    if (ring.edgesR.indexOf(edge.id) !== -1) {
                                        if ((ring.neighbours.length === 1 || ring.members.length === 5)
                                            && (_this.isNeighboursVerticesHaveDoubleLine(edge, ring)
                                                || _this.isNeighboursVerticesHaveCommonRing(edge, ring))) {
                                            edge.isNotHaveLine = false;
                                            edge.isHaveLine = true;
                                            _this.drawCommonRing(ring.id, edge.id, {
                                                isCommonEdgeHaveLine: true,
                                                isNotResort: true,
                                                //indexStart: 2,
                                                isHasFirst: true,
                                            });
                                        }
                                        else {
                                            _this.drawCommonRing(ring.id, edge.id, { isCommonEdgeHaveLine: true });
                                        }
                                    }
                                    else {
                                        edge.isHaveLine = true;
                                    }
                                }
                            });
                        }
                    }
                });
                ring.isDrawed = true;
                return true;
            }
        }
        return false;
    };
    SvgDrawer.prototype.isRing_ONN = function (ring) {
        var _this = this;
        var _a;
        var elements = ring.elements;
        var arrE = tslib_1.__spread(ring.edges);
        var graph = this.preprocessor.graph;
        if (elements.length < 5) {
            return false;
        }
        var arr = elements.filter(function (item) { return item === 'N' || item === 'O'; });
        if (((arr === null || arr === void 0 ? void 0 : arr.length) > 0
            && arr.indexOf('O') !== -1)
        //|| (ring.hasDoubleBondWithO)
        ) {
            var members_2 = ring.membersS;
            var indexS = elements.indexOf('O');
            // let vS = -1;
            //
            // if (indexS === -1 && members.length === 6) {
            //   //indexS = this.findStartVertexByDoubleBondWithO(ring);
            //   vS = indexS;
            // } else {
            //   if (indexS !== -1) {
            //     vS = members[indexS];
            //   }
            // }
            if (indexS !== -1) {
                var vS = members_2[indexS];
                var vertex_2 = graph.vertices[vS];
                vertex_2.edges.map(function (item) {
                    var _a;
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isNotHaveLine = true;
                        utils_1.arrayDelElement(arrE, item);
                        if (((_a = ring.edgesR) === null || _a === void 0 ? void 0 : _a.length) && ring.edgesR.indexOf(item) !== -1) {
                            if (vertex_2.value.element === 'O') {
                                _this.drawCommonRing(ring.id, item, {
                                    isCommonEdgeHaveLine: false,
                                    isHydro: false,
                                    isNotSetLast: true,
                                    isNotResort: false,
                                    indexStart: 2,
                                    reDraw: true
                                });
                            }
                            else {
                                _this.drawCommonRing(ring.id, item, {
                                    isCommonEdgeHaveLine: false,
                                    isHydro: false,
                                    isNotSetLast: true,
                                    isNotResort: false,
                                    indexStart: 0,
                                    reDraw: false
                                });
                            }
                        }
                    }
                });
                ring.isDrawed = true;
                var neighbours = vertex_2.neighbours.filter(function (item) { return members_2.indexOf(item) !== -1; });
                // let hasN = false;
                // neighbours.map(item => {
                //   if (graph.vertices[item].value.element === 'N') {
                //     hasN = true;
                //   }
                // });
                neighbours.map(function (item) {
                    var vertexN = graph.vertices[item];
                    vertexN.edges.map(function (ed) {
                        if (ring.edges.indexOf(ed) !== -1) {
                            var edge = _this.preprocessor.graph.edges[ed];
                            if (_this.edgeVerticesAlreadyHasDoubleLine(edge)) {
                                edge.isNotHaveLine = true;
                            }
                            if (ring.edgesR.indexOf(edge.id) !== -1) {
                                if (ring.neighbours.length === 1
                                    && (_this.isNeighboursVerticesHaveDoubleLine(edge, ring)
                                        || _this.isNeighboursVerticesHaveCommonRing(edge, ring)
                                    //  || hasN
                                    )) {
                                    edge.isNotHaveLine = false;
                                    edge.isHaveLine = true;
                                    _this.drawCommonRing(ring.id, edge.id, {
                                        isCommonEdgeHaveLine: true,
                                        isHydro: false,
                                        isNotSetLast: false,
                                        isNotResort: false,
                                        indexStart: 2,
                                        isHasFirst: true
                                    });
                                }
                                else {
                                    _this.drawCommonRing(ring.id, edge.id, {
                                        isCommonEdgeHaveLine: true, isHydro: true
                                    });
                                }
                            }
                            else {
                                edge.isHaveLine = true;
                            }
                            utils_1.arrayDelElement(arrE, ed);
                        }
                    });
                });
            }
            if (elements.length === 5) {
                if ((arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1 && ((_a = ring.edgesR) === null || _a === void 0 ? void 0 : _a.length) && ring.edgesR.indexOf(arrE[0]) !== -1) {
                    this.drawCommonRing(ring.id, arrE[0], {});
                }
            }
            else {
                if (arrE.length) {
                    this.setLinesForEdges(ring, arrE, true);
                }
            }
            ring.isDrawed = true;
            return true;
        }
        return false;
    };
    SvgDrawer.prototype.isNeighboursVerticesHaveDoubleLine = function (edge, ring) {
        var graph = this.preprocessor.graph;
        var res = false;
        var vertices = [].concat(graph.vertices[edge.sourceId].neighbours, graph.vertices[edge.targetId].neighbours);
        for (var i = 0; i < vertices.length; i++) {
            var vertex = graph.vertices[vertices[i]];
            if (vertex.hasDoubleBondWithO
                && ((ring.members.length === 5 && vertex.value.rings.filter(function (item) { return item !== ring.id; }).length > 0)
                    || ring.members.length > 5)) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.isNeighboursVerticesHaveCommonRing = function (edge, ring) {
        var graph = this.preprocessor.graph;
        var res = false;
        var vertices = [].concat(graph.vertices[edge.sourceId].neighbours, graph.vertices[edge.targetId].neighbours);
        vertices = vertices.filter(function (item) { return ring.members.indexOf(item) === -1; });
        for (var i = 0; i < vertices.length; i++) {
            var vertex = graph.vertices[vertices[i]];
            var edges = vertex.edges.filter(function (item) { return (ring.edges.indexOf(item) === -1 && item !== edge.id); });
            if (this.edgesHaveCommonRing(edges)) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.edgesHaveCommonRing = function (edges) {
        var res = false;
        for (var i = 0; i < edges.length; i++) {
            var edge = this.preprocessor.graph.edges[edges[i]];
            if (edge.rings.length > 1) {
                res = true;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.isRing_NNN = function (ring) {
        var _this = this;
        var _a;
        var elements = ring.elements;
        var arrE = tslib_1.__spread(ring.edges);
        var graph = this.preprocessor.graph;
        if (elements.length !== 5) {
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
            if (indexS === -1) {
                if (members_3.length === 5) {
                    vS = this.findStartNbyCommonRing(ring);
                }
            }
            else {
                vS = members_3[indexS];
            }
            if (vS !== -1) {
                var vertex_3 = graph.vertices[vS];
                vertex_3.edges
                    .filter(function (e, i, a) { return a.indexOf(e) == i; })
                    .map(function (item) {
                    var _a;
                    if (ring.edges.indexOf(item) !== -1) {
                        var edge = _this.preprocessor.graph.edges[item];
                        edge.isNotHaveLine = true;
                        edge.isNotReDraw = true;
                        utils_1.arrayDelElement(arrE, item);
                        if (((_a = ring.edgesR) === null || _a === void 0 ? void 0 : _a.length) && ring.edgesR.indexOf(item) !== -1) {
                            if (vertex_3.value.element === 'N') {
                                _this.drawCommonRing(ring.id, item, {
                                    isCommonEdgeHaveLine: false,
                                    isHydro: false,
                                    // isNotSetLast: true,
                                    isNotSetLast: ring.neighbours.length === 1,
                                    isNotResort: false,
                                    isNeedResort: true,
                                    //isNeedResort: true,
                                    // isHasFirst: true,
                                    indexStart: 2,
                                    reDraw: true
                                });
                            }
                            else {
                                if (ring.neighbours.length === 1
                                    && _this.isNeighboursVerticesHaveDoubleLine(edge, ring)) {
                                    edge.isNotHaveLine = false;
                                    edge.isHaveLine = true;
                                    _this.drawCommonRing(ring.id, edge.id, {
                                        isCommonEdgeHaveLine: true,
                                        isHydro: false,
                                        isNotSetLast: false,
                                        isNotResort: false,
                                        indexStart: 2,
                                        isHasFirst: true
                                    });
                                }
                                else {
                                    _this.drawCommonRing(ring.id, item, {
                                        isCommonEdgeHaveLine: false,
                                        isHydro: false,
                                        isNotSetLast: true,
                                        isNotResort: false,
                                        indexStart: 0,
                                        reDraw: false
                                    });
                                }
                            }
                        }
                    }
                });
                var neighbours = vertex_3.neighbours.filter(function (item) { return members_3.indexOf(item) !== -1; });
                if (this.isHydrogenVertices(neighbours)) {
                    neighbours.map(function (item) {
                        var v = graph.vertices[item];
                        v.edges.map(function (ed) {
                            utils_1.arrayDelElement(arrE, ed);
                        });
                    });
                    if ((arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1) {
                        var edge = this.preprocessor.graph.edges[arrE[0]];
                        edge.isHaveLine = true;
                    }
                    ring.isDrawed = true;
                    return true;
                }
                var hasDoubleBondWithO_1 = false;
                // let hasN = false;
                neighbours.map(function (item) {
                    if (graph.vertices[item].hasDoubleBondWithO) {
                        hasDoubleBondWithO_1 = true;
                    }
                    // if (graph.vertices[item].value.element === 'N') {
                    //   hasN = true;
                    // }
                });
                ring.isDrawed = true;
                neighbours.map(function (item) {
                    var vertexN = graph.vertices[item];
                    var vEdges = vertexN.edges.filter(function (ed) { return ring.edges.indexOf(ed) !== -1 && arrE.indexOf(ed) !== -1; });
                    vEdges.map(function (ed) {
                        var edge = _this.preprocessor.graph.edges[ed];
                        if (_this.edgeVerticesAlreadyHasDoubleLine(edge)
                            || _this.checkNeighboursEdges(edge, vertexN, vertexN)
                        // || this.edgeCanNotHaveLine(edge)
                        ) {
                            edge.isNotHaveLine = true;
                        }
                        if (ring.edgesR.indexOf(edge.id) !== -1) {
                            if (ring.neighbours.length === 1
                                && (_this.isNeighboursVerticesHaveDoubleLine(edge, ring)
                                    || _this.isNeighboursVerticesHaveCommonRing(edge, ring)
                                    || hasDoubleBondWithO_1
                                //  || hasN
                                )) {
                                edge.isNotHaveLine = false;
                                edge.isHaveLine = true;
                                _this.drawCommonRing(ring.id, edge.id, {
                                    isCommonEdgeHaveLine: true,
                                    isHydro: false,
                                    isNotSetLast: false,
                                    isNotResort: false,
                                    indexStart: 2,
                                    isHasFirst: true
                                });
                            }
                            else {
                                _this.drawCommonRing(ring.id, edge.id, { isCommonEdgeHaveLine: true, isHydro: true });
                            }
                        }
                        else {
                            edge.isHaveLine = true;
                        }
                        utils_1.arrayDelElement(arrE, ed);
                    });
                });
                if ((arrE === null || arrE === void 0 ? void 0 : arrE.length) === 1 && ((_a = ring.edgesR) === null || _a === void 0 ? void 0 : _a.length) && ring.edgesR.indexOf(arrE[0]) !== -1) {
                    this.drawCommonRing(ring.id, arrE[0], {});
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
    SvgDrawer.prototype.findStartVertexByDoubleBondWithO = function (ring) {
        var res = -1;
        for (var i = 0; i < ring.members.length; i++) {
            var v = ring.members[i];
            var vertex = this.preprocessor.graph.vertices[v];
            if (vertex.hasDoubleBondWithO) {
                res = v;
                break;
            }
            // if (this.isVertexHasDoubleBondWithO(ring, v)) {
            //   res = v;
            //   break
            // }
        }
        return res;
    };
    ;
    SvgDrawer.prototype.isVertexHasDoubleBondWithO = function (ring, v) {
        var res = false;
        var vertex = this.preprocessor.graph.vertices[v];
        var vEdges = vertex.edges.filter(function (item) { return ring.edges.indexOf(item) === -1; });
        if (vEdges.length > 1) {
            for (var i = 0; i < vEdges.length; i++) {
                var edge = this.preprocessor.graph.edges[vEdges[i]];
                var vertexB = this.preprocessor.graph.vertices[edge.targetId];
                if (edge.bondType === '=' && vertexB.value.element === 'O') {
                    vertex.hasDoubleBondWithO = true;
                    res = true;
                }
            }
        }
        return res;
    };
    ;
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
            if (edges.length > 2) {
                res = i;
                break;
            }
            if (members.length === 5 && this.isHydrogenVertices([v])) {
                res = i;
                isHydrogen = true;
                break;
            }
        }
        return { indexS: res, isHydrogen: isHydrogen };
    };
    SvgDrawer.prototype.findStartNbyCommonRing = function (ring) {
        var res = -1;
        for (var i = 0; i < ring.edgesR.length; i++) {
            var edge = this.preprocessor.graph.edges[ring.edgesR[i]];
            var vertexA = this.preprocessor.graph.vertices[edge.sourceId];
            var vertexB = this.preprocessor.graph.vertices[edge.targetId];
            var isVertexA = vertexA.value.element === 'C' && vertexA.value.neighbouringElements.filter(function (item) { return item === 'N'; }).length > 1;
            var isVertexB = vertexB.value.element === 'C' && vertexB.value.neighbouringElements.filter(function (item) { return item === 'N'; }).length > 1;
            if (!isVertexA && !isVertexB) {
                continue;
            }
            if (isVertexA) {
                res = vertexB.id;
                break;
            }
            if (isVertexB) {
                res = vertexA.id;
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.vertexHasBondType = function (vertex) {
        var res = false;
        for (var i = 0; i < vertex.edges.length; i++) {
            var edge = this.preprocessor.graph.edges[vertex.edges[i]];
            if (edge.bondType === "=") {
                res = true;
                break;
            }
        }
        return res;
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
    SvgDrawer.prototype.isAromaticCommonRing = function (ringId, edge) {
        var vertexA = this.preprocessor.graph.vertices[edge.targetId];
        var vertexB = this.preprocessor.graph.vertices[edge.sourceId];
        var commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
        if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) > 1) {
            var index = commonRings.indexOf(ringId);
            if (index > -1) {
                commonRings.splice(index, 1);
            }
            if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) === 1) {
                return this.preprocessor.rings[commonRings[0]].edges.length > 0;
            }
        }
        return false;
    };
    SvgDrawer.prototype.drawCommonRing = function (ringId, iEdge, options) {
        var _a = options.isCommonEdgeHaveLine, isCommonEdgeHaveLine = _a === void 0 ? false : _a, _b = options.isHydro, isHydro = _b === void 0 ? false : _b, _c = options.isNotSetLast, isNotSetLast = _c === void 0 ? false : _c, _d = options.isNotResort, isNotResort = _d === void 0 ? false : _d, _e = options.indexStart, indexStart = _e === void 0 ? 0 : _e, _f = options.reDraw, reDraw = _f === void 0 ? false : _f, _g = options.isHasFirst, isHasFirst = _g === void 0 ? false : _g, _h = options.isNeedResort, isNeedResort = _h === void 0 ? false : _h;
        var edge = this.preprocessor.graph.edges[iEdge];
        var vertexA = this.preprocessor.graph.vertices[edge.targetId];
        var vertexB = this.preprocessor.graph.vertices[edge.sourceId];
        var isFirst = false;
        var commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
        if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) > 1) {
            var index = commonRings.indexOf(ringId);
            if (index > -1) {
                commonRings.splice(index, 1);
            }
            if ((commonRings === null || commonRings === void 0 ? void 0 : commonRings.length) === 1) {
                var ring = this.preprocessor.rings[commonRings[0]];
                var needReDraw = reDraw && ring.isDrawed && ring.neighbours.length > 1;
                if (ring.members.length < 6 || ring.edges.length < 6) {
                    if (isCommonEdgeHaveLine) {
                        edge.isHaveLine = true;
                    }
                    return;
                }
                if (ring.isDrawed && !needReDraw) {
                    return;
                }
                var edges = void 0;
                var neighbouringElementsA = vertexA.value.neighbouringElements.filter(function (item) { return item === 'N' || item === 'S'; });
                var neighbouringElementsB = vertexB.value.neighbouringElements.filter(function (item) { return item === 'N' || item === 'S'; });
                var neighbouringElementsA_hasS = neighbouringElementsA.length >= 1 && neighbouringElementsA.indexOf('S') !== -1;
                var neighbouringElementsB_hasS = neighbouringElementsB.length >= 1 && neighbouringElementsB.indexOf('S') !== -1;
                if (!ring.hasHydrogen
                    && (ring.edgesR.length < 2 || reDraw)
                    && (isNotResort || neighbouringElementsA_hasS || neighbouringElementsB_hasS)) {
                    if (isNeedResort) {
                        edges = utils_1.arrayResortFromElement(ring.edges, iEdge, true);
                    }
                    else {
                        edges = ring.edges;
                    }
                    isFirst = true;
                    if (isHydro) {
                        isFirst = false;
                    }
                }
                else {
                    var eNext = this.getNexEdgeFromRing(ring, this.preprocessor.graph.edges[iEdge]);
                    if (this.preprocessor.opts.debug) {
                        console.log('eNext =>', eNext);
                    }
                    edges = utils_1.arrayResortFromElement(ring.edges, iEdge, isNeedResort, eNext);
                    if (isCommonEdgeHaveLine) {
                        isFirst = true;
                    }
                    if (isHydro
                        || (ring.edgesR.length > 1 && !ring.hasHydrogen)
                        || (this.isSimpleRing(ring) && this.preprocessor.rings[ringId].members.length > 5)) {
                        isFirst = false;
                    }
                    if (isHasFirst) {
                        isFirst = true;
                    }
                }
                if (this.preprocessor.opts.debug) {
                    console.log('ring=>', ring);
                    console.log('edges=>', edges);
                }
                ring.isDrawed = true;
                this.setLinesForEdges(ring, edges, isFirst, isNotSetLast, indexStart, needReDraw);
                if (isCommonEdgeHaveLine && !this.isNeighboursEdgesHaveLine(edge)) {
                    edge.isHaveLine = true;
                    edge.isNotHaveLine = false;
                }
            }
        }
    };
    SvgDrawer.prototype.getNexEdgeFromRing = function (ring, edge) {
        var res = -1;
        var nE = edge.neighbours.filter(function (item) { return ring.edges.indexOf(item) !== -1; });
        for (var i = 0; i < nE.length; i++) {
            if (this.edgeBetweenRings(this.preprocessor.graph.edges[nE[i]], ring.id)) {
                res = nE[i];
                break;
            }
        }
        return res;
    };
    SvgDrawer.prototype.isSimpleRing = function (ring) {
        var elements = ring.elements.filter(function (item) { return item !== 'C' && item !== 'N'; });
        return elements.length === 0 && !ring.hasOuterDoubleBond && !ring.hasDoubleBondWithO;
    };
    SvgDrawer.prototype.edgeBetweenRings = function (edge, ringId) {
        var vertexA = this.preprocessor.graph.vertices[edge.targetId];
        var vertexB = this.preprocessor.graph.vertices[edge.sourceId];
        var vertexARings = vertexA.value.rings.filter(function (item) { return item !== ringId; });
        var vertexBRings = vertexB.value.rings.filter(function (item) { return item !== ringId; });
        if (!vertexARings.length || !vertexBRings.length) {
            return false;
        }
        var aRing = this.preprocessor.rings[vertexARings[0]];
        var bRing = this.preprocessor.rings[vertexBRings[0]];
        if (aRing.id !== bRing.id &&
            aRing.members.length === 5 && bRing.members.length) {
            return true;
        }
        return false;
    };
    SvgDrawer.prototype.setLinesForEdges = function (ring, edges, isFirst, isNotSetLast, indexStart, needReDraw) {
        var _this = this;
        if (isFirst === void 0) { isFirst = false; }
        if (isNotSetLast === void 0) { isNotSetLast = false; }
        if (indexStart === void 0) { indexStart = 0; }
        if (needReDraw === void 0) { needReDraw = false; }
        var prevHaveLine = false;
        if (needReDraw) {
            edges.map(function (item) {
                var edge = _this.preprocessor.graph.edges[item];
                if (!edge.isNotReDraw) {
                    edge.isHaveLine = false;
                    edge.isNotHaveLine = false;
                }
            });
        }
        for (var index = 0; index < edges.length; index++) {
            var ed = this.preprocessor.graph.edges[edges[index]];
            if (index > 0 || (index === 0 && isFirst)) {
                if (this.edgeCanNotHaveLine(ed)
                    || this.edgeBetweenRings(ed, ring.id)
                    || (isNotSetLast && index === edges.length - 1)) {
                    prevHaveLine = false;
                    continue;
                }
                if (index < indexStart) {
                    prevHaveLine = false;
                    continue;
                }
                if (!prevHaveLine) {
                    if (ring.edgesR.indexOf(edges[index]) !== -1) {
                        if (ring.elements.indexOf('N') !== -1) {
                            this.drawCommonRing(ring.id, edges[index], { isCommonEdgeHaveLine: true });
                        }
                        else {
                            this.drawCommonRing(ring.id, edges[index], { isCommonEdgeHaveLine: true, isHydro: true });
                            // ed.isHaveLine = true;
                        }
                    }
                    else {
                        ed.isHaveLine = true;
                    }
                    ed.isHaveLine = true;
                    prevHaveLine = true;
                }
                else {
                    prevHaveLine = false;
                }
            }
            else {
                ed.isNotHaveLine = true;
            }
        }
    };
    SvgDrawer.prototype.isNeighboursEdgesHaveLine = function (edge) {
        var edgeA = this.preprocessor.graph.edges[edge.neighbours[0]];
        var edgeB = this.preprocessor.graph.edges[edge.neighbours[1]];
        return edgeA.isHaveLine || edgeB.isHaveLine;
    };
    SvgDrawer.prototype.edgeVerticesAlreadyHasDoubleLine = function (edge) {
        return edge.sourceHasOuterDoubleBond || edge.targetHasOuterDoubleBond;
    };
    SvgDrawer.prototype.edgeNeighboursCanNotHaveLine = function (ring, edge) {
        var res = false;
        var eNeighbours = edge.neighbours.filter(function (item) { return ring.edges.indexOf(item) !== -1; });
        for (var i = 0; i < eNeighbours.length; i++) {
            var edge_1 = this.preprocessor.graph.edges[eNeighbours[i]];
            if (this.edgeCanNotHaveLine(edge_1)) {
                res = true;
                break;
            }
        }
        return res;
    };
    ;
    SvgDrawer.prototype.edgeCanNotHaveLine = function (edge) {
        var res = false;
        var vertexA = this.preprocessor.graph.vertices[edge.sourceId];
        var vertexB = this.preprocessor.graph.vertices[edge.targetId];
        var isHydrogensA = this.isHydrogenVertices([edge.sourceId]);
        var isHydrogensB = this.isHydrogenVertices([edge.targetId]);
        if (isHydrogensA || isHydrogensB) {
            return true;
        }
        for (var i = 0; i < vertexA.edges.length; i++) {
            var edge_2 = this.preprocessor.graph.edges[vertexA.edges[i]];
            if (edge_2.bondType === '=' || (edge_2.isHaveLine && !edge_2.isNotHaveLine)) {
                res = true;
                break;
            }
        }
        for (var i = 0; i < vertexB.edges.length; i++) {
            var edge_3 = this.preprocessor.graph.edges[vertexB.edges[i]];
            if (edge_3.bondType === '=' || (edge_3.isHaveLine && !edge_3.isNotHaveLine)) {
                res = true;
                break;
            }
        }
        return res;
    };
    ;
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
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' ||
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
                        if (!edge.isNotHaveLine && (edge.isHaveLine || edge.bondType === '=')
                            && !this.checkNeighboursEdges(edge, vertexA, vertexB)) {
                            svgWrapper.drawLine(line);
                        }
                    }
                    // if (opts.ringAromaticVisualization !== 'dashed' && preprocessor.bridgedRing) {
                    //   if (!edge.isNotHaveLine && edge.isHaveLine
                    //     && !this.checkNeighboursEdges(edge, vertexA, vertexB)
                    //   ) {
                    //     svgWrapper.drawLine(line);
                    //   }
                    // } else {
                    //   svgWrapper.drawLine(line, true);
                    // }
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