"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOnlyOneMoNode = exports.getFunctionNameFromAscii = exports.AddToAsciiData = void 0;
var AddToAsciiData = function (data, arr) {
    if ((arr === null || arr === void 0 ? void 0 : arr.length) > 3) {
        data.ascii += arr[0];
        data.ascii_tsv += arr[1];
        data.ascii_csv += arr[2];
        data.ascii_md += arr[3];
        return data;
    }
    data.ascii += arr[0];
    data.ascii_tsv += arr[0];
    data.ascii_csv += arr[0];
    data.ascii_md += arr[0];
    return data;
};
exports.AddToAsciiData = AddToAsciiData;
var getFunctionNameFromAscii = function (ascii, node) {
    var _a;
    if (!(ascii === null || ascii === void 0 ? void 0 : ascii.trim())) {
        return '';
    }
    ascii = ascii.trim();
    var text = '';
    switch (node.kind) {
        case 'mi':
            text = ascii;
            break;
        case 'msub':
        case 'msubsup': {
            var match = ascii.match(/^.*?(?=_)/);
            text = match[0].trim();
            break;
        }
        case 'msup': {
            var match = (_a = ascii.trim()) === null || _a === void 0 ? void 0 : _a.match(/^.*?(?=\^)/);
            text = match[0].trim();
            break;
        }
    }
    return text;
};
exports.getFunctionNameFromAscii = getFunctionNameFromAscii;
var hasOnlyOneMoNode = function (node) {
    var _a, _b, _c;
    if ((node === null || node === void 0 ? void 0 : node.kind) === 'mo') {
        return ((_a = node.childNodes) === null || _a === void 0 ? void 0 : _a.length) === 1;
    }
    if (node.kind === 'inferredMrow' && ((_b = node === null || node === void 0 ? void 0 : node.childNodes) === null || _b === void 0 ? void 0 : _b.length) === 1) {
        return (0, exports.hasOnlyOneMoNode)(node.childNodes[0]);
    }
    if (node.kind === 'TeXAtom' && ((_c = node === null || node === void 0 ? void 0 : node.childNodes) === null || _c === void 0 ? void 0 : _c.length) === 1) {
        return (0, exports.hasOnlyOneMoNode)(node.childNodes[0]);
    }
    return false;
};
exports.hasOnlyOneMoNode = hasOnlyOneMoNode;
//# sourceMappingURL=common.js.map