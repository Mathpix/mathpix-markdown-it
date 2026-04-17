"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelsList = exports.groupLabelIdByUuidFromLabelsList = exports.getLabelByUuidFromLabelsList = exports.getLabelByKeyFromLabelsList = exports.clearLabelsList = exports.addIntoLabelsList = exports.eLabelType = void 0;
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
var labelsByKey = new Map();
var labelsByUuid = new Map();
var addIntoLabelsList = function (label) {
    var existing = labelsByKey.get(label.key);
    if (existing) {
        if (existing.tokenUuidInParentBlock
            && existing.tokenUuidInParentBlock !== label.tokenUuidInParentBlock) {
            labelsByUuid.delete(existing.tokenUuidInParentBlock);
        }
        labelsByKey.set(label.key, label);
        if (label.tokenUuidInParentBlock) {
            labelsByUuid.set(label.tokenUuidInParentBlock, label);
        }
        return;
    }
    label = (0, exports.groupLabelIdByUuidFromLabelsList)(label);
    labelsByKey.set(label.key, label);
    if (label.tokenUuidInParentBlock) {
        labelsByUuid.set(label.tokenUuidInParentBlock, label);
    }
};
exports.addIntoLabelsList = addIntoLabelsList;
var clearLabelsList = function () {
    labelsByKey.clear();
    labelsByUuid.clear();
};
exports.clearLabelsList = clearLabelsList;
var getLabelByKeyFromLabelsList = function (key) {
    var _a;
    return (_a = labelsByKey.get(key)) !== null && _a !== void 0 ? _a : null;
};
exports.getLabelByKeyFromLabelsList = getLabelByKeyFromLabelsList;
var getLabelByUuidFromLabelsList = function (uuid) {
    var _a;
    return (_a = labelsByUuid.get(uuid)) !== null && _a !== void 0 ? _a : null;
};
exports.getLabelByUuidFromLabelsList = getLabelByUuidFromLabelsList;
/** If the theorem has multiple labels, then we add all those labels to the id
 * that will be used to jump to the parent block for all references of those labels */
var groupLabelIdByUuidFromLabelsList = function (label) {
    var e_1, _a;
    if (!label.tokenUuidInParentBlock || labelsByKey.size === 0) {
        return label;
    }
    var lastLabelId = '';
    try {
        for (var _b = tslib_1.__values(labelsByKey.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var item = _c.value;
            if (item.tokenUuidInParentBlock !== label.tokenUuidInParentBlock) {
                continue;
            }
            item.id += '_' + label.id;
            lastLabelId = item.id;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    if (lastLabelId) {
        label.id = lastLabelId;
    }
    return label;
};
exports.groupLabelIdByUuidFromLabelsList = groupLabelIdByUuidFromLabelsList;
var getLabelsList = function (showAllInformation) {
    if (showAllInformation === void 0) { showAllInformation = false; }
    if (labelsByKey.size === 0) {
        return [];
    }
    if (showAllInformation) {
        return Array.from(labelsByKey.values());
    }
    return Array.from(labelsByKey.values()).map(function (item) { return ({
        key: item.key,
        tag: item.tag,
        type: item.type,
    }); });
};
exports.getLabelsList = getLabelsList;
//# sourceMappingURL=labels.js.map