// we use the drawer to do all the preprocessing. then we take over the drawing
// portion to output to svg
import ArrayHelper from './ArrayHelper';
import Atom from './Atom';
import Drawer from './Drawer';
import Line from './Line';
import SvgWrapper from './SvgWrapper';
import ThemeManager from './ThemeManager';
import Vector2 from './Vector2';
import { arraysCompare, arrayDelElement} from '../../../utils';

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

          if (!this.edgeHaveDoubleBound(edge) && vertexA.neighbourCount > 2
            && vertexA.neighbourCount < vertexA.value.bondCount
          ) {
            edge.sourceHasOuterDoubleBond = true;
            ring.hasOuterDoubleBond = true;
          }

          if (!this.edgeHaveDoubleBound(edge) && vertexB.neighbourCount > 2
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
    }
  };

  checkAllEdgesRings() {
    let preprocessor = this.preprocessor;
    let rings = preprocessor.rings;
    let graph = preprocessor.graph;
    let edges = preprocessor.graph.edges;
    const arr = [];
    let arrBottoms = [];

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      if (edge.rings.length > 1) {
        if (arr.indexOf(edge.id) === -1) {
          arr.push(edge.id)
        }
      }

      if (this.edgeHaveDoubleBound(edge)) {
        edge.isHaveLine = true;
        edge.isChecked = true;
        continue;
      }
      const currentRing = edge.rings.length === 1
        ? rings[edge.rings]
        : null;

      let vertexA = graph.vertices[edge.sourceId];
      let vertexB = graph.vertices[edge.targetId];


      if (currentRing && !this.ringStartedCheck(currentRing)) {
        if (this.ringStartedCheckForEdge(currentRing, edge)) {
          edge.isChecked = true;
          currentRing.isStartedCheck = true;
          continue
        }

        if (!edge.isAtomSlat &&
          currentRing.members.length === 6 && this.ringHasAtoms_N(currentRing)
          && edge.sourceId === Math.min(...currentRing.members)
          && vertexB.value.element === 'N' &&
          currentRing.elements.filter(item => item === 'N').length > 2) {
          edge.isChecked = true;
          currentRing.isStartedCheck = true;
          continue
        }
      }

      if ((edge.isBottomSlat && (!edge.isBeforeHaveLine || edge.rings.length >1)
        || this.edgeNeighboursAreAtomSlat(edge)
        || (currentRing && currentRing.members.length >= 5 && edge.rings.length === 1
          && (this.getVertexElementFromRing(currentRing) !== '' || currentRing.members.length === 6)
          && vertexA.value.rings.length > 1 && vertexB.value.rings.length > 1))
        && !(vertexA.value.element === 'N' && vertexB.value.element === 'N' && currentRing?.members.length > 5)
      ) {

        if (edge.isBottomSlat && currentRing && currentRing.neighbours.length === 1
          && rings[currentRing.neighbours[0]].members.length === 5
          && this.getVertexElementFromRing(rings[currentRing.neighbours[0]]) === 'N'
          && currentRing.members.length === 6 && this.getVertexElementFromRing(currentRing) === 'N') {

        } else
          {
          if (arrBottoms.indexOf(edge.id) === -1) {
            arrBottoms.push(edge.id)
          }
          if(currentRing) {currentRing.isStartedCheck = true;}
          continue;
        }
      }

      if (edge.isAtomVertex ) {
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
      for (let i = 0; i < arr.length; i++) {
        const edge = edges[arr[i]];
        if(edge.isChecked && (edge.isHaveLine || edge.isNotHaveLine)
        ) {
          continue
        }
        let vertexA = graph.vertices[edge.targetId];
        let vertexB = graph.vertices[edge.sourceId];
        if (this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)
          || (vertexA.value.element === 'N' && vertexA.neighbourCount === 3)
          || (vertexB.value.element === 'N' && vertexB.neighbourCount === 3)
        ) {
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
      for (let i = 0; i < arrBottoms.length; i++) {
        const edge = edges[arrBottoms[i]];
        if(edge.isChecked) {
          continue
        }
        let vertexA = graph.vertices[edge.targetId];
        let vertexB = graph.vertices[edge.sourceId];
        if (this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)
          || (vertexA.value.element === 'N' && vertexA.neighbourCount === 3 && vertexA.neighbourCount !== vertexA.value.bondCount)
          || (vertexB.value.element === 'N' && vertexB.neighbourCount === 3 && vertexB.neighbourCount !== vertexB.value.bondCount)
        ) {
          edge.isNotHaveLine = true;
          continue;
        }
        edge.isHaveLine = true;
        edge.isChecked = true;
      }
    }
  };

  checkEdge(edge, vertexA, vertexB, arr, ring) {
    const atoms = ['O', 'S', 'Se', 'As'];
    const vertexA_NotOS = atoms.indexOf(vertexA.value.element) === -1;
    const vertexB_NotOS = atoms.indexOf(vertexB.value.element) === -1;

    const vertexA_NotN = !(vertexA.value.element === 'N' && vertexA.neighbourCount === 3 && !(vertexA.value.bracket?.charge === 1)
    && !this.checkVertex_N(vertexA));
    const vertexB_NotN = !(vertexB.value.element === 'N' && vertexB.neighbourCount === 3 && !(vertexB.value.bracket?.charge === 1)
    && !this.checkVertex_N(vertexB));

    if (this.edgeHaveDoubleBound(edge)) {
      edge.isHaveLine = true;
      edge.isChecked = true;
      if (ring && !ring.isStartedCheck) {
        let prev = false;
        for (let i = 0; i < ring.edges.length; i++) {
          if (ring.edges[i] === edge.id) {
            prev = true;
            continue
          }
          if (!prev) {
            const rEdge = this.preprocessor.graph.edges[ring.edges[i]];
            rEdge.isBeforeHaveLine = true;
            prev = true;
          } else {
            prev = false;
          }
        }
      }
      return
    }

    if (this.checkVertex_N(vertexA)) {
      if (!this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)) {
        edge.isHaveLine = true;
        edge.isChecked = true;
        return
      }
    }

    if (
      this.edgeHaveDoubleBound(edge) ||
      vertexA_NotOS && vertexB_NotOS
      && vertexA_NotN && vertexB_NotN
      && !(vertexA.neighbourCount > 2 && vertexA.neighbourCount < vertexA.value.bondCount)
      && !(vertexB.neighbourCount > 2 && vertexB.neighbourCount < vertexB.value.bondCount)
      && (!vertexA.hasDoubleBondWithO || this.checkVertex_N(vertexA))
      && (!vertexB.hasDoubleBondWithO || this.checkVertex_N(vertexB))

      && !this.isHydrogenVertices([vertexA.id, vertexB.id])
      && !this.edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB)
    ) {
      if (!edge.isBeforeNotHaveLine) {
        edge.isHaveLine = true;
      }
      edge.isChecked = true;

      if (ring && !ring.isStartedCheck
        && ring.members.length === 6
        && !ring.hasDoubleBondWithO
        && !ring.hasOuterDoubleBond
      ) {
        let prev = false;
        for (let i = 0; i < ring.edges.length; i++) {
          if (ring.edges[i] === edge.id) {
            prev = true;
            continue
          }
          const rEdge = this.preprocessor.graph.edges[ring.edges[i]];
          if (!prev) {
            rEdge.isBeforeHaveLine = true;
            prev = true;
          } else {
            rEdge.isBeforeNotHaveLine = true;
            prev = false;
          }
        }
      }

    } else {
      edge.isNotHaveLine = true;
      edge.isChecked = true;
    }
  };

  edgeHaveDoubleBound(edge, vertexA = null, vertexB = null){
    if (!vertexA) {
      vertexA = this.preprocessor.graph.vertices[edge.sourceId];
    }
    if (!vertexB) {
      vertexB = this.preprocessor.graph.vertices[edge.targetId];
    }
    if (edge.bondType === '=' && !edge.isPartOfRing
      && vertexB.value.element === 'N') {
      return false
    }
    return edge.bondType === '=' || this.preprocessor.getRingbondType(vertexA, vertexB) === '=';
  }

  edgesHaveDoubleBound(edges, checkAtom){
    let  res = false;
    for (let i = 0; i < edges.length; i++) {
      const edge = this.preprocessor.graph.edges[edges[i]];
      const vertexA = this.preprocessor.graph.vertices[edge.sourceId];
      const vertexB = this.preprocessor.graph.vertices[edge.targetId];
      if (edge.bondType === '=' || this.preprocessor.getRingbondType(vertexA, vertexB) === '='
        || (checkAtom && (vertexA.value.element === 'O' ||
          vertexA.value.neighbouringElements.indexOf('F') !== -1
        ))
      ) {
        res = true;
        break
      }
    }

    return res;
  }

  edgeNeighboursHaveDoubleBound(edge, vertexA, vertexB){
    let res = false;

    let eNeighbours = [].concat(vertexA.edges, vertexB.edges);

    for (let i = 0; i < eNeighbours.length; i++) {
      const edge = this.preprocessor.graph.edges[eNeighbours[i]];
      if (edge.isHaveLine || this.edgeHaveDoubleBound(edge)) {
        res = true;
        break
      }
    }

    return res;
  };

  ringHasAtoms_N(ring) {
    let res = false;
    for(let i = 0; i < ring.members.length; i++) {
      let vertex = this.preprocessor.graph.vertices[ring.members[i]];
      if (vertex.value.element === 'N' && vertex.neighbourCount === 3) {
        res = true;
        break;
      }
    }
    return res;
  }

  ringStartedCheck(ring){
    let res = false;

    for(let i = 0; i < ring.edges.length; i++) {
      let edge = this.preprocessor.graph.edges[ring.edges[i]];
      if (edge.isChecked) {
        res = true;
        break;
      }
    }
    return res;
  }

  isVertexNeighboursHasDoubleBond(vertexId, ring) {
    let vertexA = this.preprocessor.graph.vertices[vertexId];
    let neighbours = vertexA.neighbours.filter(item => ring.members.indexOf(item) === -1);
    let  res = false;
    for (let i = 0; i < neighbours.length; i++) {
      const vertex = this.preprocessor.graph.vertices[neighbours[i]];
      if (this.edgesHaveDoubleBound(vertex.edges,  true)) {
        res = true;
        break;
      }
    }
    return res;
  }

  getVertexElementFromRing(ring){
    let res = '';
    for (let i = 0; i < ring.members.length; i++) {
      const vertex = this.preprocessor.graph.vertices[ring.members[i]];
      if (vertex.isAtomVertex) {
        if (this.isHydrogenVertices([vertex.id])) {
          res = vertex.value.element + 'H';
        } else {
          res = vertex.value.element;
        }
        break
      }
    }
    return res;
  }

  ringStartedCheckForEdge(ring, edge){
    let res = false;
    if (ring.isStartedCheck) {
      return false
    }

    if (ring.members.length === 6) {
      if (ring.neighbours.length === 1) {
        const commonEdge = this.preprocessor.graph.edges[ring.edgesR[0]];
        if (commonEdge) {
          const rN = commonEdge.rings.filter(item => item !== ring.id);
          const nRing = this.preprocessor.rings[rN[0]];

          const  index = ring.edges.indexOf(commonEdge.id);
          if (this.preprocessor.opts.debug) {
            console.log('>>>>>>> commonEdge=> ', commonEdge);
            console.log('>>>>>>> index=> ', index);
          }

          if (index === 0 ) {
            if (!nRing.edges.length) {
              return true
            }
          }
          if (index === 3) {
            if (commonEdge.isBottomSlat && nRing.members?.length === 5) {
              return true
            }
            if (this.edgeHaveDoubleBound(commonEdge)
              || (commonEdge && commonEdge.isBottomSlat && commonEdge?.members?.length === 5)) {
              res = true;
            }
            if (commonEdge.isAtomVertex && nRing.members?.length === 5) {
              return true
            }
          }

          if (index === 2 && commonEdge.isAtomSlat) {
            if (this.isVertexNeighboursHasDoubleBond(edge.sourceId, ring)) {
              if (nRing.members.length === 6) {
                return false
              } else {
                return true
              }
            }

          }

          if (index === 4 && commonEdge.isAtomSlat) {

            if (nRing && nRing.members.length === 5
              && nRing.hasHydrogen
              && nRing.elements.indexOf('S') === -1
              && nRing.elements.indexOf('O') === -1
            ) {
              return true;
            }
          }

          if ((index === 1) && commonEdge.isAtomSlat) {
            if (this.isVertexNeighboursHasDoubleBond(edge.sourceId, ring)) {
              res = false;
            } else {

              if (nRing.members.length === 5) {
                return false;
              }

              if (index === 4) {
                const rN = commonEdge.rings.filter(item => item !== ring.id);
                const nRing = this.preprocessor.rings[rN[0]];
                if (nRing && nRing.members.length > 5) {
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
  }

  edgeNeighboursAreAtomSlat(edge) {
    let res = false;
    if (edge.neighbours.length === 2) {
      return this.preprocessor.graph.edges[edge.neighbours[0]].isAtomSlat
        && this.preprocessor.graph.edges[edge.neighbours[1]].isAtomSlat
    }
    return res;
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
    let arrE = [...ring.edges];
    if (elements.length < 5) {
      return false
    }
    const arr = elements.filter(item => item === 'N' || item === 'S');
    if (arr?.length > 0 && arr.indexOf('S') !== -1) {
      const members = ring.membersS;
      const indexS = elements.indexOf('S');
      if (indexS !== -1) {
        const vS = members[indexS];
        let vertex = graph.vertices[vS];
        vertex.isAtomVertex = true;

        vertex.edges.map(item => {
          if (ring.edges.indexOf(item) !== -1) {
            const edge = this.preprocessor.graph.edges[item];

            edge.isAtomVertex = true;
            arrayDelElement(arrE, item);
          }
        });

        let neighbours = vertex.neighbours;
        neighbours.map(item => {
          if (members.indexOf(item) !== -1) {
            let vertexN = graph.vertices[item];

            const vertexNEdges = vertexN.edges.filter(ed => ring.edges.indexOf(ed) !== -1);
            vertexNEdges.map (ed => {
              const edge = this.preprocessor.graph.edges[ed];
              if (!edge.isAtomVertex) {
                edge.isAtomSlat = true
              }

              arrayDelElement(arrE, ed);
            });
          }
        });

        if (elements.length === 5 && arrE?.length === 1) {
          this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
        } else {
          if (elements.length === 6) {
            arrE.map(item => {
              this.preprocessor.graph.edges[item].isBottomSlat = true;
            })
          }
        }
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
      let indexS = this.findStartElementbyEdges(members, elements, 'O');

      if (indexS !== -1) {
        const vS = members[indexS];
        let vertex = graph.vertices[vS];
        vertex.isAtomVertex = true;
        vertex.edges.map(item => {
          if (ring.edges.indexOf(item) !== -1) {
            const edge = this.preprocessor.graph.edges[item];
            edge.isAtomVertex = true;

            arrayDelElement(arrE, item);
          }
        });

        let neighbours = vertex.neighbours.filter(item => members.indexOf(item) !== -1);

        neighbours.map(item => {
          let vertexN = graph.vertices[item];
          vertexN.edges.map(ed => {
            if (ring.edges.indexOf(ed) !== -1) {
              const edge = this.preprocessor.graph.edges[ed];
              if (!edge.isAtomVertex) {
                edge.isAtomSlat = true
              }

               arrayDelElement(arrE, ed);
            }
          })

        })

      }

      if (elements.length === 5 && arrE?.length === 1) {
        this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
      } else {
        if (elements.length === 6) {
          arrE.map(item => {
            this.preprocessor.graph.edges[item].isBottomSlat = true;
          })
        }
      }
      return true
    }

    return false;
  }

  isRing_NNN(ring) {
    const elements = ring.elements;
    let arrE = [...ring.edges];
    let graph = this.preprocessor.graph;
    if (elements.length < 5) {
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

      if (indexS !== -1) {
        vS = members[indexS];
      }

      if (vS !== -1) {
        let vertex = graph.vertices[vS];
        vertex.isAtomVertex = true;

        vertex.edges
          .filter((e,i,a)=>a.indexOf(e)==i)
          .map(item => {
            if (ring.edges.indexOf(item) !== -1) {
              const edge = this.preprocessor.graph.edges[item];
              edge.isAtomVertex = true;
               arrayDelElement(arrE, item);
            }
          });

        let neighbours = vertex.neighbours.filter(item => members.indexOf(item) !== -1);

        neighbours.map(item => {
          let vertexN = graph.vertices[item];

          const vEdges = vertexN.edges.filter(ed => ring.edges.indexOf(ed) !== -1 && arrE.indexOf(ed) !== -1);

          vEdges.map(ed => {
            const edge = this.preprocessor.graph.edges[ed];
            if (!edge.isAtomVertex) {
              edge.isAtomSlat = true
            }

             arrayDelElement(arrE, ed);
           })
        });


        if (elements.length === 5 && arrE?.length === 1) {
          this.preprocessor.graph.edges[arrE[0]].isBottomSlat = true;
        } else {
          if (elements.length === 6) {
            arrE.map(item => {
              this.preprocessor.graph.edges[item].isBottomSlat = true;
            })
          }
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

  isVertexHasDoubleBondWithO(ring, v){
    let res = false;

    const vertex = this.preprocessor.graph.vertices[v];
    const vEdges = vertex.edges.filter(item => ring.edges.indexOf(item) === -1);

    if (vEdges.length > 1) {
      for (let i = 0; i < vEdges.length; i++) {
        const edge = this.preprocessor.graph.edges[vEdges[i]];
        const vertexB = this.preprocessor.graph.vertices[edge.targetId];

        if (this.edgeHaveDoubleBound(edge) && vertexB.value.element === 'O') {
          vertex.hasDoubleBondWithO = true;
          res = true;
        }
      }
    }
    return res;
  };

  checkVertex_N(vertex){
    if (vertex.value.element !== 'N') {
      return false;
    }
    let neighbours = this.preprocessor.graph.vertices[vertex.id].neighbours;
    let bonds = 0;

    for (let j = 0; j < neighbours.length; j++) {
      bonds += this.preprocessor.graph.getEdge(vertex.id, neighbours[j]).weight;
    }

    if (bonds > vertex.value.getMaxBonds()) {
      return true;
    }
    return false;
  }

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

      if (this.checkVertex_N(vertex)) {
        continue;
      }

      if (edges.length > 2) {
        res = i;
        if (vertex.value.rings.length > 1) {
          continue
        } else {
          break;
        }
      }

      if ( members.length >= 5 && this.isHydrogenVertices([v])) {
        res = i;
        isHydrogen = true;
        break;
      }
    }
    return {indexS: res, isHydrogen: isHydrogen};
  }

  findStartElementbyEdges(members, elements, element) {
    let res = -1;
    for  (let i = 0; i < elements.length; i++) {
      if (elements[i] !== element) {
        continue;
      }

      const v = members[i];
      const vertex = this.preprocessor.graph.vertices[v];
      if (vertex.value.bracket?.charge === 1) {
        continue;
      }
      res = i;
    }
    return res;
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

    if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' || this.edgeHaveDoubleBound(edge) ||
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
            if (((edge.isHaveLine && !edge.isNotHaveLine)
                || (edge.bondType === '=' || this.edgeHaveDoubleBound(edge)))) {
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

  allNeighboursHasDoubleLine(vertex){
    const edges = vertex.edges;
    if (edges.length < 2 || vertex.value.rings.length) {
      return false;
    }

    let res = true;

    for (let i = 0; i < edges.length; i++) {
      const edge = this.preprocessor.graph.edges[edges[i]];
      if (edge.bondType !== '=') {
        res = false;
        break;
      }
    }
    return res;
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

      let isShowC = element === 'C' && this.allNeighboursHasDoubleLine(vertex);

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
      } else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements) || isShowC) || graph.vertices.length === 1) {
        if (opts.atomVisualization === 'default') {
          const isCentre = atom.hasPseudoElements && vertex.neighbours.length === 4 && !vertex.value.rings.length;
          svgWrapper.drawText(vertex.position.x, vertex.position.y,
            element, hydrogens, dir, isTerminal, charge, isotope, atom.getAttachedPseudoElements(), isCentre);
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
