/**
 * Returns true when running in a browser environment (not SSR / Node).
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};
