// Module-global figure/table caption counters. Kept in a leaf module (no heavy imports) so
// begin-table.ts (which increments them) and the list rule (which snapshots/restores them
// around a speculative parse) can both import without creating an import cycle.

let tables: number = 0;
let figures: number = 0;

export interface CaptionCounters { tables: number; figures: number }

export const getCaptionCounters = (): CaptionCounters => ({ tables, figures });
export const setCaptionCounters = (c: CaptionCounters): void => {
  tables = c.tables;
  figures = c.figures;
};

export const clearTableNumbers = (): void => { tables = 0; };
export const clearFigureNumbers = (): void => { figures = 0; };

// Increment and return the new number (used when a caption commits).
export const nextTableNumber = (): number => (tables += 1);
export const nextFigureNumber = (): number => (figures += 1);
export const currentTableNumber = (): number => tables;
export const currentFigureNumber = (): number => figures;
