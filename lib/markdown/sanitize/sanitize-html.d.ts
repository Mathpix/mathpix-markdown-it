declare const htmlparser: any;
declare const escapeStringRegexp: any;
declare const isPlainObject: any;
declare const deepmerge: any;
declare const parseSrcset: any;
declare const postcssParse: any;
declare const mediaTags: string[];
declare const vulnerableTags: string[];
declare function each(obj: any, cb: any): void;
declare function has(obj: any, key: any): any;
declare function filter(a: any, cb: any): any[];
declare function isEmptyObject(obj: any): boolean;
declare function stringifySrcset(parsedSrcset: any): any;
declare const VALID_HTML_ATTRIBUTE_NAME: RegExp;
declare function sanitizeHtml(html: any, options: any, _recursing: any): string;
declare namespace sanitizeHtml {
    var defaults: {
        allowedTags: string[];
        disallowedTagsMode: string;
        allowedAttributes: {
            a: string[];
            img: string[];
        };
        selfClosing: string[];
        allowedSchemes: string[];
        allowedSchemesByTag: {};
        allowedSchemesAppliedToAttributes: string[];
        allowProtocolRelative: boolean;
        enforceHtmlBoundary: boolean;
        skipCloseTag: boolean;
    };
    var simpleTransform: (newTagName: any, newAttribs?: any, merge?: any) => (tagName: any, attribs: any) => {
        tagName: any;
        attribs: any;
    };
}
declare const htmlParserDefaults: {
    decodeEntities: boolean;
};
