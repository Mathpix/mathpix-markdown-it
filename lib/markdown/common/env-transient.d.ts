export declare const LIST_TRANSIENT_ENV_KEYS: readonly string[];
export declare const snapshotEnvForInline: (env: any) => any;
export interface EnvSnapshot {
    keys: string[];
    values: any[];
    length: number;
    takeId: number;
}
export declare const snapshotEnvAll: (env: any) => EnvSnapshot;
/** Live snapshots. Zero between parses; above it, one was never released. */
export declare const envSnapshotDepth: () => number;
export declare const releaseEnvSnapshot: () => void;
export declare const restoreEnvAll: (env: any, snap: EnvSnapshot) => void;
export declare const resetEnvSnapshotPool: () => void;
export declare const restoreEnvKeysFromAll: (env: any, keys: readonly string[], snap: EnvSnapshot) => void;
