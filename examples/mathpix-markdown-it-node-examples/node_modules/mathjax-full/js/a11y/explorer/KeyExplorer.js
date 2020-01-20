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
var Explorer_js_1 = require("./Explorer.js");
var sre_js_1 = require("../sre.js");
var AbstractKeyExplorer = (function (_super) {
    __extends(AbstractKeyExplorer, _super);
    function AbstractKeyExplorer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.events = _super.prototype.Events.call(_this).concat([['keydown', _this.KeyDown.bind(_this)],
            ['focusin', _this.FocusIn.bind(_this)],
            ['focusout', _this.FocusOut.bind(_this)]]);
        _this.oldIndex = null;
        return _this;
    }
    AbstractKeyExplorer.prototype.FocusIn = function (event) {
    };
    AbstractKeyExplorer.prototype.FocusOut = function (event) {
        this.Stop();
    };
    AbstractKeyExplorer.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
        if (!this.active && !force)
            return;
        this.highlighter.unhighlight();
        this.highlighter.highlight(this.walker.getFocus(true).getNodes());
    };
    AbstractKeyExplorer.prototype.Attach = function () {
        _super.prototype.Attach.call(this);
        this.oldIndex = this.node.tabIndex;
        this.node.tabIndex = 1;
        this.node.setAttribute('role', 'application');
    };
    AbstractKeyExplorer.prototype.Detach = function () {
        this.node.tabIndex = this.oldIndex;
        this.oldIndex = null;
        this.node.removeAttribute('role');
        _super.prototype.Detach.call(this);
    };
    AbstractKeyExplorer.prototype.Stop = function () {
        if (this.active) {
            this.highlighter.unhighlight();
            this.walker.deactivate();
        }
        _super.prototype.Stop.call(this);
    };
    return AbstractKeyExplorer;
}(Explorer_js_1.AbstractExplorer));
exports.AbstractKeyExplorer = AbstractKeyExplorer;
var SpeechExplorer = (function (_super) {
    __extends(SpeechExplorer, _super);
    function SpeechExplorer(document, region, node, mml) {
        var _this = _super.call(this, document, region, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.mml = mml;
        _this.showRegion = 'subtitles';
        _this.init = false;
        _this.restarted = false;
        _this.initWalker();
        return _this;
    }
    SpeechExplorer.prototype.Start = function () {
        var _this = this;
        if (!this.init) {
            this.init = true;
            sre_js_1.sreReady.then(function () {
                _this.Speech(_this.walker);
                _this.Start();
            }).catch(function (error) { return console.log(error.message); });
            return;
        }
        _super.prototype.Start.call(this);
        var options = this.getOptions();
        this.speechGenerator = sre.SpeechGeneratorFactory.generator('Direct');
        this.speechGenerator.setOptions(options);
        this.walker = sre.WalkerFactory.walker('table', this.node, this.speechGenerator, this.highlighter, this.mml);
        this.walker.activate();
        this.Update();
        if (this.document.options.a11y[this.showRegion]) {
            this.region.Show(this.node, this.highlighter);
        }
        this.restarted = true;
    };
    SpeechExplorer.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
        _super.prototype.Update.call(this, force);
        this.region.Update(this.walker.speech());
        var options = this.speechGenerator.getOptions();
        if (options.modality === 'speech') {
            this.document.options.a11y.speechRules = options.domain + '-' + options.style;
        }
    };
    SpeechExplorer.prototype.Speech = function (walker) {
        var speech = walker.speech();
        this.node.setAttribute('hasspeech', 'true');
        this.Update();
        if (this.restarted && this.document.options.a11y[this.showRegion]) {
            this.region.Show(this.node, this.highlighter);
        }
    };
    SpeechExplorer.prototype.KeyDown = function (event) {
        var code = event.keyCode;
        if (code === 27) {
            this.Stop();
            this.stopEvent(event);
            return;
        }
        if (this.active) {
            this.Move(code);
            this.stopEvent(event);
            return;
        }
        if (code === 32 && event.shiftKey || code === 13) {
            this.Start();
            this.stopEvent(event);
        }
    };
    SpeechExplorer.prototype.Move = function (key) {
        this.walker.move(key);
        this.Update();
    };
    SpeechExplorer.prototype.initWalker = function () {
        this.speechGenerator = sre.SpeechGeneratorFactory.generator('Tree');
        var dummy = sre.WalkerFactory.walker('dummy', this.node, this.speechGenerator, this.highlighter, this.mml);
        this.walker = dummy;
    };
    SpeechExplorer.prototype.getOptions = function () {
        var options = this.speechGenerator.getOptions();
        var _a = __read(this.document.options.a11y.speechRules.split('-'), 2), domain = _a[0], style = _a[1];
        if (options.modality === 'speech' &&
            (options.domain !== domain || options.style !== style)) {
            options.domain = domain;
            options.style = style;
            this.walker.update(options);
        }
        return options;
    };
    return SpeechExplorer;
}(AbstractKeyExplorer));
exports.SpeechExplorer = SpeechExplorer;
var Magnifier = (function (_super) {
    __extends(Magnifier, _super);
    function Magnifier(document, region, node, mml) {
        var _this = _super.call(this, document, region, node) || this;
        _this.document = document;
        _this.region = region;
        _this.node = node;
        _this.mml = mml;
        _this.walker = sre.WalkerFactory.walker('table', _this.node, sre.SpeechGeneratorFactory.generator('Dummy'), _this.highlighter, _this.mml);
        return _this;
    }
    Magnifier.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
        _super.prototype.Update.call(this, force);
        this.showFocus();
    };
    Magnifier.prototype.Start = function () {
        _super.prototype.Start.call(this);
        this.region.Show(this.node, this.highlighter);
        this.walker.activate();
        this.Update();
    };
    Magnifier.prototype.showFocus = function () {
        var node = this.walker.getFocus().getNodes()[0];
        this.region.Show(node, this.highlighter);
    };
    Magnifier.prototype.Move = function (key) {
        var result = this.walker.move(key);
        if (result) {
            this.Update();
        }
    };
    Magnifier.prototype.KeyDown = function (event) {
        var code = event.keyCode;
        if (code === 27) {
            this.Stop();
            this.stopEvent(event);
            return;
        }
        if (this.active && code !== 13) {
            this.Move(code);
            this.stopEvent(event);
            return;
        }
        if (code === 32 && event.shiftKey || code === 13) {
            this.Start();
            this.stopEvent(event);
        }
    };
    return Magnifier;
}(AbstractKeyExplorer));
exports.Magnifier = Magnifier;
//# sourceMappingURL=KeyExplorer.js.map