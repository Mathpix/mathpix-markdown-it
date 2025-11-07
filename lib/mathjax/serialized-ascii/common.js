"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOnlyOneMoNode = exports.getFunctionNameFromAscii = exports.AddToAsciiData = exports.initAsciiData = void 0;
var initAsciiData = function () {
    return {
        ascii: '',
        linear: '',
        ascii_tsv: '',
        ascii_csv: '',
        ascii_md: ''
    };
};
exports.initAsciiData = initAsciiData;
var AddToAsciiData = function (dataOutput, dataInput) {
    dataOutput.ascii += dataInput.ascii;
    dataOutput.linear += dataInput.hasOwnProperty('linear')
        ? dataInput.linear
        : dataInput.ascii;
    dataOutput.ascii_tsv += dataInput.hasOwnProperty('ascii_tsv')
        ? dataInput.ascii_tsv
        : dataInput.ascii;
    dataOutput.ascii_csv += dataInput.hasOwnProperty('ascii_csv')
        ? dataInput.ascii_csv
        : dataInput.ascii;
    dataOutput.ascii_md += dataInput.hasOwnProperty('ascii_md')
        ? dataInput.ascii_md
        : dataInput.ascii;
    return dataOutput;
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