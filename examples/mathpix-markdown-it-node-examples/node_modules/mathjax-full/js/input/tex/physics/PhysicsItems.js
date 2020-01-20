"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var StackItem_js_1 = require("../StackItem.js");
var ParseUtil_js_1 = require("../ParseUtil.js");
var TexParser_js_1 = require("../TexParser.js");
var AutoOpen = (function (_super) {
    __extends(AutoOpen, _super);
    function AutoOpen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AutoOpen.prototype, "kind", {
        get: function () {
            return 'auto open';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AutoOpen.prototype, "isOpen", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    AutoOpen.prototype.toMml = function () {
        var parser = this.factory.configuration.parser;
        var right = this.getProperty('right');
        if (this.getProperty('smash')) {
            var mml_1 = _super.prototype.toMml.call(this);
            var smash = parser.create('node', 'mpadded', [mml_1], { height: 0, depth: 0 });
            this.Clear();
            this.Push(parser.create('node', 'TeXAtom', [smash]));
        }
        if (right) {
            this.Push(new TexParser_js_1.default(right, parser.stack.env, parser.configuration).mml());
        }
        var mml = _super.prototype.toMml.call(this);
        return ParseUtil_js_1.default.fenced(this.factory.configuration, this.getProperty('open'), mml, this.getProperty('close'), this.getProperty('big'));
    };
    AutoOpen.prototype.checkItem = function (item) {
        var close = item.getProperty('autoclose');
        if (close && close === this.getProperty('close')) {
            if (this.getProperty('ignore')) {
                this.Clear();
                return [[], true];
            }
            return [[this.toMml()], true];
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return AutoOpen;
}(StackItem_js_1.BaseItem));
exports.AutoOpen = AutoOpen;
//# sourceMappingURL=PhysicsItems.js.map