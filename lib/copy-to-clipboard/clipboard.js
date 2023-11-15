"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyText = exports.copyNode = void 0;
function createNode(text) {
    var node = document.createElement('pre');
    node.style.width = '1px';
    node.style.height = '1px';
    node.style.position = 'fixed';
    node.style.top = '5px';
    node.textContent = text;
    return node;
}
function copyNode(node) {
    var selection = getSelection();
    if (selection == null) {
        return Promise.reject(new Error());
    }
    selection.removeAllRanges();
    var range = document.createRange();
    range.selectNodeContents(node);
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    return Promise.resolve();
}
exports.copyNode = copyNode;
function copyText(text) {
    if ('clipboard' in navigator) {
        return navigator.clipboard.writeText(text);
    }
    var body = document === null || document === void 0 ? void 0 : document.body;
    if (!body) {
        return Promise.reject(new Error());
    }
    var node = createNode(text);
    body.appendChild(node);
    copyNode(node);
    body.removeChild(node);
    return Promise.resolve();
}
exports.copyText = copyText;
//# sourceMappingURL=clipboard.js.map