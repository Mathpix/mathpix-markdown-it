import { mathExportTypes } from "./consts";
import { createMathMenuItem } from "./menu-item";
import { parseMmdElement } from "../../helpers/parse-mmd-element";

export const mathMenuItems = (el) => {
  const items = [];
  try {
    const res = parseMmdElement(el);
    if (!res || !res.length) {
      return items;
    }
    
    for (let i = 0; i < mathExportTypes.length; i++) {
      const resItem = res.find(item => item.type === mathExportTypes[i]);
      if (!resItem) {
        continue;
      }
      
      let item = createMathMenuItem(resItem.type, resItem.value);
      if (item) {
        items.push(item);
      }
    }
    
    return items;
  } catch (err) {
    console.error(err);
    return items;
  }
};
