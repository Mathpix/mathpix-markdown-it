// Greek letters: Unicode → Typst symbol name
const greekSymbols: ReadonlyArray<[string, string]> = [
  ["\u03B1", "alpha"],    // α
  ["\u03B2", "beta"],     // β
  ["\u03B3", "gamma"],    // γ
  ["\u0393", "Gamma"],    // Γ
  ["\u03B4", "delta"],    // δ
  ["\u0394", "Delta"],    // Δ
  ["\u03F5", "epsilon.alt"], // ϵ (LaTeX \epsilon → MathJax U+03F5)
  ["\u03B5", "epsilon"],  // ε (LaTeX \varepsilon → MathJax U+03B5)
  ["\u025B", "epsilon"],  // ɛ (alternate varepsilon)
  ["\u03B6", "zeta"],     // ζ
  ["\u03B7", "eta"],      // η
  ["\u03B8", "theta"],    // θ
  ["\u03D1", "theta.alt"], // ϑ (vartheta)
  ["\u0398", "Theta"],    // Θ
  ["\u03B9", "iota"],     // ι
  ["\u03BA", "kappa"],    // κ
  ["\u03BB", "lambda"],   // λ
  ["\u039B", "Lambda"],   // Λ
  ["\u03BC", "mu"],       // μ
  ["\u03BD", "nu"],       // ν
  ["\u03BE", "xi"],       // ξ
  ["\u039E", "Xi"],       // Ξ
  ["\u03C0", "pi"],       // π
  ["\u03D6", "pi.alt"],   // ϖ (varpi)
  ["\u03A0", "Pi"],       // Π
  ["\u03C1", "rho"],      // ρ
  ["\u03F1", "rho.alt"],  // ϱ (varrho)
  ["\u03C3", "sigma"],    // σ
  ["\u03C2", "sigma.alt"], // ς (varsigma)
  ["\u03A3", "Sigma"],    // Σ
  ["\u03C4", "tau"],      // τ
  ["\u03C5", "upsilon"],  // υ
  ["\u03A5", "Upsilon"],  // Υ
  ["\u03D5", "phi.alt"],  // ϕ (LaTeX \phi → MathJax U+03D5)
  ["\u03C6", "phi"],      // φ (LaTeX \varphi → MathJax U+03C6)
  ["\u03A6", "Phi"],      // Φ
  ["\u03C7", "chi"],      // χ
  ["\u03C8", "psi"],      // ψ
  ["\u03A8", "Psi"],      // Ψ
  ["\u03C9", "omega"],    // ω
  ["\u03A9", "Omega"],    // Ω
];

// Binary operators: Unicode → Typst symbol name
const binaryOperators: ReadonlyArray<[string, string]> = [
  ["\u00D7", "times"],            // ×
  ["\u00F7", "div"],              // ÷
  ["\u22C5", "dot.op"],           // ⋅
  ["\u00B1", "plus.minus"],       // ±
  ["\u2213", "minus.plus"],       // ∓
  ["\u2217", "ast"],              // ∗
  ["\u22C6", "star"],             // ⋆
  ["\u2218", "compose"],          // ∘
  ["\u2219", "bullet"],           // ∙
  ["\u2022", "bullet"],           // •
  ["\u2295", "plus.circle"],      // ⊕
  ["\u2296", "minus.circle"],     // ⊖
  ["\u2297", "times.circle"],     // ⊗
  ["\u2299", "dot.circle"],       // ⊙
  ["\u222A", "union"],            // ∪
  ["\u2229", "sect"],             // ∩
  ["\u2294", "union.sq"],         // ⊔
  ["\u2293", "sect.sq"],          // ⊓
  ["\u2228", "or"],               // ∨
  ["\u2227", "and"],              // ∧
  ["\u2216", "without"],          // ∖
  ["\u25C7", "diamond.stroked"],  // ◇
  ["\u22C4", "diamond.stroked"],  // ⋄
  ["\u2020", "dagger"],           // †
  ["\u2021", "dagger.double"],    // ‡
  ["\u2210", "product.co"],       // ∐
  ["\u2212", "-"],                // − (use ASCII minus for natural Typst output)
  ["\u25C3", "triangle.stroked.small.l"], // ◃ (triangleleft)
  ["\u25B9", "triangle.stroked.small.r"], // ▹ (triangleright)
  ["\u22B2", "lt.tri"],           // ⊲ (lhd / trianglelefteq base)
  ["\u22B3", "gt.tri"],           // ⊳ (rhd / trianglerighteq base)
  ["\u22B4", "lt.tri.eq"],        // ⊴ (unlhd)
  ["\u22B5", "gt.tri.eq"],        // ⊵ (unrhd)
  ["\u2240", "wr"],               // ≀ (wreath product)
  ["\u2A3F", "product.co"],       // ⨿ (amalg)
  ["\u22C8", "bowtie"],           // ⋈ (bowtie / Join)
  ["\u22C9", "times.l"],          // ⋉ (ltimes)
  ["\u22CA", "times.r"],          // ⋊ (rtimes)
];

