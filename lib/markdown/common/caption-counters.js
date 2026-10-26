"use strict";
// Module-global figure/table caption counters. Kept in a leaf module (no heavy imports) so
// begin-table.ts (which increments them) and the list rule (which snapshots/restores them
// around a speculative parse) can both import without creating an import cycle.
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentFigureNumber = exports.currentTableNumber = exports.nextFigureNumber = exports.nextTableNumber = exports.clearFigureNumbers = exports.clearTableNumbers = exports.setCaptionCounters = exports.getCaptionCounters = void 0;
var tables = 0;
var figures = 0;
var getCaptionCounters = function () { return ({ tables: tables, figures: figures }); };
exports.getCaptionCounters = getCaptionCounters;
var setCaptionCounters = function (c) {
    tables = c.tables;
    figures = c.figures;
};
exports.setCaptionCounters = setCaptionCounters;
var clearTableNumbers = function () { tables = 0; };
exports.clearTableNumbers = clearTableNumbers;
var clearFigureNumbers = function () { figures = 0; };
exports.clearFigureNumbers = clearFigureNumbers;
// Increment and return the new number (used when a caption commits).
var nextTableNumber = function () { return (tables += 1); };
exports.nextTableNumber = nextTableNumber;
var nextFigureNumber = function () { return (figures += 1); };
exports.nextFigureNumber = nextFigureNumber;
var currentTableNumber = function () { return tables; };
exports.currentTableNumber = currentTableNumber;
var currentFigureNumber = function () { return figures; };
exports.currentFigureNumber = currentFigureNumber;
//# sourceMappingURL=caption-counters.js.map