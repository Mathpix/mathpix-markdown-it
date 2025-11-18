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
export const parseAttributes = (str: string): Record<string, string | true> => {
  const result: Record<string, string | true> = {};
  try {
    str.split(",").forEach(pair => {
      const [key, value] = pair.split("=").map(s => s.trim());
      result[key] = value || true;
    });

    return result;
  } catch (err) {
    console.error("[ERROR]=>[parseAttributes]=>", err);
    return result;
  }
}
