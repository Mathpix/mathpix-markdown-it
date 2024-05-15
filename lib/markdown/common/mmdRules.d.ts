export declare enum eMmdRuleType {
    markdown = "markdown",
    latex = "latex",
    chem = "chem",
    html = "html",
    common = "common",
    asciiMath = "asciiMath",
    math = "math",
    mathML = "mathML",
    simpleMath = "simpleMath"
}
export declare enum eRule {
    block = "block",
    inline = "inline",
    inline2 = "inline2",
    core = "core"
}
export interface IMmdRule {
    name: string;
    type: eMmdRuleType;
    rule: eRule;
    description?: string;
}
export declare const mmdRuleList: IMmdRule[];
