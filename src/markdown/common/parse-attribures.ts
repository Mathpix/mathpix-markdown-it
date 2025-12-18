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
export const parseAttributes = (str: string): Record<string, string | boolean> => {
  const result: Record<string, string | boolean> = {};
  try {
    str.split(",").forEach(pair => {
      const [key, value] = pair.split("=").map(s => s.trim());
      // no explicit value -> treat as boolean flag = true
      if (!value) {
        result[key] = true;
        return;
      }
      const lower = value.toLowerCase();
      if (lower === "true") {
        result[key] = true;
      } else if (lower === "false") {
        result[key] = false;
      } else {
        result[key] = value;
      }
    });
    return result;
  } catch (err) {
    console.error("[ERROR]=>[parseAttributes]=>", err);
    return result;
  }
}
