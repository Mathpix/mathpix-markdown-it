"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathpixMarkdownModel = exports.ParserErrors = exports.TTocStyle = void 0;
var check_formula_1 = require("./check-formula");
var markdown_1 = require("../markdown");
var styles_1 = require("../styles");
var styles_container_1 = require("../styles/styles-container");
var styles_code_1 = require("../styles/styles-code");
var styles_tabular_1 = require("../styles/styles-tabular");
var styles_fonts_1 = require("../styles/styles-fonts");
var styles_lists_1 = require("../styles/styles-lists");
var mathjax_1 = require("../mathjax");
var yaml_parser_1 = require("../yaml-parser");
var html_page_1 = require("./html-page");
var halpers_1 = require("../styles/halpers");
var parse_mmd_element_1 = require("../helpers/parse-mmd-element");
var styles_2 = require("../contex-menu/styles");
var TTocStyle;
(function (TTocStyle) {
    TTocStyle["summary"] = "summary";
    TTocStyle["list"] = "list";
})(TTocStyle = exports.TTocStyle || (exports.TTocStyle = {}));
;
var ParserErrors;
(function (ParserErrors) {
    ParserErrors["show"] = "show";
    ParserErrors["hide"] = "hide";
    ParserErrors["show_input"] = "show_input";
})(ParserErrors = exports.ParserErrors || (exports.ParserErrors = {}));
;
var MathpixMarkdown_Model = /** @class */ (function () {
    function MathpixMarkdown_Model() {
        var _this = this;
        this.disableFancyArrayDef = ['replacements', 'list', 'usepackage', 'toc'];
        this.checkFormula = check_formula_1.checkFormula;
        this.texReset = mathjax_1.MathJax.Reset;
        this.getLastEquationNumber = mathjax_1.MathJax.GetLastEquationNumber;
        this.getMaxWidthStyle = halpers_1.getMaxWidthStyle;
        this.parseMarkdownByHTML = function (html, include_sub_math) {
            if (include_sub_math === void 0) { include_sub_math = true; }
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            return _this.parseMarkdownByElement(doc, include_sub_math);
        };
        this.parseMarkdownByElement = parse_mmd_element_1.parseMarkdownByElement;
        this.markdownToHTML = function (markdown, options) {
            if (options === void 0) { options = {}; }
            var _a = options.lineNumbering, lineNumbering = _a === void 0 ? false : _a, _b = options.isDisableFancy, isDisableFancy = _b === void 0 ? false : _b, _c = options.htmlWrapper, htmlWrapper = _c === void 0 ? false : _c;
            var disableRules = isDisableFancy ? _this.disableFancyArrayDef : options ? options.disableRules || [] : [];
            _this.setOptions(disableRules);
            var html = (0, markdown_1.markdownToHTML)(markdown, options);
            if (!lineNumbering) {
                mathjax_1.MathJax.Reset();
                // if (html.indexOf('clickable-link') !== -1) {
                //   html = this.checkEquationNumber(html);
                // }
            }
            if (!htmlWrapper) {
                return html;
            }
            if (typeof htmlWrapper !== "boolean") {
                var title = htmlWrapper.title
                    ? htmlWrapper.title
                    : '';
                var styles = htmlWrapper.includeStyles
                    ? "<style>".concat(_this.getMathpixStyle(true), "</style>")
                    : '';
                var fonts = htmlWrapper.includeFonts
                    ? '<link rel="stylesheet" href="https://cdn.mathpix.com/fonts/cmu.css"/>'
                    : '';
                return (0, html_page_1.generateHtmlPage)(title, html, styles, fonts);
            }
            return (0, html_page_1.generateHtmlPage)('Title', html, '', '');
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
        this.getTocContainerHTML = function (html, onlyContent) {
            if (onlyContent === void 0) { onlyContent = true; }
            var parser = new DOMParser();
            var doc = parser.parseFromString(html, "text/html");
            var body = doc.body;
            var toc = body.getElementsByClassName('table-of-contents')[0];
            if (toc) {
                if (!onlyContent) {
                    return "<div id=\"toc_container\">" + toc.innerHTML + '</div>';
                }
                return toc.innerHTML;
            }
            else {
                return '';
            }
        };
        this.checkEquationNumber = function (html) {
            try {
                /** This feature is no longer needed.
                 We don't remove it to avoid bugs in applications where it might be called. */
                console.warn('Warning! This feature is deprecated. No need to use it anymore');
                return html;
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
        this.loadMathJax = function (notScrolling, setTextAlignJustify, isResetBodyStyles, maxWidth, scaleEquation) {
            if (notScrolling === void 0) { notScrolling = false; }
            if (setTextAlignJustify === void 0) { setTextAlignJustify = false; }
            if (isResetBodyStyles === void 0) { isResetBodyStyles = false; }
            if (maxWidth === void 0) { maxWidth = ''; }
            if (scaleEquation === void 0) { scaleEquation = true; }
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
                    style.innerHTML = bodyStyles
                        + (0, styles_1.MathpixStyle)(setTextAlignJustify, true, maxWidth, scaleEquation)
                        + styles_code_1.codeStyles
                        + (0, styles_tabular_1.tabularStyles)()
                        + styles_lists_1.listsStyles
                        + (0, styles_1.TocStyle)("toc")
                        + (0, styles_2.menuStyle)();
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
            try {
                var startTime = new Date().getTime();
                var mathString = _this.isCheckFormula ? _this.checkFormula(str, _this.showTimeLog) : str;
                options.lineNumbering = false;
                var html = _this.markdownToHTML(mathString, options);
                var endTime = new Date().getTime();
                if (_this.showTimeLog) {
                    console.log("===> setText: ".concat(endTime - startTime, "ms"));
                }
                return html;
            }
            catch (err) {
                console.error(err);
                return '';
            }
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
        this.getMathpixStyleOnly = function (scaleEquation) {
            if (scaleEquation === void 0) { scaleEquation = true; }
            var style = _this.getMathjaxStyle()
                + (0, styles_1.MathpixStyle)(false, true, '', scaleEquation)
                + styles_code_1.codeStyles
                + (0, styles_tabular_1.tabularStyles)()
                + styles_lists_1.listsStyles
                + (0, styles_2.menuStyle)();
            return style;
        };
        this.getMathpixStyle = function (stylePreview, showToc, tocContainerName, scaleEquation) {
            if (stylePreview === void 0) { stylePreview = false; }
            if (showToc === void 0) { showToc = false; }
            if (tocContainerName === void 0) { tocContainerName = 'toc'; }
            if (scaleEquation === void 0) { scaleEquation = true; }
            var style = (0, styles_container_1.ContainerStyle)() + _this.getMathjaxStyle() + (0, styles_1.MathpixStyle)(false, true, '', scaleEquation) + styles_code_1.codeStyles + (0, styles_tabular_1.tabularStyles)() + styles_lists_1.listsStyles;
            if (showToc) { }
            if (!stylePreview) {
                return style;
            }
            return showToc
                ? style + styles_1.PreviewStyle + (0, styles_1.TocStyle)(tocContainerName) + (0, styles_2.menuStyle)()
                : style + styles_1.PreviewStyle + (0, styles_2.menuStyle)();
        };
        this.getMathpixMarkdownStyles = function (useColors, scaleEquation) {
            if (useColors === void 0) { useColors = true; }
            if (scaleEquation === void 0) { scaleEquation = true; }
            var style = (0, styles_container_1.ContainerStyle)(useColors);
            style += _this.getMathjaxStyle();
            style += (0, styles_1.MathpixStyle)(false, useColors, '', scaleEquation = true);
            // style += codeStyles;
            style += (0, styles_tabular_1.tabularStyles)(useColors);
            style += styles_lists_1.listsStyles;
            return style;
        };
        this.getMathpixFontsStyle = function () {
            return styles_fonts_1.fontsStyles;
        };
        this.render = function (text, options) {
            var _a = options || {}, _b = _a.alignMathBlock, alignMathBlock = _b === void 0 ? 'center' : _b, _c = _a.display, display = _c === void 0 ? 'block' : _c, _d = _a.isCheckFormula, isCheckFormula = _d === void 0 ? false : _d, _e = _a.showTimeLog, showTimeLog = _e === void 0 ? false : _e, _f = _a.isDisableFancy, isDisableFancy = _f === void 0 ? false : _f, _g = _a.isDisableEmoji, isDisableEmoji = _g === void 0 ? false : _g, _h = _a.isDisableEmojiShortcuts, isDisableEmojiShortcuts = _h === void 0 ? false : _h, _j = _a.isDisableRefs, isDisableRefs = _j === void 0 ? false : _j, _k = _a.isDisableFootnotes, isDisableFootnotes = _k === void 0 ? false : _k, _l = _a.fontSize, fontSize = _l === void 0 ? null : _l, _m = _a.padding, padding = _m === void 0 ? null : _m, _o = _a.htmlTags, htmlTags = _o === void 0 ? false : _o, _p = _a.width, width = _p === void 0 ? 0 : _p, _q = _a.showToc, showToc = _q === void 0 ? false : _q, _r = _a.overflowY, overflowY = _r === void 0 ? 'unset' : _r, _s = _a.breaks, breaks = _s === void 0 ? true : _s, _t = _a.typographer, typographer = _t === void 0 ? true : _t, _u = _a.linkify, linkify = _u === void 0 ? true : _u, _v = _a.xhtmlOut, xhtmlOut = _v === void 0 ? false : _v, _w = _a.outMath, outMath = _w === void 0 ? {} : _w, _x = _a.mathJax, mathJax = _x === void 0 ? {} : _x, _y = _a.htmlSanitize, htmlSanitize = _y === void 0 ? {} : _y, _z = _a.smiles, smiles = _z === void 0 ? {} : _z, _0 = _a.openLinkInNewWindow, openLinkInNewWindow = _0 === void 0 ? true : _0, _1 = _a.maxWidth, maxWidth = _1 === void 0 ? '' : _1, _2 = _a.enableFileLinks, enableFileLinks = _2 === void 0 ? false : _2, _3 = _a.validateLink, validateLink = _3 === void 0 ? null : _3, _4 = _a.toc, toc = _4 === void 0 ? {} : _4, _5 = _a.accessibility, accessibility = _5 === void 0 ? null : _5, _6 = _a.nonumbers, nonumbers = _6 === void 0 ? false : _6, _7 = _a.showPageBreaks, showPageBreaks = _7 === void 0 ? false : _7, _8 = _a.centerImages, centerImages = _8 === void 0 ? true : _8, _9 = _a.centerTables, centerTables = _9 === void 0 ? true : _9, _10 = _a.enableCodeBlockRuleForLatexCommands, enableCodeBlockRuleForLatexCommands = _10 === void 0 ? false : _10, _11 = _a.addPositionsToTokens, addPositionsToTokens = _11 === void 0 ? false : _11, _12 = _a.highlights, highlights = _12 === void 0 ? [] : _12, _13 = _a.parserErrors, parserErrors = _13 === void 0 ? ParserErrors.show : _13, _14 = _a.codeHighlight, codeHighlight = _14 === void 0 ? {} : _14;
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
                isDisableEmoji: isDisableEmoji,
                isDisableEmojiShortcuts: isDisableEmojiShortcuts,
                isDisableRefs: isDisableRefs,
                isDisableFootnotes: isDisableFootnotes,
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
                openLinkInNewWindow: openLinkInNewWindow,
                maxWidth: maxWidth,
                enableFileLinks: enableFileLinks,
                validateLink: validateLink,
                toc: toc,
                accessibility: accessibility,
                nonumbers: nonumbers,
                showPageBreaks: showPageBreaks,
                centerImages: centerImages,
                centerTables: centerTables,
                enableCodeBlockRuleForLatexCommands: enableCodeBlockRuleForLatexCommands,
                addPositionsToTokens: addPositionsToTokens,
                highlights: highlights,
                parserErrors: parserErrors,
                codeHighlight: codeHighlight
            };
            var styleFontSize = fontSize ? " font-size: ".concat(options.fontSize, "px;") : '';
            var stylePadding = padding ? " padding-left: ".concat(options.padding, "px; padding-right: ").concat(options.padding, "px;") : '';
            var styleMaxWidth = maxWidth ? " max-width: ".concat(maxWidth, ";") : '';
            _this.setOptions(disableRules, isCheckFormula, showTimeLog);
            return ("<div id='preview' style='justify-content:".concat(alignMathBlock, ";overflow-y:").concat(overflowY, ";will-change:transform;'>\n                <div id='container-ruller'></div>\n                <div id='setText' style='display: ").concat(display, "; justify-content: inherit;").concat(styleFontSize).concat(stylePadding).concat(styleMaxWidth, "' >\n                    ").concat(_this.convertToHTML(text, markdownItOptions), "\n                </div>\n            </div>"));
        };
        this.mmdYamlToHTML = function (mmd, options, isAddYamlToHtml) {
            if (options === void 0) { options = {}; }
            if (isAddYamlToHtml === void 0) { isAddYamlToHtml = false; }
            try {
                mathjax_1.MathJax.Reset();
                var _a = options.isDisableFancy, isDisableFancy = _a === void 0 ? false : _a;
                var disableRules = isDisableFancy ? _this.disableFancyArrayDef : options ? options.disableRules || [] : [];
                _this.setOptions(disableRules);
                var _b = (0, yaml_parser_1.yamlParser)(mmd, isAddYamlToHtml), metadata = _b.metadata, content = _b.content, _c = _b.error, error = _c === void 0 ? '' : _c;
                var html = _this.render(content, options);
                if (html.indexOf('clickable-link') !== -1) {
                    html = _this.checkEquationNumber(html);
                }
                return {
                    html: html,
                    metadata: metadata,
                    content: content,
                    error: error
                };
            }
            catch (err) {
                console.log('ERROR => [mmdYamlToHTML] =>' + err);
                console.error(err);
                return null;
            }
        };
        this.renderTitleMmd = function (title, options, className, isOnlyInner) {
            if (options === void 0) { options = {}; }
            if (className === void 0) { className = 'article-title'; }
            if (isOnlyInner === void 0) { isOnlyInner = false; }
            try {
                if (!title) {
                    return '';
                }
                var htmlTitle = _this.markdownToHTML("\\title{".concat(title, "}"), options);
                var parser = new DOMParser();
                var doc = parser.parseFromString(htmlTitle, "text/html");
                var elTitle = doc.body.firstChild;
                if (isOnlyInner) {
                    return elTitle.innerHTML;
                }
                elTitle.classList.add(className);
                return elTitle.outerHTML;
            }
            catch (err) {
                console.error(err);
                return '';
            }
        };
        this.renderAuthorsMmd = function (authors, options, className, isOnlyInner) {
            if (options === void 0) { options = {}; }
            if (className === void 0) { className = 'article-author'; }
            if (isOnlyInner === void 0) { isOnlyInner = false; }
            try {
                if (!authors) {
                    return '';
                }
                ;
                var htmlAuthors = _this.markdownToHTML("\\author{".concat(authors, "}"), options);
                var parser = new DOMParser();
                var doc = parser.parseFromString(htmlAuthors, "text/html");
                var elAuthors = doc.body.firstChild;
                if (isOnlyInner) {
                    return elAuthors.innerHTML;
                }
                elAuthors.classList.add(className);
                return elAuthors.outerHTML;
            }
            catch (err) {
                console.error(err);
                return '';
            }
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