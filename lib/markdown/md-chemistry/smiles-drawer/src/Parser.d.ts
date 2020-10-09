declare class pegSyntaxError extends Error {
    expected: any;
    found: any;
    location: any;
    name: string;
    constructor(message: any, expected: any, found?: any, location?: any);
}
declare function peg$parse(input: any, options: any): any;
declare const Parser: {
    SyntaxError: typeof pegSyntaxError;
    parse: typeof peg$parse;
};
export default Parser;
