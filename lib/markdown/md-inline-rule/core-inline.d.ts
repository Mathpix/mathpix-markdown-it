/** Top-level inline rule executor
 * Replace inline core rule
 *
 * By default the state.env that is passed to the inline parser only has the latest values.
 * We add this rule to be able to pass the current variables (obtained during block parsing) to the inline parser.
 * This is necessary to match labels with the current block.
 * */
export declare const coreInline: (state: any) => void;
