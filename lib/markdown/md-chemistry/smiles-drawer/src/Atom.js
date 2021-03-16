"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAtomCoefficientForWidth = void 0;
var ArrayHelper_1 = require("./ArrayHelper");
// import Vertex = require('./Vertex')
// import Ring = require('./Ring')
/**
 * A class representing an atom.
 *
 * @property {String} element The element symbol of this atom. Single-letter symbols are always uppercase. Examples: H, C, F, Br, Si, ...
 * @property {Boolean} drawExplicit A boolean indicating whether or not this atom is drawn explicitly (for example, a carbon atom). This overrides the default behaviour.
 * @property {Object[]} ringbonds An array containing the ringbond ids and bond types as specified in the original SMILE.
 * @property {String} branchBond The branch bond as defined in the SMILES.
 * @property {Number} ringbonds[].id The ringbond id as defined in the SMILES.
 * @property {String} ringbonds[].bondType The bond type of the ringbond as defined in the SMILES.
 * @property {Number[]} rings The ids of rings which contain this atom.
 * @property {String} bondType The bond type associated with this array. Examples: -, =, #, ...
 * @property {Boolean} isBridge A boolean indicating whether or not this atom is part of a bridge in a bridged ring (contained by the largest ring).
 * @property {Boolean} isBridgeNode A boolean indicating whether or not this atom is a bridge node (a member of the largest ring in a bridged ring which is connected to a bridge-atom).
 * @property {Number[]} originalRings Used to back up rings when they are replaced by a bridged ring.
 * @property {Number} bridgedRing The id of the bridged ring if the atom is part of a bridged ring.
 * @property {Number[]} anchoredRings The ids of the rings that are anchored to this atom. The centers of anchored rings are translated when this atom is translated.
 * @property {Object} bracket If this atom is defined as a bracket atom in the original SMILES, this object contains all the bracket information. Example: { hcount: {Number}, charge: ['--', '-', '+', '++'], isotope: {Number} }.
 * @property {Number} plane Specifies on which "plane" the atoms is in stereochemical deptictions (-1 back, 0 middle, 1 front).
 * @property {Object[]} attachedPseudoElements A map with containing information for pseudo elements or concatinated elements. The key is comprised of the element symbol and the hydrogen count.
 * @property {String} attachedPseudoElement[].element The element symbol.
 * @property {Number} attachedPseudoElement[].count The number of occurences that match the key.
 * @property {Number} attachedPseudoElement[].hyrogenCount The number of hydrogens attached to each atom matching the key.
 * @property {Boolean} hasAttachedPseudoElements A boolean indicating whether or not this attom will be drawn with an attached pseudo element or concatinated elements.
 * @property {Boolean} isDrawn A boolean indicating whether or not this atom is drawn. In contrast to drawExplicit, the bond is drawn neither.
 * @property {Boolean} isConnectedToRing A boolean indicating whether or not this atom is directly connected (but not a member of) a ring.
 * @property {String[]} neighbouringElements An array containing the element symbols of neighbouring atoms.
 * @property {Boolean} isPartOfAromaticRing A boolean indicating whether or not this atom is part of an explicitly defined aromatic ring. Example: c1ccccc1.
 * @property {Number} bondCount The number of bonds in which this atom is participating.
 * @property {String} chirality The chirality of this atom if it is a stereocenter (R or S).
 * @property {Number} priority The priority of this atom acording to the CIP rules, where 0 is the highest priority.
 * @property {Boolean} mainChain A boolean indicating whether or not this atom is part of the main chain (used for chirality).
 * @property {String} hydrogenDirection The direction of the hydrogen, either up or down. Only for stereocenters with and explicit hydrogen.
 * @property {Number} subtreeDepth The depth of the subtree coming from a stereocenter.
 */
