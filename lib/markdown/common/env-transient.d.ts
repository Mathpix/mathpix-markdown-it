export declare const LIST_TRANSIENT_ENV_KEYS: readonly string[];
export declare const snapshotEnvForInline: (env: any) => any;
export declare const snapshotEnvAll: (env: any) => {
    keys: string[];
    values: any[];
};
export declare const restoreEnvAll: (env: any, snap: {
    keys: string[];
    values: any[];
}) => void;
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
