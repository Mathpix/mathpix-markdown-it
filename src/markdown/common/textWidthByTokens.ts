import { Token } from 'markdown-it';
import { eFontType, fontMetrics } from "./text-dimentions";

export interface ISizeEx {
  widthEx: number,
  heightEx: number
}
export const getTextWidthByTokens = (
  tokens: Array<Token>,
  widthEx: number = 0,
  heightEx: number = 0,
  fontType: eFontType = eFontType.normal
): ISizeEx => {
  try {
    for (let i = 0; i < tokens.length; i++) {
      let token: Token = tokens[i];
      if (token.type === 'text') {
        let widthTextEx: number = fontMetrics.getWidthInEx(token.content, fontType);
        if (widthTextEx) {
          widthEx += widthTextEx;
        }
        continue;
      }
      if (token.type === 'textbf' || token.type === 'textit') {
        if (token.children?.length) {
          let data: ISizeEx = getTextWidthByTokens(token.children, widthEx, heightEx, eFontType.bold);
          if (data) {
            widthEx = data.widthEx;
            heightEx = data.heightEx;
          }
        }
        continue;
      }
      if (token.widthEx) {
        widthEx += token.widthEx;
      }
      if (token.heightEx && heightEx < token.heightEx) {
        heightEx = token.heightEx;
      }
    }
    return {
      widthEx: widthEx,
      heightEx: heightEx
    }
  } catch (err) {
    console.error("[ERROR]=>[getTextWidthByTokens]=>err=>", err);
    return {
      widthEx: 0,
      heightEx: 0
    }
  }
}
