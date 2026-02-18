"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTypstSymbol = exports.typstFontMap = exports.typstAccentMap = exports.typstSymbolMap = void 0;
var tslib_1 = require("tslib");
// Greek letters: Unicode → Typst symbol name
var greekSymbols = [
    ["\u03B1", "alpha"],
    ["\u03B2", "beta"],
    ["\u03B3", "gamma"],
    ["\u0393", "Gamma"],
    ["\u03B4", "delta"],
    ["\u0394", "Delta"],
    ["\u03F5", "epsilon.alt"],
    ["\u03B5", "epsilon"],
    ["\u025B", "epsilon"],
    ["\u03B6", "zeta"],
    ["\u03B7", "eta"],
    ["\u03B8", "theta"],
    ["\u03D1", "theta.alt"],
    ["\u0398", "Theta"],
    ["\u03B9", "iota"],
    ["\u03BA", "kappa"],
    ["\u03BB", "lambda"],
    ["\u039B", "Lambda"],
    ["\u03BC", "mu"],
    ["\u03BD", "nu"],
    ["\u03BE", "xi"],
    ["\u039E", "Xi"],
    ["\u03C0", "pi"],
    ["\u03D6", "pi.alt"],
    ["\u03A0", "Pi"],
    ["\u03C1", "rho"],
    ["\u03F1", "rho.alt"],
    ["\u03C3", "sigma"],
    ["\u03C2", "sigma.alt"],
    ["\u03A3", "Sigma"],
    ["\u03C4", "tau"],
    ["\u03C5", "upsilon"],
    ["\u03A5", "Upsilon"],
    ["\u03D5", "phi.alt"],
    ["\u03C6", "phi"],
    ["\u03A6", "Phi"],
    ["\u03C7", "chi"],
    ["\u03C8", "psi"],
    ["\u03A8", "Psi"],
    ["\u03C9", "omega"],
    ["\u03A9", "Omega"], // Ω
];
// Binary operators: Unicode → Typst symbol name
var binaryOperators = [
    ["\u00D7", "times"],
    ["\u00F7", "div"],
    ["\u22C5", "dot.op"],
    ["\u00B1", "plus.minus"],
    ["\u2213", "minus.plus"],
    ["\u2217", "ast"],
    ["\u22C6", "star"],
    ["\u2218", "compose"],
    ["\u2219", "bullet"],
    ["\u2022", "bullet"],
    ["\u2295", "plus.circle"],
    ["\u2296", "minus.circle"],
    ["\u2297", "times.circle"],
    ["\u2299", "dot.circle"],
    ["\u222A", "union"],
    ["\u2229", "sect"],
    ["\u2294", "union.sq"],
    ["\u2293", "sect.sq"],
    ["\u2228", "or"],
    ["\u2227", "and"],
    ["\u2216", "without"],
    ["\u25C7", "diamond.stroked"],
    ["\u22C4", "diamond.stroked"],
    ["\u2020", "dagger"],
    ["\u2021", "dagger.double"],
    ["\u2210", "product.co"],
    ["\u2212", "-"], // − (use ASCII minus for natural Typst output)
];
// Relation operators: Unicode → Typst symbol name
var relationOperators = [
    ["\u2264", "lt.eq"],
    ["\u2265", "gt.eq"],
    ["\u2266", "lt.eq"],
    ["\u2267", "gt.eq"],
    ["\u2A7D", "lt.eq.slant"],
    ["\u2A7E", "gt.eq.slant"],
    ["\u2260", "eq.not"],
    ["\u2261", "equiv"],
    ["\u227A", "prec"],
    ["\u227B", "succ"],
    ["\u2AAF", "prec.eq"],
    ["\u2AB0", "succ.eq"],
    ["\u223C", "sim"],
    ["\u2243", "sim.eq"],
    ["\u2248", "approx"],
    ["\u2245", "cong"],
    ["\u2282", "subset"],
    ["\u2283", "supset"],
    ["\u2286", "subset.eq"],
    ["\u2287", "supset.eq"],
    ["\u2208", "in"],
    ["\u220B", "in.rev"],
    ["\u2209", "in.not"],
    ["\u221D", "prop"],
    ["\u2223", "mid"],
    ["\u2225", "parallel"],
    ["\u22A5", "perp"],
    ["\u226A", "lt.double"],
    ["\u226B", "gt.double"],
    ["\u22A2", "tack.r"],
    ["\u22A3", "tack.l"],
    ["\u22A8", "tack.r.double"],
    ["\u2262", "equiv.not"],
    ["\u226E", "lt.not"],
    ["\u226F", "gt.not"],
    ["\u2270", "lt.eq.not"],
    ["\u2271", "gt.eq.not"],
    ["\u2284", "subset.not"],
    ["\u2285", "supset.not"],
    ["\u2288", "subset.eq.not"],
    ["\u2289", "supset.eq.not"],
    ["\u2241", "sim.not"],
    ["\u2247", "cong.not"],
    ["\u2249", "approx.not"], // ≉ (\not\approx)
];
// Arrows: Unicode → Typst symbol name
var arrows = [
    ["\u2190", "arrow.l"],
    ["\u2192", "arrow.r"],
    ["\u2194", "arrow.l.r"],
    ["\u21D0", "arrow.l.double"],
    ["\u21D2", "arrow.r.double"],
    ["\u21D4", "arrow.l.r.double"],
    ["\u2191", "arrow.t"],
    ["\u2193", "arrow.b"],
    ["\u21D1", "arrow.t.double"],
    ["\u21D3", "arrow.b.double"],
    ["\u21A6", "arrow.r.bar"],
    ["\u27FC", "arrow.r.long.bar"],
    ["\u27F6", "arrow.r.long"],
    ["\u27F5", "arrow.l.long"],
    ["\u27F9", "arrow.r.long.double"],
    ["\u27F8", "arrow.l.long.double"],
    ["\u27F7", "arrow.l.r.long"],
    ["\u27FA", "arrow.l.r.long.double"],
    ["\u21AA", "arrow.r.hook"],
    ["\u21A9", "arrow.l.hook"],
    ["\u2197", "arrow.tr"],
    ["\u2198", "arrow.br"],
    ["\u2199", "arrow.bl"],
    ["\u2196", "arrow.tl"],
    ["\u21C0", "harpoon.rt"],
    ["\u21BC", "harpoon.lt"],
    ["\u21A0", "arrow.r.twohead"],
    ["\u21A3", "arrow.r.tail"],
    ["\u2916", "arrow.r.twohead.tail"], // ⤖
];
// Large operators: Unicode → Typst symbol name
var largeOperators = [
    ["\u2211", "sum"],
    ["\u220F", "product"],
    ["\u2210", "product.co"],
    ["\u222B", "integral"],
    ["\u222C", "integral.double"],
    ["\u222D", "integral.triple"],
    ["\u222E", "integral.cont"],
    ["\u22C3", "union.big"],
    ["\u22C2", "sect.big"],
    ["\u2A01", "plus.circle.big"],
    ["\u2A02", "times.circle.big"],
    ["\u2A06", "union.sq.big"],
    ["\u22C1", "or.big"],
    ["\u22C0", "and.big"], // ⋀
];
// Delimiters: Unicode → Typst symbol name
var delimiters = [
    ["\u27E8", "angle.l"],
    ["\u27E9", "angle.r"],
    ["\u2329", "angle.l"],
    ["\u232A", "angle.r"],
    ["\u2308", "ceil.l"],
    ["\u2309", "ceil.r"],
    ["\u230A", "floor.l"],
    ["\u230B", "floor.r"],
    ["\u231C", "corner.tl"],
    ["\u231D", "corner.tr"],
    ["\u231E", "corner.bl"],
    ["\u231F", "corner.br"],
    ["\u2016", "bar.v.double"], // ‖
    // Note: \u2225 (∥) is NOT duplicated here — it maps to "parallel" in relationOperators
];
// Dots: Unicode → Typst symbol name
var dots = [
    ["\u2026", "dots"],
    ["\u22EF", "dots.c"],
    ["\u22EE", "dots.v"],
    ["\u22F1", "dots.down"], // ⋱
];
// Miscellaneous symbols: Unicode → Typst symbol name
var miscSymbols = [
    ["\u221E", "infinity"],
    ["\u2207", "nabla"],
    ["\u2202", "diff"],
    ["\u2200", "forall"],
    ["\u2203", "exists"],
    ["\u2204", "exists.not"],
    ["\u2205", "emptyset"],
    ["\u2300", "nothing"],
    ["\u00AC", "not"],
    ["\u22A4", "top"],
    ["\u22A5", "bot"],
    ["\u2220", "angle"],
    ["\u25B3", "triangle.t"],
    ["\u2032", "prime"],
    ["\u2033", "prime.double"],
    ["\u2034", "prime.triple"],
    ["\u2224", "divides.not"],
    ["\u2135", "alef"],
    ["\u210F", "planck.reduce"],
    ["\u2113", "ell"],
    ["\u211C", "Re"],
    ["\u2111", "Im"],
    ["\u2118", "wp"],
    ["\u2201", "complement"],
    ["\u2234", "therefore"],
    ["\u2235", "because"],
    ["\u25A1", "square"],
    ["\u2322", "frown"],
    ["\u00A0", "space.nobreak"],
    ["\u2061", ""],
    ["\u2062", ""],
    ["\u2063", ""],
    ["\u2064", ""], // invisible plus
];
// Build the combined symbol map
exports.typstSymbolMap = new Map(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray(tslib_1.__spreadArray([], tslib_1.__read(greekSymbols), false), tslib_1.__read(binaryOperators), false), tslib_1.__read(relationOperators), false), tslib_1.__read(arrows), false), tslib_1.__read(largeOperators), false), tslib_1.__read(delimiters), false), tslib_1.__read(dots), false), tslib_1.__read(miscSymbols), false));
// Accent Unicode → Typst accent function name
// Maps the accent character (from MathML mover/munder accent attribute) to Typst function
exports.typstAccentMap = new Map([
    ["\u005E", "hat"],
    ["\u00AF", "macron"],
    ["\u203E", "overline"],
    ["\u0332", "underline"],
    ["\u007E", "tilde"],
    ["\u2192", "arrow"],
    ["\u2190", "arrow.l"],
    ["\u002E", "dot"],
    ["\u02D9", "dot"],
    ["\u00A8", "diaer"],
    ["\u02D8", "breve"],
    ["\u02C7", "caron"],
    ["\u00B4", "acute"],
    ["\u0060", "grave"],
    ["\u23DE", "overbrace"],
    ["\u23DF", "underbrace"],
    ["\u23B4", "overbracket"],
    ["\u23B5", "underbracket"],
    ["―", "overline"], // ― (horizontal bar → overline)
]);
// MathML mathvariant attribute → Typst font function name
exports.typstFontMap = new Map([
    ["bold", "bold"],
    ["bold-italic", "bold"],
    ["double-struck", "bb"],
    ["script", "cal"],
    ["-tex-calligraphic", "cal"],
    ["fraktur", "frak"],
    ["bold-fraktur", "frak"],
    ["normal", "upright"],
    ["-tex-mathit", "italic"],
    ["sans-serif", "sans"],
    ["bold-sans-serif", "sans"],
    ["sans-serif-italic", "sans"],
    ["monospace", "mono"],
]);
var findTypstSymbol = function (unicode) {
    var result = exports.typstSymbolMap.get(unicode);
    if (result !== undefined) {
        return result;
    }
    return unicode;
};
exports.findTypstSymbol = findTypstSymbol;
//# sourceMappingURL=typst-symbol-map.js.map