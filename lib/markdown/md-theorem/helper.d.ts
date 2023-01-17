export interface ITheoremEnvironmentParents {
    env: string;
    num: number;
}
export interface ITheoremEnvironment {
    name: string;
    print: string;
    counter: number;
    counterName: string;
    isNumbered: boolean;
    lastNumber?: string;
    parentNumber?: string;
    parents?: Array<ITheoremEnvironmentParents>;
    style: string;
    useCounter?: string;
}
export interface IEnvironmentsCounter {
    environment: string;
    counter: number;
}
export declare let theoremEnvironments: Array<ITheoremEnvironment>;
export declare let counterProof: number;
export declare let environmentsCounter: Array<IEnvironmentsCounter>;
export declare const addEnvironmentsCounter: (data: IEnvironmentsCounter) => void;
export declare const getEnvironmentsCounterIndex: (environment: string) => number;
export declare const getNextCounterProof: () => number;
export declare const addTheoremEnvironment: (data: ITheoremEnvironment) => void;
export declare const setCounterTheoremEnvironment: (envName: string, num: number) => boolean;
export declare const getTheoremEnvironment: (name: string) => ITheoremEnvironment;
export declare const getTheoremEnvironmentIndex: (name: string) => number;
/** Reset global counters for theorems and clear lists storing information about styles and descriptions of theorems */
export declare const resetTheoremEnvironments: () => void;
export declare const getTheoremNumber: (envIndex: number, env: any) => string;
