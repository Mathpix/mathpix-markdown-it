import { faIcons } from "./fa-icons";
import { unicodeIcons } from "./unicode-icons";
import { squaredIcons } from "./squared-icons";
import { emojiIcons } from "./emoji-icons";
import { cssColors } from "./css-colors";

export interface IUnicodeIcon {
  symbol: string,
  unicodeHex?: string,
  code?: number,
  alias?: string,
  name?: string,
  nameUnicode?: string,
  width?: string,
  textOnly?: boolean,
  tags?: Array<string>
}

export interface IIcon {
  icon: IUnicodeIcon;
  name?: string;
  color?: string;
  isSquared?: boolean;
}

const findEmoji = (iconName: string, isMath: boolean = false): IUnicodeIcon | undefined => {
  return emojiIcons.find((item: IUnicodeIcon) => item.name === iconName && (!isMath || !item.textOnly));
};

export const findSquaredIcon = (iconName: string): IUnicodeIcon => {
  return squaredIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName)
}

export const findSquaredIconByName = (iconName: string): IUnicodeIcon => {
  return squaredIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName)
}

export const findSquaredIconByTag = (tag: string): IUnicodeIcon => {
  return squaredIcons.find((item: IUnicodeIcon) => item.tags?.includes(tag))
}

export const findFaIconsByName = (iconName: string): IUnicodeIcon => {
  return faIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName)
}

export const findFaIconsByTag = (tag: string): IUnicodeIcon => {
  return faIcons.find((item: IUnicodeIcon) => item.tags?.includes(tag))
}

const findIconByName = (iconName: string, isMath: boolean = false): IUnicodeIcon => {
  let foundIcon: IUnicodeIcon = unicodeIcons.find((item: IUnicodeIcon) => item.alias === iconName || item.name === iconName);
  if (!foundIcon) {
    foundIcon = !isMath ? findFaIconsByName (iconName) : null;
    if (!foundIcon) {
      foundIcon = findEmoji(iconName, isMath)
    }
  }
  return foundIcon;
}

const findIconByTag = (tag: string, isMath: boolean = false): IUnicodeIcon => {
  let foundIcon: IUnicodeIcon = unicodeIcons.find((item: IUnicodeIcon) => item.tags.includes(tag));
  if (!foundIcon) {
    foundIcon = !isMath ? findFaIconsByTag(tag) : null;
  }
  return foundIcon;
}

const parseIconNameAndColor = (iconName: string): {parsedName: string, parsedColor: string} => {
  const reColor: RegExp = /\bcolor\s*=\s*(#[0-9a-fA-F]{3,8}|\w+\([^)]*\)|[a-zA-Z]+)/;
  // Attempt to match color pattern
  const match: RegExpMatchArray = iconName.match(reColor);
  if (match) {
    // Color is present, split icon name and color
    const parsedName: string = iconName.slice(0, match.index).trim();
    const parsedColor: string = match[1] || '';
    return { parsedName, parsedColor };
  }
  // If no color found, split the name and the rest of the string
  const parts: string[] = iconName.split(/\s+/);
  const parsedName: string = parts[0];  // The first part is the icon name
  const parsedColor: string = parts.length > 1 ? parts.slice(1).join(' ').trim() : '';
  return { parsedName, parsedColor };
}

export const findIcon = (iconName: string, isMath: boolean = false): IIcon => {
  if (iconName.includes('emoji')) {
    const cleanIconName: string = iconName.replace(/emoji/g, "")?.trim();
    return {
      icon: cleanIconName ? findEmoji(cleanIconName, isMath) : null,
      name: cleanIconName,
      color: '',
      isSquared: false
    };
  }
  // Let's analyze the icon and color
  const {parsedName, parsedColor } = parseIconNameAndColor(iconName);
  let iconNameParsed = parsedName || iconName;
  let color = parsedColor || '';
  if (!iconNameParsed) {
    return { icon: null, name: '', color: '', isSquared: false };
  }
  // Attempt to find the icon by name
  let foundIcon: IUnicodeIcon = findIconByName(iconNameParsed, isMath);
  if (foundIcon) {
    return { icon: foundIcon, name: iconNameParsed, color: color, isSquared: false };
  }
  // Check for a squared variant of the icon
  foundIcon = findSquaredIconByName(iconNameParsed);
  if (foundIcon) {
    return { icon: foundIcon, name: iconNameParsed, color: color, isSquared: true }
  }
  // If no icon is found, check for color-prefixed icons
  if (iconNameParsed.includes('_')) {
    const [colorName, ...rest] = iconNameParsed.split('_');
    const tag: string = `color_${rest.join('_')}`;
    if (cssColors.includes(colorName) && rest.length > 0) {
      foundIcon = findIconByTag(tag, isMath);
      if (foundIcon) {
        return { icon: foundIcon, name: iconNameParsed, color: colorName, isSquared: false }
      }
      foundIcon = findSquaredIconByTag(tag);
      if (foundIcon) {
        return { icon: foundIcon, name: iconNameParsed, color: colorName, isSquared: true }
      }
    }
  }
  return { icon: null, name: iconNameParsed, color: '', isSquared: false };
}
