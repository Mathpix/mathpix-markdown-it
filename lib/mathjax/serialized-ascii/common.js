"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddToAsciiData = void 0;
exports.AddToAsciiData = function (data, arr) {
    if ((arr === null || arr === void 0 ? void 0 : arr.length) > 2) {
        data.ascii += arr[0];
        data.ascii_tsv += arr[1];
        data.ascii_csv += arr[2];
        return data;
    }
    data.ascii += arr[0];
    data.ascii_tsv += arr[0];
    data.ascii_csv += arr[0];
    return data;
};
//# sourceMappingURL=common.js.map