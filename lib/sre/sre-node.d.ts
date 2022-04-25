/**
 * Note that in asynchronous operation mode for these methods to work correctly,
 * it is necessary to ensure that the Engine is ready for processing.
 * In other words, you need to wait for the setup promise to resolve.
 * */
export declare const loadSreAsync: (options?: {}) => Promise<unknown>;
