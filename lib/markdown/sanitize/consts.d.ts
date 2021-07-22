/** default sanitize allowedTags
 **  [ 'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'iframe',
 **    'li', 'nl', 'ol', 'p', 'pre', 'strike', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul']
 **/
export declare const allowedTags: string[];
/** all sanitize allowedTags
 [ 'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code',
 'dd', 'del', 'details', 'div', 'dl', 'dt', 'em',
 'h1', 'h2','h3', 'h4', 'h5', 'h6', 'hr',
 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
 'li', 'meta', 'nl', 'ol', 'p', 'path', 'pre', 'q', 'rp', 'rt', 'ruby',
 's', 'samp', 'span','strike', 'strong', 'sub', 'summary', 'sup', 'svg',
 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul', 'var']
 **/
export declare const allowedAttributes: {
    '*': string[];
    a: string[];
    abbr: string[];
    b: any[];
    blockquote: any[];
    br: string[];
    caption: string[];
    code: any[];
    dd: any[];
    del: string[];
    details: string[];
    div: string[];
    dl: any[];
    dt: any[];
    em: any[];
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
    hr: string[];
    i: any[];
    iframe: string[];
    img: string[];
    input: string[];
    ins: string[];
    figure: any[];
    figcaption: any[];
    kbd: any[];
    li: string[];
    meta: string[];
    nl: any[];
    ol: string[];
    p: string[];
    pre: any[];
    q: string[];
    rp: any[];
    rt: any[];
    ruby: any[];
    s: any[];
    samp: any[];
    span: any[];
    strike: any[];
    strong: any[];
    sub: any[];
    summary: any[];
    sup: any[];
    table: string[];
    tbody: string[];
    td: string[];
    tfoot: string[];
    th: string[];
    thead: string[];
    tr: string[];
    ul: string[];
    var: any[];
};
export declare const generateAllowedTagsAndAttrs: (addHtmlTags?: boolean) => {
    allowedTags: string[];
    allowedAttributes: {
        '*': string[];
        a: string[];
        abbr: string[];
        b: any[];
        blockquote: any[];
        br: string[];
        caption: string[];
        code: any[];
        dd: any[];
        del: string[];
        details: string[];
        div: string[];
        dl: any[];
        dt: any[];
        em: any[];
        h1: string[];
        h2: string[];
        h3: string[];
        h4: string[];
        h5: string[];
        h6: string[];
        hr: string[];
        i: any[];
        iframe: string[];
        img: string[];
        input: string[];
        ins: string[];
        figure: any[];
        figcaption: any[];
        kbd: any[];
        li: string[];
        meta: string[];
        nl: any[];
        ol: string[];
        p: string[];
        pre: any[];
        q: string[];
        rp: any[];
        rt: any[];
        ruby: any[];
        s: any[];
        samp: any[];
        span: any[];
        strike: any[];
        strong: any[];
        sub: any[];
        summary: any[];
        sup: any[];
        table: string[];
        tbody: string[];
        td: string[];
        tfoot: string[];
        th: string[];
        thead: string[];
        tr: string[];
        ul: string[];
        var: any[];
    };
};
export declare const allowedSchemes: string[];
export declare const allowedSchemesFile: string[];
export declare const allowedClasses: {
    a: string[];
    div: string[];
    h1: string[];
    input: string[];
    li: string[];
    ol: string[];
    p: string[];
    pre: string[];
    svg: string[];
    ul: string[];
};
