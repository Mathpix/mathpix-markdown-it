export declare type TParseError = Array<string>;
export declare type TParseErrorList = Array<TParseError>;
export declare var ParseErrorList: TParseErrorList;
export declare var ParseError: TParseError;
export declare const pushError: (messages: string) => void;
export declare const pushParseErrorList: (messages: TParseError, ln: number) => void;
export declare const ClearParseError: () => void;
export declare const ClearParseErrorList: () => void;
export declare const CheckParseError: (state: any, startLine: number, nextLine: number, content: string) => boolean;
