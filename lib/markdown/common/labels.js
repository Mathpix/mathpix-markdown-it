"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsList = exports.groupLabelIdByUuidFromLabelsList = exports.getLabelByUuidFromLabelsList = exports.getLabelByKeyFromLabelsList = exports.clearLabelsList = exports.addIntoLabelsList = exports.labelsList = exports.eLabelType = void 0;
var tslib_1 = require("tslib");
/**
 * In LaTeX, we can easily reference almost anything that can be numbered,
 * and have LaTeX automatically updating the numbering for we whenever necessary.
 * The objects which can be referenced include
 *   sections, subsections, subsubsections, footnotes, theorems, equations, figures and tables
 * */
var eLabelType;
(function (eLabelType) {
    eLabelType["equation"] = "equation";
    eLabelType["figure"] = "figure";
    eLabelType["footnote"] = "footnote";
    eLabelType["table"] = "table";
    eLabelType["theorem"] = "theorem";
    eLabelType["section"] = "section";
    eLabelType["subsection"] = "subsection";
    eLabelType["subsubsection"] = "subsubsection";
})(eLabelType = exports.eLabelType || (exports.eLabelType = {}));
exports.labelsList = [];
var addIntoLabelsList = function (label) {
    /** Label key should be unique */
    var index = (exports.labelsList === null || exports.labelsList === void 0 ? void 0 : exports.labelsList.length)
        ? exports.labelsList.findIndex(function (item) { return item.key === label.key; })
        : -1;
    /** If the list already has a label with this key,
     * it will be replaced by a new one (like in Overleaf) */
    if (index !== -1) {
        exports.labelsList[index] = label;
        return;
    }
    /** If the theorem has multiple labels, then we add all those labels to the id
     * that will be used to jump to the parent block for all references of those labels */
    label = (0, exports.groupLabelIdByUuidFromLabelsList)(label);
    exports.labelsList.push(label);
};
exports.addIntoLabelsList = addIntoLabelsList;
var clearLabelsList = function () {
    exports.labelsList = [];
};
exports.clearLabelsList = clearLabelsList;
var getLabelByKeyFromLabelsList = function (key) {
    return (exports.labelsList === null || exports.labelsList === void 0 ? void 0 : exports.labelsList.length)
        ? exports.labelsList.find(function (item) { return item.key === key; })
        : null;
};
exports.getLabelByKeyFromLabelsList = getLabelByKeyFromLabelsList;
var getLabelByUuidFromLabelsList = function (uuid) {
    return (exports.labelsList === null || exports.labelsList === void 0 ? void 0 : exports.labelsList.length)
        ? exports.labelsList.find(function (item) { return item.tokenUuidInParentBlock === uuid; })
        : null;
};
exports.getLabelByUuidFromLabelsList = getLabelByUuidFromLabelsList;
/** If the theorem has multiple labels, then we add all those labels to the id
 * that will be used to jump to the parent block for all references of those labels */
var groupLabelIdByUuidFromLabelsList = function (label) {
    if (!label.tokenUuidInParentBlock || !exports.labelsList.length) {
        return label;
    }
    var lastLabelId = '';
    for (var i = 0; i < exports.labelsList.length; i++) {
        var item = exports.labelsList[i];
        if (item.tokenUuidInParentBlock !== label.tokenUuidInParentBlock) {
            continue;
        }
        item.id += '_' + label.id;
        lastLabelId = item.id;
    }
    if (lastLabelId) {
        label.id = lastLabelId;
    }
    return label;
};
exports.groupLabelIdByUuidFromLabelsList = groupLabelIdByUuidFromLabelsList;
var getLabelsList = function (showAllInformation) {
    if (showAllInformation === void 0) { showAllInformation = false; }
    /** Get all information including auxiliary fields like tagChildrenTokens */
    if (showAllInformation) {
        return tslib_1.__spreadArray([], tslib_1.__read(exports.labelsList), false);
    }
    return (exports.labelsList === null || exports.labelsList === void 0 ? void 0 : exports.labelsList.length)
        ? exports.labelsList.map(function (item) {
            return {
                key: item.key,
                tag: item.tag,
                type: item.type
            };
        })
        : [];
};
exports.getLabelsList = getLabelsList;
//# sourceMappingURL=labels.js.map