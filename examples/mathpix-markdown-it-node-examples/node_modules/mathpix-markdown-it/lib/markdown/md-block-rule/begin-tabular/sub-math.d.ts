declare type TSubMath = {
    id: string;
    content: string;
};
export declare const ClearSubMathLists: () => void;
export declare const mathTablePush: (item: TSubMath) => void;
export declare const getMathTableContent: (sub: string, i: number) => string;
export declare const getSubMath: (str: string) => string;
export {};
