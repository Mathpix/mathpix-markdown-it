// we use the drawer to do all the preprocessing. then we take over the drawing
// portion to output to svg
import ArrayHelper from './ArrayHelper';
import Atom from './Atom';
import Drawer from './Drawer';
import Line from './Line';
import SvgWrapper from './SvgWrapper';
import ThemeManager from './ThemeManager';
import Vector2 from './Vector2';
import { arraysCompare, arrayDelElement, arrayResortFromElement } from '../../../utils';

class SvgDrawer {
	public preprocessor: any;
	public themeManager: any;
	public svgWrapper: any;
	public bridgedRing: any;

  constructor(options) {
    this.preprocessor = new Drawer(options);
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
  draw(data, target, themeName = 'light', infoOnly = false) {
    let preprocessor = this.preprocessor;

    preprocessor.initDraw(data, themeName, infoOnly);

    if (!infoOnly) {
      this.themeManager = new ThemeManager(this.preprocessor.opts.themes, themeName);
      this.svgWrapper = new SvgWrapper(this.themeManager, target, this.preprocessor.opts);
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
  }

  sortMembers(ring){
    const members = [...ring.members].sort((a, b) => a - b);
    const arr = [];
    const edgesAll = [];
    let prev;
    for (let i = 0; i < members.length; i++) {
      const v = members[i];
      if (i === 0) {
        arr.push(v);
        prev = v
      }

      const vertex = this.preprocessor.graph.vertices[prev];

      const neighbours = vertex.neighbours.filter(item => members.indexOf(item) !== -1  && arr.indexOf(item) === -1);
      let vNext;
      if (neighbours?.length) {
        if (neighbours.length > 1) {
          vNext = Math.min(...neighbours)
        } else {
          vNext = neighbours[0];
        }
      } else {
        vNext = arr[0]
      }

      const vertexIds = vertex.id + '_' + vNext;
      const ed = this.preprocessor.graph.vertexIdsToEdgeId[vertexIds]

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
  }

  putEdgesForRings() {
    let preprocessor = this.preprocessor;
    let rings = preprocessor.rings;
    let graph = preprocessor.graph;
    let edges = preprocessor.graph.edges;

    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      ring.membersS = this.sortMembers(ring);

      if (ring.neighbours.length) {
        ring.neighbours.map(item => {
          const nRing = rings[item];
          if (nRing && nRing.neighbours.indexOf(ring.id) === -1) {
            nRing.neighbours.push(ring.id)
          }
        })
      }

      const members = ring.membersS;
      for (let j = 0; j < members.length; j++) {
        const v = members[j];
        let vertex = graph.vertices[v];

        if (this.isHydrogenVertices([v])) {
          ring.hasHydrogen = true;
        }
        //DoubleBondWithO
        if (this.isVertexHasDoubleBondWithO(ring, v)) {
          ring.hasDoubleBondWithO = true;
        }

        if (!ring.isHaveElements && vertex.value.element !== 'C') {
          ring.isHaveElements = true
        }
        ring.elements.push(vertex.value.element);

        const v2 = j < members.length - 1
          ? members[j + 1]
          : members[0];

        const {item, isBetweenRings } = this.getEdgeBetweenVertexAB(v, v2);

        let edge = edges[item];
        if (edge) {
          const vertexA = graph.vertices[edge.sourceId];
          const vertexB = graph.vertices[edge.targetId];

          if (edge.bondType !== '=' && vertexA.neighbourCount > 2
            && vertexA.neighbourCount < vertexA.value.bondCount
          ) {
            edge.sourceHasOuterDoubleBond = true;
            ring.hasOuterDoubleBond = true;
          }

          if (edge.bondType !== '=' && vertexB.neighbourCount > 2
            && vertexB.neighbourCount < vertexB.value.bondCount
          ) {
            edge.targetHasOuterDoubleBond = true;
            ring.hasOuterDoubleBond = true;
          }
        }

        if (edge?.isPartOfAromaticRing) {
          if (ring.edges.indexOf(item) === -1) {
            if (ring.edges.length > 0) {

              const prev = edges[ring.edges[ring.edges.length - 1]];

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
              edge.rings.push(ring.id)
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
        const first = edges[ring.edges[0]];
        const last  = edges[ring.edges[ring.edges.length - 1]];

        if (first.neighbours.indexOf(last.id) === -1) {
          first.neighbours.push(last.id);
        }
        if (last.neighbours.indexOf(first.id) === -1) {
          last.neighbours.push(first.id);
        }
      }


      if (ring.edgesR.length) {
        const arr = [...ring.edges];

        ring.edgesR.map(item => {
          const index = arr.indexOf(item);
          if (index > -1) {
            arr.splice(index, 1);
          }
        });
        if (!arr.length || arr.length < 1) {
          ring.edges = [];
        }
      }
    }
  };

  putEdgesLForRings() {
    let preprocessor = this.preprocessor;
    let rings = preprocessor.rings;
    let graph = preprocessor.graph;
    let edges = preprocessor.graph.edges;

    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
      if (this.isRing_SNN(ring)){
        continue;
      }
      if (this.isRing_ONN(ring)){
        continue;
      }
      if (this.isRing_NNN(ring)){
        continue;
      }


      if (ring.elements.indexOf('S') !== -1
        || ring.elements.indexOf('O') !== -1
        || ring.elements.indexOf('N') !== -1
      ) {
        ring.edges.map(item => {
          let edge = edges[item];
          let vertexA = graph.vertices[edge.targetId];
          let vertexB = graph.vertices[edge.sourceId];

          if (vertexA.value.element !== 'S' && vertexA.value.element !== 'O'
            && vertexB.value.element !== 'S' && vertexB.value.element !== 'O'
            && !(vertexA.value.element === 'N' && vertexB.value.element === 'N')
            && !this.isBridgeCommonRing(ring.id, vertexA, vertexB)
          ) {
            if (ring.edgesL.indexOf(item) === -1) {
              ring.edgesL.push(item);
            }
            this.neighboursHasDoubleLine(vertexA, ring.members, ring.edges);
          }
        })
      }

      if (ring.edgesL?.length) {
        ring.edgesL = ring.edgesL.sort((a, b) => {
          return a - b;
        })
      }
    }
  };

  checkEdgesRingsOnHaveLine() {
    let preprocessor = this.preprocessor;
    let rings = preprocessor.rings;
    let edges = preprocessor.graph.edges;
    let commonRings = [];

    for (let i = 0; i < rings.length; i++) {
      const  ring = rings[i];

      if (ring.isDrawed) {
        continue;
      }
      if (preprocessor.opts.debug) {
        console.log('Draw ring=>', ring)
      }
      if (ring.elements
        && (ring.elements.indexOf('S') !== -1
          || ring.elements.indexOf('O') !== -1
          || (ring.elements.indexOf('N') !== -1 && ring.elements.length === 5)
        )) {
        for (let index = 0; index < ring.edgesL.length; index++) {
          const item = ring.edgesL[index];
          if (edges[item].isHaveLine) {
            continue;
          }
          const iindex = index + 1;
          if (iindex & 1) {
            edges[item].isHaveLine = true;
          }
        }
      } else {
        //isNeighboursVerticesHaveDoubleLine
        let rEdges = ring.edges;

        if (ring.neighbours.length === 1) {
          const nRing = rings[ring.neighbours[0]];
          if (nRing.edges.length < 1
            && (nRing.elements.indexOf('O') !== -1 || nRing.neighbours.length > 1)
          ) {
            const edgeR = edges[ring.edgesR[0]];
            if (edgeR && this.isNeighboursVerticesHaveDoubleLine(edgeR, ring)) {
              rEdges = arrayResortFromElement(ring.edges, edgeR.id, true);
            }
          }
        }

        let prevHaveLine = false;
        for (let index = 0; index < rEdges.length; index++) {
          const item = rEdges[index];

          if (this.edgeCanNotHaveLine(edges[item])) {
            prevHaveLine = false;
            continue;
          }

          if (index === 0) {
            const vertexA = preprocessor.graph.vertices[edges[item].sourceId];
            let needToNext = false;
            if (vertexA.value.element === 'N') {
              needToNext = true;
            } else {
              for (let j = 0 ; j < vertexA.edges.length; j++) {
                if (edges[vertexA.edges[j]].isHaveLine) {
                  needToNext = true;
                  break;
                }
              }
            }
            if (needToNext) {
              prevHaveLine = false;
              continue;
            } else {

              if (ring.neighbours.length < 1) {
                if (!ring.hasDoubleBondWithO) {
                  prevHaveLine = true;
                }
              }
            }
          }

            if (!prevHaveLine)
          {
            prevHaveLine = true;
            if (ring.edgesR.indexOf(item) !== -1) {
              const iRing = edges[item].rings.filter(r => r !== ring.id);

              let rhasHydrogen = false;
              let rhasOuterDoubleBond = false;

              iRing.map( item => {
                const nRing = rings[item];
                if (!rhasHydrogen && nRing.hasHydrogen ) {
                  rhasHydrogen = true;
                }
                if (!rhasOuterDoubleBond && nRing.hasOuterDoubleBond ) {
                  rhasOuterDoubleBond = true;
                }
              });

              if (ring.elements.indexOf('N') !== -1
                || (ring.elements.filter(item => item !== 'C').length === 0
                  && rEdges.length > 5
                  && !rhasHydrogen && !rhasOuterDoubleBond)
              ) {

                ring.isDrawed = true;
                if ( this.isNeighboursVerticesHaveDoubleLine(edges[item], ring, true)
                  ||
                  this.isNeighboursVerticesHaveCommonRing(edges[item], ring)) {
                  edges[item].isNotHaveLine = false;
                  edges[item].isHaveLine = true;
                  this.drawCommonRing(ring.id, item, {
                    isCommonEdgeHaveLine: true,
                    isHydro: false,
                    isNotSetLast: false,
                    isNotResort: false,
                    indexStart: 2,
                    isHasFirst: true
                  });
                } else {
                  this.drawCommonRing(ring.id, item, {isCommonEdgeHaveLine: true});
                }
              } else {
                if (rEdges.length === 6) {
                  this.drawCommonRing(ring.id, item, {isCommonEdgeHaveLine: true});
                }
              }
            } else {
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
        }

        if (commonRings.length > 0) {
          commonRings.map(ed => {
            this.drawCommonRing(ring.id, ed, {
              isCommonEdgeHaveLine: false,
              isHydro: true,
              isNotSetLast: false,
              isNotResort: true
            })
          });
          commonRings = [];
        }
      }

    }
  };

  getEdgeBetweenVertexAB(vA, vB){
    let vertexA = this.preprocessor.graph.vertices[vA];
    let vertexB = this.preprocessor.graph.vertices[vB];

    let edgesA = [...vertexA.edges];
    let edgesB = [...vertexB.edges];

    const edges = edgesA.filter(i => edgesB.indexOf(i) >= 0);

    const isBetweenRings = vertexA.value.rings?.length > 1
      && vertexB.value.rings?.length > 1
      && arraysCompare(vertexA.value.rings, vertexB.value.rings);

    const rings = isBetweenRings
      ? vertexA.value.rings
      : [];

    return {
      item: edges[0],
      isBetweenRings: isBetweenRings,
      bRings: rings
    };
  }

  isRing_SNN(ring) {
    const elements = ring.elements;
    let graph = this.preprocessor.graph;
    if (elements.length !== 5) {
      return false
    }
    const arr = elements.filter(item => item === 'N' || item === 'S');
    if (arr?.length > 0 && arr.indexOf('S') !== -1) {
      const members = ring.membersS;
      const indexS = elements.indexOf('S');
      if (indexS !== -1) {
        const vS = members[indexS];
        let vertex = graph.vertices[vS];
        vertex.edges.map(item => {
          if (ring.edges.indexOf(item) !== -1) {
            const edge = this.preprocessor.graph.edges[item];
            edge.isNotHaveLine = true;

            if (vertex.value.element === 'O' ) {
              this.drawCommonRing(ring.id, item, {
                isCommonEdgeHaveLine: false, isHydro: false, isNotSetLast: true, isNotResort: false, indexStart: 2, reDraw: true});
            } else {
              this.drawCommonRing(ring.id, item, {
                isCommonEdgeHaveLine: false, isHydro: false, isNotSetLast: true, isNotResort: false, indexStart: 0, reDraw: false
              });
            }
          }
        });

        ring.isDrawed = true;

        let neighbours = vertex.neighbours;
        neighbours.map(item => {
          if (members.indexOf(item) !== -1) {
            let vertexN = graph.vertices[item];
            if (!this.vertexHasBondType(vertexN)) {

              vertexN.edges.map(ed => {
                if (ring.edges.indexOf(ed) !== -1) {
                  const edge = this.preprocessor.graph.edges[ed];
                  edge.isNotReDraw = true;
                  if ( this.edgeVerticesAlreadyHasDoubleLine(edge)) {
                    edge.isNotHaveLine = true;
                  }
                  if (ring.edgesR.indexOf(edge.id) !== -1) {

                    if ( (ring.neighbours.length === 1 || ring.members.length === 5)
                      && (this.isNeighboursVerticesHaveDoubleLine(edge, ring)
                        || this.isNeighboursVerticesHaveCommonRing(edge, ring)
                      )) {

                      edge.isNotHaveLine = false;
                      edge.isHaveLine = true;
                      this.drawCommonRing(ring.id, edge.id, {
                        isCommonEdgeHaveLine: true,
                        isNotResort: true,
                        isHasFirst: true,
                      });
                    } else {
                      this.drawCommonRing(ring.id, edge.id, {isCommonEdgeHaveLine: true});
                    }
                  } else {
                    edge.isHaveLine = true;
                  }
                }
              })
            }
          }
        });
        ring.isDrawed = true;
        return true
      }
    }

    return false;
  }

  isRing_ONN(ring) {
    const elements = ring.elements;
    let arrE = [...ring.edges];
    let graph = this.preprocessor.graph;
    if (elements.length < 5) {
      return false
    }
    const arr = elements.filter(item => item === 'N' || item === 'O');
    if (
      (arr?.length > 0
      && arr.indexOf('O') !== -1)
    ) {
      const members = ring.membersS;
      let indexS = elements.indexOf('O');

      if (indexS !== -1) {
        const vS = members[indexS];
        let vertex = graph.vertices[vS];
        vertex.edges.map(item => {
          if (ring.edges.indexOf(item) !== -1) {
            const edge = this.preprocessor.graph.edges[item];
            edge.isNotHaveLine = true;
            arrayDelElement(arrE, item);

            if (ring.edgesR?.length && ring.edgesR.indexOf(item) !== -1) {
              if (vertex.value.element === 'O' ) {
                this.drawCommonRing(ring.id, item, {
                  isCommonEdgeHaveLine: false,
                  isHydro: false,
                  isNotSetLast: true,
                  isNotResort: false,
                  indexStart: 2,
                  reDraw: true});
              } else {
                this.drawCommonRing(ring.id, item, {
                  isCommonEdgeHaveLine: false,
                  isHydro: false,
                  isNotSetLast: true,
                  isNotResort: false,
                  indexStart: 0,
                  reDraw: false});
              }
            }
          }
        });

        ring.isDrawed = true;

        let neighbours = vertex.neighbours.filter(item => members.indexOf(item) !== -1);

        neighbours.map(item => {
          let vertexN = graph.vertices[item];
          vertexN.edges.map(ed => {
            if (ring.edges.indexOf(ed) !== -1) {
              const edge = this.preprocessor.graph.edges[ed];
              if ( this.edgeVerticesAlreadyHasDoubleLine(edge)) {
                edge.isNotHaveLine = true;
              }
              if (ring.edgesR.indexOf(edge.id) !== -1) {

                if ( ((ring.neighbours.length === 1 && ring.members.length > 5) && this.isNeighboursVerticesHaveDoubleLine(edge, ring))
                  ||
                  (this.isNeighboursVerticesHaveDoubleLine(edge, ring, true)
                    || this.isNeighboursVerticesHaveCommonRing(edge, ring)
                  )
                ) {
                  edge.isNotHaveLine = false;
                  edge.isHaveLine = true;
                  this.drawCommonRing(ring.id, edge.id, {
                    isCommonEdgeHaveLine: true,
                    isHydro: false,
                    isNotSetLast: false,
                    isNotResort: false,
                    indexStart: 2,
                    isHasFirst: true
                  });
                } else {
                  this.drawCommonRing(ring.id, edge.id, {
                    isCommonEdgeHaveLine: true, isHydro: true});
                }

              } else {
                edge.isHaveLine = true;
              }
              arrayDelElement(arrE, ed);
            }
          })

        })

      }

      if (elements.length === 5) {
        if (arrE?.length === 1 && ring.edgesR?.length && ring.edgesR.indexOf(arrE[0]) !== -1) {
          this.drawCommonRing(ring.id, arrE[0], {});
        }
      } else {
        if (arrE.length) {
          this.setLinesForEdges(ring, arrE, true);
        }
      }

      ring.isDrawed = true;
      return true
    }

    return false;
  }

  isNeighboursVerticesHaveDoubleLine(edge, ring, notCurrentRing = false) {
    const graph = this.preprocessor.graph;
    let res = false;

    let vertices = [].concat(graph.vertices[edge.sourceId].neighbours,
      graph.vertices[edge.targetId].neighbours);

    if (notCurrentRing) {
      vertices = vertices.filter(item => ring.members.indexOf(item) === -1)
    }

    for (let i = 0; i < vertices.length; i++) {
      const vertex = graph.vertices[vertices[i]];

      if (vertex.hasDoubleBondWithO
        && ((ring.members.length === 5 && vertex.value.rings.filter(item => item !== ring.id).length > 0)
           || ring.members.length > 5
        )

      ) {
        res = true;
        break;
      }
    }
    return res;
  }

  isNeighboursVerticesHaveCommonRing(edge, ring) {
    const graph = this.preprocessor.graph;
    let res = false;

    let vertices = [].concat(graph.vertices[edge.sourceId].neighbours,
      graph.vertices[edge.targetId].neighbours);
    vertices = vertices.filter(item => ring.members.indexOf(item) === -1);

    for (let i = 0; i < vertices.length; i++) {
      const vertex = graph.vertices[vertices[i]];
      const edges = vertex.edges.filter(item => (ring.edges.indexOf(item) === -1 && item !== edge.id));

      if (this.edgesHaveCommonRing(edges)) {
        res = true;
        break;
      }
    }
    return res;
  }

  edgesHaveCommonRing(edges) {
    let res = false;

    for (let i = 0; i < edges.length; i++) {
      const edge = this.preprocessor.graph.edges[edges[i]];
      if (edge.rings.length > 1) {
        res = true;
        break;
      }
    }
    return res;
  }

  isRing_NNN(ring) {
    const elements = ring.elements;
    let arrE = [...ring.edges];
    let graph = this.preprocessor.graph;
    if (elements.length !== 5) {
      return false
    }
    if (ring.isDrawed) {
      return false
    }
    const arr = elements.filter(item => item === 'N');
    if (arr?.length > 0) {
      const members = ring.membersS;
      let { indexS } = this.findStartNbyEdges(members, elements);
      let vS = -1;

      if (indexS === -1) {
        if (members.length === 5) {
          vS = this.findStartNbyCommonRing(ring)
        }
      } else {
        vS = members[indexS];
      }

      if (vS !== -1) {
        let vertex = graph.vertices[vS];
        vertex.edges
          .filter((e,i,a)=>a.indexOf(e)==i)
          .map(item => {
          if (ring.edges.indexOf(item) !== -1) {
            const edge = this.preprocessor.graph.edges[item];
            edge.isNotHaveLine = true;
            edge.isNotReDraw = true;
            arrayDelElement(arrE, item);
            if (ring.edgesR?.length && ring.edgesR.indexOf(item) !== -1) {
              if (vertex.value.element === 'N' ) {
                this.drawCommonRing(ring.id, item, {
                  isCommonEdgeHaveLine: false,
                  isHydro: false,
                  isNotSetLast: ring.neighbours.length === 1,
                  isNotResort: false,
                  isNeedResort: true,
                  indexStart: 2,
                  reDraw: true
                });
              } else {

                if ( ring.neighbours.length === 1
                  && this.isNeighboursVerticesHaveDoubleLine(edge, ring)) {
                  edge.isNotHaveLine = false;
                  edge.isHaveLine = true;
                  this.drawCommonRing(ring.id, edge.id, {
                    isCommonEdgeHaveLine: true,
                    isHydro: false,
                    isNotSetLast: false,
                    isNotResort: false,
                    indexStart: 2,
                    isHasFirst: true
                  });
                } else {
                  this.drawCommonRing(ring.id, item, {
                    isCommonEdgeHaveLine: false,
                    isHydro: false,
                    isNotSetLast: true,
                    isNotResort: false,
                    indexStart: 0,
                    reDraw: false});
                }
              }
            }

          }
        });

        let neighbours = vertex.neighbours.filter(item => members.indexOf(item) !== -1);
        if (this.isHydrogenVertices(neighbours)) {
          neighbours.map(item => {
            const v = graph.vertices[item];
            v.edges.map(ed => {
              arrayDelElement(arrE, ed);
            })
          });
          if (arrE?.length === 1) {
            const edge = this.preprocessor.graph.edges[arrE[0]];
            edge.isHaveLine = true;
          }
          ring.isDrawed = true;
          return true;
        }

        let hasDoubleBondWithO = false;
        neighbours.map(item => {
          if (graph.vertices[item].hasDoubleBondWithO) {
            hasDoubleBondWithO = true;
          }
        });

        ring.isDrawed = true;

        neighbours.map(item => {
          let vertexN = graph.vertices[item];

          const vEdges = vertexN.edges.filter(ed => ring.edges.indexOf(ed) !== -1 && arrE.indexOf(ed) !== -1);

          vEdges.map(ed => {
            const edge = this.preprocessor.graph.edges[ed];
            if (this.edgeVerticesAlreadyHasDoubleLine(edge)
              || this.checkNeighboursEdges(edge, vertexN, vertexN)

            ) {
              edge.isNotHaveLine = true;
            }
            if (ring.edgesR.indexOf(edge.id) !== -1) {
              if ( //ring.neighbours.length === 1
                //&&
                (this.isNeighboursVerticesHaveDoubleLine(edge, ring)
                  || this.isNeighboursVerticesHaveCommonRing(edge, ring)
                  || hasDoubleBondWithO
                )) {

                edge.isNotHaveLine = false;
                edge.isHaveLine = true;
                this.drawCommonRing(ring.id, edge.id, {
                  isCommonEdgeHaveLine: true,
                  isHydro: false,
                  isNotSetLast: false,
                  isNotResort: false,
                  indexStart: 2,
                  isHasFirst: true
                });
              } else {
                this.drawCommonRing(ring.id, edge.id, { isCommonEdgeHaveLine: true, isHydro: true});
              }

            } else {
              edge.isHaveLine = true;
            }

            arrayDelElement(arrE, ed);

          })
        });


        if (arrE?.length === 1 && ring.edgesR?.length && ring.edgesR.indexOf(arrE[0]) !== -1) {
          this.drawCommonRing(ring.id, arrE[0], {});
        }

        return true
      }
    }

    return false;
  }

  isHydrogenVertices(arr) {
    let res = false;
    for (let i = 0; i < arr.length; i++) {
      if (this.preprocessor.graph.vertices[arr[i]].value.bracket
        && Number(this.preprocessor.graph.vertices[arr[i]].value.bracket.hcount) > 0) {
        res = true;
        break;
      }
    }
    return res
  }

  findStartVertexByDoubleBondWithO(ring){
    let res = -1;
    for (let i = 0; i < ring.members.length; i++) {
      const v = ring.members[i];
      const vertex = this.preprocessor.graph.vertices[v];
      if (vertex.hasDoubleBondWithO) {
        res = v;
        break
      }
    }
    return res;
  };

  isVertexHasDoubleBondWithO(ring, v){
    let res = false;

    const vertex = this.preprocessor.graph.vertices[v];
    const vEdges = vertex.edges.filter(item => ring.edges.indexOf(item) === -1);

    if (vEdges.length > 1) {
      for (let i = 0; i < vEdges.length; i++) {
        const edge = this.preprocessor.graph.edges[vEdges[i]];
        const vertexB = this.preprocessor.graph.vertices[edge.targetId];

        if (edge.bondType === '=' && vertexB.value.element === 'O') {
          vertex.hasDoubleBondWithO = true;
          res = true;
        }
      }
    }
    return res;
  };

  findStartNbyEdges(members, elements) {
    let res = -1;
    let isHydrogen = false;
    for  (let i = 0; i < elements.length; i++) {
      if (elements[i] !== 'N') {
        continue;
      }

      const v = members[i];
      const vertex = this.preprocessor.graph.vertices[v];
      if (vertex.value.bracket?.charge === 1) {
        continue;
      }
      const edges = vertex.edges.filter((e,i,a)=>a.indexOf(e)==i);
      if (edges.length > 2) {
        res = i;
        if (vertex.value.rings.length > 1) {
          continue
        } else {
          break;
        }
      }

      if ( members.length === 5 && this.isHydrogenVertices([v])) {
        res = i;
        isHydrogen = true;
        break;
      }
    }
    return {indexS: res, isHydrogen: isHydrogen};
  }

  findStartNbyCommonRing(ring) {
    let res = -1;

    for  (let i = 0; i < ring.edgesR.length; i++) {
      const edge = this.preprocessor.graph.edges[ring.edgesR[i]];
      let vertexA = this.preprocessor.graph.vertices[edge.sourceId];
      let vertexB = this.preprocessor.graph.vertices[edge.targetId];


      const isVertexA = vertexA.value.element === 'C' && vertexA.value.neighbouringElements.filter(item => item === 'N').length > 1;
      const isVertexB = vertexB.value.element === 'C' && vertexB.value.neighbouringElements.filter(item => item === 'N').length > 1;

      if (!isVertexA && !isVertexB) {
        continue
      }

      if (isVertexA) {
        res = vertexB.id;
        break
      }

      if (isVertexB) {
        res = vertexA.id;
        break
      }

    }
    return res;
  }

  vertexHasBondType (vertex) {
    let res = false;
    for (let i = 0; i < vertex.edges.length; i++) {
      const edge = this.preprocessor.graph.edges[vertex.edges[i]];
      if (edge.bondType === "=") {
        res = true;
        break;
      }
    }
    return res;
  }

  neighboursHasDoubleLine(vertex, members, edgesR) {
    if (vertex.value.bondType === "=") {
      const edges = vertex.edges;
      edges.map(item => {
        if (edgesR.indexOf(item) !== -1) {
          const edge = this.preprocessor.graph.edges[item];
          edge.isNotHaveLine = true;
        }
      });
      return
    }

    let neighbours = vertex.neighbours;
    neighbours = neighbours.filter( item => members.indexOf(item) === -1);

    if (neighbours?.length) {
      for (let i = 0; i < neighbours.length; i++) {
        const vn = this.preprocessor.graph.vertices[neighbours[i]];
        if (vn.value?.branchBond === '=') {
          const edges = vertex.edges;
          edges.map(item => {
            if (edgesR.indexOf(item) !== -1) {
              const edge = this.preprocessor.graph.edges[item];
              edge.isNotHaveLine = true;
            }
          })
        }
      }
    }

  }

  isBridgeCommonRing(ringId, vertexA, vertexB) {
    let commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
    if (commonRings?.length > 1) {
      let index = commonRings.indexOf(ringId);
      if (index > -1) {
        commonRings.splice(index, 1);
      }
      if (commonRings?.length === 1) {
        return this.preprocessor.rings[commonRings[0]].isBridged;
      }
    }
    return false;
  }

  isAromaticCommonRing(ringId, edge) {
    const vertexA = this.preprocessor.graph.vertices[edge.targetId];
    const vertexB = this.preprocessor.graph.vertices[edge.sourceId];
    let commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
    if (commonRings?.length > 1) {
      let index = commonRings.indexOf(ringId);
      if (index > -1) {
        commonRings.splice(index, 1);
      }
      if (commonRings?.length === 1) {
        return this.preprocessor.rings[commonRings[0]].edges.length > 0;
      }
    }
    return false;
  }

  drawCommonRing(ringId, iEdge, options) {
    const {
      isCommonEdgeHaveLine = false,
      isHydro = false,
      isNotSetLast = false,
      isNotResort = false,
      indexStart = 0,
      reDraw = false,
      isHasFirst = false,
      isNeedResort = false,
    } = options;
    const edge = this.preprocessor.graph.edges[iEdge];
    const vertexA = this.preprocessor.graph.vertices[edge.targetId];
    const vertexB = this.preprocessor.graph.vertices[edge.sourceId];

    let isFirst = false;
    let commonRings = this.preprocessor.getCommonRings(vertexA, vertexB);
    if (commonRings?.length > 1) {
      let index = commonRings.indexOf(ringId);
      if (index > -1) {
        commonRings.splice(index, 1);
      }

      if (commonRings?.length === 1) {
        const ring = this.preprocessor.rings[commonRings[0]];

        const needReDraw = reDraw && ring.isDrawed && ring.neighbours.length > 1;
        if (ring.members.length < 6 || ring.edges.length < 6) {
          if (isCommonEdgeHaveLine) {
            edge.isHaveLine = true;
          }
          return
        }
        if (ring.isDrawed && !needReDraw) {
          return
        }

        let edges;
        let neighbouringElementsA = vertexA.value.neighbouringElements.filter(item => item === 'N' || item === 'S' );
        let neighbouringElementsB = vertexB.value.neighbouringElements.filter(item => item === 'N' || item === 'S' );

        let neighbouringElementsA_hasS = neighbouringElementsA.length >= 1 && neighbouringElementsA.indexOf('S') !== -1;
        let neighbouringElementsB_hasS = neighbouringElementsB.length >= 1 && neighbouringElementsB.indexOf('S') !== -1;
        if ( !ring.hasHydrogen
          && (ring.edgesR.length < 2 || reDraw)
          && (isNotResort || neighbouringElementsA_hasS || neighbouringElementsB_hasS)
        ) {
          if (isNeedResort) {
            edges = arrayResortFromElement(ring.edges, iEdge, true);
          } else {
            edges = ring.edges;
          }

          isFirst = true;
          if (isHydro) {
            isFirst = false
          }
        } else {

          const eNext = this.getNexEdgeFromRing(ring, this.preprocessor.graph.edges[iEdge]);
          if (this.preprocessor.opts.debug) {
            console.log('eNext =>', eNext)
          }
          edges = arrayResortFromElement(ring.edges, iEdge, isNeedResort, eNext);
          if (isCommonEdgeHaveLine) {
            isFirst = true;
          }
          if (isHydro
            || (ring.edgesR.length > 1 && !ring.hasHydrogen)
            || (this.isSimpleRing(ring) && this.preprocessor.rings[ringId].members.length > 5)
          ) {
            isFirst = false
          }
          if (isHasFirst) {
            isFirst = true;
          }
        }
        if (this.preprocessor.opts.debug) {
          console.log('[drawCommonRing] ring=>', ring)
          console.log('[drawCommonRing] edges=>', edges)
          console.log('[drawCommonRing] isNotSetLast=>', isNotSetLast)
        }

        ring.isDrawed = true;
        this.setLinesForEdges(ring, edges, isFirst, isNotSetLast, indexStart, needReDraw);


        if (isCommonEdgeHaveLine && !this.isNeighboursEdgesHaveLine(edge)) {
          edge.isHaveLine = true;
          edge.isNotHaveLine = false
        }
      }
    }
  }

  getNexEdgeFromRing(ring, edge ) {
    let res = -1;
    const nE = edge.neighbours.filter(item => ring.edges.indexOf(item) !== -1);

    for (let i = 0; i<nE.length; i++) {
      if (this.edgeBetweenRings(this.preprocessor.graph.edges[nE[i]], ring.id)) {
        res = nE[i];
        break;
      }
    }
    return res;
  }

  isSimpleRing(ring) {
    const elements = ring.elements.filter(item => item !== 'C' && item !== 'N');
    return elements.length === 0 && !ring.hasOuterDoubleBond && !ring.hasDoubleBondWithO;
  }

  edgeBetweenRings(edge, ringId){
    const vertexA = this.preprocessor.graph.vertices[edge.targetId];
    const vertexB = this.preprocessor.graph.vertices[edge.sourceId];

    const vertexARings = vertexA.value.rings.filter(item => item !== ringId);
    const vertexBRings = vertexB.value.rings.filter(item => item !== ringId);

    if (!vertexARings.length || !vertexBRings.length) {
      return false
    }

    const aRing = this.preprocessor.rings[vertexARings[0]];
    const bRing = this.preprocessor.rings[vertexBRings[0]];

   if (aRing.id !== bRing.id &&
     aRing.members.length === 5 && bRing.members.length ) {
     return true
   }
    return false
  }

  setLinesForEdges(ring, edges, isFirst = false, isNotSetLast = false, indexStart = 0, needReDraw = false) {
    let prevHaveLine = false;
    if (needReDraw) {
      edges.map(item => {
        const edge = this.preprocessor.graph.edges[item];
        if (!edge.isNotReDraw) {
          edge.isHaveLine = false;
          edge.isNotHaveLine = false;
        }

      })

    }
    for (let index = 0; index < edges.length; index++) {
      const ed = this.preprocessor.graph.edges[edges[index]];
      if (index > 0 || (index === 0 && isFirst)) {
        if (this.edgeCanNotHaveLine(ed)
          || this.edgeBetweenRings(ed, ring.id)
          || (isNotSetLast && index === edges.length - 1)
        ) {
          prevHaveLine = false;
          continue
        }
        if (index < indexStart) {
          prevHaveLine = false;
          continue
        }

        if (!prevHaveLine) {

          if (ring.edgesR.indexOf(edges[index]) !== -1) {
            if (ring.elements.indexOf('N') !== -1) {
              this.drawCommonRing(ring.id, edges[index], {isCommonEdgeHaveLine: true});
            } else {
              this.drawCommonRing(ring.id, edges[index], {isCommonEdgeHaveLine: true, isHydro: true});
            }
          } else {
            ed.isHaveLine = true;
          }


          ed.isHaveLine = true;
          prevHaveLine = true;
        } else {
          prevHaveLine = false;
        }
      } else {
        ed.isNotHaveLine = true;
      }
    }
  }

  isNeighboursEdgesHaveLine(edge) {
    const edgeA = this.preprocessor.graph.edges[edge.neighbours[0]];
    const edgeB = this.preprocessor.graph.edges[edge.neighbours[1]];

    return edgeA.isHaveLine || edgeB.isHaveLine;
  }

  edgeVerticesAlreadyHasDoubleLine(edge){
    return edge.sourceHasOuterDoubleBond || edge.targetHasOuterDoubleBond;
  }

  edgeNeighboursCanNotHaveLine(ring, edge){
    let res = false;

    const eNeighbours = edge.neighbours.filter(item => ring.edges.indexOf(item) !== -1);

    for (let i = 0; i < eNeighbours.length; i++) {
      const edge = this.preprocessor.graph.edges[eNeighbours[i]];
      if (this.edgeCanNotHaveLine(edge)) {
        res = true;
        break
      }
    }

    return res;
  };

  edgeCanNotHaveLine(edge){
    let res = false;
    const vertexA = this.preprocessor.graph.vertices[edge.sourceId];
    const vertexB = this.preprocessor.graph.vertices[edge.targetId];

    const isHydrogensA = this.isHydrogenVertices([edge.sourceId]);
    const isHydrogensB = this.isHydrogenVertices([edge.targetId]);

    if (isHydrogensA || isHydrogensB) {
      return true;
    }

    for (let i = 0; i < vertexA.edges.length; i++) {
      const edgeA = this.preprocessor.graph.edges[vertexA.edges[i]];
      if (edgeA.bondType === '=' || (edgeA.isHaveLine && !edgeA.isNotHaveLine)) {
        res = true;
        break
      }
    }
    for (let i = 0; i < vertexB.edges.length; i++) {
      const edgeB = this.preprocessor.graph.edges[vertexB.edges[i]];
      if (edgeB.bondType === '=' || (edgeB.isHaveLine && !edgeB.isNotHaveLine)) {
        res = true;
        break
      }
    }

    return res;
  };

  checkNeighboursEdges(edge, vertexA, vertexB) {
    let res = false;
    if (arraysCompare(vertexA.value.rings, vertexB.value.rings)) {
      const edgesA = vertexA.edges;
      const edgesB = vertexB.edges;

      for (let i = 0; i < edgesA.length; i++) {
        if (edgesA[i] === edge.id) {
          continue;
        }
        const e = this.preprocessor.graph.edges[edgesA[i]];
        if (!e.isNotHaveLine && e.isHaveLine) {
          res = true;
          break;
        }
      }

      if (res) {
        return res;
      }

      for (let i = 0; i < edgesB.length; i++) {
        if (edgesB[i] === edge.id) {
          continue;
        }
        const e = this.preprocessor.graph.edges[edgesB[i]];
        if (!e.isNotHaveLine && e.isHaveLine) {
          res = true;
          break;
        }
      }

    }
    return false;
  }

  /**
   * Draw the actual edges as bonds.
   *
   * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
   */
  drawEdges(debug) {
    let preprocessor = this.preprocessor,
      graph = preprocessor.graph,
      rings = preprocessor.rings,
      drawn = Array(this.preprocessor.graph.edges.length);

    drawn.fill(false);

    graph.traverseBF(0, vertex => {
      let edges = graph.getEdges(vertex.id);
      for (var i = 0; i < edges.length; i++) {
        let edgeId = edges[i];
        if (!drawn[edgeId]) {
          drawn[edgeId] = true;
          this.drawEdge(edgeId, debug);
        }
      }
    });
    // Draw ring for implicitly defined aromatic rings
    if (!this.preprocessor.bridgedRing
      && this.preprocessor.opts.ringVisualization === 'circle'
    ) {
      for (var i = 0; i < rings.length; i++) {
        let ring = rings[i];

        if (preprocessor.isRingAromatic(ring)) {
          this.svgWrapper.drawAromaticityRing(ring);
        }
      }
    }
  }

  /**
   * Draw the an edge as a bond.
   *
   * @param {Number} edgeId An edge id.
   * @param {Boolean} debug A boolean indicating whether or not to draw debug helpers.
   */
  drawEdge(edgeId, debug) {
    let preprocessor = this.preprocessor,
      opts = preprocessor.opts,
      svgWrapper = this.svgWrapper,
      edge = preprocessor.graph.edges[edgeId],
      vertexA = preprocessor.graph.vertices[edge.sourceId],
      vertexB = preprocessor.graph.vertices[edge.targetId],
      elementA = vertexA.value.element,
      elementB = vertexB.value.element;

    if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && preprocessor.opts.atomVisualization === 'default') {
      return;
    }

    let a = vertexA.position,
      b = vertexB.position,
      normals = preprocessor.getEdgeNormals(edge),
      // Create a point on each side of the line
      sides = ArrayHelper.clone(normals);

    sides[0].multiplyScalar(10).add(a);
    sides[0].multiplyScalar(10).add(a);
    sides[1].multiplyScalar(10).add(a);

    if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' ||
      (edge.isPartOfAromaticRing && preprocessor.bridgedRing
       && edge.isPartOfRing
      )
      || (edge.isPartOfRing
        && opts.ringVisualization === 'default'
      )
    ) {
      // Always draw double bonds inside the ring
      let inRing = preprocessor.areVerticesInSameRing(vertexA, vertexB);
      let s = preprocessor.chooseSide(vertexA, vertexB, sides);

      if (inRing) {
        // Always draw double bonds inside a ring
        // if the bond is shared by two rings, it is drawn in the larger
        // problem: smaller ring is aromatic, bond is still drawn in larger -> fix this
        let lcr = preprocessor.getLargestOrAromaticCommonRing(vertexA, vertexB);
        let center = lcr.center;

        normals[0].multiplyScalar(opts.bondSpacing);
        normals[1].multiplyScalar(opts.bondSpacing);

        // Choose the normal that is on the same side as the center
        let line = null;

        if (center.sameSideAs(vertexA.position, vertexB.position, Vector2.add(a, normals[0]))) {
          line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
        } else {
          line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
        }

        line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);

        // The shortened edge
        if (edge.isPartOfAromaticRing) {
          if (opts.ringAromaticVisualization === 'dashed' && preprocessor.bridgedRing) {
            svgWrapper.drawLine(line, true);
          } else {
            if (!edge.isNotHaveLine && (edge.isHaveLine || edge.bondType === '=')
              && !this.checkNeighboursEdges(edge, vertexA, vertexB)
            ) {
              svgWrapper.drawLine(line);
            }
          }
        } else {
          svgWrapper.drawLine(line);
        }

        svgWrapper.drawLine(new Line(a, b, elementA, elementB));
      } else if ((edge.center || vertexA.isTerminal() && vertexB.isTerminal()) ||
        (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1)) {
        this.multiplyNormals(normals, opts.halfBondSpacing);

        let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB),
          lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);

        svgWrapper.drawLine(lineA);
        svgWrapper.drawLine(lineB);
      } else if ((s.sideCount[0] > s.sideCount[1]) ||
        (s.totalSideCount[0] > s.totalSideCount[1])) {
        this.multiplyNormals(normals, opts.bondSpacing);

        let line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);

        line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);

        svgWrapper.drawLine(line);
        svgWrapper.drawLine(new Line(a, b, elementA, elementB));
      } else if ((s.sideCount[0] < s.sideCount[1]) ||
        (s.totalSideCount[0] <= s.totalSideCount[1])) {
        this.multiplyNormals(normals, opts.bondSpacing);

        let line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);

        line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
        svgWrapper.drawLine(line);
        svgWrapper.drawLine(new Line(a, b, elementA, elementB));
      }
    } else if (edge?.bondType === '#') {
      normals[0].multiplyScalar(opts.bondSpacing / 1.5);
      normals[1].multiplyScalar(opts.bondSpacing / 1.5);

      let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
      let lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);

      svgWrapper.drawLine(lineA);
      svgWrapper.drawLine(lineB);
      svgWrapper.drawLine(new Line(a, b, elementA, elementB));
    } else if (edge?.bondType === '.') {
      // TODO: Something... maybe... version 2?
    } else {
      let isChiralCenterA = vertexA.value.isStereoCenter;
      let isChiralCenterB = vertexB.value.isStereoCenter;

      if (edge.wedge === 'up') {
        svgWrapper.drawWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
      } else if (edge.wedge === 'down') {
        svgWrapper.drawDashedWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
      } else {
        svgWrapper.drawLine(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
      }
    }

    if (debug) {
      let midpoint = Vector2.midpoint(a, b);
      svgWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
    }
  }

  /**
   * Draws the vertices representing atoms to the canvas.
   *
   * @param {Boolean} debug A boolean indicating whether or not to draw debug messages to the canvas.
   */
  drawVertices(debug) {
    let preprocessor = this.preprocessor,
      opts = preprocessor.opts,
      graph = preprocessor.graph,
      rings = preprocessor.rings,
      svgWrapper = this.svgWrapper;

    var i = graph.vertices.length;
    for (var i: any = 0; i < graph.vertices.length; i++) {
      let vertex = graph.vertices[i];
      let atom = vertex.value;
      let charge = 0;
      let isotope = 0;
      let bondCount = vertex.value.bondCount;
      let element = atom.element;
      let hydrogens = Atom.maxBonds[element] - bondCount;
      let dir = vertex.getTextDirection(graph.vertices);
      let isTerminal = opts.terminalCarbons || element !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
      let isCarbon = atom.element === 'C';

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
      } else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) || graph.vertices.length === 1) {
        if (opts.atomVisualization === 'default') {
          svgWrapper.drawText(vertex.position.x, vertex.position.y,
            element, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements());
        } else if (opts.atomVisualization === 'balls') {
          svgWrapper.drawBall(vertex.position.x, vertex.position.y, element);
        }
      } else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
        // If there is a carbon which bonds are in a straight line, draw a dot
        let a = graph.vertices[vertex.neighbours[0]].position;
        let b = graph.vertices[vertex.neighbours[1]].position;
        let angle = Vector2.threePointangle(vertex.position, a, b);

        if (Math.abs(Math.PI - angle) < 0.1) {
          svgWrapper.drawPoint(vertex.position.x, vertex.position.y, element);
        }
      }

      if (debug) {
        let value = 'v: ' + vertex.id + ' ' + ArrayHelper.print(atom.ringbonds);
        svgWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
      } else {
        svgWrapper.drawDebugText(vertex.position.x, vertex.position.y, vertex.value.chirality);
      }
    }

    // Draw the ring centers for debug purposes
    if (opts.debug) {
      for (var i: any = 0; i < rings.length; i++) {
        let center = rings[i].center;
        svgWrapper.drawDebugPoint(center.x, center.y, 'r: ' + rings[i].id);
      }
    }
  }

  /**
   * Returns the total overlap score of the current molecule.
   *
   * @returns {Number} The overlap score.
   */
  getTotalOverlapScore() {
    return this.preprocessor.getTotalOverlapScore();
  }

  /**
   * Returns the molecular formula of the loaded molecule as a string.
   *
   * @returns {String} The molecular formula.
   */
  getMolecularFormula() {
    return this.preprocessor.getMolecularFormula();
  }

  /**
   * @param {Array} normals list of normals to multiply
   * @param {Number} spacing value to multiply normals by
   */
  multiplyNormals(normals, spacing) {
    normals[0].multiplyScalar(spacing);
    normals[1].multiplyScalar(spacing);
  }
}

export default SvgDrawer;
