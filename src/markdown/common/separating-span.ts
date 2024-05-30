import {
  markerBeginTagSpan,
  markerCloseTagSpan,
  reSeparatingSpan,
  reSeparatingSpanG,
} from "./consts";

export interface ISeparatingSpan {
  pos: number,
  content: string,
  nextPos: number
}

export interface IContentAndSeparatingSpan {
  content: string,
  contentSpan: string
}

export const getSeparatingSpanFromString = (
  str: string,
  pos: number = 0,
  res: ISeparatingSpan[],
  previewUuid: string
): ISeparatingSpan[] => {
  try {
    if (!str?.trim()?.length) {
      return res;
    }
    let max: number = str.length;
    // Ensure we are starting at a '<' character
    if (str.charCodeAt(pos) !== 0x3C/* < */) {
      return res;
    }
    // Check for opening span tag
    const sMatch: RegExpMatchArray = str.slice(pos).match(markerBeginTagSpan);
    if (!sMatch) {
      return res;
    }
    // Check for closing span tag
    const sMatchEnd: RegExpMatchArray = str.slice(pos).match(markerCloseTagSpan);
    if (!sMatchEnd) {
      return res;
    }

    let nextPos: number = pos + sMatchEnd.index + sMatchEnd[0].length;
    // Skip spaces after the closing tag
    while (nextPos < max && str.charCodeAt(nextPos) === 0x20 /* space */) {
      nextPos++;
    }
    const content: string = str.slice(pos, nextPos);
    const match: RegExpMatchArray = content.match(reSeparatingSpan);
    if (!match || match.length < 3) {
      return res
    }
    const className: string = match.groups?.className;
    if (className?.indexOf(`preview-uuid-${previewUuid}`) !== -1) {
      res.push({
        pos: pos,
        content: content,
        nextPos: nextPos
      });
      if (nextPos < max) {
        return getSeparatingSpanFromString(str, nextPos, res, previewUuid);
      }
    }
    return res;
  } catch (err) {
    console.error(err);
    return res;
  }
};

export const getContentAndSeparatingSpanFromLine = (
  line: string,
  pos: number = 0,
  previewUuid: string = '',
  res: IContentAndSeparatingSpan = {content: '', contentSpan: ''}
): IContentAndSeparatingSpan => {
  try {
    const max: number = line?.length;
    while (pos < max) {
      const match: RegExpMatchArray = line.slice(pos).match(reSeparatingSpanG);
      if (match) {
        const className: string = match.groups?.className;
        if (className?.includes(`preview-uuid-${previewUuid}`)) {
          const nextPos: number = pos + match.index + match[0].length;
          const content: string = line.slice(pos, pos + match.index);
          const contentSpan: string = line.slice(pos + match.index, nextPos);
          res.content += content;
          res.contentSpan += contentSpan;
          pos = nextPos;
          continue;
        }
      }
      res.content += line.slice(pos);
      break;
    }
    return res;
  } catch (err) {
    console.error(err);
    return {
      content: line,
      contentSpan: ""
    }
  }
};

export const removeSeparatingSpanFromContent = (
  content: string,
  previewUuid: string
): IContentAndSeparatingSpan => {
  try {
    const lines: string[] = content.split('\n');
    const arrContent: string[] = [];
    const arrSpan: string[] = [];

    for (const line of lines) {
      if (!reSeparatingSpanG.test(line)) {
        arrContent.push(line);
        arrSpan.push('');
        continue;
      }
      const data: IContentAndSeparatingSpan = getContentAndSeparatingSpanFromLine(line, 0,  previewUuid);
      arrContent.push(data.content);
      arrSpan.push(data.contentSpan);
    }
    return {
      content: arrContent.join('\n'),
      contentSpan: arrSpan.join('\n'),
    };
  } catch (err) {
    console.error(err);
    return {
      content: content,
      contentSpan: "",
    };
  }
};

export const getHtmlSeparatingSpanContainer = (contentSpan: string): string => {
  if (!contentSpan?.trim()?.length) {
    return "";
  }
  try {
    const spanList: string[] = contentSpan.trimRight().split('\n');
    const htmlSpans: string = spanList
      .map((line, index) => {
        const htmlLineNumber: string = `<span style="display: none">${index.toString()}</span>`
        return line ? `${htmlLineNumber}${line}<br>` : `${htmlLineNumber}<br>`
      })
      .join('');
    let style: string = "left: 0; " +
      "top: 0; " +
      "position: absolute; " +
      "width: 100%; " +
      "height: 100%; " +
      "padding: 1rem; " +
      "font-size: 15px; " +
      "line-height: 24px;";
    return `<div class="separating-span-container" style="${style}">${htmlSpans}</div>`;
  } catch (err) {
    console.error(err);
    return "";
  }
};