import { faIcons } from "./fa-icons";
import { unicodeIcons } from "./unicode-icons";
import { squaredIcons } from "./squared-icons";
import { emojiIcons } from "./emoji-icons";

export interface IUnicodeIcon {
  symbol: string,
  unicodeHex?: string,
  code?: number,
  alias?: string,
  name?: string,
  nameUnicode?: string,
  width?: string,
  textOnly?: boolean
}

const findEmoji = (iconName: string, isMath: boolean = false): IUnicodeIcon | undefined => {
  return emojiIcons.find((item: IUnicodeIcon) => item.name === iconName && (!isMath || !item.textOnly));
};

export const findIcon = (iconName: string, isMath: boolean = false): IUnicodeIcon => {
  if (iconName.indexOf('emoji') !== -1) {
    iconName = iconName.replace(/emoji/g, "");
    iconName = iconName ? iconName.trim() : '';
    return iconName ? findEmoji(iconName, isMath) : null;
  }
  let foundIcon: IUnicodeIcon = unicodeIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName);
  if (!foundIcon) {
    foundIcon = !isMath ? findFaIcons(iconName) : null;
    if (!foundIcon) {
      foundIcon = findEmoji(iconName, isMath)
    }
  }
  return foundIcon;
}

export const findSquaredIcon = (iconName: string): IUnicodeIcon => {
  return squaredIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName)
}

export const findFaIcons = (iconName: string): IUnicodeIcon => {
  return faIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName)
}
