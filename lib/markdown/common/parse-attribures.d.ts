/**
 * Parse a comma-separated attribute string into an object.
 *
 * Examples:
 *   "language=JavaScript, mathescape"
 *     → { language: "JavaScript", mathescape: true }
 *
 * - Attributes are split by commas.
 * - Each attribute may be "key=value" or just "key" (interpreted as `true`).
 * - Whitespace around keys/values is trimmed.
 */
export declare const parseAttributes: (str: string) => Record<string, string | true>;
