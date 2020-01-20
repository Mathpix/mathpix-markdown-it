import { ParseMethod } from './Types.js';
import { HandlerType } from './MapHandler.js';
import { StackItemClass } from './StackItem.js';
import { TagsClass } from './Tags.js';
import { OptionList } from '../../util/Options.js';
import { FunctionList } from '../../util/FunctionList.js';
import { TeX } from '../tex.js';
export declare type HandlerConfig = {
    [P in HandlerType]?: string[];
};
export declare type FallbackConfig = {
    [P in HandlerType]?: ParseMethod;
};
export declare type StackItemConfig = {
    [kind: string]: StackItemClass;
};
export declare type TagsConfig = {
    [kind: string]: TagsClass;
};
export declare type ProcessorList = (Function | [Function, number])[];
export declare class Configuration {
    readonly name: string;
    readonly handler: HandlerConfig;
    readonly fallback: FallbackConfig;
    readonly items: StackItemConfig;
    readonly tags: TagsConfig;
    readonly options: OptionList;
    readonly nodes: {
        [key: string]: any;
    };
    readonly preprocessors: ProcessorList;
    readonly postprocessors: ProcessorList;
    protected initMethod: FunctionList;
    protected configMethod: FunctionList;
    static create(name: string, config?: {
        handler?: HandlerConfig;
        fallback?: FallbackConfig;
        items?: StackItemConfig;
        tags?: TagsConfig;
        options?: OptionList;
        nodes?: {
            [key: string]: any;
        };
        preprocessors?: ProcessorList;
        postprocessors?: ProcessorList;
        init?: Function;
        priority?: number;
        config?: Function;
        configPriority?: number;
    }): Configuration;
    static empty(): Configuration;
    static extension(): Configuration;
    init(configuration: Configuration): void;
    config(configuration: Configuration, jax: TeX<any, any, any>): void;
    append(config: Configuration): void;
    register(config: Configuration, jax: TeX<any, any, any>, options?: OptionList): void;
    private constructor();
}
export declare namespace ConfigurationHandler {
    let set: (name: string, map: Configuration) => void;
    let get: (name: string) => Configuration;
    let keys: () => IterableIterator<string>;
}
