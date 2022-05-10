"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTagSpan = exports.reSpan = exports.reOpenTagSmiles = exports.open_tag_smiles = exports.closeTagMML = exports.openTagMML = exports.attribute = exports.attr_value = void 0;
var attr_name = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var unquoted = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';
exports.attr_value = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';
exports.attribute = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + exports.attr_value + ')?)';
var open_tag_mml = '<(math)' + exports.attribute + '*\\s*\\/?>';
var close_tag_mml = '<\\/math*\\s*>';
exports.openTagMML = new RegExp('(?:' + open_tag_mml + ')');
exports.closeTagMML = new RegExp('(?:' + close_tag_mml + ')');
exports.open_tag_smiles = '^<(smiles)' + exports.attribute + '*\\s*\\/?>';
exports.reOpenTagSmiles = new RegExp('(?:' + exports.open_tag_smiles + ')');
exports.reSpan = /^<(span\s*(?:class="([^>]*)")\s*([^>]*))>(.*)<\/span\>/;
var close_tag_span = '<\\/span*\\s*>';
exports.closeTagSpan = new RegExp('(?:' + close_tag_span + ')');
//# sourceMappingURL=consts.js.map