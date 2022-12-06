import { RuleBlock, RuleInline } from 'markdown-it';
export interface ITheoremEnvironment {
    name: string;
    print: string;
    counter: number;
    counterName: string;
    isNumbered: boolean;
    lastNumber?: string;
    parentNumber?: string;
}
export declare let envNumbers: any[];
export declare let theorems: any[];
export declare const openTag: RegExp;
export declare const openTagDescription: RegExp;
export declare const addTheoremEnvironment: (data: ITheoremEnvironment) => void;
export declare const getTheoremEnvironment: (name: string) => ITheoremEnvironment;
export declare const getTheoremEnvironmentIndex: (name: string) => number;
export declare const resetTheoremEnvironments: () => void;
export declare const getTheoremNumberByLabel: (envLabel: string) => any;
export declare const newTheoremBlock: RuleBlock;
/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
export declare const newTheorem: RuleInline;
export declare const BeginEnvironmentBlock: RuleBlock;
export declare const mappingTheorems: {
    newtheorem: string;
    theorem_open: string;
    theorem_close: string;
};
export declare const renderTheorems: (md: any) => void;
