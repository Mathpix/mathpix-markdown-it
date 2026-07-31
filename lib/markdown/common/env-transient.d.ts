export declare const LIST_TRANSIENT_ENV_KEYS: readonly string[];
export declare const LIST_SPECULATIVE_ENV_KEYS: readonly string[];
export declare const snapshotEnvForInline: (env: any) => any;
export declare const snapshotEnvKeys: (env: any, keys: readonly string[]) => {
    had: {
        [k: string]: boolean;
    };
    snap: {
        [k: string]: any;
    };
};
export declare const restoreEnvKeys: (env: any, keys: readonly string[], had: {
    [k: string]: boolean;
}, snap: {
    [k: string]: any;
}) => void;
