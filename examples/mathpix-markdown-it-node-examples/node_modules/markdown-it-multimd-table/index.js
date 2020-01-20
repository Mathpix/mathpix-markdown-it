'use strict';

module.exports = function multimd_table_plugin(md, pluginOptions) {
  pluginOptions = pluginOptions || {};

  function getLine(state, line) {
    var pos = state.bMarks[line] + state.blkIndent,
        max = state.eMarks[line];
    return state.src.slice(pos, max);
  }

  function escapedSplit(str) {
    var result = [],
        max = str.length,
        lastPos = 0,
        escaped = false,
        backTicked = false;

    for (var pos = 0; pos < max; pos++) {
      switch (str.charCodeAt(pos)) {
        case 0x5c /* \ */:
          escaped = true;
          break;
        case 0x60 /* ` */:
          if (backTicked || !escaped) {
            /* make \` closes the code sequence, but not open it;
               the reason is that `\` is correct code block */
            backTicked = !backTicked;
          }
          escaped = false;
          break;
        case 0x7c /* | */:
          if (!backTicked && !escaped) {
            result.push(str.slice(lastPos, pos));
            lastPos = pos + 1;
          }
          escaped = false;
          break;
        default:
          escaped = false;
          break;
      }
    }

    result.push(str.slice(lastPos));

    return result;
  }

  function countColspan(columns) {
    var emptyCount = 0,
        colspans = [];

    for (var i = columns.length - 1; i >= 0; i--) {
      if (columns[i]) {
        colspans.unshift(emptyCount + 1);
        emptyCount = 0;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      colspans.unshift(emptyCount + 1);
    }

    return colspans;
  }

  function caption(state, lineText, lineNum, silent) {
    var result = lineText.match(/^\[([^\[\]]+)\](\[([^\[\]]+)\])?\s*$/);
    if (!result) { return false; }
    if (silent)  { return true; }

    var captionInfo = { caption: null, label: null };
    captionInfo.content = result[1];
    captionInfo.label = result[2] || result[1];

    var token;
    token          = state.push('caption_open', 'caption', 1);
    token.map      = [ lineNum, lineNum + 1 ];
    token.attrs    = [ [ 'id', captionInfo.label.toLowerCase().replace(/\W+/g, '') ] ];

    token          = state.push('inline', '', 0);
    token.content  = captionInfo.content;
    token.map      = [ lineNum, lineNum + 1 ];
    token.children = [];

    token         = state.push('caption_close', 'caption', -1);

    return captionInfo;
  }

  function appendRowToken(state, content, startLine, endLine) {
    var linesCount, blockParser, tmpState, token;
    linesCount = content.split(/\n/).length;

    if (linesCount > 1) {
      // Multiline content => subparsing as a block to support lists
      blockParser = state.md.block;
      tmpState = new blockParser.State(content, state.md, state.env, state.tokens);
      blockParser.tokenize(tmpState, 0, linesCount); // appends to state.tokens
    } else {
      token          = state.push('inline', '', 0);
      token.content  = content;
      token.map      = [ startLine, endLine ];
      token.children = [];
    }
  }

  function tableRow(state, lineText, lineNum, silent, separatorInfo, rowType, rowspanState) {
    var rowInfo, columns;
    rowInfo = { colspans: null, columns: null, extractedTextLinesCount: 1 };
    columns = escapedSplit(lineText.replace(/^\||([^\\])\|$/g, '$1'));

    // lineText does not contain valid pipe character
    if (columns.length === 1 && !/^\||[^\\]\|$/.test(lineText)) { return false; }
    if (silent) { return true; }

    // Multiline feature
    if (pluginOptions.enableMultilineRows && lineText.slice(-1) === '\\') {
      var lineTextNext, columnsNext, EndOfMultilines;
      var trimItself = Function.prototype.call.bind(String.prototype.trim); // equal to (x => x.trim())
      columns = escapedSplit(lineText.replace(/\\$/, '').replace(/^\||([^\\])\|$/g, '$1'));
      var initialIndent = /^\s*/.exec(columns[0])[0];
      var trimRegex = new RegExp('^' + initialIndent + '|\\s+$', 'g');
      columns = columns.map(trimItself);
      do {
        lineTextNext = getLine(state, lineNum + rowInfo.extractedTextLinesCount);
        columnsNext = escapedSplit(lineTextNext.replace(/\\$/, '').replace(/^\||([^\\])\|$/g, '$1'));
        EndOfMultilines = lineTextNext.slice(-1) !== '\\';

        if (columnsNext.length === 1 && !/^\||[^\\]\|$|\\$/.test(lineTextNext)) { return false; }
        if (columnsNext.length !== columns.length && !EndOfMultilines) { return false; }

        for (var j = 0; j < columnsNext.length; j++) {
          columns[j] = columns[j] || '';
          columns[j] += '\n' + columnsNext[j].replace(trimRegex, '');
        }
        rowInfo.extractedTextLinesCount += 1;

      } while (!EndOfMultilines);
    }

    // Fill in HTML <tr> elements
    var isValidColumn = RegExp.prototype.test.bind(/[^\n]/); // equal to (s => /[^\n]/.test(s))
    rowInfo.columns = columns.filter(isValidColumn);
    rowInfo.colspans = countColspan(columns.map(isValidColumn));

    var token = state.push('tr_open', 'tr', 1);
    token.map = [ lineNum, lineNum + rowInfo.extractedTextLinesCount ];

    for (var i = 0, col = 0;
      i < rowInfo.columns.length && col < separatorInfo.aligns.length;
      col += rowInfo.colspans[i], i++) {
      if (pluginOptions.enableRowspan &&
          rowspanState && rowspanState[i] &&
          /^\s*\^\^\s*$/.test(rowInfo.columns[i])) {
        var rowspanAttr = rowspanState[i].attrs.find(function (attr) {
          return attr[0] === 'rowspan';
        });
        if (!rowspanAttr) {
          rowspanAttr = [ 'rowspan', 1 ];
          rowspanState[i].attrs.push(rowspanAttr);
        }
        rowspanAttr[1]++;
        continue;
      }
      token          = state.push(rowType + '_open', rowType, 1);
      token.map      = [ lineNum, lineNum + rowInfo.extractedTextLinesCount ];
      token.attrs    = [];
      rowspanState[i] = {
        attrs: token.attrs
      };
      if (separatorInfo.aligns[col]) {
        token.attrs.push([ 'style', 'text-align:' + separatorInfo.aligns[col] ]);
      }
      if (separatorInfo.wraps[col]) {
        token.attrs.push([ 'class', 'extend' ]);
      }
      if (rowInfo.colspans[i] > 1) {
        token.attrs.push([ 'colspan', rowInfo.colspans[i] ]);
      }

      appendRowToken(state, rowInfo.columns[i].trim(), lineNum, lineNum + rowInfo.extractedTextLinesCount);

      token          = state.push(rowType + '_close', rowType, -1);
    }

    state.push('tr_close', 'tr', -1);

    return rowInfo;
  }

  function separator(state, lineText, lineNum, silent) {
    // lineText have code indentation
    if (state.sCount[lineNum] - state.blkIndent >= 4) { return false; }

    // lineText does not contain valid pipe character
    var columns = escapedSplit(lineText.replace(/^\||([^\\])\|$/g, '$1'));
    if (columns.length === 1 && !/^\||[^\\]\|$/.test(lineText)) { return false; }

    var separatorInfo = { aligns: [], wraps: [] };

    for (var i = 0; i < columns.length; i++) {
      var t = columns[i].trim();
      if (!/^:?(-+|=+):?\+?$/.test(t)) { return false; }

      separatorInfo.wraps.push(t.charCodeAt(t.length - 1) === 0x2B/* + */);
      if (separatorInfo.wraps[i]) {
        t = t.slice(0, -1);
      }

      switch (((t.charCodeAt(0)            === 0x3A /* : */) << 4) +
               (t.charCodeAt(t.length - 1) === 0x3A /* : */)) {
        case 0x00: separatorInfo.aligns.push('');       break;
        case 0x01: separatorInfo.aligns.push('right');  break;
        case 0x10: separatorInfo.aligns.push('left');   break;
        case 0x11: separatorInfo.aligns.push('center'); break;
      }
    }

    return silent || separatorInfo;
  }

  function table(state, startLine, endLine, silent) {
    /* Regex pseudo code for table:
     * caption? header+ separator (data+ empty)* data+ caption?
     *
     * We use NFA with precedences to emulate this plugin.
     * Noted that separator should have higher precedence than header or data.
     *   |  state  | caption separator header data empty | --> lower precedence
     *   | 0x10100 |    1        0       1     0     0   |
     */

    var match = {
      0x10000: function (s, l, lt) { return caption(s, lt, l, true); },
      0x01000: function (s, l, lt) { return separator(s, lt, l); },
      0x00100: function (s, l, lt) { return tableRow(s, lt, l, true, null, 'th'); },
      0x00010: function (s, l, lt) { return tableRow(s, lt, l, true, null, 'td'); },
      0x00001: function (s, l, lt) { return !lt; }
    };
    var transitions = {
      0x10100: { 0x10000: 0x00100, 0x00100: 0x01100 },
      0x00100: { 0x00100: 0x01100 },
      0x01100: { 0x01000: 0x10010, 0x00100: 0x01100 },
      0x10010: { 0x10000: 0x00000, 0x00010: 0x10011 },
      0x10011: { 0x10000: 0x00000, 0x00010: 0x10011, 0x00001: 0x10010 }
    };

    /* Check validity; Gather separator informations */
    if (startLine + 2 > endLine) { return false; }

    var NFAstate, line, candidate, rowInfo, lineText, separatorInfo;
    var captionAtFirst = false;

    for (NFAstate = 0x10100, line = startLine; NFAstate && line < endLine; line++) {
      lineText = getLine(state, line).trim();

      for (candidate = 0x10000; candidate > 0; candidate >>= 4) {
        if (NFAstate & candidate && match[candidate].call(this, state, line, lineText)) { break; }
      }

      switch (candidate) {
        case 0x10000:
          if (NFAstate === 0x10100) { captionAtFirst = true; }
          break;
        case 0x01000:
          separatorInfo = separator(state, lineText, line);
          if (silent) { return true; }
          break;
        case 0x00100:
        case 0x00010:
        case 0x00001:
          break;
        case 0x00000:
          if (NFAstate & 0x00100) { return false; } // separator not reached
      }

      NFAstate = transitions[NFAstate][candidate] || 0x00000;
    }

    if (!separatorInfo) { return false; }

    /* Generate table HTML */
    var token, tableLines, theadLines, tbodyLines;

    token = state.push('table_open', 'table', 1);
    token.map = tableLines = [ startLine, 0 ];

    var rowspanState;
    for (NFAstate = 0x10100, line = startLine; NFAstate && line < endLine; line++) {
      lineText = getLine(state, line).trim();

      for (candidate = 0x10000; candidate > 0; candidate >>= 4) {
        if (NFAstate & candidate && match[candidate].call(this, state, line, lineText)) { break; }
      }

      switch (candidate) {
        case 0x10000:
          if (NFAstate !== 0x10100) { // the last line in table
            tbodyLines[1] = line;
            token = state.push('tbody_close', 'tbody', -1);
          }
          if (NFAstate === 0x10100 || !captionAtFirst) {
            caption(state, lineText, line, false);
          } else {
            line--;
          }
          break;
        case 0x01000:
          theadLines[1] = line;
          token         = state.push('thead_close', 'thead', -1);
          break;
        case 0x00100:
          if (NFAstate !== 0x01100) { // the first line in thead
            token     = state.push('thead_open', 'thead', 1);
            token.map = theadLines = [ line + 1, 0 ];
            rowspanState = [];
          }
          rowInfo = tableRow(state, lineText, line, false, separatorInfo, 'th', rowspanState);
          line   += rowInfo.extractedTextLinesCount - 1;
          break;
        case 0x00010:
          if (NFAstate !== 0x10011) { // the first line in tbody
            token     = state.push('tbody_open', 'tbody', 1);
            token.map = tbodyLines = [ line + 1, 0 ];
            rowspanState = [];
          }
          rowInfo = tableRow(state, lineText, line, false, separatorInfo, 'td', rowspanState);
          line   += rowInfo.extractedTextLinesCount - 1;
          break;
        case 0x00001:
          tbodyLines[1] = line;
          token         = state.push('tbody_close', 'tbody', -1);
          break;
        case 0x00000:
          line--;
          break;
      }

      NFAstate = transitions[NFAstate][candidate] || 0x00000;
    }

    if (tbodyLines && !tbodyLines[1]) { // Corner case: table without tbody or EOL
      tbodyLines[1] = line;
      token         = state.push('tbody_close', 'tbody', -1);
    }

    tableLines[1] = line;
    token = state.push('table_close', 'table', -1);

    state.line = line;
    return true;
  }

  md.block.ruler.at('table', table, { alt: [ 'paragraph', 'reference' ] });
};

/* vim: set ts=2 sw=2 et: */
