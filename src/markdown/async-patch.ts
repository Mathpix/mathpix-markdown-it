let alreadyPatched = false;

export function applyAsyncPatch() {
  console.log("[MMD]=>[applyAsyncPatch]=>")
  if (alreadyPatched) return;
  alreadyPatched = true;

  const MarkdownIt   = require('markdown-it');
  const Core         = require('markdown-it/lib/parser_core');
  const ParserBlock  = require('markdown-it/lib/parser_block');
  const ParserInline = require('markdown-it/lib/parser_inline');

  // 1) Core.prototype.processAsync
  Core.prototype.processAsync = function (state, opts): Promise<void>  {
    opts = opts || {};
    const rules = this.ruler.getRules('');
    let i = 0;

    return new Promise<void>((resolve, reject) => {
      const self = this;

      function nextRule() {
        if (i >= rules.length) return resolve();

        const rule = rules[i++];
        const name = self.ruler.getRulesNames
          ? self.ruler.getRulesNames('')[i - 1]  // если сделаешь такой helper
          : rule.name || 'core_rule_' + (i - 1);

        const start = Date.now();

        if (typeof rule.async === 'function') {
          rule.async(state, opts)
            .then(() => {
              const dur = Date.now() - start;
              if (dur > 200) {
                console.log('[MMD][SLOW][coreRule] async ', name, 'took', dur, 'ms');
              }
              setImmediate(nextRule);
            })
            .catch(reject);
        } else {
          try {
            rule(state);
            const dur = Date.now() - start;
            if (dur > 200) {
              console.log('[MMD][SLOW][coreRule]', name, 'took', dur, 'ms');
            }
          } catch (e) {
            return reject(e);
          }
          setImmediate(nextRule);
        }
      }

      nextRule();
    });
  };

  // 2) ParserBlock.tokenizeAsync / parseAsync
  ParserBlock.prototype.tokenizeAsync = function (state, startLine, endLine, opts): Promise<void> {
    opts = opts || {};
    const sliceMs = opts.sliceMs || 30;
    const rules = this.ruler.getRules('');
    const len = rules.length;

    let line = startLine;
    let hasEmptyLines = false;
    const maxNesting = state.md.options.maxNesting;

    return new Promise<void>((resolve, reject) => {
      function step() {
        const start = Date.now();

        try {
          while (line < endLine && (Date.now() - start) < sliceMs) {
            // === Copy the logic from sync tokenize ===
            state.line = line = state.skipEmptyLines(line);
            if (line >= endLine) { break; }

            if (state.sCount[line] < state.blkIndent) { break; }

            if (state.level >= maxNesting) {
              state.line = endLine;
              break;
            }

            let i, ok = false;
            for (i = 0; i < len; i++) {
              const ruleFn = rules[i];
              const rStart = Date.now();
              ok = ruleFn(state, line, endLine, false);
              const rDur = Date.now() - rStart;

              if (rDur > 200) {
                console.log('[MMD][SLOW][blockRule]', ruleFn.name || ('rule_' + i), 'took', rDur, 'ms at line', line);
              }
              if (ok) break;
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
        } catch (e) {
          return reject(e);
        }

        // the exit conditions are the same as in the sync version of while
        if (line < endLine &&
          state.sCount[line] >= state.blkIndent &&
          state.level < maxNesting) {
          setImmediate(step);
        } else {
          resolve();
        }
      }

      step();
    });
  };

  ParserBlock.prototype.parseAsync = function (src, md, env, outTokens, opts) {
    if (!src) return Promise.resolve();
    const state = new this.State(src, md, env, outTokens);
    return this.tokenizeAsync(state, state.line, state.lineMax, opts);
  };

  // 3) ParserInline.tokenizeAsync / parseAsync
  ParserInline.prototype.tokenizeAsync = function (state, opts): Promise<void> {
    opts = opts || {};
    const sliceMs = opts.sliceMs || 30;
    const rules = this.ruler.getRules('');
    const len = rules.length;

    return new Promise<void>((resolve, reject) => {
      function step() {
        const start = Date.now();
        try {
          // This is the same logic as in sync tokenize,
          // just wrapped in "until we go beyond sliceMs"
          while (state.pos < state.posMax && (Date.now() - start) < sliceMs) {
            var i, ok = false;
            // copy of the body from ParserInline.prototype.tokenize:
            // - iterate over the rules
            // - each rule moves state.pos / creates tokens
            for (i = 0; i < len; i++) {
              ok = rules[i](state, false);
              if (ok) break;
            }

            if (!ok) {
              // safety, so as not to get stuck
              state.pending += state.src[state.pos++];
            }
          }
        } catch (e) {
          return reject(e);
        }

        if (state.pos < state.posMax) {
          setImmediate(step);
        } else {
          resolve();
        }
      }

      step();
    });
  };

  ParserInline.prototype.parseAsync = function (str, md, env, outTokens, opts) {
    const state = new this.State(str, md, env, outTokens);
    return this.tokenizeAsync(state, opts).then(() => {
      const rules2 = this.ruler2.getRules('');
      for (let i = 0; i < rules2.length; i++) {
        rules2[i](state);
      }
    });
  };

  // 4) rules_core/block.async
  const blockRule = require('markdown-it/lib/rules_core/block');
  blockRule.async = function blockAsync(state, opts) {
    if (state.inlineMode) {
      const token          = new state.Token('inline', '', 0);
      token.content        = state.src;
      token.map            = [0, 1];
      token.children       = [];
      state.tokens.push(token);
      return Promise.resolve();
    } else {
      return state.md.block.parseAsync(state.src, state.md, state.env, state.tokens, opts);
    }
  };

  // 5) rules_core/inline.async
  const inlineRule = require('markdown-it/lib/rules_core/inline');
  inlineRule.async = function inlineAsync(state, opts): Promise<void> {
    opts = opts || {};
    const tokens = state.tokens;
    const md = state.md;
    const env = state.env;
    let i = 0;

    return new Promise<void>((resolve, reject) => {
      function next() {
        if (i >= tokens.length) return resolve();
        const tok = tokens[i++];

        if (tok.type !== 'inline') {
          return setImmediate(next);
        }

        md.inline.parseAsync(tok.content, md, env, tok.children, opts)
          .then(() => setImmediate(next))
          .catch(reject);
      }
      next();
    });
  };

  // 6) MarkdownIt.prototype.parseAsync / renderAsync
  MarkdownIt.prototype.parseAsync = async function (src, env, opts) {
    if (typeof src !== 'string') {
      return Promise.reject(new Error('Input data should be a String'));
    }
    env = env || {};
    const state = new this.core.State(src, this, env);
    await this.core.processAsync(state, opts);
    return state.tokens;
  };

  MarkdownIt.prototype.renderAsync = async function (src, env, opts) {
    env = env || {};
    const tokens = await this.parseAsync(src, env, opts);
    return this.renderer.render(tokens, this.options, env);
  };
}
