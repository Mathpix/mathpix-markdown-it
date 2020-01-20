import ParseOptions from '../ParseOptions.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
import { MathItem } from '../../../core/MathItem.js';
import { MathDocument } from '../../../core/MathDocument.js';
declare type MATHITEM = MathItem<any, any, any>;
declare type MATHDOCUMENT = MathDocument<any, any, any>;
declare type FilterData = {
    math: MATHITEM;
    document: MATHDOCUMENT;
    data: ParseOptions;
};
export declare let balanceRules: (arg: FilterData) => void;
export declare let setProperty: (node: MmlNode, property: string, value: string | number | boolean) => void;
export declare let getProperty: (node: MmlNode, property: string) => string | number | boolean;
export declare let removeProperty: (node: MmlNode, property: string) => void;
export declare let makeBsprAttributes: (arg: FilterData) => void;
export declare let saveDocument: (arg: FilterData) => void;
export declare let clearDocument: (arg: FilterData) => void;
export {};