// Relation operators: Unicode → Typst symbol name
const relationOperators: ReadonlyArray<[string, string]> = [
  ["\u2264", "lt.eq"],            // ≤
  ["\u2265", "gt.eq"],            // ≥
  ["\u2266", "lt.eq"],            // ≦ (leqq)
  ["\u2267", "gt.eq"],            // ≧ (geqq)
  ["\u2A7D", "lt.eq.slant"],      // ⩽ (leqslant)
  ["\u2A7E", "gt.eq.slant"],      // ⩾ (geqslant)
  ["\u2260", "eq.not"],           // ≠
  ["\u2261", "equiv"],            // ≡
  ["\u227A", "prec"],             // ≺
  ["\u227B", "succ"],             // ≻
  ["\u2AAF", "prec.eq"],          // ⪯
  ["\u2AB0", "succ.eq"],          // ⪰
  ["\u223C", "sim"],              // ∼
  ["\u2243", "sim.eq"],           // ≃
  ["\u2248", "approx"],           // ≈
  ["\u2245", "cong"],             // ≅
  ["\u2282", "subset"],           // ⊂
  ["\u2283", "supset"],           // ⊃
  ["\u2286", "subset.eq"],        // ⊆
  ["\u2287", "supset.eq"],        // ⊇
  ["\u2208", "in"],               // ∈
  ["\u220B", "in.rev"],           // ∋
  ["\u2209", "in.not"],           // ∉
  ["\u221D", "prop"],             // ∝
  ["\u2223", "mid"],              // ∣
  ["\u2225", "parallel"],         // ∥
  ["\u22A5", "perp"],             // ⊥
  ["\u226A", "lt.double"],        // ≪
  ["\u226B", "gt.double"],        // ≫
  ["\u22A2", "tack.r"],           // ⊢
  ["\u22A3", "tack.l"],           // ⊣
  ["\u22A8", "tack.r.double"],    // ⊨
  ["\u2262", "equiv.not"],        // ≢ (\not\equiv)
  ["\u226E", "lt.not"],           // ≮ (\not<)
  ["\u226F", "gt.not"],           // ≯ (\not>)
  ["\u2270", "lt.eq.not"],        // ≰ (\not\leq)
  ["\u2271", "gt.eq.not"],        // ≱ (\not\geq)
  ["\u2284", "subset.not"],       // ⊄ (\not\subset)
  ["\u2285", "supset.not"],       // ⊅ (\not\supset)
  ["\u2288", "subset.eq.not"],    // ⊈ (\not\subseteq)
  ["\u2289", "supset.eq.not"],    // ⊉ (\not\supseteq)
  ["\u2241", "sim.not"],          // ≁ (\not\sim)
  ["\u2247", "cong.not"],         // ≇ (\not\cong)
  ["\u2249", "approx.not"],       // ≉ (\not\approx)
  ["\u2272", "lt.tilde"],         // ≲ (\lesssim)
  ["\u2273", "gt.tilde"],         // ≳ (\gtrsim)
  ["\u2250", "eq.dot"],           // ≐ (\doteq)
  ["\u225C", "eq.delta"],         // ≜ (\triangleq)
  ["\u227A", "prec"],             // ≺ (\prec)
  ["\u227B", "succ"],             // ≻ (\succ)
  ["\u227C", "prec.eq"],          // ≼ (\preceq)
  ["\u227D", "succ.eq"],          // ≽ (\succeq)
];

