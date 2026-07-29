export interface CaptionCounters {
    tables: number;
    figures: number;
}
export declare const getCaptionCounters: () => CaptionCounters;
export declare const setCaptionCounters: (c: CaptionCounters) => void;
export declare const clearTableNumbers: () => void;
export declare const clearFigureNumbers: () => void;
export declare const nextTableNumber: () => number;
export declare const nextFigureNumber: () => number;
export declare const currentTableNumber: () => number;
export declare const currentFigureNumber: () => number;
