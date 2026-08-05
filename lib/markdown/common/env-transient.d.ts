export declare const LIST_TRANSIENT_ENV_KEYS: readonly string[];
export declare const snapshotEnvForInline: (env: any) => any;
export interface EnvSnapshot {
    keys: string[];
    values: any[];
    length: number;
}
export declare const snapshotEnvAll: (env: any) => EnvSnapshot;
export declare const releaseEnvSnapshot: () => void;
export declare const restoreEnvAll: (env: any, snap: EnvSnapshot) => void;
export declare const restoreEnvKeysFromAll: (env: any, keys: readonly string[], snap: EnvSnapshot) => void;
