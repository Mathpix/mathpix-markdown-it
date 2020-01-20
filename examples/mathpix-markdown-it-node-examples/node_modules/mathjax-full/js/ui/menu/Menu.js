"use strict";
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
var mathjax_js_1 = require("../../mathjax.js");
var MathItem_js_1 = require("../../core/MathItem.js");
var Options_js_1 = require("../../util/Options.js");
var MJContextMenu_js_1 = require("./MJContextMenu.js");
var MmlVisitor_js_1 = require("./MmlVisitor.js");
var SelectableInfo_js_1 = require("./SelectableInfo.js");
var isMac = (typeof window !== 'undefined' &&
    window.navigator && window.navigator.platform.substr(0, 3) === 'Mac');
var Menu = (function () {
    function Menu(document, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.settings = null;
        this.defaultSettings = null;
        this.menu = null;
        this.MmlVisitor = new MmlVisitor_js_1.MmlVisitor();
        this.jax = {
            CHTML: null,
            SVG: null
        };
        this.rerenderStart = MathItem_js_1.STATE.LAST;
        this.about = new ContextMenu.Info('<b style="font-size:120%;">MathJax</b> v' + mathjax_js_1.mathjax.version, function () {
            var lines = [];
            lines.push('Input Jax: ' + _this.document.inputJax.map(function (jax) { return jax.name; }).join(', '));
            lines.push('Output Jax: ' + _this.document.outputJax.name);
            lines.push('Document Type: ' + _this.document.kind);
            return lines.join('<br/>');
        }, '<a href="https://www.mathjax.org">www.mathjax.org</a>');
        this.help = new ContextMenu.Info('<b>MathJax Help</b>', function () {
            return [
                '<p><b>MathJax</b> is a JavaScript library that allows page',
                ' authors to include mathematics within their web pages.',
                ' As a reader, you don\'t need to do anything to make that happen.</p>',
                '<p><b>Browsers</b>: MathJax works with all modern browsers including',
                ' Edge, Firefox, Chrome, Safari, Opera, and most mobile browsers.</p>',
                '<p><b>Math Menu</b>: MathJax adds a contextual menu to equations.',
                ' Right-click or CTRL-click on any mathematics to access the menu.</p>',
                '<div style="margin-left: 1em;">',
                '<p><b>Show Math As:</b> These options allow you to view the formula\'s',
                ' source markup (as MathML or in its original format).</p>',
                '<p><b>Copy to Clipboard:</b> These options copy the formula\'s source markup,',
                ' as MathML or in its original format, to the clipboard',
                ' (in browsers that support that).</p>',
                '<p><b>Math Settings:</b> These give you control over features of MathJax,',
                ' such the size of the mathematics, and the mechanism used',
                ' to display equations.</p>',
                '<p><b>Accessibility</b>: MathJax can work with screen',
                ' readers to make mathematics accessible to the visually impaired.',
                ' Turn on the explorer to enable generation of speech strings',
                ' and the ability to investigate expressions interactively.</p>',
                '<p><b>Language</b>: This menu lets you select the language used by MathJax',
                ' for its menus and warning messages. (Not yet implemented in version 3.)</p>',
                '</div>',
                '<p><b>Math Zoom</b>: If you are having difficulty reading an',
                ' equation, MathJax can enlarge it to help you see it better, or',
                ' you can scall all the math on the page to make it larger.',
                ' Turn these features on in the <b>Math Settings</b> menu.</p>',
                '<p><b>Preferences</b>: MathJax uses your browser\'s localStorage database',
                ' to save the preferences set via this menu locally in your browser.  These',
                ' are not used to track you, and are not transferred or used remotely by',
                ' MathJax in any way.</p>'
            ].join('\n');
        }, '<a href="https://www.mathjax.org">www.mathjax.org</a>');
        this.mathmlCode = new SelectableInfo_js_1.SelectableInfo('MathJax MathML Expression', function () {
            if (!_this.menu.mathItem)
                return '';
            var text = _this.toMML(_this.menu.mathItem);
            return '<pre>' + _this.formatSource(text) + '</pre>';
        }, '');
        this.originalText = new SelectableInfo_js_1.SelectableInfo('MathJax Original Source', function () {
            if (!_this.menu.mathItem)
                return '';
            var text = _this.menu.mathItem.math;
            return '<pre style="font-size:125%; margin:0">' + _this.formatSource(text) + '</pre>';
        }, '');
        this.annotationText = new SelectableInfo_js_1.SelectableInfo('MathJax Annotation Text', function () {
            if (!_this.menu.mathItem)
                return '';
            var text = _this.menu.annotation;
            return '<pre style="font-size:125%; margin:0">' + _this.formatSource(text) + '</pre>';
        }, '');
        this.zoomBox = new ContextMenu.Info('MathJax Zoomed Expression', function () {
            if (!_this.menu.mathItem)
                return '';
            var element = _this.menu.mathItem.typesetRoot.cloneNode(true);
            element.style.margin = '0';
            var scale = 1.25 * parseFloat(_this.settings.zscale);
            return '<div style="font-size: ' + scale + '%">' + element.outerHTML + '</div>';
        }, '');
        this.document = document;
        this.options = Options_js_1.userOptions(Options_js_1.defaultOptions({}, this.constructor.OPTIONS), options);
        this.initSettings();
        this.mergeUserSettings();
        this.initMenu();
    }
    Object.defineProperty(Menu.prototype, "isLoading", {
        get: function () {
            return Menu.loading > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Menu.prototype, "loadingPromise", {
        get: function () {
            if (!this.isLoading) {
                return Promise.resolve();
            }
            if (!Menu._loadingPromise) {
                Menu._loadingPromise = new Promise(function (ok, failed) {
                    Menu._loadingOK = ok;
                    Menu._loadingFailed = failed;
                });
            }
            return Menu._loadingPromise;
        },
        enumerable: true,
        configurable: true
    });
    Menu.prototype.initSettings = function () {
        this.settings = this.options.settings;
        this.jax = this.options.jax;
        var jax = this.document.outputJax;
        this.jax[jax.name] = jax;
        this.settings.renderer = jax.name;
        if (window.MathJax._.a11y && window.MathJax._.a11y.explorer) {
            Object.assign(this.settings, this.document.options.a11y);
        }
        this.settings.scale = jax.options.scale;
        this.defaultSettings = Object.assign({}, this.settings);
    };
    Menu.prototype.initMenu = function () {
        var _this = this;
        this.menu = MJContextMenu_js_1.MJContextMenu.parse({
            menu: {
                id: 'MathJax_Menu',
                pool: [
                    this.variable('texHints'),
                    this.variable('semantics'),
                    this.variable('zoom'),
                    this.variable('zscale'),
                    this.variable('renderer', function (jax) { return _this.setRenderer(jax); }),
                    this.variable('alt'),
                    this.variable('cmd'),
                    this.variable('ctrl'),
                    this.variable('shift'),
                    this.variable('scale', function (scale) { return _this.setScale(scale); }),
                    this.variable('explorer', function (explore) { return _this.setExplorer(explore); }),
                    this.a11yVar('highlight'),
                    this.a11yVar('backgroundColor'),
                    this.a11yVar('foregroundColor'),
                    this.a11yVar('speech'),
                    this.a11yVar('subtitles'),
                    this.a11yVar('braille'),
                    this.a11yVar('viewBraille'),
                    this.a11yVar('speechRules'),
                    this.a11yVar('magnification'),
                    this.a11yVar('magnify'),
                    this.a11yVar('treeColoring'),
                    this.a11yVar('infoType'),
                    this.a11yVar('infoRole'),
                    this.a11yVar('infoPrefix'),
                    this.variable('autocollapse'),
                    this.variable('collapsible', function (collapse) { return _this.setCollapsible(collapse); }),
                    this.variable('inTabOrder', function (tab) { return _this.setTabOrder(tab); })
                ],
                items: [
                    this.submenu('Show', 'Show Math As', [
                        this.command('MathMLcode', 'MathML Code', function () { return _this.mathmlCode.post(); }),
                        this.command('Original', 'Original Form', function () { return _this.originalText.post(); }),
                        this.submenu('Annotation', 'Annotation')
                    ]),
                    this.submenu('Copy', 'Copy to Clipboard', [
                        this.command('MathMLcode', 'MathML Code', function () { return _this.copyMathML(); }),
                        this.command('Original', 'Original Form', function () { return _this.copyOriginal(); }),
                        this.submenu('Annotation', 'Annotation')
                    ]),
                    this.rule(),
                    this.submenu('Settings', 'Math Settings', [
                        this.submenu('Renderer', 'Math Renderer', this.radioGroup('renderer', [['CHTML'], ['SVG']])),
                        this.rule(),
                        this.submenu('ZoomTrigger', 'Zoom Trigger', [
                            this.command('ZoomNow', 'Zoom Once Now', function () { return _this.zoom(null, '', _this.menu.mathItem); }),
                            this.rule(),
                            this.radioGroup('zoom', [
                                ['Click'], ['DoubleClick', 'Double-Click'], ['NoZoom', 'No Zoom']
                            ]),
                            this.rule(),
                            this.label('TriggerRequires', 'Trigger Requires:'),
                            this.checkbox((isMac ? 'Option' : 'Alt'), (isMac ? 'Option' : 'Alt'), 'alt'),
                            this.checkbox('Command', 'Command', 'cmd', { hidden: !isMac }),
                            this.checkbox('Control', 'Control', 'ctrl', { hiddne: isMac }),
                            this.checkbox('Shift', 'Shift', 'shift')
                        ]),
                        this.submenu('ZoomFactor', 'Zoom Factor', this.radioGroup('zscale', [
                            ['150%'], ['175%'], ['200%'], ['250%'], ['300%'], ['400%']
                        ])),
                        this.rule(),
                        this.command('Scale', 'Scale All Math...', function () { return _this.scaleAllMath(); }),
                        this.rule(),
                        this.checkbox('texHints', 'Add TeX hints to MathML', 'texHints'),
                        this.checkbox('semantics', 'Add original as annotation', 'semantics'),
                        this.rule(),
                        this.command('Reset', 'Reset to defaults', function () { return _this.resetDefaults(); })
                    ]),
                    this.submenu('Accessibility', 'Accessibility', [
                        this.checkbox('Activate', 'Activate', 'explorer'),
                        this.submenu('Speech', 'Speech', [
                            this.checkbox('Speech', 'Speech Output', 'speech'),
                            this.checkbox('Subtitles', 'Speech Subtities', 'subtitles'),
                            this.checkbox('Braille', 'Braille Output', 'braille'),
                            this.checkbox('View Braille', 'Braille Subtitles', 'viewBraille'),
                            this.rule(),
                            this.submenu('Mathspeak', 'Mathspeak Rules', this.radioGroup('speechRules', [
                                ['mathspeak-default', 'Verbose'],
                                ['mathspeak-brief', 'Brief'],
                                ['mathspeak-sbrief', 'Superbrief']
                            ])),
                            this.submenu('Clearspeak', 'Clearspeak Rules', this.radioGroup('speechRules', [
                                ['clearspeak-default', 'Auto']
                            ])),
                            this.submenu('ChromeVox', 'ChromeVox Rules', this.radioGroup('speechRules', [
                                ['default-default', 'Verbose'],
                                ['default-short', 'Short'],
                                ['default-alternative', 'Alternative']
                            ]))
                        ]),
                        this.submenu('Highlight', 'Highlight', [
                            this.submenu('Background', 'Background', this.radioGroup('backgroundColor', [
                                ['Blue'], ['Red'], ['Green'], ['Yellow'], ['Cyan'], ['Magenta'], ['White'], ['Black']
                            ])),
                            this.submenu('Foreground', 'Foreground', this.radioGroup('foregroundColor', [
                                ['Black'], ['White'], ['Magenta'], ['Cyan'], ['Yellow'], ['Green'], ['Red'], ['Blue']
                            ])),
                            this.rule(),
                            this.radioGroup('highlight', [
                                ['None'], ['Hover'], ['Flame']
                            ]),
                            this.rule(),
                            this.checkbox('TreeColoring', 'Tree Coloring', 'treeColoring')
                        ]),
                        this.submenu('Magnification', 'Magnification', [
                            this.radioGroup('magnification', [
                                ['None'], ['Keyboard'], ['Mouse']
                            ]),
                            this.rule(),
                            this.radioGroup('magnify', [
                                ['200%'], ['300%'], ['400%'], ['500%']
                            ])
                        ]),
                        this.submenu('Semantic Info', 'Semantic Info', [
                            this.checkbox('Type', 'Type', 'infoType'),
                            this.checkbox('Role', 'Role', 'infoRole'),
                            this.checkbox('Prefix', 'Prefix', 'infoPrefix')
                        ], true),
                        this.rule(),
                        this.checkbox('Collapsible', 'Collapsible Math', 'collapsible'),
                        this.checkbox('AutoCollapse', 'Auto Collapse', 'autocollapse', { disabled: true }),
                        this.rule(),
                        this.checkbox('InTabOrder', 'Include in Tab Order', 'inTabOrder')
                    ]),
                    this.submenu('Language', 'Language'),
                    this.rule(),
                    this.command('About', 'About MathJax', function () { return _this.about.post(); }),
                    this.command('Help', 'MathJax Help', function () { return _this.help.post(); })
                ]
            }
        });
        var menu = this.menu;
        this.about.attachMenu(menu);
        this.help.attachMenu(menu);
        this.originalText.attachMenu(menu);
        this.annotationText.attachMenu(menu);
        this.mathmlCode.attachMenu(menu);
        this.zoomBox.attachMenu(menu);
        this.checkLoadableItems();
        this.enableExplorerItems(this.settings.explorer);
        menu.showAnnotation = this.annotationText;
        menu.copyAnnotation = this.copyAnnotation.bind(this);
        menu.annotationTypes = this.options.annotationTypes;
        ContextMenu.CssStyles.addInfoStyles(this.document.document);
        ContextMenu.CssStyles.addMenuStyles(this.document.document);
    };
    Menu.prototype.checkLoadableItems = function () {
        var e_1, _a;
        var MathJax = window.MathJax;
        if (MathJax && MathJax._ && MathJax.loader && MathJax.startup) {
            if (this.settings.collapsible && (!MathJax._.a11y || !MathJax._.a11y.complexity)) {
                this.loadA11y('complexity');
            }
            if (this.settings.explorer && (!MathJax._.a11y || !MathJax._.a11y.explorer)) {
                this.loadA11y('explorer');
            }
        }
        else {
            var menu = this.menu;
            try {
                for (var _b = __values(Object.keys(this.jax)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_1 = _c.value;
                    if (!this.jax[name_1]) {
                        menu.findID('Settings', 'Renderer', name_1).disable();
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            menu.findID('Accessibility', 'Explorer').disable();
            menu.findID('Accessibility', 'AutoCollapse').disable();
            menu.findID('Accessibility', 'Collapsible').disable();
        }
    };
    Menu.prototype.enableExplorerItems = function (enable) {
        var e_2, _a;
        var menu = this.menu.findID('Accessibility', 'Activate').getMenu();
        try {
            for (var _b = __values(menu.getItems().slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item instanceof ContextMenu.Rule)
                    break;
                enable ? item.enable() : item.disable();
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Menu.prototype.mergeUserSettings = function () {
        try {
            var settings = localStorage.getItem(Menu.MENU_STORAGE);
            if (!settings)
                return;
            Object.assign(this.settings, JSON.parse(settings));
            this.setA11y(this.settings);
        }
        catch (err) {
            console.log('MathJax localStorage error: ' + err.message);
        }
    };
    Menu.prototype.saveUserSettings = function () {
        var e_3, _a;
        var settings = {};
        try {
            for (var _b = __values(Object.keys(this.settings)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_2 = _c.value;
                if (this.settings[name_2] !== this.defaultSettings[name_2]) {
                    settings[name_2] = this.settings[name_2];
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            if (Object.keys(settings).length) {
                localStorage.setItem(Menu.MENU_STORAGE, JSON.stringify(settings));
            }
            else {
                localStorage.removeItem(Menu.MENU_STORAGE);
            }
        }
        catch (err) {
            console.log('MathJax localStorage error: ' + err.message);
        }
    };
    Menu.prototype.setA11y = function (options) {
        if (window.MathJax._.a11y && window.MathJax._.a11y.explorer) {
            window.MathJax._.a11y.explorer_ts.setA11yOptions(this.document, options);
        }
    };
    Menu.prototype.getA11y = function (options) {
        if (window.MathJax._.a11y && window.MathJax._.a11y.explorer) {
            return this.document.options.a11y[options];
        }
    };
    Menu.prototype.setScale = function (scale) {
        this.document.outputJax.options.scale = parseFloat(scale);
        this.document.rerender();
    };
    Menu.prototype.setRenderer = function (jax) {
        var _this = this;
        if (this.jax[jax]) {
            this.setOutputJax(jax);
        }
        else {
            var name_3 = jax.toLowerCase();
            this.loadComponent('output/' + name_3, function () {
                var startup = window.MathJax.startup;
                if (name_3 in startup.constructors) {
                    startup.useOutput(name_3, true);
                    startup.output = startup.getOutputJax();
                    _this.jax[jax] = startup.output;
                    _this.setOutputJax(jax);
                }
            });
        }
    };
    Menu.prototype.setOutputJax = function (jax) {
        this.jax[jax].setAdaptor(this.document.adaptor);
        this.document.outputJax = this.jax[jax];
        this.rerender();
    };
    Menu.prototype.setTabOrder = function (tab) {
        this.menu.getStore().inTaborder(tab);
    };
    Menu.prototype.setExplorer = function (explore) {
        this.enableExplorerItems(explore);
        if (!explore || (window.MathJax._.a11y && window.MathJax._.a11y.explorer)) {
            this.rerender(this.settings.collapsible ? MathItem_js_1.STATE.RERENDER : MathItem_js_1.STATE.COMPILED);
        }
        else {
            this.loadA11y('explorer');
        }
    };
    Menu.prototype.setCollapsible = function (collapse) {
        if (!collapse || (window.MathJax._.a11y && window.MathJax._.a11y.complexity)) {
            this.rerender(MathItem_js_1.STATE.COMPILED);
        }
        else {
            this.loadA11y('complexity');
        }
    };
    Menu.prototype.scaleAllMath = function () {
        var scale = (parseFloat(this.settings.scale) * 100).toFixed(1).replace(/.0$/, '');
        var percent = prompt('Scale all mathematics (compared to surrounding text) by', scale + '%');
        if (percent) {
            if (percent.match(/^\s*\d+(\.\d*)?\s*%?\s*$/)) {
                var scale_1 = parseFloat(percent) / 100;
                if (scale_1) {
                    this.setScale(String(scale_1));
                }
                else {
                    alert('The scale should not be zero');
                }
            }
            else {
                alert('The scale should be a percentage (e.g., 120%)');
            }
        }
    };
    Menu.prototype.resetDefaults = function () {
        var e_4, _a;
        Menu.loading++;
        var pool = this.menu.getPool();
        var settings = this.defaultSettings;
        try {
            for (var _b = __values(Object.keys(this.settings)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_4 = _c.value;
                var variable = pool.lookup(name_4);
                if (variable) {
                    variable.setValue(settings[name_4]);
                    var item = variable.items[0];
                    if (item) {
                        item.executeCallbacks_();
                    }
                }
                else {
                    this.settings[name_4] = settings[name_4];
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        Menu.loading--;
        this.rerender(MathItem_js_1.STATE.COMPILED);
    };
    Menu.prototype.checkComponent = function (name) {
        var promise = Menu.loadingPromises.get(name);
        if (promise) {
            mathjax_js_1.mathjax.retryAfter(promise);
        }
    };
    Menu.prototype.loadComponent = function (name, callback) {
        if (Menu.loadingPromises.has(name))
            return;
        var loader = window.MathJax.loader;
        if (!loader)
            return;
        Menu.loading++;
        var promise = loader.load(name).then(function () {
            Menu.loading--;
            Menu.loadingPromises.delete(name);
            callback();
            if (Menu.loading === 0 && Menu._loadingPromise) {
                Menu._loadingPromise = null;
                Menu._loadingOK();
            }
        }).catch(function (err) {
            if (Menu._loadingPromise) {
                Menu._loadingPromise = null;
                Menu._loadingFailed(err);
            }
            else {
                console.log(err);
            }
        });
        Menu.loadingPromises.set(name, promise);
    };
    Menu.prototype.loadA11y = function (component) {
        var _this = this;
        var noEnrich = !MathItem_js_1.STATE.ENRICHED;
        this.loadComponent('a11y/' + component, function () {
            var startup = window.MathJax.startup;
            mathjax_js_1.mathjax.handlers.unregister(startup.handler);
            startup.handler = startup.getHandler();
            mathjax_js_1.mathjax.handlers.register(startup.handler);
            var document = _this.document;
            _this.document = startup.document = startup.getDocument();
            _this.document.menu = _this;
            _this.transferMathList(document);
            if (!Menu._loadingPromise) {
                _this.rerender(component === 'complexity' || noEnrich ? MathItem_js_1.STATE.COMPILED : MathItem_js_1.STATE.TYPESET);
            }
        });
    };
    Menu.prototype.transferMathList = function (document) {
        var e_5, _a;
        var MathItem = this.document.options.MathItem;
        try {
            for (var _b = __values(document.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                var math = new MathItem();
                Object.assign(math, item);
                this.document.math.push(math);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    Menu.prototype.formatSource = function (text) {
        return text.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };
    Menu.prototype.toMML = function (math) {
        return this.MmlVisitor.visitTree(math.root, math, {
            texHints: this.settings.texHints,
            semantics: (this.settings.semantics && math.inputJax.name !== 'MathML')
        });
    };
    Menu.prototype.zoom = function (event, type, math) {
        if (!event || this.isZoomEvent(event, type)) {
            this.menu.mathItem = math;
            if (event) {
                this.menu.post(event);
            }
            this.zoomBox.post();
        }
    };
    Menu.prototype.isZoomEvent = function (event, zoom) {
        return (this.settings.zoom === zoom &&
            (!this.settings.alt || event.altKey) &&
            (!this.settings.ctrl || event.ctrlKey) &&
            (!this.settings.cmd || event.metaKey) &&
            (!this.settings.shift || event.shiftKey));
    };
    Menu.prototype.rerender = function (start) {
        if (start === void 0) { start = MathItem_js_1.STATE.TYPESET; }
        this.rerenderStart = Math.min(start, this.rerenderStart);
        if (!Menu.loading) {
            this.document.rerender(this.rerenderStart);
            this.rerenderStart = MathItem_js_1.STATE.LAST;
        }
    };
    Menu.prototype.copyMathML = function () {
        this.copyToClipboard(this.toMML(this.menu.mathItem));
    };
    Menu.prototype.copyOriginal = function () {
        this.copyToClipboard(this.menu.mathItem.math);
    };
    Menu.prototype.copyAnnotation = function () {
        this.copyToClipboard(this.menu.annotation);
    };
    Menu.prototype.copyToClipboard = function (text) {
        var input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.cssText = 'height: 1px; width: 1px; padding: 1px; position: absolute; left: -10px';
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
        }
        catch (error) {
            alert('Can\'t copy to clipboard: ' + error.message);
        }
        document.body.removeChild(input);
    };
    Menu.prototype.addMenu = function (math) {
        var _this = this;
        var element = math.typesetRoot;
        element.addEventListener('contextmenu', function () { return _this.menu.mathItem = math; }, true);
        element.addEventListener('keydown', function () { return _this.menu.mathItem = math; }, true);
        element.addEventListener('click', function (event) { return _this.zoom(event, 'Click', math); }, true);
        element.addEventListener('dblclick', function (event) { return _this.zoom(event, 'DoubleClick', math); }, true);
        this.menu.getStore().insert(element);
    };
    Menu.prototype.clear = function () {
        this.menu.getStore().clear();
    };
    Menu.prototype.variable = function (name, action) {
        var _this = this;
        return {
            name: name,
            getter: function () { return _this.settings[name]; },
            setter: function (value) {
                _this.settings[name] = value;
                action && action(value);
                _this.saveUserSettings();
            }
        };
    };
    Menu.prototype.a11yVar = function (name) {
        var _this = this;
        return {
            name: name,
            getter: function () { return _this.getA11y(name); },
            setter: function (value) {
                _this.settings[name] = value;
                var options = {};
                options[name] = value;
                _this.setA11y(options);
                _this.saveUserSettings();
            }
        };
    };
    Menu.prototype.submenu = function (id, content, entries, disabled) {
        var e_6, _a;
        if (entries === void 0) { entries = []; }
        if (disabled === void 0) { disabled = false; }
        var items = [];
        try {
            for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                var entry = entries_1_1.value;
                if (Array.isArray(entry)) {
                    items = items.concat(entry);
                }
                else {
                    items.push(entry);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return { type: 'submenu', id: id, content: content, menu: { items: items }, disabled: (items.length === 0) || disabled };
    };
    Menu.prototype.command = function (id, content, action, other) {
        if (other === void 0) { other = {}; }
        return Object.assign({ type: 'command', id: id, content: content, action: action }, other);
    };
    Menu.prototype.checkbox = function (id, content, variable, other) {
        if (other === void 0) { other = {}; }
        return Object.assign({ type: 'checkbox', id: id, content: content, variable: variable }, other);
    };
    Menu.prototype.radioGroup = function (variable, radios) {
        var _this = this;
        return radios.map(function (def) { return _this.radio(def[0], def[1] || def[0], variable); });
    };
    Menu.prototype.radio = function (id, content, variable, other) {
        if (other === void 0) { other = {}; }
        return Object.assign({ type: 'radio', id: id, content: content, variable: variable }, other);
    };
    Menu.prototype.label = function (id, content) {
        return { type: 'label', id: id, content: content };
    };
    Menu.prototype.rule = function () {
        return { type: 'rule' };
    };
    Menu.MENU_STORAGE = 'MathJax-Menu-Settings';
    Menu.OPTIONS = {
        settings: {
            texHints: true,
            semantics: false,
            zoom: 'NoZoom',
            zscale: '200%',
            renderer: 'CHTML',
            alt: false,
            cmd: false,
            ctrl: false,
            shift: false,
            scale: 1,
            autocollapse: false,
            collapsible: false,
            inTabOrder: true,
            explorer: false
        },
        jax: {
            CHTML: null,
            SVG: null
        },
        annotationTypes: Options_js_1.expandable({
            TeX: ['TeX', 'LaTeX', 'application/x-tex'],
            StarMath: ['StarMath 5.0'],
            Maple: ['Maple'],
            ContentMathML: ['MathML-Content', 'application/mathml-content+xml'],
            OpenMath: ['OpenMath']
        })
    };
    Menu.loading = 0;
    Menu.loadingPromises = new Map();
    Menu._loadingPromise = null;
    Menu._loadingOK = null;
    Menu._loadingFailed = null;
    return Menu;
}());
exports.Menu = Menu;
//# sourceMappingURL=Menu.js.map