var Atom = /** @class */ (function () {
    /**
     * The constructor of the class Atom.
     *
     * @param {String} element The one-letter code of the element.
     * @param {String} [bondType='-'] The type of the bond associated with this atom.
     */
    function Atom(element, bondType) {
        if (bondType === void 0) { bondType = '-'; }
        this.element = element.length === 1 ? element.toUpperCase() : element;
        this.drawExplicit = false;
        this.ringbonds = Array();
        this.rings = Array();
        this.bondType = bondType;
        this.branchBond = null;
        this.isBridge = false;
        this.isBridgeNode = false;
        this.originalRings = Array();
        this.bridgedRing = null;
        this.anchoredRings = Array();
        this.bracket = null;
        this.plane = 0;
        this.attachedPseudoElements = {};
        this.hasAttachedPseudoElements = false;
        this.hasPseudoElements = false;
        this.isDrawn = true;
        this.isConnectedToRing = false;
        this.neighbouringElements = Array();
        this.isPartOfAromaticRing = element !== this.element || element === '*' || element == 'Se' || element == 'As';
        this.bondCount = 0;
        this.chirality = '';
        this.isStereoCenter = false;
        this.priority = 0;
        this.mainChain = false;
        this.hydrogenDirection = 'down';
        this.subtreeDepth = 1;
        this.hasHydrogen = false;
    }
    /**
     * Adds a neighbouring element to this atom.
     *
     * @param {String} element A string representing an element.
     */
    Atom.prototype.addNeighbouringElement = function (element) {
        this.neighbouringElements.push(element);
    };
    /**
     * Attaches a pseudo element (e.g. Ac) to the atom.
     * @param {String} element The element identifier (e.g. Br, C, ...).
     * @param {String} previousElement The element that is part of the main chain (not the terminals that are converted to the pseudo element or concatinated).
     * @param {Number} [hydrogenCount=0] The number of hydrogens for the element.
     * @param {Number} [charge=0] The charge for the element.
     */
    Atom.prototype.attachPseudoElement = function (element, previousElement, hydrogenCount, charge) {
        if (hydrogenCount === void 0) { hydrogenCount = 0; }
        if (charge === void 0) { charge = 0; }
        if (hydrogenCount === null) {
            hydrogenCount = 0;
        }
        if (charge === null) {
            charge = 0;
        }
        var key = hydrogenCount + element + charge;
        if (this.attachedPseudoElements[key]) {
            this.attachedPseudoElements[key].count += 1;
        }
        else {
            this.attachedPseudoElements[key] = {
                element: element,
                count: 1,
                hydrogenCount: hydrogenCount,
                previousElement: previousElement,
                charge: charge
            };
        }
        this.hasAttachedPseudoElements = true;
    };
    /**
     * Returns the attached pseudo elements sorted by hydrogen count (ascending).
     *
     * @returns {Object} The sorted attached pseudo elements.
     */
    Atom.prototype.getAttachedPseudoElements = function () {
        var ordered = {};
        var that = this;
        Object.keys(this.attachedPseudoElements).sort().forEach(function (key) {
            ordered[key] = that.attachedPseudoElements[key];
        });
        return ordered;
    };
    /**
     * Returns the number of attached pseudo elements.
     *
     * @returns {Number} The number of attached pseudo elements.
     */
    Atom.prototype.getAttachedPseudoElementsCount = function () {
        return Object.keys(this.attachedPseudoElements).length;
    };
    /**
     * Returns whether this atom is a heteroatom (not C and not H).
     *
     * @returns {Boolean} A boolean indicating whether this atom is a heteroatom.
     */
    Atom.prototype.isHeteroAtom = function () {
        return this.element !== 'C' && this.element !== 'H';
    };
    /**
     * Defines this atom as the anchor for a ring. When doing repositionings of the vertices and the vertex associated with this atom is moved, the center of this ring is moved as well.
     *
     * @param {Number} ringId A ring id.
     */
    Atom.prototype.addAnchoredRing = function (ringId) {
        if (!ArrayHelper_1.default.contains(this.anchoredRings, {
            value: ringId
        })) {
            this.anchoredRings.push(ringId);
        }
    };
    /**
     * Returns the number of ringbonds (breaks in rings to generate the MST of the smiles) within this atom is connected to.
     *
     * @returns {Number} The number of ringbonds this atom is connected to.
     */
    Atom.prototype.getRingbondCount = function () {
        return this.ringbonds.length;
    };
    /**
     * Backs up the current rings.
     */
    Atom.prototype.backupRings = function () {
        this.originalRings = Array(this.rings.length);
        for (var i = 0; i < this.rings.length; i++) {
            this.originalRings[i] = this.rings[i];
        }
    };
    /**
     * Restores the most recent backed up rings.
     */
    Atom.prototype.restoreRings = function () {
        this.rings = Array(this.originalRings.length);
        for (var i = 0; i < this.originalRings.length; i++) {
            this.rings[i] = this.originalRings[i];
        }
    };
    /**
     * Checks whether or not two atoms share a common ringbond id. A ringbond is a break in a ring created when generating the spanning tree of a structure.
     *
     * @param {Atom} atomA An atom.
     * @param {Atom} atomB An atom.
     * @returns {Boolean} A boolean indicating whether or not two atoms share a common ringbond.
     */
    Atom.prototype.haveCommonRingbond = function (atomA, atomB) {
        for (var i = 0; i < atomA.ringbonds.length; i++) {
            for (var j = 0; j < atomB.ringbonds.length; j++) {
                if (atomA.ringbonds[i].id == atomB.ringbonds[j].id) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Check whether or not the neighbouring elements of this atom equal the supplied array.
     *
     * @param {String[]} arr An array containing all the elements that are neighbouring this atom. E.g. ['C', 'O', 'O', 'N']
     * @returns {Boolean} A boolean indicating whether or not the neighbours match the supplied array of elements.
     */
    Atom.prototype.neighbouringElementsEqual = function (arr) {
        if (arr.length !== this.neighbouringElements.length) {
            return false;
        }
        arr.sort();
        this.neighbouringElements.sort();
        for (var i = 0; i < this.neighbouringElements.length; i++) {
            if (arr[i] !== this.neighbouringElements[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Get the atomic number of this atom.
     *
     * @returns {Number} The atomic number of this atom.
     */
    Atom.prototype.getAtomicNumber = function () {
        return Atom.atomicNumbers[this.element];
    };
    /**
     * Get the maximum number of bonds for this atom.
     *
     * @returns {Number} The maximum number of bonds of this atom.
     */
    Atom.prototype.getMaxBonds = function () {
        return Atom.maxBonds[this.element];
    };
    Object.defineProperty(Atom, "maxBonds", {
        /**
         * A map mapping element symbols to their maximum bonds.
         */
        get: function () {
            return {
                'H': 1,
                'C': 4,
                'N': 3,
                'O': 2,
                'P': 3,
                'S': 2,
                'B': 3,
                'F': 1,
                'I': 1,
                'Cl': 1,
                'Br': 1
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Atom, "atomicNumbers", {
        /**
         * A map mapping element symbols to the atomic number.
         */
        get: function () {
            return {
                'H': 1,
                'He': 2,
                'Li': 3,
                'Be': 4,
                'B': 5,
                'b': 5,
                'C': 6,
                'c': 6,
                'N': 7,
                'n': 7,
                'O': 8,
                'o': 8,
                'F': 9,
                'Ne': 10,
                'Na': 11,
                'Mg': 12,
                'Al': 13,
                'Si': 14,
                'P': 15,
                'p': 15,
                'S': 16,
                's': 16,
                'Cl': 17,
                'Ar': 18,
                'K': 19,
                'Ca': 20,
                'Sc': 21,
                'Ti': 22,
                'V': 23,
                'Cr': 24,
                'Mn': 25,
                'Fe': 26,
                'Co': 27,
                'Ni': 28,
                'Cu': 29,
                'Zn': 30,
                'Ga': 31,
                'Ge': 32,
                'As': 33,
                'Se': 34,
                'Br': 35,
                'Kr': 36,
                'Rb': 37,
                'Sr': 38,
                'Y': 39,
                'Zr': 40,
                'Nb': 41,
                'Mo': 42,
                'Tc': 43,
                'Ru': 44,
                'Rh': 45,
                'Pd': 46,
                'Ag': 47,
                'Cd': 48,
                'In': 49,
                'Sn': 50,
                'Sb': 51,
                'Te': 52,
                'I': 53,
                'Xe': 54,
                'Cs': 55,
                'Ba': 56,
                'La': 57,
                'Ce': 58,
                'Pr': 59,
                'Nd': 60,
                'Pm': 61,
                'Sm': 62,
                'Eu': 63,
                'Gd': 64,
                'Tb': 65,
                'Dy': 66,
                'Ho': 67,
                'Er': 68,
                'Tm': 69,
                'Yb': 70,
                'Lu': 71,
                'Hf': 72,
                'Ta': 73,
                'W': 74,
                'Re': 75,
                'Os': 76,
                'Ir': 77,
                'Pt': 78,
                'Au': 79,
                'Hg': 80,
                'Tl': 81,
                'Pb': 82,
                'Bi': 83,
                'Po': 84,
                'At': 85,
                'Rn': 86,
                'Fr': 87,
                'Ra': 88,
                'Ac': 89,
                'Th': 90,
                'Pa': 91,
                'U': 92,
                'Np': 93,
                'Pu': 94,
                'Am': 95,
                'Cm': 96,
                'Bk': 97,
                'Cf': 98,
                'Es': 99,
                'Fm': 100,
                'Md': 101,
                'No': 102,
                'Lr': 103,
                'Rf': 104,
                'Db': 105,
                'Sg': 106,
                'Bh': 107,
                'Hs': 108,
                'Mt': 109,
                'Ds': 110,
                'Rg': 111,
                'Cn': 112,
                'Uut': 113,
                'Uuq': 114,
                'Uup': 115,
                'Uuh': 116,
                'Uus': 117,
                'Uuo': 118
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Atom, "mass", {
        /**
         * A map mapping element symbols to the atomic mass.
         */
        get: function () {
            return {
                'H': 1,
                'He': 2,
                'Li': 3,
                'Be': 4,
                'B': 5,
                'b': 5,
                'C': 6,
                'c': 6,
                'N': 7,
                'n': 7,
                'O': 8,
                'o': 8,
                'F': 9,
                'Ne': 10,
                'Na': 11,
                'Mg': 12,
                'Al': 13,
                'Si': 14,
                'P': 15,
                'p': 15,
                'S': 16,
                's': 16,
                'Cl': 17,
                'Ar': 18,
                'K': 19,
                'Ca': 20,
                'Sc': 21,
                'Ti': 22,
                'V': 23,
                'Cr': 24,
                'Mn': 25,
                'Fe': 26,
                'Co': 27,
                'Ni': 28,
                'Cu': 29,
                'Zn': 30,
                'Ga': 31,
                'Ge': 32,
                'As': 33,
                'Se': 34,
                'Br': 35,
                'Kr': 36,
                'Rb': 37,
                'Sr': 38,
                'Y': 39,
                'Zr': 40,
                'Nb': 41,
                'Mo': 42,
                'Tc': 43,
                'Ru': 44,
                'Rh': 45,
                'Pd': 46,
                'Ag': 47,
                'Cd': 48,
                'In': 49,
                'Sn': 50,
                'Sb': 51,
                'Te': 52,
                'I': 53,
                'Xe': 54,
                'Cs': 55,
                'Ba': 56,
                'La': 57,
                'Ce': 58,
                'Pr': 59,
                'Nd': 60,
                'Pm': 61,
                'Sm': 62,
                'Eu': 63,
                'Gd': 64,
                'Tb': 65,
                'Dy': 66,
                'Ho': 67,
                'Er': 68,
                'Tm': 69,
                'Yb': 70,
                'Lu': 71,
                'Hf': 72,
                'Ta': 73,
                'W': 74,
                'Re': 75,
                'Os': 76,
                'Ir': 77,
                'Pt': 78,
                'Au': 79,
                'Hg': 80,
                'Tl': 81,
                'Pb': 82,
                'Bi': 83,
                'Po': 84,
                'At': 85,
                'Rn': 86,
                'Fr': 87,
                'Ra': 88,
                'Ac': 89,
                'Th': 90,
                'Pa': 91,
                'U': 92,
                'Np': 93,
                'Pu': 94,
                'Am': 95,
                'Cm': 96,
                'Bk': 97,
                'Cf': 98,
                'Es': 99,
                'Fm': 100,
                'Md': 101,
                'No': 102,
                'Lr': 103,
                'Rf': 104,
                'Db': 105,
                'Sg': 106,
                'Bh': 107,
                'Hs': 108,
                'Mt': 109,
                'Ds': 110,
                'Rg': 111,
                'Cn': 112,
                'Uut': 113,
                'Uuq': 114,
                'Uup': 115,
                'Uuh': 116,
                'Uus': 117,
                'Uuo': 118
            };
        },
        enumerable: false,
        configurable: true
    });
    return Atom;
}());
exports.getAtomCoefficientForWidth = function (atomName) {
    var atomCoefficientForWidth = {
        'He': 1.5,
        'Li': 4,
        'Be': 1,
        'Ne': 1,
        'Na': 1,
        'Mg': 1,
        'Al': 4,
        'Si': 4,
        // 'Cl': 4,
        'Ar': 4,
        'Ca': 1,
        'Sc': 1.5,
        'Ti': 4,
        'Cr': 4,
        'Mn': 1,
        'Fe': 1,
        'Co': 1,
        'Ni': 4,
        'Cu': 1,
        'Zn': 1,
        'Ga': 1,
        'Ge': 1,
        'As': 1,
        'Se': 1.5,
        'Br': 4,
        'Kr': 4,
        'Rb': 1.5,
        'Sr': 4,
        'Zr': 4,
        'Nb': 1,
        'Mo': 1,
        'Tc': 4,
        'Ru': 1,
        'Rh': 1,
        'Pd': 1.5,
        'Ag': 1.5,
        'Cd': 1.5,
        'Sn': 1.5,
        'Sb': 1.5,
        'Te': 4,
        'Xe': 2,
        'Cs': 2,
        'Ba': 1,
        'La': 1.5,
        'Ce': 1.5,
        'Pr': 4,
        'Nd': 1,
        'Pm': 1,
        'Sm': 1,
        'Eu': 1,
        'Gd': 1,
        'Tb': 4,
        'Dy': 1,
        'Ho': 1,
        'Er': 4,
        'Tm': 1,
        'Yb': 1.5,
        'Lu': 1.5,
        'Hf': 1.5,
        'Ta': 1.5,
        'Re': 1,
        'Os': 1,
        'Ir': 4,
        'Pt': 4,
        'Au': 1,
        'Hg': 1,
        'Tl': 4,
        'Pb': 1,
        'Bi': 4,
        'Po': 1,
        'At': 4,
        'Rn': 1,
        'Fr': 4,
        'Ra': 1,
        'Ac': 1,
        'Th': 1,
        'Pa': 1,
        'Np': 1,
        'Pu': 1,
        'Am': 1,
        'Cm': 1,
        'Bk': 1,
        'Cf': 1.5,
        'Es': 1,
        'Fm': 1,
        'Md': 1,
        'No': 1,
        'Lr': 1.5,
        'Rf': 1.5,
        'Db': 1,
        'Sg': 1,
        'Bh': 1,
        'Hs': 1,
        'Mt': 1.5,
        'Ds': 1,
        'Rg': 1,
        'Cn': 1
    };
    return Object(atomCoefficientForWidth).hasOwnProperty(atomName)
        ? atomCoefficientForWidth[atomName]
        : -1;
};
exports.default = Atom;
//# sourceMappingURL=Atom.js.map