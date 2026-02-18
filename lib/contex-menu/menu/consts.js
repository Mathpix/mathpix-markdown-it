"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eMathType = exports.mmdClassesForContextMenu = exports.mathExportTypes = exports.maxWidthMenu = exports.paddingMenuBottomSmall = exports.paddingMenu = exports.heightMenuItem = exports.SMALL_SCREEN_BREAKPOINT = exports.classNameMenuItemSource = exports.classNameMenuItem = exports.classNameMenu = exports.classNameContextMenu = void 0;
exports.classNameContextMenu = 'mmd-context-menu';
exports.classNameMenu = 'mmd-menu';
exports.classNameMenuItem = 'mmd-menu-item';
exports.classNameMenuItemSource = 'mmd-menu-item-source';
exports.SMALL_SCREEN_BREAKPOINT = 580;
exports.heightMenuItem = 52;
exports.paddingMenu = 5;
exports.paddingMenuBottomSmall = 34;
exports.maxWidthMenu = 320;
exports.mathExportTypes = [
    'latex',
    'asciimath',
    'linearmath',
    'mathml',
    'mathmlword',
    'typst',
    'tsv',
    'csv',
    'table-markdown',
    'smiles'
];
/** Classes mmd for which the context menu is supported */
exports.mmdClassesForContextMenu = ['inline-tabular', 'MathJax', 'smiles', 'smiles-inline'];
var eMathType;
(function (eMathType) {
    eMathType["latex"] = "latex";
    eMathType["asciimath"] = "asciimath";
    eMathType["linearmath"] = "linearmath";
    eMathType["mathml"] = "mathml";
    eMathType["mathmlword"] = "mathmlword";
    eMathType["tsv"] = "tsv";
    eMathType["csv"] = "csv";
    eMathType["typst"] = "typst";
    eMathType["table_markdown"] = "table-markdown";
    eMathType["smiles"] = "smiles";
})(eMathType = exports.eMathType || (exports.eMathType = {}));
//# sourceMappingURL=consts.js.map