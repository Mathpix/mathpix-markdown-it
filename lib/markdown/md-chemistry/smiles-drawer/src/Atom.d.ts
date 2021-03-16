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
declare class Atom {
    element: any;
    drawExplicit: any;
    ringbonds: any;
    rings: any;
    bondType: any;
    branchBond: any;
    isBridge: any;
    isBridgeNode: any;
    originalRings: any;
    bridgedRing: any;
    anchoredRings: any;
    bracket: any;
    plane: any;
    attachedPseudoElements: any;
    hasAttachedPseudoElements: any;
    hasPseudoElements: any;
    isDrawn: any;
    isConnectedToRing: any;
    neighbouringElements: any;
    isPartOfAromaticRing: any;
    bondCount: any;
    chirality: any;
    isStereoCenter: any;
    priority: any;
    mainChain: any;
    hydrogenDirection: any;
    subtreeDepth: any;
    hasHydrogen: any;
    /**
     * The constructor of the class Atom.
     *
     * @param {String} element The one-letter code of the element.
     * @param {String} [bondType='-'] The type of the bond associated with this atom.
     */
    constructor(element: any, bondType?: string);
    /**
     * Adds a neighbouring element to this atom.
     *
     * @param {String} element A string representing an element.
     */
    addNeighbouringElement(element: any): void;
    /**
     * Attaches a pseudo element (e.g. Ac) to the atom.
     * @param {String} element The element identifier (e.g. Br, C, ...).
     * @param {String} previousElement The element that is part of the main chain (not the terminals that are converted to the pseudo element or concatinated).
     * @param {Number} [hydrogenCount=0] The number of hydrogens for the element.
     * @param {Number} [charge=0] The charge for the element.
     */
    attachPseudoElement(element: any, previousElement: any, hydrogenCount?: number, charge?: number): void;
    /**
     * Returns the attached pseudo elements sorted by hydrogen count (ascending).
     *
     * @returns {Object} The sorted attached pseudo elements.
     */
    getAttachedPseudoElements(): {};
    /**
     * Returns the number of attached pseudo elements.
     *
     * @returns {Number} The number of attached pseudo elements.
     */
    getAttachedPseudoElementsCount(): number;
    /**
     * Returns whether this atom is a heteroatom (not C and not H).
     *
     * @returns {Boolean} A boolean indicating whether this atom is a heteroatom.
     */
    isHeteroAtom(): boolean;
    /**
     * Defines this atom as the anchor for a ring. When doing repositionings of the vertices and the vertex associated with this atom is moved, the center of this ring is moved as well.
     *
     * @param {Number} ringId A ring id.
     */
    addAnchoredRing(ringId: any): void;
    /**
     * Returns the number of ringbonds (breaks in rings to generate the MST of the smiles) within this atom is connected to.
     *
     * @returns {Number} The number of ringbonds this atom is connected to.
     */
    getRingbondCount(): any;
    /**
     * Backs up the current rings.
     */
    backupRings(): void;
    /**
     * Restores the most recent backed up rings.
     */
    restoreRings(): void;
    /**
     * Checks whether or not two atoms share a common ringbond id. A ringbond is a break in a ring created when generating the spanning tree of a structure.
     *
     * @param {Atom} atomA An atom.
     * @param {Atom} atomB An atom.
     * @returns {Boolean} A boolean indicating whether or not two atoms share a common ringbond.
     */
    haveCommonRingbond(atomA: any, atomB: any): boolean;
    /**
     * Check whether or not the neighbouring elements of this atom equal the supplied array.
     *
     * @param {String[]} arr An array containing all the elements that are neighbouring this atom. E.g. ['C', 'O', 'O', 'N']
     * @returns {Boolean} A boolean indicating whether or not the neighbours match the supplied array of elements.
     */
    neighbouringElementsEqual(arr: any): boolean;
    /**
     * Get the atomic number of this atom.
     *
     * @returns {Number} The atomic number of this atom.
     */
    getAtomicNumber(): any;
    /**
     * Get the maximum number of bonds for this atom.
     *
     * @returns {Number} The maximum number of bonds of this atom.
     */
    getMaxBonds(): any;
    /**
     * A map mapping element symbols to their maximum bonds.
     */
    static get maxBonds(): {
        H: number;
        C: number;
        N: number;
        O: number;
        P: number;
        S: number;
        B: number;
        F: number;
        I: number;
        Cl: number;
        Br: number;
    };
    /**
     * A map mapping element symbols to the atomic number.
     */
    static get atomicNumbers(): {
        H: number;
        He: number;
        Li: number;
        Be: number;
        B: number;
        b: number;
        C: number;
        c: number;
        N: number;
        n: number;
        O: number;
        o: number;
        F: number;
        Ne: number;
        Na: number;
        Mg: number;
        Al: number;
        Si: number;
        P: number;
        p: number;
        S: number;
        s: number;
        Cl: number;
        Ar: number;
        K: number;
        Ca: number;
        Sc: number;
        Ti: number;
        V: number;
        Cr: number;
        Mn: number;
        Fe: number;
        Co: number;
        Ni: number;
        Cu: number;
        Zn: number;
        Ga: number;
        Ge: number;
        As: number;
        Se: number;
        Br: number;
        Kr: number;
        Rb: number;
        Sr: number;
        Y: number;
        Zr: number;
        Nb: number;
        Mo: number;
        Tc: number;
        Ru: number;
        Rh: number;
        Pd: number;
        Ag: number;
        Cd: number;
        In: number;
        Sn: number;
        Sb: number;
        Te: number;
        I: number;
        Xe: number;
        Cs: number;
        Ba: number;
        La: number;
        Ce: number;
        Pr: number;
        Nd: number;
        Pm: number;
        Sm: number;
        Eu: number;
        Gd: number;
        Tb: number;
        Dy: number;
        Ho: number;
        Er: number;
        Tm: number;
        Yb: number;
        Lu: number;
        Hf: number;
        Ta: number;
        W: number;
        Re: number;
        Os: number;
        Ir: number;
        Pt: number;
        Au: number;
        Hg: number;
        Tl: number;
        Pb: number;
        Bi: number;
        Po: number;
        At: number;
        Rn: number;
        Fr: number;
        Ra: number;
        Ac: number;
        Th: number;
        Pa: number;
        U: number;
        Np: number;
        Pu: number;
        Am: number;
        Cm: number;
        Bk: number;
        Cf: number;
        Es: number;
        Fm: number;
        Md: number;
        No: number;
        Lr: number;
        Rf: number;
        Db: number;
        Sg: number;
        Bh: number;
        Hs: number;
        Mt: number;
        Ds: number;
        Rg: number;
        Cn: number;
        Uut: number;
        Uuq: number;
        Uup: number;
        Uuh: number;
        Uus: number;
        Uuo: number;
    };
    /**
     * A map mapping element symbols to the atomic mass.
     */
    static get mass(): {
        H: number;
        He: number;
        Li: number;
        Be: number;
        B: number;
        b: number;
        C: number;
        c: number;
        N: number;
        n: number;
        O: number;
        o: number;
        F: number;
        Ne: number;
        Na: number;
        Mg: number;
        Al: number;
        Si: number;
        P: number;
        p: number;
        S: number;
        s: number;
        Cl: number;
        Ar: number;
        K: number;
        Ca: number;
        Sc: number;
        Ti: number;
        V: number;
        Cr: number;
        Mn: number;
        Fe: number;
        Co: number;
        Ni: number;
        Cu: number;
        Zn: number;
        Ga: number;
        Ge: number;
        As: number;
        Se: number;
        Br: number;
        Kr: number;
        Rb: number;
        Sr: number;
        Y: number;
        Zr: number;
        Nb: number;
        Mo: number;
        Tc: number;
        Ru: number;
        Rh: number;
        Pd: number;
        Ag: number;
        Cd: number;
        In: number;
        Sn: number;
        Sb: number;
        Te: number;
        I: number;
        Xe: number;
        Cs: number;
        Ba: number;
        La: number;
        Ce: number;
        Pr: number;
        Nd: number;
        Pm: number;
        Sm: number;
        Eu: number;
        Gd: number;
        Tb: number;
        Dy: number;
        Ho: number;
        Er: number;
        Tm: number;
        Yb: number;
        Lu: number;
        Hf: number;
        Ta: number;
        W: number;
        Re: number;
        Os: number;
        Ir: number;
        Pt: number;
        Au: number;
        Hg: number;
        Tl: number;
        Pb: number;
        Bi: number;
        Po: number;
        At: number;
        Rn: number;
        Fr: number;
        Ra: number;
        Ac: number;
        Th: number;
        Pa: number;
        U: number;
        Np: number;
        Pu: number;
        Am: number;
        Cm: number;
        Bk: number;
        Cf: number;
        Es: number;
        Fm: number;
        Md: number;
        No: number;
        Lr: number;
        Rf: number;
        Db: number;
        Sg: number;
        Bh: number;
        Hs: number;
        Mt: number;
        Ds: number;
        Rg: number;
        Cn: number;
        Uut: number;
        Uuq: number;
        Uup: number;
        Uuh: number;
        Uus: number;
        Uuo: number;
    };
}
export declare const getAtomCoefficientForWidth: (atomName: any) => any;
export default Atom;
