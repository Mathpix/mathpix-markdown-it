// Parse link destination
//
'use strict';


var unescapeAll = require('markdown-it/lib/common/utils').unescapeAll;

export function parseLinkDestination(str, pos, max) {
    var code, level,
        lines = 0,
        start = pos,
        result = {
            ok: false,
            pos: 0,
            lines: 0,
            str: ''
        };
    if (str.charCodeAt(pos) === 0x3C /* < */) {
        pos++;
        while (pos < max) {
            code = str.charCodeAt(pos);
            if (code === 0x0A /* \n */) { return result; }
            if (code === 0x3E /* > */) {
                result.pos = pos + 1;
                result.str = unescapeAll(str.slice(start + 1, pos));
                result.ok = true;
                return result;
            }
            if (code === 0x5C /* \ */ && pos + 1 < max) {
                pos += 2;
                continue;
            }

            pos++;
        }

        // no closing '>'
        return result;
    }

    // this should be ... } else { ... branch

    level = 0;
    let hasPoint = false;
    let beforeCode: number = -1;
    while (pos < max) {
        code = str.charCodeAt(pos);

        if (code === 0x20 /* space */ && hasPoint) {
            break;
        }

        if (code === 0x2E /* . */) {
            if (beforeCode !== -1 && beforeCode !==  0x2E /* . */ && beforeCode !== 0x2F/* / */ ) {
                hasPoint = true;
            }
        }

        // ascii control characters
        if (code < 0x20 || code === 0x7F) { break; }

        if (code === 0x5C /* \ */ && pos + 1 < max) {
            pos += 2;
            continue;
        }

        if (code === 0x28 /* ( */) {
            level++;
        }

        if (code === 0x29 /* ) */) {
            if (level === 0) { break; }
            level--;
        }

        pos++;
        beforeCode = code;
    }

    if (start === pos) { return result; }
    if (level !== 0) { return result; }

    result.str = unescapeAll(str.slice(start, pos));
    result.lines = lines;
    result.pos = pos;
    result.ok = true;
    return result;
};

