/** Reset per-parse module-level state. Auto-invoked at parse start via the
 *  reset_mmd_global_state core-ruler hook; export exists for one-shot
 *  converters to release state after render. */
export declare const resetMmdGlobalState: () => void;
