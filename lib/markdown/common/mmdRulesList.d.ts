export declare enum eMmdRuleType {
    markdown = "markdown",
    latex = "latex",
    chem = "chem",
    html = "html",
    common = "common",
    asciiMath = "asciiMath",
    math = "math",
    mathML = "mathML",
    toc = "toc"
}
export declare const mmdBlockRulesList: ({
    name: string;
    description: string;
    type: eMmdRuleType;
} | {
    name: string;
    type: eMmdRuleType;
    description?: undefined;
})[];
export declare const mmdInlineRuleList: ({
    name: string;
    type: eMmdRuleType;
    description?: undefined;
} | {
    name: string;
    description: string;
    type: eMmdRuleType;
})[];
export declare const mmdInlineRule2List: ({
    name: string;
    description: string;
    type: eMmdRuleType;
} | {
    name: string;
    type: eMmdRuleType;
    description?: undefined;
})[];
export declare const mmdCoreRuleList: ({
    name: string;
    description: string;
    type: eMmdRuleType;
} | {
    name: string;
    type: eMmdRuleType;
    description?: undefined;
})[];
