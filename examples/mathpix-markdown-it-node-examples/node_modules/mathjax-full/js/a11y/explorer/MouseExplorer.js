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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Region_js_1 = require("./Region.js");
var Explorer_js_1 = require("./Explorer.js");
var AbstractMouseExplorer = (function (_super) {
    __extends(AbstractMouseExplorer, _super);
    function AbstractMouseExplorer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.events = _super.prototype.Events.call(_this).concat([
            ['mouseover', _this.MouseOver.bind(_this)],
            ['mouseout', _this.MouseOut.bind(_this)]
        ]);
        return _this;
    }
    AbstractMouseExplorer.prototype.MouseOver = function (event) {
        this.Start();
    };
    AbstractMouseExplorer.prototype.MouseOut = function (event) {
        this.Stop();
    };
    return AbstractMouseExplorer;
}(Explorer_js_1.AbstractExplorer));
exports.AbstractMouseExplorer = AbstractMouseExplorer;
var Hoverer = (function (_super) {
    __extends(Hoverer, _super);
    function Hoverer(document, region, node, nodeQuery, nodeAccess) {
        var _this = _super.call(this, document, region, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.nodeQuery = nodeQuery;
        _this.nodeAccess = nodeAccess;
        return _this;
    }
    Hoverer.prototype.MouseOut = function (event) {
        if (event.clientX === this.coord[0] &&
            event.clientY === this.coord[1]) {
            return;
        }
        this.highlighter.unhighlight();
        this.region.Hide();
        _super.prototype.MouseOut.call(this, event);
    };
    Hoverer.prototype.MouseOver = function (event) {
        _super.prototype.MouseOver.call(this, event);
        var target = event.target;
        this.coord = [event.clientX, event.clientY];
        var _a = __read(this.getNode(target), 2), node = _a[0], kind = _a[1];
        if (!node) {
            return;
        }
        this.highlighter.unhighlight();
        this.highlighter.highlight([node]);
        this.region.Update(kind);
        this.region.Show(node, this.highlighter);
    };
    Hoverer.prototype.getNode = function (node) {
        var original = node;
        while (node && node !== this.node) {
            if (this.nodeQuery(node)) {
                return [node, this.nodeAccess(node)];
            }
            node = node.parentNode;
        }
        node = original;
        while (node) {
            if (this.nodeQuery(node)) {
                return [node, this.nodeAccess(node)];
            }
            var child = node.childNodes[0];
            node = (child && child.tagName === 'defs') ?
                node.childNodes[1] : child;
        }
        return [null, null];
    };
    return Hoverer;
}(AbstractMouseExplorer));
exports.Hoverer = Hoverer;
var ValueHoverer = (function (_super) {
    __extends(ValueHoverer, _super);
    function ValueHoverer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ValueHoverer;
}(Hoverer));
exports.ValueHoverer = ValueHoverer;
var ContentHoverer = (function (_super) {
    __extends(ContentHoverer, _super);
    function ContentHoverer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ContentHoverer;
}(Hoverer));
exports.ContentHoverer = ContentHoverer;
var FlameHoverer = (function (_super) {
    __extends(FlameHoverer, _super);
    function FlameHoverer(document, ignore, node) {
        var _this = _super.call(this, document, new Region_js_1.DummyRegion(document), node, function (x) { return _this.highlighter.isMactionNode(x); }, function (x) { }) || this;
        _this.document = document;
        _this.node = node;
        return _this;
    }
    return FlameHoverer;
}(Hoverer));
exports.FlameHoverer = FlameHoverer;
//# sourceMappingURL=MouseExplorer.js.map