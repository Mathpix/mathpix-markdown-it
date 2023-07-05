"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToAsciiData = void 0;
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
//# sourceMappingURL=common.js.map