import { reSpan, reSpanG } from "../markdown/common/consts";

export const spanToClass = (math: string): string => {
  try {
    if (!reSpanG.test(math)) {
      return math;
    }

    return math.replace(reSpanG, (subStr) => {
      const match: RegExpMatchArray = subStr.match(reSpan);

      if (match && match.length > 3) {
        const className = match[2] ? match[2].trim() : '';
        const content = match[4] ? match[4].trim() : '';
        return `\\class{${className}}{${content}}`
      }
      return subStr
    });
  } catch (err) {
    console.error(err);
    return math;
  }
};
