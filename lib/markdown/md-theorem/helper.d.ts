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
export interface ITheoremLabel {
    label: string; /** reference name */
    number: string; /** theorem number */
}
export declare let theoremEnvironments: Array<ITheoremEnvironment>;
/** Global list containing information about references to theorems: reference name, theorem number */
export declare let theoremLabels: Array<ITheoremLabel>;
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
export declare const getTheoremNumberByLabel: (envLabel: string) => string;
/** Add a reference to the theorem to the global list theoremLabels
 *  whose elements contain information:
 *    label - reference name
 *    number - theorem number
 * */
export declare const addTheoremLabel: (theoremLabel: ITheoremLabel) => void;
export declare const getTheoremNumber: (envIndex: number, env: any) => string;
