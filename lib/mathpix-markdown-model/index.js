"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var check_formula_1 = require("./check-formula");
var markdown_1 = require("../markdown");
var styles_1 = require("../mathjax/styles");
var styles_tabular_1 = require("../mathjax/styles-tabular");
var mathjax_1 = require("../mathjax");
var MathpixMarkdown_Model = /** @class */ (function () {
    function MathpixMarkdown_Model() {
        var _this = this;
        this.disableFancyArrayDef = ['replacements', 'list', 'usepackage', 'separateForBlock', 'toc'];
        this.checkFormula = check_formula_1.checkFormula;
        this.texReset = mathjax_1.MathJax.Reset;
        this.getLastEquationNumber = mathjax_1.MathJax.GetLastEquationNumber;
        this.markdownToHTML = function (markdown, options) {
            var _a = options.lineNumbering, lineNumbering = _a === void 0 ? false : _a;
            var html = markdown_1.markdownToHTML(markdown, options);
            if (!lineNumbering) {
                mathjax_1.MathJax.Reset();
                if (html.indexOf('clickable-link') !== -1) {
                    html = _this.checkEquationNumber(html);
                }
            }
            return html;
        };
        this.showTocInContainer = function (html, containerName) {
            if (containerName === void 0) { containerName = 'toc'; }
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var body = doc.body;
            var toc = body.getElementsByClassName('table-of-contents')[0];
            if (toc) {
                var toc_container = document.getElementById(containerName);
                if (toc_container) {
                    toc_container.innerHTML = toc.innerHTML;
                    var preview_right = document.getElementById("preview-right");
                    if (preview_right) {
                        preview_right.style.margin = 'unset';
                    }
                }
            }
        };
        this.getTocContainerHTML = function (html) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var body = doc.body;
            var toc = body.getElementsByClassName('table-of-contents')[0];
            if (toc) {
                return toc.innerHTML;
            }
            else {
                return '';
            }
        };
        this.checkEquationNumber = function (html) {
            try {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, "text/html");
                var body = doc.body;
                var links = body.getElementsByClassName('clickable-link');
                for (var i = 0; i < links.length; i++) {
                    var eq = links[i].getAttribute('value');
                    var equationNumber = doc.getElementById(eq);
                    if (!equationNumber) {
                        links[i].innerHTML = "[" + decodeURIComponent(eq) + "]";
                    }
                    else {
                        var numbers = equationNumber.getAttribute('number');
                        if (numbers) {
                            links[i].innerHTML = "[" + numbers.split(',')[0] + "]";
                        }
                    }
                }
                return body.innerHTML;
            }
            catch (e) {
                return html;
            }
        };
        this.handleClick = function (e) {
            var domNode = e.target.attributes;
            var preview = document.getElementById("preview");
            var offsetTarget;
            if (domNode.href && domNode.length === 2) {
                e.preventDefault();
                var anchor = document.getElementById(domNode.href.nodeValue.slice(1));
                if (!anchor) {
                    return;
                }
                ;
                offsetTarget = anchor.getBoundingClientRect().top + preview.scrollTop - 48;
                _this.scrollPage(preview, offsetTarget);
            }
            else {
                if (domNode.length > 2 && domNode[2].value) {
                    if (domNode[2].value === 'clickable-link') {
                        e.preventDefault();
                        var domID = domNode[3].value;
                        var el = document.getElementById(domID);
                        if (!el) {
                            return;
                        }
                        ;
                        if (el.classList.contains('table') || el.classList.contains('figure')) {
                            offsetTarget = el.getBoundingClientRect().top + preview.scrollTop - 48;
                        }
                        else {
                            offsetTarget = (el.offsetTop) - (window.innerHeight / 2) || 0;
                        }
                        _this.scrollPage(preview, offsetTarget);
                    }
                    else {
                        if (domNode[2].value && domNode[2].value.indexOf('toc-link') >= 0) {
                            e.preventDefault();
                            var selectLink = document.getElementsByClassName('toc-link');
                            if (selectLink && selectLink.length > 0) {
                                for (var i = 0; i < selectLink.length; i++) {
                                    selectLink[i].classList.remove('selected');
                                }
                            }
                            domNode[2].value = 'toc-link selected';
                            var anchor = document.getElementById(domNode.href.nodeValue.slice(1));
                            if (!anchor) {
                                return;
                            }
                            ;
                            offsetTarget = anchor.getBoundingClientRect().top + preview.scrollTop - 48;
                            _this.scrollPage(preview, offsetTarget);
                        }
                    }
                }
            }
        };
        this.scrollPage = function (parent, offsetTarget) {
            var offsetStart = parent.scrollTop;
            var step = Math.abs(offsetTarget - offsetStart) / 20;
            var clickPoint = offsetStart;
            var refeatTimer = window.setInterval(function () {
                clickPoint = offsetTarget > offsetStart ? (clickPoint + step) : (clickPoint - step);
                parent.scrollTop = clickPoint;
                var scrollNext = (step > 1) ? Math.abs(clickPoint - offsetTarget) + 1 : Math.abs(clickPoint - offsetTarget);
                if (scrollNext <= step) {
                    clearInterval(refeatTimer);
                    return;
                }
            }, 10);
        };
        this.loadMathJax = function (notScrolling, setTextAlignJustify, isResetBodyStyles) {
            if (notScrolling === void 0) { notScrolling = false; }
            if (setTextAlignJustify === void 0) { setTextAlignJustify = true; }
            if (isResetBodyStyles === void 0) { isResetBodyStyles = false; }
            try {
                var el = document.getElementById('SVG-styles');
                if (!el) {
                    var MathJaxStyle = mathjax_1.MathJax.Stylesheet();
                    document.head.appendChild(MathJaxStyle);
                }
                var elStyle = document.getElementById('Mathpix-styles');
                if (!notScrolling) {
                    window.addEventListener('click', _this.handleClick, false);
                }
                if (!elStyle) {
                    var style = document.createElement("style");
                    style.setAttribute("id", "Mathpix-styles");
                    var bodyStyles = isResetBodyStyles ? styles_1.resetBodyStyles : '';
                    style.innerHTML = bodyStyles + styles_1.MathpixStyle(setTextAlignJustify) + styles_1.codeStyles + styles_tabular_1.tabularStyles;
                    document.head.appendChild(style);
                }
                return true;
            }
            catch (e) {
                console.log('Error load MathJax =>', e.message);
                return false;
            }
        };
        this.convertToHTML = function (str, options) {
            var startTime = new Date().getTime();
            var mathString = _this.isCheckFormula ? _this.checkFormula(str, _this.showTimeLog) : str;
            options.lineNumbering = false;
            var html = _this.markdownToHTML(mathString, options);
            var endTime = new Date().getTime();
            if (_this.showTimeLog) {
                console.log("===> setText: " + (endTime - startTime) + "ms");
            }
            return html;
        };
        this.getMathjaxStyle = function () {
            var MathJaxStyle = mathjax_1.MathJax.Stylesheet();
            return MathJaxStyle.children[0].value;
        };
        this.getMathpixStyle = function (stylePreview, showToc, tocContainerName) {
            if (stylePreview === void 0) { stylePreview = false; }
            if (showToc === void 0) { showToc = false; }
            if (tocContainerName === void 0) { tocContainerName = 'toc'; }
            var MathJaxStyle = mathjax_1.MathJax.Stylesheet();
            var style = styles_1.ContainerStyle + MathJaxStyle.children[0].value + styles_1.MathpixStyle(stylePreview) + styles_1.codeStyles + styles_tabular_1.tabularStyles;
            if (showToc) { }
            return stylePreview
                ? showToc ? style + styles_1.PreviewStyle + styles_1.TocStyle(tocContainerName) : style + styles_1.PreviewStyle
                : style;
        };
        this.render = function (text, options) {
            var _a = options || {}, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.fontSize, fontSize = _g === void 0 ? null : _g, _h = _a.padding, padding = _h === void 0 ? null : _h, _j = _a.htmlTags, htmlTags = _j === void 0 ? false : _j, _k = _a.width, width = _k === void 0 ? 0 : _k, _l = _a.showToc, showToc = _l === void 0 ? false : _l, _m = _a.overflowY, overflowY = _m === void 0 ? 'unset' : _m, _o = _a.breaks, breaks = _o === void 0 ? true : _o, _p = _a.typographer, typographer = _p === void 0 ? true : _p;
            var disableRules = isDisableFancy ? _this.disableFancyArrayDef : options ? options.disableRules || [] : [];
            if (!showToc) {
                disableRules.push('toc');
            }
            var styleFontSize = fontSize ? " font-size: " + options.fontSize + "px;" : '';
            var stylePadding = padding ? " padding-left: " + options.padding + "px; padding-right: " + options.padding + "px;" : '';
            _this.setOptions(disableRules, isCheckFormula, showTimeLog);
            return ("<div id='preview' style='justify-content:" + alignMathBlock + ";overflow-y:" + overflowY + ";will-change:transform;'>\n                <div id='container-ruller'></div>\n                <div id='setText' style='display: " + display + "; justify-content: inherit;" + styleFontSize + stylePadding + "' >\n                    " + _this.convertToHTML(text, { htmlTags: htmlTags, breaks: breaks, typographer: typographer, width: width }) + "\n                </div>\n            </div>");
        };
    }
    MathpixMarkdown_Model.prototype.setOptions = function (disableRules, isCheckFormula, showTimeLog) {
        this.disableRules = disableRules;
        this.isCheckFormula = isCheckFormula;
        this.showTimeLog = showTimeLog;
    };
    return MathpixMarkdown_Model;
}());
exports.MathpixMarkdownModel = new MathpixMarkdown_Model();
//# sourceMappingURL=index.js.map