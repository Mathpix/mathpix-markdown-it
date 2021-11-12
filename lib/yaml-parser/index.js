"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamlParser = void 0;
var tslib_1 = require("tslib");
var yaml = require("js-yaml");
exports.yamlParser = function (text, isAddYamlToHtml) {
    if (isAddYamlToHtml === void 0) { isAddYamlToHtml = false; }
    if (typeof text !== 'string') {
        throw new TypeError('Markdown source text must be a string.');
    }
    text = text.trim();
    var YAML_START = /^-+(\r|\n)/;
    var YAML_END = /(\r|\n)-+(\r|\n)/;
    var YAMKL_FILE_END = /(\r|\n)-+/;
    var result = {
        content: text,
        metadata: null,
        contentStartLine: 0
    };
    try {
        if (YAML_START.test(text)) {
            var match = text.match(YAML_END);
            if (match) {
                var endIndex = match.index + match[0].length;
                var metadata = text.substring(0, match.index);
                var content = text.substring(endIndex);
                result = {
                    metadata: metadata,
                    content: content.trim(),
                    contentStartLine: 0
                };
            }
            if (!result.metadata) {
                var match_1 = text.match(YAMKL_FILE_END);
                if (match_1) {
                    var metadata = text.substring(0, match_1.index);
                    result = {
                        metadata: metadata,
                        content: '',
                        contentStartLine: 0
                    };
                }
            }
            if (result.metadata) {
                result = tslib_1.__assign(tslib_1.__assign({}, result), { metadata: result.metadata.replace(YAML_START, '').trim() });
            }
            if (result.metadata) {
                var arr = result.metadata.split('\n');
                result.contentStartLine = arr.length + 3;
            }
            if (result.metadata) {
                var parseResult = null;
                try {
                    parseResult = yaml.load(result.metadata);
                }
                catch (err) {
                    console.error(err);
                    result.error = 'Can not parse yaml data';
                }
                result = tslib_1.__assign(tslib_1.__assign({}, result), { metadata: parseResult });
            }
            if (isAddYamlToHtml) {
                if (result.metadata) {
                    var mmdTitle = '';
                    var mmdAuthor_1 = '';
                    if (result.metadata.authors && result.metadata.authors.length) {
                        if (Array.isArray(result.metadata.authors)) {
                            result.metadata.authors.map(function (item) {
                                var author = item.toString().trim();
                                author = author.replace(/\r|\n|,/g, '\\\\');
                                mmdAuthor_1 += "\\author{" + author + "}";
                                mmdAuthor_1 += '\n\n';
                            });
                        }
                        else {
                            var author = result.metadata.authors.trim();
                            author = author.replace(/\r|\n|,/g, '\\\\');
                            mmdAuthor_1 = "\\author{" + author + "}";
                            mmdAuthor_1 += '\n\n';
                        }
                    }
                    if (!mmdAuthor_1 && result.metadata.author && result.metadata.author.trim()) {
                        var author = result.metadata.author.trim();
                        author = author.replace(/\r|\n|,/g, '\\\\');
                        mmdAuthor_1 = "\\author{" + author + "}";
                        mmdAuthor_1 += '\n\n';
                    }
                    if (result.metadata.title && result.metadata.title.trim()) {
                        mmdTitle = "\\title{" + result.metadata.title + "}";
                        mmdTitle += '\n\n';
                    }
                    result.content = mmdAuthor_1 + result.content;
                    result.content = mmdTitle + result.content;
                }
            }
        }
        return result;
    }
    catch (err) {
        console.error(err);
        result.error = 'Can not parse yaml data';
        return result;
    }
};
//# sourceMappingURL=index.js.map