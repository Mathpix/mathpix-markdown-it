var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var htmlparser = require('htmlparser2');
var escapeStringRegexp = require('escape-string-regexp');
var isPlainObject = require('is-plain-object').isPlainObject;
var deepmerge = require('deepmerge');
var parseSrcset = require('parse-srcset');
var postcssParse = require('postcss').parse;
// Tags that can conceivably represent stand-alone media.
var mediaTags = [
    'img', 'audio', 'video', 'picture', 'svg',
    'object', 'map', 'iframe', 'embed'
];
// Tags that are inherently vulnerable to being used in XSS attacks.
var vulnerableTags = ['script', 'style'];
function each(obj, cb) {
    if (obj) {
        Object.keys(obj).forEach(function (key) {
            cb(obj[key], key);
        });
    }
}
// Avoid false positives with .__proto__, .hasOwnProperty, etc.
function has(obj, key) {
    return ({}).hasOwnProperty.call(obj, key);
}
// Returns those elements of `a` for which `cb(a)` returns truthy
function filter(a, cb) {
    var n = [];
    each(a, function (v) {
        if (cb(v)) {
            n.push(v);
        }
    });
    return n;
}
function isEmptyObject(obj) {
    for (var key in obj) {
        if (has(obj, key)) {
            return false;
        }
    }
    return true;
}
function stringifySrcset(parsedSrcset) {
    return parsedSrcset.map(function (part) {
        if (!part.url) {
            throw new Error('URL missing');
        }
        return (part.url +
            (part.w ? " ".concat(part.w, "w") : '') +
            (part.h ? " ".concat(part.h, "h") : '') +
            (part.d ? " ".concat(part.d, "x") : ''));
    }).join(', ');
}
module.exports = sanitizeHtml;
// A valid attribute name.
// We use a tolerant definition based on the set of strings defined by
// html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state
// and html.spec.whatwg.org/multipage/parsing.html#attribute-name-state .
// The characters accepted are ones which can be appended to the attribute
// name buffer without triggering a parse error:
//   * unexpected-equals-sign-before-attribute-name
//   * unexpected-null-character
//   * unexpected-character-in-attribute-name
// We exclude the empty string because it's impossible to get to the after
// attribute name state with an empty attribute name buffer.
var VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;
// Ignore the _recursing flag; it's there for recursive
// invocation as a guard against this exploit:
// https://github.com/fb55/htmlparser2/issues/105
function sanitizeHtml(html, options, _recursing) {
    if (html == null) {
        return '';
    }
    var result = '';
    // Used for hot swapping the result variable with an empty string in order to "capture" the text written to it.
    var tempResult = '';
    function Frame(tag, attribs) {
        var that = this;
        this.tag = tag;
        this.attribs = attribs || {};
        this.tagPosition = result.length;
        this.text = ''; // Node inner text
        this.mediaChildren = [];
        this.updateParentNodeText = function () {
            if (stack.length) {
                var parentFrame = stack[stack.length - 1];
                parentFrame.text += that.text;
            }
        };
        this.updateParentNodeMediaChildren = function () {
            if (stack.length && mediaTags.includes(this.tag)) {
                var parentFrame = stack[stack.length - 1];
                parentFrame.mediaChildren.push(this.tag);
            }
        };
    }
    options = Object.assign({}, sanitizeHtml.defaults, options);
    options.parser = Object.assign({}, htmlParserDefaults, options.parser);
    // vulnerableTags
    vulnerableTags.forEach(function (tag) {
        if (options.allowedTags && options.allowedTags.indexOf(tag) > -1 &&
            !options.allowVulnerableTags) {
            console.warn("\n\n\u26A0\uFE0F Your `allowedTags` option includes, `".concat(tag, "`, which is inherently\nvulnerable to XSS attacks. Please remove it from `allowedTags`.\nOr, to disable this warning, add the `allowVulnerableTags` option\nand ensure you are accounting for this risk.\n\n"));
        }
    });
    // Tags that contain something other than HTML, or where discarding
    // the text when the tag is disallowed makes sense for other reasons.
    // If we are not allowing these tags, we should drop their content too.
    // For other tags you would drop the tag but keep its content.
    var nonTextTagsArray = options.nonTextTags || [
        'script',
        'style',
        'textarea',
        'option'
    ];
    var allowedAttributesMap;
    var allowedAttributesGlobMap;
    if (options.allowedAttributes) {
        allowedAttributesMap = {};
        allowedAttributesGlobMap = {};
        each(options.allowedAttributes, function (attributes, tag) {
            allowedAttributesMap[tag] = [];
            var globRegex = [];
            attributes.forEach(function (obj) {
                if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
                    globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
                }
                else {
                    allowedAttributesMap[tag].push(obj);
                }
            });
            if (globRegex.length) {
                allowedAttributesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
            }
        });
    }
    var allowedClassesMap = {};
    var allowedClassesGlobMap = {};
    var allowedClassesRegexMap = {};
    each(options.allowedClasses, function (classes, tag) {
        // Implicitly allows the class attribute
        if (allowedAttributesMap) {
            if (!has(allowedAttributesMap, tag)) {
                allowedAttributesMap[tag] = [];
            }
            allowedAttributesMap[tag].push('class');
        }
        allowedClassesMap[tag] = [];
        allowedClassesRegexMap[tag] = [];
        var globRegex = [];
        classes.forEach(function (obj) {
            if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
                globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
            }
            else if (obj instanceof RegExp) {
                allowedClassesRegexMap[tag].push(obj);
            }
            else {
                allowedClassesMap[tag].push(obj);
            }
        });
        if (globRegex.length) {
            allowedClassesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
        }
    });
    var transformTagsMap = {};
    var transformTagsAll;
    each(options.transformTags, function (transform, tag) {
        var transFun;
        if (typeof transform === 'function') {
            transFun = transform;
        }
        else if (typeof transform === 'string') {
            transFun = sanitizeHtml.simpleTransform(transform);
        }
        if (tag === '*') {
            transformTagsAll = transFun;
        }
        else {
            transformTagsMap[tag] = transFun;
        }
    });
    var depth;
    var stack;
    var skipMap;
    var transformMap;
    var skipText;
    var skipTextDepth;
    var addedText = false;
    initializeState();
    var parser = new htmlparser.Parser({
        onopentag: function (name, attribs) {
            // If `enforceHtmlBoundary` is `true` and this has found the opening
            // `html` tag, reset the state.
            if (options.enforceHtmlBoundary && name === 'html') {
                initializeState();
            }
            if (skipText) {
                skipTextDepth++;
                return;
            }
            var frame = new Frame(name, attribs);
            stack.push(frame);
            var skip = false;
            var hasText = !!frame.text;
            var transformedTag;
            if (has(transformTagsMap, name)) {
                transformedTag = transformTagsMap[name](name, attribs);
                frame.attribs = attribs = transformedTag.attribs;
                if (transformedTag.text !== undefined) {
                    frame.innerText = transformedTag.text;
                }
                if (name !== transformedTag.tagName) {
                    frame.name = name = transformedTag.tagName;
                    transformMap[depth] = transformedTag.tagName;
                }
            }
            if (transformTagsAll) {
                transformedTag = transformTagsAll(name, attribs);
                frame.attribs = attribs = transformedTag.attribs;
                if (name !== transformedTag.tagName) {
                    frame.name = name = transformedTag.tagName;
                    transformMap[depth] = transformedTag.tagName;
                }
            }
            if ((options.allowedTags && options.allowedTags.indexOf(name) === -1) || (options.disallowedTagsMode === 'recursiveEscape' && !isEmptyObject(skipMap)) || (options.nestingLimit != null && depth >= options.nestingLimit)) {
                skip = true;
                skipMap[depth] = true;
                if (options.disallowedTagsMode === 'discard') {
                    if (nonTextTagsArray.indexOf(name) !== -1) {
                        skipText = true;
                        skipTextDepth = 1;
                    }
                }
                skipMap[depth] = true;
            }
            depth++;
            if (skip) {
                if (options.disallowedTagsMode === 'discard') {
                    // We want the contents but not this tag
                    return;
                }
                tempResult = result;
                result = '';
            }
            result += '<' + name;
            if (name === 'script') {
                if (options.allowedScriptHostnames || options.allowedScriptDomains) {
                    frame.innerText = '';
                }
            }
            if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap['*']) {
                each(attribs, function (value, a) {
                    var e_1, _a, e_2, _b;
                    if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
                        // This prevents part of an attribute name in the output from being
                        // interpreted as the end of an attribute, or end of a tag.
                        delete frame.attribs[a];
                        return;
                    }
                    var parsed;
                    // check allowedAttributesMap for the element and attribute and modify the value
                    // as necessary if there are specific values defined.
                    var passedAllowedAttributesMapCheck = false;
                    if (!allowedAttributesMap ||
                        (has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1) ||
                        (allowedAttributesMap['*'] && allowedAttributesMap['*'].indexOf(a) !== -1) ||
                        (has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a)) ||
                        (allowedAttributesGlobMap['*'] && allowedAttributesGlobMap['*'].test(a))) {
                        passedAllowedAttributesMapCheck = true;
                    }
                    else if (allowedAttributesMap && allowedAttributesMap[name]) {
                        try {
                            for (var _c = __values(allowedAttributesMap[name]), _d = _c.next(); !_d.done; _d = _c.next()) {
                                var o = _d.value;
                                if (isPlainObject(o) && o.name && (o.name === a)) {
                                    passedAllowedAttributesMapCheck = true;
                                    var newValue = '';
                                    if (o.multiple === true) {
                                        // verify the values that are allowed
                                        var splitStrArray = value.split(' ');
                                        try {
                                            for (var splitStrArray_1 = (e_2 = void 0, __values(splitStrArray)), splitStrArray_1_1 = splitStrArray_1.next(); !splitStrArray_1_1.done; splitStrArray_1_1 = splitStrArray_1.next()) {
                                                var s = splitStrArray_1_1.value;
                                                if (o.values.indexOf(s) !== -1) {
                                                    if (newValue === '') {
                                                        newValue = s;
                                                    }
                                                    else {
                                                        newValue += ' ' + s;
                                                    }
                                                }
                                            }
                                        }
                                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                        finally {
                                            try {
                                                if (splitStrArray_1_1 && !splitStrArray_1_1.done && (_b = splitStrArray_1.return)) _b.call(splitStrArray_1);
                                            }
                                            finally { if (e_2) throw e_2.error; }
                                        }
                                    }
                                    else if (o.values.indexOf(value) >= 0) {
                                        // verified an allowed value matches the entire attribute value
                                        newValue = value;
                                    }
                                    value = newValue;
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    if (passedAllowedAttributesMapCheck) {
                        if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
                            if (naughtyHref(name, value)) {
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        if (name === 'script' && a === 'src') {
                            var allowed = true;
                            try {
                                var parsed_1 = new URL(value);
                                if (options.allowedScriptHostnames || options.allowedScriptDomains) {
                                    var allowedHostname = (options.allowedScriptHostnames || []).find(function (hostname) {
                                        return hostname === parsed_1.hostname;
                                    });
                                    var allowedDomain = (options.allowedScriptDomains || []).find(function (domain) {
                                        return parsed_1.hostname === domain || parsed_1.hostname.endsWith(".".concat(domain));
                                    });
                                    allowed = allowedHostname || allowedDomain;
                                }
                            }
                            catch (e) {
                                allowed = false;
                            }
                            if (!allowed) {
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        if (name === 'iframe' && a === 'src') {
                            var allowed = true;
                            try {
                                // Chrome accepts \ as a substitute for / in the // at the
                                // start of a URL, so rewrite accordingly to prevent exploit.
                                // Also drop any whitespace at that point in the URL
                                value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, '$1//');
                                if (value.startsWith('relative:')) {
                                    // An attempt to exploit our workaround for base URLs being
                                    // mandatory for relative URL validation in the WHATWG
                                    // URL parser, reject it
                                    throw new Error('relative: exploit attempt');
                                }
                                // naughtyHref is in charge of whether protocol relative URLs
                                // are cool. Here we are concerned just with allowed hostnames and
                                // whether to allow relative URLs.
                                //
                                // Build a placeholder "base URL" against which any reasonable
                                // relative URL may be parsed successfully
                                var base = 'relative://relative-site';
                                for (var i = 0; (i < 100); i++) {
                                    base += "/".concat(i);
                                }
                                var parsed_2 = new URL(value, base);
                                var isRelativeUrl = parsed_2 && parsed_2.hostname === 'relative-site' && parsed_2.protocol === 'relative:';
                                if (isRelativeUrl) {
                                    // default value of allowIframeRelativeUrls is true
                                    // unless allowedIframeHostnames or allowedIframeDomains specified
                                    allowed = has(options, 'allowIframeRelativeUrls')
                                        ? options.allowIframeRelativeUrls
                                        : (!options.allowedIframeHostnames && !options.allowedIframeDomains);
                                }
                                else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
                                    var allowedHostname = (options.allowedIframeHostnames || []).find(function (hostname) {
                                        return hostname === parsed_2.hostname;
                                    });
                                    var allowedDomain = (options.allowedIframeDomains || []).find(function (domain) {
                                        return parsed_2.hostname === domain || parsed_2.hostname.endsWith(".".concat(domain));
                                    });
                                    allowed = allowedHostname || allowedDomain;
                                }
                            }
                            catch (e) {
                                // Unparseable iframe src
                                allowed = false;
                            }
                            if (!allowed) {
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        if (a === 'srcset') {
                            try {
                                parsed = parseSrcset(value);
                                parsed.forEach(function (value) {
                                    if (naughtyHref('srcset', value.url)) {
                                        value.evil = true;
                                    }
                                });
                                parsed = filter(parsed, function (v) {
                                    return !v.evil;
                                });
                                if (!parsed.length) {
                                    delete frame.attribs[a];
                                    return;
                                }
                                else {
                                    value = stringifySrcset(filter(parsed, function (v) {
                                        return !v.evil;
                                    }));
                                    frame.attribs[a] = value;
                                }
                            }
                            catch (e) {
                                // Unparseable srcset
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        if (a === 'class') {
                            var allowedSpecificClasses = allowedClassesMap[name];
                            var allowedWildcardClasses = allowedClassesMap['*'];
                            var allowedSpecificClassesGlob = allowedClassesGlobMap[name];
                            var allowedSpecificClassesRegex = allowedClassesRegexMap[name];
                            var allowedWildcardClassesGlob = allowedClassesGlobMap['*'];
                            var allowedClassesGlobs = [
                                allowedSpecificClassesGlob,
                                allowedWildcardClassesGlob
                            ]
                                .concat(allowedSpecificClassesRegex)
                                .filter(function (t) {
                                return t;
                            });
                            if (allowedSpecificClasses && allowedWildcardClasses) {
                                value = filterClasses(value, deepmerge(allowedSpecificClasses, allowedWildcardClasses), allowedClassesGlobs);
                            }
                            else {
                                value = filterClasses(value, allowedSpecificClasses || allowedWildcardClasses, allowedClassesGlobs);
                            }
                            if (!value.length) {
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        if (a === 'style') {
                            try {
                                var abstractSyntaxTree = postcssParse(name + ' {' + value + '}');
                                var filteredAST = filterCss(abstractSyntaxTree, options.allowedStyles);
                                value = stringifyStyleAttributes(filteredAST);
                                if (value.length === 0) {
                                    delete frame.attribs[a];
                                    return;
                                }
                            }
                            catch (e) {
                                delete frame.attribs[a];
                                return;
                            }
                        }
                        result += ' ' + a;
                        if (value && value.length) {
                            result += '="' + escapeHtml(value, true) + '"';
                        }
                    }
                    else {
                        delete frame.attribs[a];
                    }
                });
            }
            if (options.selfClosing.indexOf(name) !== -1) {
                result += ' />';
            }
            else {
                result += '>';
                if (frame.innerText && !hasText && !options.textFilter) {
                    result += escapeHtml(frame.innerText);
                    addedText = true;
                }
            }
            if (skip) {
                result = tempResult + escapeHtml(result);
                tempResult = '';
            }
        },
        ontext: function (text) {
            if (skipText) {
                return;
            }
            var lastFrame = stack[stack.length - 1];
            var tag;
            if (lastFrame) {
                tag = lastFrame.tag;
                // If inner text was set by transform function then let's use it
                text = lastFrame.innerText !== undefined ? lastFrame.innerText : text;
            }
            if (options.disallowedTagsMode === 'discard' && ((tag === 'script') || (tag === 'style'))) {
                // htmlparser2 gives us these as-is. Escaping them ruins the content. Allowing
                // script tags is, by definition, game over for XSS protection, so if that's
                // your concern, don't allow them. The same is essentially true for style tags
                // which have their own collection of XSS vectors.
                result += text;
            }
            else {
                var escaped = escapeHtml(text, false);
                if (options.textFilter && !addedText) {
                    result += options.textFilter(escaped, tag);
                }
                else if (!addedText) {
                    result += escaped;
                }
            }
            if (stack.length) {
                var frame = stack[stack.length - 1];
                frame.text += text;
            }
        },
        onclosetag: function (name) {
            if (skipText) {
                skipTextDepth--;
                if (!skipTextDepth) {
                    skipText = false;
                }
                else {
                    return;
                }
            }
            var frame = stack.pop();
            if (!frame) {
                // Do not crash on bad markup
                return;
            }
            skipText = options.enforceHtmlBoundary ? name === 'html' : false;
            depth--;
            var skip = skipMap[depth];
            if (skip) {
                delete skipMap[depth];
                if (options.disallowedTagsMode === 'discard') {
                    frame.updateParentNodeText();
                    return;
                }
                tempResult = result;
                result = '';
            }
            if (transformMap[depth]) {
                name = transformMap[depth];
                delete transformMap[depth];
            }
            if (options.exclusiveFilter && options.exclusiveFilter(frame)) {
                result = result.substr(0, frame.tagPosition);
                return;
            }
            frame.updateParentNodeMediaChildren();
            frame.updateParentNodeText();
            if (options.selfClosing.indexOf(name) !== -1) {
                // Already output />
                if (skip) {
                    result = tempResult;
                    tempResult = '';
                }
                return;
            }
            if (!options.skipCloseTag) {
                result += '</' + name + '>';
            }
            if (skip) {
                result = tempResult + escapeHtml(result);
                tempResult = '';
            }
            addedText = false;
        }
    }, options.parser);
    parser.write(html);
    parser.end();
    return result;
    function initializeState() {
        result = '';
        depth = 0;
        stack = [];
        skipMap = {};
        transformMap = {};
        skipText = false;
        skipTextDepth = 0;
    }
    function escapeHtml(s, quote) {
        if (typeof (s) !== 'string') {
            s = s + '';
        }
        if (options.parser.decodeEntities) {
            s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (quote) {
                s = s.replace(/"/g, '&quot;');
            }
        }
        // TODO: this is inadequate because it will pass `&0;`. This approach
        // will not work, each & must be considered with regard to whether it
        // is followed by a 100% syntactically valid entity or not, and escaped
        // if it is not. If this bothers you, don't set parser.decodeEntities
        // to false. (The default is true.)
        s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, '&amp;') // Match ampersands not part of existing HTML entity
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        if (quote) {
            s = s.replace(/"/g, '&quot;');
        }
        return s;
    }
    function naughtyHref(name, href) {
        // Browsers ignore character codes of 32 (space) and below in a surprising
        // number of situations. Start reading here:
        // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
        // eslint-disable-next-line no-control-regex
        href = href.replace(/[\x00-\x20]+/g, '');
        // Clobber any comments in URLs, which the browser might
        // interpret inside an XML data island, allowing
        // a javascript: URL to be snuck through
        href = href.replace(/<!--.*?-->/g, '');
        // Case insensitive so we don't get faked out by JAVASCRIPT #1
        // Allow more characters after the first so we don't get faked
        // out by certain schemes browsers accept
        var matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
        if (!matches) {
            // Protocol-relative URL starting with any combination of '/' and '\'
            if (href.match(/^[/\\]{2}/)) {
                return !options.allowProtocolRelative;
            }
            // No scheme
            return false;
        }
        var scheme = matches[1].toLowerCase();
        if (has(options.allowedSchemesByTag, name)) {
            return options.allowedSchemesByTag[name].indexOf(scheme) === -1;
        }
        return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1;
    }
    /**
     * Filters user input css properties by allowlisted regex attributes.
     * Modifies the abstractSyntaxTree object.
     *
     * @param {object} abstractSyntaxTree  - Object representation of CSS attributes.
     * @property {array[Declaration]} abstractSyntaxTree.nodes[0] - Each object cointains prop and value key, i.e { prop: 'color', value: 'red' }.
     * @param {object} allowedStyles       - Keys are properties (i.e color), value is list of permitted regex rules (i.e /green/i).
     * @return {object}                    - The modified tree.
     */
    function filterCss(abstractSyntaxTree, allowedStyles) {
        if (!allowedStyles) {
            return abstractSyntaxTree;
        }
        var astRules = abstractSyntaxTree.nodes[0];
        var selectedRule;
        // Merge global and tag-specific styles into new AST.
        if (allowedStyles[astRules.selector] && allowedStyles['*']) {
            selectedRule = deepmerge(allowedStyles[astRules.selector], allowedStyles['*']);
        }
        else {
            selectedRule = allowedStyles[astRules.selector] || allowedStyles['*'];
        }
        if (selectedRule) {
            abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
        }
        return abstractSyntaxTree;
    }
    /**
     * Extracts the style attributes from an AbstractSyntaxTree and formats those
     * values in the inline style attribute format.
     *
     * @param  {AbstractSyntaxTree} filteredAST
     * @return {string}             - Example: "color:yellow;text-align:center !important;font-family:helvetica;"
     */
    function stringifyStyleAttributes(filteredAST) {
        return filteredAST.nodes[0].nodes
            .reduce(function (extractedAttributes, attrObject) {
            extractedAttributes.push("".concat(attrObject.prop, ":").concat(attrObject.value).concat(attrObject.important ? ' !important' : ''));
            return extractedAttributes;
        }, [])
            .join(';');
    }
    /**
     * Filters the existing attributes for the given property. Discards any attributes
     * which don't match the allowlist.
     *
     * @param  {object} selectedRule             - Example: { color: red, font-family: helvetica }
     * @param  {array} allowedDeclarationsList   - List of declarations which pass the allowlist.
     * @param  {object} attributeObject          - Object representing the current css property.
     * @property {string} attributeObject.type   - Typically 'declaration'.
     * @property {string} attributeObject.prop   - The CSS property, i.e 'color'.
     * @property {string} attributeObject.value  - The corresponding value to the css property, i.e 'red'.
     * @return {function}                        - When used in Array.reduce, will return an array of Declaration objects
     */
    function filterDeclarations(selectedRule) {
        return function (allowedDeclarationsList, attributeObject) {
            // If this property is allowlisted...
            if (has(selectedRule, attributeObject.prop)) {
                var matchesRegex = selectedRule[attributeObject.prop].some(function (regularExpression) {
                    return regularExpression.test(attributeObject.value);
                });
                if (matchesRegex) {
                    allowedDeclarationsList.push(attributeObject);
                }
            }
            return allowedDeclarationsList;
        };
    }
    function filterClasses(classes, allowed, allowedGlobs) {
        if (!allowed) {
            // The class attribute is allowed without filtering on this tag
            return classes;
        }
        classes = classes.split(/\s+/);
        return classes.filter(function (clss) {
            return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function (glob) {
                return glob.test(clss);
            });
        }).join(' ');
    }
}
// Defaults are accessible to you so that you can use them as a starting point
// programmatically if you wish
var htmlParserDefaults = {
    decodeEntities: true
};
sanitizeHtml.defaults = {
    allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
    disallowedTagsMode: 'discard',
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: ['src']
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
    // URL schemes we permit
    allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowProtocolRelative: true,
    enforceHtmlBoundary: false,
    skipCloseTag: false
};
sanitizeHtml.simpleTransform = function (newTagName, newAttribs, merge) {
    merge = (merge === undefined) ? true : merge;
    newAttribs = newAttribs || {};
    return function (tagName, attribs) {
        var attrib;
        if (merge) {
            for (attrib in newAttribs) {
                attribs[attrib] = newAttribs[attrib];
            }
        }
        else {
            attribs = newAttribs;
        }
        return {
            tagName: newTagName,
            attribs: attribs
        };
    };
};
//# sourceMappingURL=sanitize-html.js.map