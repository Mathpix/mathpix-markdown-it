export interface ISeparatingSpan {
    pos: number;
    content: string;
    nextPos: number;
}
export interface IContentAndSeparatingSpan {
    content: string;
    contentSpan: string;
}
export declare const getSeparatingSpanFromString: (str: string, pos: number, res: ISeparatingSpan[], previewUuid: string) => ISeparatingSpan[];
export declare const getContentAndSeparatingSpanFromLine: (line: string, pos?: number, previewUuid?: string, res?: IContentAndSeparatingSpan) => IContentAndSeparatingSpan;
export declare const removeSeparatingSpanFromContent: (content: string, previewUuid: string) => IContentAndSeparatingSpan;
export declare const getHtmlSeparatingSpanContainer: (contentSpan: string) => string;
