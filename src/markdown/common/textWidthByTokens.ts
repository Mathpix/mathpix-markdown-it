import {fontMetrics} from "../../helpers/text-dimentions";

const fonSize = 16;
export const getTextWidthByTokens = (tokens, fontType = 'normal', widthEx = 0, heightEx = 0) => {
  try {
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (token.type === 'text') {
        let widthTextEx = fontMetrics.getWidthInEx(token.content, fonSize, fontType);
        if (widthTextEx) {
          widthEx += widthTextEx;
        }
        continue;
      }
      if (token.type === 'textbf' || token.type === 'textit') {
        if (token.children?.length) {
          let data = getTextWidthByTokens(token.children, 'bold', widthEx, heightEx);
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
    console.log("[ERROR]=>[getTextWidthByTokens]=>err=>", err);
    return {
      widthEx: 0,
      heightEx: 0
    }
  }
}