// Arrows: Unicode → Typst symbol name
const arrows: ReadonlyArray<[string, string]> = [
  ["\u2190", "arrow.l"],              // ←
  ["\u2192", "arrow.r"],              // →
  ["\u2194", "arrow.l.r"],            // ↔
  ["\u21D0", "arrow.l.double"],       // ⇐
  ["\u21D2", "arrow.r.double"],       // ⇒
  ["\u21D4", "arrow.l.r.double"],     // ⇔
  ["\u2191", "arrow.t"],              // ↑
  ["\u2193", "arrow.b"],              // ↓
  ["\u21D1", "arrow.t.double"],       // ⇑
  ["\u21D3", "arrow.b.double"],       // ⇓
  ["\u21A6", "arrow.r.bar"],          // ↦
  ["\u27FC", "arrow.r.long.bar"],     // ⟼
  ["\u27F6", "arrow.r.long"],         // ⟶
  ["\u27F5", "arrow.l.long"],         // ⟵
  ["\u27F9", "arrow.r.long.double"],  // ⟹
  ["\u27F8", "arrow.l.long.double"],  // ⟸
  ["\u27F7", "arrow.l.r.long"],       // ⟷
  ["\u27FA", "arrow.l.r.long.double"], // ⟺
  ["\u21AA", "arrow.r.hook"],         // ↪
  ["\u21A9", "arrow.l.hook"],         // ↩
  ["\u2197", "arrow.tr"],             // ↗
  ["\u2198", "arrow.br"],             // ↘
  ["\u2199", "arrow.bl"],             // ↙
  ["\u2196", "arrow.tl"],             // ↖
  ["\u21C0", "harpoon.rt"],           // ⇀
  ["\u21BC", "harpoon.lt"],           // ↼
  ["\u21A0", "arrow.r.twohead"],      // ↠
  ["\u21A3", "arrow.r.tail"],         // ↣
  ["\u2916", "arrow.r.twohead.tail"], // ⤖
  ["\u21CC", "harpoons.rtlb"],        // ⇌ (rightleftharpoons)
  ["\u21CB", "harpoons.ltrb"],        // ⇋ (leftrightharpoons)
  ["\u21C1", "harpoon.rb"],           // ⇁ (rightharpoondown)
  ["\u21BD", "harpoon.lb"],           // ↽ (leftharpoondown)
  ["\u21BE", "harpoon.rt"],           // ↾ (upharpoonright) — reuse for vertical
  ["\u21C6", "arrows.ll"],            // ⇆ (leftrightarrows — approx)
  ["\u21C4", "arrows.rr"],            // ⇄ (rightleftarrows — approx)
  ["\u2195", "arrow.t.b"],            // ↕ (updownarrow)
  ["\u21D5", "arrow.t.b.double"],     // ⇕ (Updownarrow)
  ["\u219A", "arrow.l.not"],          // ↚ (nleftarrow)
  ["\u219B", "arrow.r.not"],          // ↛ (nrightarrow)
  ["\u21CD", "arrow.l.double.not"],   // ⇍ (nLeftarrow)
  ["\u21CF", "arrow.r.double.not"],   // ⇏ (nRightarrow)
];

// Large operators: Unicode → Typst symbol name
const largeOperators: ReadonlyArray<[string, string]> = [
  ["\u2211", "sum"],                // ∑
  ["\u220F", "product"],            // ∏
  ["\u2210", "product.co"],         // ∐
  ["\u222B", "integral"],           // ∫
  ["\u222C", "integral.double"],    // ∬
  ["\u222D", "integral.triple"],    // ∭
  ["\u222E", "integral.cont"],      // ∮
  ["\u22C3", "union.big"],          // ⋃
  ["\u22C2", "sect.big"],           // ⋂
  ["\u2A01", "plus.circle.big"],    // ⨁
  ["\u2A02", "times.circle.big"],   // ⨂
  ["\u2A06", "union.sq.big"],       // ⨆
  ["\u22C1", "or.big"],             // ⋁
  ["\u22C0", "and.big"],            // ⋀
];

// Delimiters: Unicode → Typst symbol name
const delimiters: ReadonlyArray<[string, string]> = [
  ["\u27E8", "angle.l"],       // ⟨
  ["\u27E9", "angle.r"],       // ⟩
  ["\u2329", "angle.l"],       // 〈 (old form)
  ["\u232A", "angle.r"],       // 〉 (old form)
  ["\u2308", "ceil.l"],        // ⌈
  ["\u2309", "ceil.r"],        // ⌉
  ["\u230A", "floor.l"],       // ⌊
  ["\u230B", "floor.r"],       // ⌋
  ["\u231C", "corner.tl"],     // ⌜
  ["\u231D", "corner.tr"],     // ⌝
  ["\u231E", "corner.bl"],     // ⌞
  ["\u231F", "corner.br"],     // ⌟
  ["\u2016", "bar.v.double"],  // ‖
  // Note: \u2225 (∥) is NOT duplicated here — it maps to "parallel" in relationOperators
];

// Dots: Unicode → Typst symbol name
const dots: ReadonlyArray<[string, string]> = [
  ["\u2026", "dots"],         // …
  ["\u22EF", "dots.c"],       // ⋯
  ["\u22EE", "dots.v"],       // ⋮
  ["\u22F1", "dots.down"],    // ⋱
];

