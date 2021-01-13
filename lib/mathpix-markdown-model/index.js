"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathpixMarkdownModel = void 0;
var check_formula_1 = require("./check-formula");
var markdown_1 = require("../markdown");
var styles_1 = require("../styles");
var styles_container_1 = require("../styles/styles-container");
var styles_code_1 = require("../styles/styles-code");
var styles_tabular_1 = require("../styles/styles-tabular");
var styles_fonts_1 = require("../styles/styles-fonts");
var styles_lists_1 = require("../styles/styles-lists");
var mathjax_1 = require("../mathjax");
var formatSourceHtml = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
};
var formatSourceHtmlWord = function (text, notTrim) {
    if (notTrim === void 0) { notTrim = false; }
    text = notTrim ? text : text.trim();
    return text
        .replace(/<maligngroup><\/maligngroup>/g, '<maligngroup/>')
        .replace(/<malignmark><\/malignmark>/g, '<malignmark/>')
        .replace(/&nbsp;/g, '&#xA0;');
};
var MathpixMarkdown_Model = /** @class */ (function () {
    function MathpixMarkdown_Model() {
        var _this = this;
        this.disableFancyArrayDef = ['replacements', 'list', 'usepackage', 'toc'];
        this.checkFormula = check_formula_1.checkFormula;
        this.texReset = mathjax_1.MathJax.Reset;
        this.getLastEquationNumber = mathjax_1.MathJax.GetLastEquationNumber;
        this.parseMarkdownByHTML = function (html, include_sub_math) {
            if (include_sub_math === void 0) { include_sub_math = true; }
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            return _this.parseMarkdownByElement(doc, include_sub_math);
        };
        this.parseMarkdownByElement = function (el, include_sub_math) {
            if (include_sub_math === void 0) { include_sub_math = true; }
            var res = [];
            if (!el)
                return null;
            var math_el = include_sub_math
                ? el.querySelectorAll('.math-inline, .math-block, .table_tabular, .inline-tabular, .smiles, .smiles-inline')
                : el.querySelectorAll('div > .math-inline, div > .math-block, .table_tabular, div > .inline-tabular, div > .smiles, div > .smiles-inline');
            if (!math_el)
                return null;
            for (var i = 0; i < math_el.length; i++) {
                for (var j = 0; j < math_el[i].children.length; j++) {
                    var child = math_el[i].children[j];
                    if (['smiles', 'smiles-inline'].includes(math_el[i].className) && child.tagName.toUpperCase() === 'SVG') {
                        res.push({ type: "svg", value: child.outerHTML });
                        continue;
                    }
                    if (["MATHML", "MATHMLWORD", "ASCIIMATH", "LATEX", "MJX-CONTAINER", "TABLE", "TSV", "SMILES"].indexOf(child.tagName) !== -1) {
                        if (child.tagName === "MJX-CONTAINER" || child.tagName === "TABLE") {
                            if (child.tagName === "TABLE") {
                                res.push({ type: "html", value: child.outerHTML });
                            }
                            else {
                                res.push({ type: "svg", value: child.innerHTML });
                            }
                        }
                        else {
                            res.push({
                                type: child.tagName.toLowerCase(),
                                value: child.tagName === 'LATEX' || child.tagName === 'ASCIIMATH' || child.tagName === 'TSV' || child.tagName === 'SMILES'
                                    ? formatSourceHtml(child.innerHTML, child.tagName === 'TSV')
                                    : child.tagName === 'MATHMLWORD'
                                        ? formatSourceHtmlWord(child.innerHTML)
                                        : child.innerHTML
                            });
                        }
                    }
                }
            }
            return res;
        };
        this.markdownToHTML = function (markdown, options) {
            if (options === void 0) { options = {}; }
            var _a = options.lineNumbering, lineNumbering = _a === void 0 ? false : _a, _b = options.isDisableFancy, isDisableFancy = _b === void 0 ? false : _b;
            var disableRules = isDisableFancy ? _this.disableFancyArrayDef : options ? options.disableRules || [] : [];
            _this.setOptions(disableRules);
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
                            window.location.hash = anchor.id;
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
                    style.innerHTML = bodyStyles + styles_1.MathpixStyle(setTextAlignJustify) + styles_code_1.codeStyles + styles_tabular_1.tabularStyles() + styles_lists_1.listsStyles;
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
            if (options === void 0) { options = {}; }
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
            try {
                var MathJaxStyle = mathjax_1.MathJax.Stylesheet();
                return MathJaxStyle.children[0] && MathJaxStyle.children[0].value
                    ? MathJaxStyle.children[0].value
                    : MathJaxStyle.innerHTML;
            }
            catch (e) {
                return '';
            }
        };
        this.getMathpixStyleOnly = function () {
            var style = _this.getMathjaxStyle() + styles_1.MathpixStyle(false) + styles_code_1.codeStyles + styles_tabular_1.tabularStyles() + styles_lists_1.listsStyles;
            return style;
        };
        this.getMathpixStyle = function (stylePreview, showToc, tocContainerName) {
            if (stylePreview === void 0) { stylePreview = false; }
            if (showToc === void 0) { showToc = false; }
            if (tocContainerName === void 0) { tocContainerName = 'toc'; }
            var style = styles_container_1.ContainerStyle() + _this.getMathjaxStyle() + styles_1.MathpixStyle(stylePreview) + styles_code_1.codeStyles + styles_tabular_1.tabularStyles() + styles_lists_1.listsStyles;
            if (showToc) { }
            return stylePreview
                ? showToc ? style + styles_1.PreviewStyle + styles_1.TocStyle(tocContainerName) : style + styles_1.PreviewStyle
                : style;
        };
        this.getMathpixMarkdownStyles = function (useColors) {
            if (useColors === void 0) { useColors = true; }
            var style = styles_container_1.ContainerStyle(useColors);
            style += _this.getMathjaxStyle();
            style += styles_1.MathpixStyle(false, useColors);
            // style += codeStyles;
            style += styles_tabular_1.tabularStyles(useColors);
            style += styles_lists_1.listsStyles;
            return style;
        };
        this.getMathpixFontsStyle = function () {
            return styles_fonts_1.fontsStyles;
        };
        this.render = function (text, options) {
            var _a = options || {}, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.fontSize, fontSize = _g === void 0 ? null : _g, _h = _a.padding, padding = _h === void 0 ? null : _h, _j = _a.htmlTags, htmlTags = _j === void 0 ? false : _j, _k = _a.width, width = _k === void 0 ? 0 : _k, _l = _a.showToc, showToc = _l === void 0 ? false : _l, _m = _a.overflowY, overflowY = _m === void 0 ? 'unset' : _m, _o = _a.breaks, breaks = _o === void 0 ? true : _o, _p = _a.typographer, typographer = _p === void 0 ? true : _p, _q = _a.linkify, linkify = _q === void 0 ? true : _q, _r = _a.xhtmlOut, xhtmlOut = _r === void 0 ? false : _r, _s = _a.outMath, outMath = _s === void 0 ? {} : _s, _t = _a.mathJax, mathJax = _t === void 0 ? {} : _t, _u = _a.htmlSanitize, htmlSanitize = _u === void 0 ? {} : _u, _v = _a.smiles, smiles = _v === void 0 ? {} : _v, _w = _a.openLinkInNewWindow, openLinkInNewWindow = _w === void 0 ? true : _w;
            var disableRules = isDisableFancy ? _this.disableFancyArrayDef : options ? options.disableRules || [] : [];
            if (showToc) {
                var index = disableRules.indexOf('toc');
                if (disableRules.indexOf('toc') === -1) {
                    disableRules.splice(index, 1);
                }
            }
            else {
                disableRules.push('toc');
            }
            var markdownItOptions = {
                isDisableFancy: isDisableFancy,
                disableRules: disableRules,
                htmlTags: htmlTags,
                xhtmlOut: xhtmlOut,
                breaks: breaks,
                typographer: typographer,
                linkify: linkify,
                width: width,
                outMath: outMath,
                mathJax: mathJax,
                htmlSanitize: htmlSanitize,
                smiles: smiles,
                openLinkInNewWindow: openLinkInNewWindow
            };
            var styleFontSize = fontSize ? " font-size: " + options.fontSize + "px;" : '';
            var stylePadding = padding ? " padding-left: " + options.padding + "px; padding-right: " + options.padding + "px;" : '';
            _this.setOptions(disableRules, isCheckFormula, showTimeLog);
            return ("<div id='preview' style='justify-content:" + alignMathBlock + ";overflow-y:" + overflowY + ";will-change:transform;'>\n                <div id='container-ruller'></div>\n                <div id='setText' style='display: " + display + "; justify-content: inherit;" + styleFontSize + stylePadding + "' >\n                    " + _this.convertToHTML(text, markdownItOptions) + "\n                </div>\n            </div>");
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