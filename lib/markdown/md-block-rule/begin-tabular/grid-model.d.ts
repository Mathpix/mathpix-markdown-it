export type AnalysedCell = {
    mc: number;
    mr: number;
    prints: boolean;
};
export type AnalysedRow = {
    cells: AnalysedCell[] | null;
    targets: number[] | null;
};
export type DropReason = 'clipped' | 'covered';
export type PlannedCell = {
    col: number;
    covers: number;
    colspan: number;
    rowspan: number;
    claimed: number;
    index: number;
    dropped?: DropReason;
};
export type PlannedRow = {
    cells: PlannedCell[];
    collapsed: boolean;
};
export type GridOptions = {
    strict?: boolean;
    lines?: number;
    skipHeldOnBareLine?: boolean;
};
/** Plans every row of one tabular from the analysed rows. */
export declare const buildTabularGrid: (cols: number, rows: AnalysedRow[], options?: GridOptions) => PlannedRow[];
