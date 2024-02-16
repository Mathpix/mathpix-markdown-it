"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-plain-object";
exports.ids = ["vendor-chunks/is-plain-object"];
exports.modules = {

/***/ "(ssr)/./node_modules/is-plain-object/dist/is-plain-object.js":
/*!**************************************************************!*\
  !*** ./node_modules/is-plain-object/dist/is-plain-object.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\n/*!\n * is-plain-object <https://github.com/jonschlinkert/is-plain-object>\n *\n * Copyright (c) 2014-2017, Jon Schlinkert.\n * Released under the MIT License.\n */ function isObject(o) {\n    return Object.prototype.toString.call(o) === \"[object Object]\";\n}\nfunction isPlainObject(o) {\n    var ctor, prot;\n    if (isObject(o) === false) return false;\n    // If has modified constructor\n    ctor = o.constructor;\n    if (ctor === undefined) return true;\n    // If has modified prototype\n    prot = ctor.prototype;\n    if (isObject(prot) === false) return false;\n    // If constructor does not have an Object-specific method\n    if (prot.hasOwnProperty(\"isPrototypeOf\") === false) {\n        return false;\n    }\n    // Most likely a plain Object\n    return true;\n}\nexports.isPlainObject = isPlainObject;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L2Rpc3QvaXMtcGxhaW4tb2JqZWN0LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBRUFBLDhDQUE2QztJQUFFRyxPQUFPO0FBQUssQ0FBQyxFQUFDO0FBRTdEOzs7OztDQUtDLEdBRUQsU0FBU0MsU0FBU0MsQ0FBQztJQUNqQixPQUFPTCxPQUFPTSxTQUFTLENBQUNDLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDSCxPQUFPO0FBQy9DO0FBRUEsU0FBU0ksY0FBY0osQ0FBQztJQUN0QixJQUFJSyxNQUFLQztJQUVULElBQUlQLFNBQVNDLE9BQU8sT0FBTyxPQUFPO0lBRWxDLDhCQUE4QjtJQUM5QkssT0FBT0wsRUFBRU8sV0FBVztJQUNwQixJQUFJRixTQUFTRyxXQUFXLE9BQU87SUFFL0IsNEJBQTRCO0lBQzVCRixPQUFPRCxLQUFLSixTQUFTO0lBQ3JCLElBQUlGLFNBQVNPLFVBQVUsT0FBTyxPQUFPO0lBRXJDLHlEQUF5RDtJQUN6RCxJQUFJQSxLQUFLRyxjQUFjLENBQUMscUJBQXFCLE9BQU87UUFDbEQsT0FBTztJQUNUO0lBRUEsNkJBQTZCO0lBQzdCLE9BQU87QUFDVDtBQUVBWixxQkFBcUIsR0FBR08iLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXh0anMvLi9ub2RlX21vZHVsZXMvaXMtcGxhaW4tb2JqZWN0L2Rpc3QvaXMtcGxhaW4tb2JqZWN0LmpzP2QxNzYiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4vKiFcbiAqIGlzLXBsYWluLW9iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtcGxhaW4tb2JqZWN0PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE3LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG8pIHtcbiAgdmFyIGN0b3IscHJvdDtcblxuICBpZiAoaXNPYmplY3QobykgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgaGFzIG1vZGlmaWVkIGNvbnN0cnVjdG9yXG4gIGN0b3IgPSBvLmNvbnN0cnVjdG9yO1xuICBpZiAoY3RvciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcblxuICAvLyBJZiBoYXMgbW9kaWZpZWQgcHJvdG90eXBlXG4gIHByb3QgPSBjdG9yLnByb3RvdHlwZTtcbiAgaWYgKGlzT2JqZWN0KHByb3QpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGNvbnN0cnVjdG9yIGRvZXMgbm90IGhhdmUgYW4gT2JqZWN0LXNwZWNpZmljIG1ldGhvZFxuICBpZiAocHJvdC5oYXNPd25Qcm9wZXJ0eSgnaXNQcm90b3R5cGVPZicpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE1vc3QgbGlrZWx5IGEgcGxhaW4gT2JqZWN0XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnRzLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0O1xuIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiaXNPYmplY3QiLCJvIiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIiwiaXNQbGFpbk9iamVjdCIsImN0b3IiLCJwcm90IiwiY29uc3RydWN0b3IiLCJ1bmRlZmluZWQiLCJoYXNPd25Qcm9wZXJ0eSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/is-plain-object/dist/is-plain-object.js\n");

/***/ })

};
;