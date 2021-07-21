"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLinkEnableFile = void 0;
var BAD_PROTO_RE = /^(vbscript|javascript|data):/;
var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
exports.validateLinkEnableFile = function (url) {
    // url should be normalized at this point, and existing entities are decoded
    var str = url.trim().toLowerCase();
    return BAD_PROTO_RE.test(str)
        ? GOOD_DATA_RE.test(str)
            ? true
            : false
        : true;
};
//# sourceMappingURL=mdOptions.js.map