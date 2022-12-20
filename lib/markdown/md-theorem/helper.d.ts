export interface ITheoremEnvironment {
    name: string;
    print: string;
    counter: number;
    counterName: string;
    isNumbered: boolean;
    lastNumber?: string;
    parentNumber?: string;
    style: string;
}
export declare let theoremEnvironments: Array<ITheoremEnvironment>;
export declare let envNumbers: any[];
export declare let counterProof: number;
export declare const getNextCounterProof: () => number;
export declare const addTheoremEnvironment: (data: ITheoremEnvironment) => void;
export declare const setCounterTheoremEnvironment: (envName: string, num: number) => boolean;
export declare const getTheoremEnvironment: (name: string) => ITheoremEnvironment;
export declare const getTheoremEnvironmentIndex: (name: string) => number;
export declare const resetTheoremEnvironments: () => void;
export declare const getTheoremNumberByLabel: (envLabel: string) => any;
export declare const getTheoremNumber: (envIndex: number, env: any) => string;
