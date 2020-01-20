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
var SelectableInfo = (function (_super) {
    __extends(SelectableInfo, _super);
    function SelectableInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectableInfo.prototype.addEvents = function (element) {
        var _this = this;
        element.addEventListener('keypress', function (event) {
            if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
                _this.selectAll();
                _this.stop(event);
            }
        });
    };
    SelectableInfo.prototype.selectAll = function () {
        var selection = document.getSelection();
        selection.selectAllChildren(this.getHtml().querySelector('pre'));
    };
    SelectableInfo.prototype.copyToClipboard = function () {
        this.selectAll();
        try {
            document.execCommand('copy');
        }
        catch (err) {
            alert('Can\'t copy to clipboard: ' + err.message);
        }
        document.getSelection().removeAllRanges();
    };
    SelectableInfo.prototype.generateHtml = function () {
        var _this = this;
        _super.prototype.generateHtml.call(this);
        var footer = this.getHtml().querySelector('span.' + ContextMenu.HtmlClasses['INFOSIGNATURE']);
        var button = footer.appendChild(document.createElement('input'));
        button.type = 'button';
        button.value = 'Copy to Clipboard';
        button.addEventListener('click', function (event) { return _this.copyToClipboard(); });
    };
    return SelectableInfo;
}(ContextMenu.Info));
exports.SelectableInfo = SelectableInfo;
//# sourceMappingURL=SelectableInfo.js.map