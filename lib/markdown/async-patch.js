"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAsyncPatch = void 0;
var tslib_1 = require("tslib");
var alreadyPatched = false;
function applyAsyncPatch() {
    console.log("[MMD]=>[applyAsyncPatch]=>");
    if (alreadyPatched)
        return;
    alreadyPatched = true;
    var MarkdownIt = require('markdown-it');
    var Core = require('markdown-it/lib/parser_core');
    var ParserBlock = require('markdown-it/lib/parser_block');
    var ParserInline = require('markdown-it/lib/parser_inline');
    // 1) Core.prototype.processAsync
    Core.prototype.processAsync = function (state, opts) {
        var _this = this;
        opts = opts || {};
        var rules = this.ruler.getRules('');
        var i = 0;
        return new Promise(function (resolve, reject) {
            var self = _this;
            function nextRule() {
                if (i >= rules.length)
                    return resolve();
                var rule = rules[i++];
                var name = self.ruler.getRulesNames
                    ? self.ruler.getRulesNames('')[i - 1] // если сделаешь такой helper
                    : rule.name || 'core_rule_' + (i - 1);
                var start = Date.now();
                if (typeof rule.async === 'function') {
                    rule.async(state, opts)
                        .then(function () {
                        var dur = Date.now() - start;
                        if (dur > 200) {
                            console.log('[MMD][SLOW][coreRule] async ', name, 'took', dur, 'ms');
                        }
                        setImmediate(nextRule);
                    })
                        .catch(reject);
                }
                else {
                    try {
                        rule(state);
                        var dur = Date.now() - start;
                        if (dur > 200) {
                            console.log('[MMD][SLOW][coreRule]', name, 'took', dur, 'ms');
                        }
                    }
                    catch (e) {
                        return reject(e);
                    }
                    setImmediate(nextRule);
                }
            }
            nextRule();
        });
    };
    // 2) ParserBlock.tokenizeAsync / parseAsync
    ParserBlock.prototype.tokenizeAsync = function (state, startLine, endLine, opts) {
        opts = opts || {};
        var sliceMs = opts.sliceMs || 30;
        var rules = this.ruler.getRules('');
        var len = rules.length;
        var line = startLine;
        var hasEmptyLines = false;
        var maxNesting = state.md.options.maxNesting;
        return new Promise(function (resolve, reject) {
            function step() {
                var start = Date.now();
                try {
                    while (line < endLine && (Date.now() - start) < sliceMs) {
                        // === Copy the logic from sync tokenize ===
                        state.line = line = state.skipEmptyLines(line);
                        if (line >= endLine) {
                            break;
                        }
                        if (state.sCount[line] < state.blkIndent) {
                            break;
                        }
                        if (state.level >= maxNesting) {
                            state.line = endLine;
                            break;
                        }
                        var i = void 0, ok = false;
                        for (i = 0; i < len; i++) {
                            var ruleFn = rules[i];
                            var rStart = Date.now();
                            ok = ruleFn(state, line, endLine, false);
                            var rDur = Date.now() - rStart;
                            if (rDur > 200) {
                                console.log('[MMD][SLOW][blockRule]', ruleFn.name || ('rule_' + i), 'took', rDur, 'ms at line', line);
                            }
                            if (ok)
                                break;
                        }
                        state.tight = !hasEmptyLines;
                        if (state.isEmpty(state.line - 1)) {
                            hasEmptyLines = true;
                        }
                        line = state.line;
                        if (line < endLine && state.isEmpty(line)) {
                            hasEmptyLines = true;
                            line++;
                            state.line = line;
                        }
                    }
                }
                catch (e) {
                    return reject(e);
                }
                // the exit conditions are the same as in the sync version of while
                if (line < endLine &&
                    state.sCount[line] >= state.blkIndent &&
                    state.level < maxNesting) {
                    setImmediate(step);
                }
                else {
                    resolve();
                }
            }
            step();
        });
    };
    ParserBlock.prototype.parseAsync = function (src, md, env, outTokens, opts) {
        if (!src)
            return Promise.resolve();
        var state = new this.State(src, md, env, outTokens);
        return this.tokenizeAsync(state, state.line, state.lineMax, opts);
    };
    // 3) ParserInline.tokenizeAsync / parseAsync
    ParserInline.prototype.tokenizeAsync = function (state, opts) {
        opts = opts || {};
        var sliceMs = opts.sliceMs || 30;
        var rules = this.ruler.getRules('');
        var len = rules.length;
        var maxNesting = state.md.options.maxNesting;
        var end = state.posMax;
        return new Promise(function (resolve, reject) {
            function step() {
                var start = Date.now();
                try {
                    // This is the same logic as in sync tokenize,
                    // just wrapped in "until we go beyond sliceMs"
                    while (state.pos < end && (Date.now() - start) < sliceMs) {
                        var i, ok = false;
                        // copy of the body from ParserInline.prototype.tokenize:
                        // Try all possible rules.
                        // On success, rule should:
                        //
                        // - update `state.pos`
                        // - update `state.tokens`
                        // - return true
                        if (state.level < maxNesting) {
                            for (i = 0; i < len; i++) {
                                ok = rules[i](state, false);
                                if (ok) {
                                    break;
                                }
                            }
                        }
                        if (ok) {
                            if (state.pos >= end) {
                                break;
                            }
                            continue;
                        }
                        state.pending += state.src[state.pos++];
                    }
                    if (state.pending) {
                        state.pushPending();
                    }
                }
                catch (e) {
                    return reject(e);
                }
                if (state.pos < state.posMax) {
                    setImmediate(step);
                }
                else {
                    resolve();
                }
            }
            step();
        });
    };
    ParserInline.prototype.parseAsync = function (str, md, env, outTokens, opts) {
        var _this = this;
        var state = new this.State(str, md, env, outTokens);
        return this.tokenizeAsync(state, opts).then(function () {
            var rules2 = _this.ruler2.getRules('');
            for (var i = 0; i < rules2.length; i++) {
                rules2[i](state);
            }
        });
    };
    // 4) rules_core/block.async
    var blockRule = require('markdown-it/lib/rules_core/block');
    blockRule.async = function blockAsync(state, opts) {
        if (state.inlineMode) {
            var token = new state.Token('inline', '', 0);
            token.content = state.src;
            token.map = [0, 1];
            token.children = [];
            state.tokens.push(token);
            return Promise.resolve();
        }
        else {
            return state.md.block.parseAsync(state.src, state.md, state.env, state.tokens, opts);
        }
    };
    // 5) rules_core/inline.async
    var inlineRule = require('markdown-it/lib/rules_core/inline');
    inlineRule.async = function inlineAsync(state, opts) {
        opts = opts || {};
        var tokens = state.tokens;
        var md = state.md;
        var env = state.env;
        var i = 0;
        return new Promise(function (resolve, reject) {
            function next() {
                if (i >= tokens.length)
                    return resolve();
                var tok = tokens[i++];
                if (tok.type !== 'inline') {
                    return setImmediate(next);
                }
                md.inline.parseAsync(tok.content, md, env, tok.children, opts)
                    .then(function () { return setImmediate(next); })
                    .catch(reject);
            }
            next();
        });
    };
    // 6) MarkdownIt.prototype.parseAsync / renderAsync
    MarkdownIt.prototype.parseAsync = function (src, env, opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var state;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (typeof src !== 'string') {
                            return [2 /*return*/, Promise.reject(new Error('Input data should be a String'))];
                        }
                        env = env || {};
                        state = new this.core.State(src, this, env);
                        return [4 /*yield*/, this.core.processAsync(state, opts)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, state.tokens];
                }
            });
        });
    };
    MarkdownIt.prototype.renderAsync = function (src, env, opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var tokens;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        env = env || {};
                        return [4 /*yield*/, this.parseAsync(src, env, opts)];
                    case 1:
                        tokens = _a.sent();
                        return [2 /*return*/, this.renderer.render(tokens, this.options, env)];
                }
            });
        });
    };
}
exports.applyAsyncPatch = applyAsyncPatch;
//# sourceMappingURL=async-patch.js.map