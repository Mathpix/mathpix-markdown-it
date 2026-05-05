import { TMulti } from "./index";
export declare const getMC: (cell: string) => number;
export declare const getCurrentMC: (cells: string[], i: number) => number;
export declare const getMultiColumnMultiRow: (str: string, params: {
    lLines: string;
    align: string;
    rLines: string;
    posDefault?: 't' | 'c' | 'b';
}, forLatex?: boolean, forPptx?: boolean, skipVisual?: boolean) => TMulti | null;
