"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportMethods = void 0;
var contex_menu_1 = require("./contex-menu");
exports.exportMethods = function () {
    window.addListenerContextMenuEvents = contex_menu_1.addListenerContextMenuEvents;
    window.removeListenerContextMenuEvents = contex_menu_1.removeListenerContextMenuEvents;
};
exports.exportMethods();
//# sourceMappingURL=context-menu.js.map