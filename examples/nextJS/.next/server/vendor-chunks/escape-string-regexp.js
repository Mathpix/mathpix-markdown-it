"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/escape-string-regexp";
exports.ids = ["vendor-chunks/escape-string-regexp"];
exports.modules = {

/***/ "(ssr)/./node_modules/escape-string-regexp/index.js":
/*!****************************************************!*\
  !*** ./node_modules/escape-string-regexp/index.js ***!
  \****************************************************/
/***/ ((module) => {

eval("\nmodule.exports = (string)=>{\n    if (typeof string !== \"string\") {\n        throw new TypeError(\"Expected a string\");\n    }\n    // Escape characters with special meaning either inside or outside character sets.\n    // Use a simple backslash escape when it’s always valid, and a \\unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.\n    return string.replace(/[|\\\\{}()[\\]^$+*?.]/g, \"\\\\$&\").replace(/-/g, \"\\\\x2d\");\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZXNjYXBlLXN0cmluZy1yZWdleHAvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQUEsT0FBT0MsT0FBTyxHQUFHQyxDQUFBQTtJQUNoQixJQUFJLE9BQU9BLFdBQVcsVUFBVTtRQUMvQixNQUFNLElBQUlDLFVBQVU7SUFDckI7SUFFQSxrRkFBa0Y7SUFDbEYsNkpBQTZKO0lBQzdKLE9BQU9ELE9BQ0xFLE9BQU8sQ0FBQyx1QkFBdUIsUUFDL0JBLE9BQU8sQ0FBQyxNQUFNO0FBQ2pCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmV4dGpzLy4vbm9kZV9tb2R1bGVzL2VzY2FwZS1zdHJpbmctcmVnZXhwL2luZGV4LmpzP2E4NzMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHQvLyBFc2NhcGUgY2hhcmFjdGVycyB3aXRoIHNwZWNpYWwgbWVhbmluZyBlaXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgY2hhcmFjdGVyIHNldHMuXG5cdC8vIFVzZSBhIHNpbXBsZSBiYWNrc2xhc2ggZXNjYXBlIHdoZW4gaXTigJlzIGFsd2F5cyB2YWxpZCwgYW5kIGEgXFx1bm5ubiBlc2NhcGUgd2hlbiB0aGUgc2ltcGxlciBmb3JtIHdvdWxkIGJlIGRpc2FsbG93ZWQgYnkgVW5pY29kZSBwYXR0ZXJuc+KAmSBzdHJpY3RlciBncmFtbWFyLlxuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nLCAnXFxcXCQmJylcblx0XHQucmVwbGFjZSgvLS9nLCAnXFxcXHgyZCcpO1xufTtcbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwic3RyaW5nIiwiVHlwZUVycm9yIiwicmVwbGFjZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/escape-string-regexp/index.js\n");

/***/ })

};
;