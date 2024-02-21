"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionNameFromAscii = exports.AddToAsciiData = void 0;
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
//# sourceMappingURL=common.js.map