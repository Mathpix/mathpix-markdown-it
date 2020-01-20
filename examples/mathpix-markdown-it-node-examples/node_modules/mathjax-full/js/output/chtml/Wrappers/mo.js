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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Wrapper_js_1 = require("../Wrapper.js");
var mo_js_1 = require("../../common/Wrappers/mo.js");
var mo_js_2 = require("../../../core/MmlTree/MmlNodes/mo.js");
var BBox_js_1 = require("../BBox.js");
var CHTMLmo = (function (_super) {
    __extends(CHTMLmo, _super);
    function CHTMLmo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmo.prototype.toCHTML = function (parent) {
        var e_1, _a;
        var attributes = this.node.attributes;
        var symmetric = attributes.get('symmetric') && this.stretch.dir !== 2;
        var stretchy = this.stretch.dir !== 0;
        if (stretchy && this.size === null) {
            this.getStretchedVariant([]);
        }
        var chtml = this.standardCHTMLnode(parent);
        if (this.noIC) {
            this.adaptor.setAttribute(chtml, 'noIC', 'true');
        }
        if (stretchy && this.size < 0) {
            this.stretchHTML(chtml, symmetric);
        }
        else {
            if (symmetric || attributes.get('largeop')) {
                var bbox = BBox_js_1.BBox.empty();
                _super.prototype.computeBBox.call(this, bbox);
                var u = this.em((bbox.d - bbox.h) / 2 + this.font.params.axis_height);
                if (u !== '0') {
                    this.adaptor.setStyle(chtml, 'verticalAlign', u);
                }
            }
            try {
                for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.toCHTML(chtml);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    CHTMLmo.prototype.stretchHTML = function (chtml, symmetric) {
        var c = this.getText().charCodeAt(0);
        var delim = this.stretch;
        delim.used = true;
        var stretch = delim.stretch;
        var content = [];
        if (stretch[0]) {
            content.push(this.html('mjx-beg', {}, [this.html('mjx-c')]));
        }
        content.push(this.html('mjx-ext', {}, [this.html('mjx-c')]));
        if (stretch.length === 4) {
            content.push(this.html('mjx-mid', {}, [this.html('mjx-c')]), this.html('mjx-ext', {}, [this.html('mjx-c')]));
        }
        if (stretch[2]) {
            content.push(this.html('mjx-end', {}, [this.html('mjx-c')]));
        }
        var styles = {};
        var _a = this.bbox, h = _a.h, d = _a.d, w = _a.w;
        if (delim.dir === 1) {
            content.push(this.html('mjx-mark'));
            styles.height = this.em(h + d);
            styles.verticalAlign = this.em(-d);
        }
        else {
            styles.width = this.em(w);
        }
        var dir = mo_js_1.DirectionVH[delim.dir];
        var properties = { class: this.char(delim.c || c), style: styles };
        var html = this.html('mjx-stretchy-' + dir, properties, content);
        this.adaptor.append(chtml, html);
    };
    CHTMLmo.kind = mo_js_2.MmlMo.prototype.kind;
    CHTMLmo.styles = {
        'mjx-stretchy-h': {
            display: 'inline-table',
            width: '100%'
        },
        'mjx-stretchy-h > *': {
            display: 'table-cell',
            width: 0
        },
        'mjx-stretchy-h > * > mjx-c': {
            display: 'inline-block'
        },
        'mjx-stretchy-h > * > mjx-c::before': {
            padding: '.001em 0',
            width: 'initial'
        },
        'mjx-stretchy-h > mjx-ext': {
            overflow: 'hidden',
            width: '100%'
        },
        'mjx-stretchy-h > mjx-ext > mjx-c::before': {
            transform: 'scalex(500)'
        },
        'mjx-stretchy-h > mjx-ext > mjx-c': {
            width: 0
        },
        'mjx-stretchy-h > mjx-beg > mjx-c': {
            'margin-right': '-.1em'
        },
        'mjx-stretchy-h > mjx-end > mjx-c': {
            'margin-left': '-.1em'
        },
        'mjx-stretchy-v': {
            display: 'inline-block'
        },
        'mjx-stretchy-v > *': {
            display: 'block'
        },
        'mjx-stretchy-v > mjx-beg': {
            height: 0
        },
        'mjx-stretchy-v > mjx-end > mjx-c': {
            display: 'block'
        },
        'mjx-stretchy-v > * > mjx-c': {
            transform: 'scale(1)',
            'transform-origin': 'left center',
            overflow: 'hidden'
        },
        'mjx-stretchy-v > mjx-ext': {
            display: 'block',
            height: '100%',
            'box-sizing': 'border-box',
            border: '0px solid transparent',
            overflow: 'hidden'
        },
        'mjx-stretchy-v > mjx-ext > mjx-c::before': {
            width: 'initial'
        },
        'mjx-stretchy-v > mjx-ext > mjx-c': {
            transform: 'scaleY(500) translateY(.1em)',
            overflow: 'visible'
        },
        'mjx-mark': {
            display: 'inline-block',
            height: '0px'
        }
    };
    return CHTMLmo;
}(mo_js_1.CommonMoMixin(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmo = CHTMLmo;
//# sourceMappingURL=mo.js.map