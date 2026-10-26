import { TMulti } from "./index";
import { TVerticalPos } from "./common";
export declare const getMC: (cell: string) => number;
/** Column index `i` ends on: one per index before it, plus the extra width of every span up to it. */
export declare const getCurrentMC: (cells: string[], i: number) => number;
export declare const getMultiColumnMultiRow: (str: string, params: {
    lLines: string;
    align: string;
    rLines: string;
    bracketDefault?: TVerticalPos;
}, forLatex?: boolean, forPptx?: boolean, skipVisual?: boolean) => TMulti | null;