// Miscellaneous symbols: Unicode → Typst symbol name
const miscSymbols: ReadonlyArray<[string, string]> = [
  ["\u221E", "infinity"],       // ∞
  ["\u2207", "nabla"],          // ∇
  ["\u2202", "diff"],           // ∂
  ["\u2200", "forall"],         // ∀
  ["\u2203", "exists"],         // ∃
  ["\u2204", "exists.not"],     // ∄
  ["\u2205", "emptyset"],       // ∅
  ["\u2300", "nothing"],        // ⌀ (varnothing)
  ["\u00AC", "not"],            // ¬
  ["\u22A4", "top"],            // ⊤
  ["\u22A5", "bot"],            // ⊥
  ["\u2220", "angle"],          // ∠
  ["\u25B3", "triangle.t"],     // △
  ["\u2032", "prime"],          // ′
  ["\u2033", "prime.double"],   // ″
  ["\u2034", "prime.triple"],   // ‴
  ["\u2224", "divides.not"],    // ∤
  ["\u2135", "alef"],            // ℵ
  ["\u210F", "planck.reduce"],  // ℏ
  ["\u2113", "ell"],            // ℓ
  ["\u211C", "Re"],             // ℜ
  ["\u2111", "Im"],             // ℑ
  ["\u2118", "wp"],             // ℘
  ["\u2201", "complement"],     // ∁
  ["\u2234", "therefore"],      // ∴
  ["\u2235", "because"],        // ∵
  ["\u25A1", "square"],         // □
  ["\u25FB", "square"],         // ◻ (white medium square — MathJax variant)
  ["\u25FC", "square.filled"],  // ◼ (black medium square)
  ["\u2221", "angle.arc"],      // ∡ (measuredangle)
  ["\u2222", "angle.spheric"],   // ∢ (sphericalangle)
  ["\u25BD", "triangle.b"],     // ▽ (triangledown)
  ["\u25CA", "diamond.stroked"],// ◊ (Diamond / lozenge)
  ["\u2663", "suit.club"],      // ♣
  ["\u2662", "suit.diamond"],   // ♢
  ["\u2661", "suit.heart"],     // ♡
  ["\u2660", "suit.spade"],     // ♠
  ["\u266F", "sharp"],          // ♯
  ["\u266D", "flat"],           // ♭
  ["\u266E", "natural"],        // ♮
  ["\u00F0", "eth"],            // ð
  ["\u2127", "ohm.inv"],        // ℧ (mho)
  ["\u2322", "frown"],          // ⌢
  ["\u00A0", "space.nobreak"],   // non-breaking space
  ["\u2061", ""],               // function application (invisible)
  ["\u2062", ""],               // invisible times
  ["\u2063", ""],               // invisible separator
  ["\u2064", ""],               // invisible plus
];

// Build the combined symbol map
export const typstSymbolMap: Map<string, string> = new Map<string, string>([
  ...greekSymbols,
  ...binaryOperators,
  ...relationOperators,
  ...arrows,
  ...largeOperators,
  ...delimiters,
  ...dots,
  ...miscSymbols,
]);

// Accent Unicode → Typst accent function name
// Maps the accent character (from MathML mover/munder accent attribute) to Typst function
export const typstAccentMap: Map<string, string> = new Map<string, string>([
  ["\u005E", "hat"],          // ^ (hat)
  ["\u00AF", "macron"],       // ¯ (bar/overline as macron)
  ["\u203E", "overline"],     // ‾ (overline)
  ["\u0332", "underline"],    // ̲ (combining low line → underline)
  ["\u007E", "tilde"],        // ~ (tilde)
  ["\u2192", "arrow"],        // → (vec / overrightarrow)
  ["\u2190", "arrow.l"],      // ← (overleftarrow)
  ["\u2194", "arrow.l.r"],    // ↔ (overleftrightarrow)
  ["\u002E", "dot"],          // . (dot accent)
  ["\u02D9", "dot"],          // ˙ (dot above)
  ["\u00A8", "diaer"],        // ¨ (ddot/diaeresis)
  ["\u20DB", "dot.triple"],   // ⃛ (dddot / triple dot above)
  ["\u20DC", "dot.quad"],     // ⃜ (ddddot / quadruple dot above)
  ["\u02D8", "breve"],        // ˘ (breve)
  ["\u02C7", "caron"],        // ˇ (check/caron)
  ["\u00B4", "acute"],        // ´ (acute)
  ["\u02DD", "acute.double"], // ˝ (double acute / Hungarian umlaut)
  ["\u0060", "grave"],        // ` (grave)
  ["\u02DA", "circle"],        // ˚ (mathring)
  ["\u21C0", "harpoon"],       // ⇀ (right harpoon accent)
  ["\u21BC", "harpoon.lt"],    // ↼ (left harpoon accent)
  ["\u23DE", "overbrace"],    // ⏞ (overbrace)
  ["\u23DF", "underbrace"],   // ⏟ (underbrace)
  ["\u23B4", "overbracket"],  // ⎴ (overbracket)
  ["\u23B5", "underbracket"], // ⎵ (underbracket)
  ["―", "overline"],          // ― (horizontal bar → overline)
]);

// MathML mathvariant attribute → Typst font function name
export const typstFontMap: Map<string, string> = new Map<string, string>([
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

export const findTypstSymbol = (unicode: string): string => {
  const result = typstSymbolMap.get(unicode);
  if (result !== undefined) {
    return result;
  }
  return unicode;
};
