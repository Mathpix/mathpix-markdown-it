export type AnalysedCell = {
    mc: number;
    mr: number;
    prints: boolean;
    index: number;
};
export type AnalysedRow = {
    cells: AnalysedCell[] | null;
    targets: number[] | null;
    rowsLeft: number;
};
export type PlannedCell = {
    col: number;
    colspan: number;
    rowspan: number;
    claimed: number;
    index: number;
    dropped?: 'clipped' | 'covered';
};
export type PlannedRow = {
    cells: PlannedCell[];
    collapsed: boolean;
};
export type TabularGrid = {
    cols: number;
    rows: PlannedRow[];
};
export type GridOptions = {
    strict?: boolean;
    pptx?: boolean;
};
/** The structure of one tabular from the analysed rows. */
export declare const buildTabularGrid: (cols: number, rows: AnalysedRow[], options?: GridOptions) => TabularGrid;
