import { mathMenuItems } from "./menu-items";
import { chooseNextItem, choosePreviousItem } from "./menu-item-actions";
import { classNameMenu, classNameContextMenu } from "./consts";
import { getPositionMenuByClick } from "./helper";
import { IMenuPosition } from "./interfaces";

const handleKeyDownMenuItem = (e) => {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      chooseNextItem();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      choosePreviousItem();
      break;
    
  }
};

const addEventListenerToMenu = (elMenu) => {
  elMenu.addEventListener('keydown', handleKeyDownMenuItem);
};

const removeEventListenerFromMenu = () => {
  const elMenu = document.querySelector(`.${classNameMenu}`);
  if (!elMenu) {
    return;
  }
  elMenu.removeEventListener('keydown', handleKeyDownMenuItem);
};

const findContextMenuElement = () => {
  return document.querySelector(`.${classNameContextMenu}`);
};

export const createContextMenu = (el, e) => {
  try {
    const items = mathMenuItems(el);
    if (!items || !items.length) {
      return;
    }
    const elCtxtMenu = document.createElement('div');
    elCtxtMenu.setAttribute('class', classNameContextMenu);
    elCtxtMenu.setAttribute('style', 'position: absolute; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;');
    
    const elPosition = document.createElement('div');
    elPosition.setAttribute('style', 'position: fixed; left: 0px; top: 0px; z-index: 200; width: 100%; height: 100%; border: 0px; padding: 0px; margin: 0px;');
    elCtxtMenu.appendChild(elPosition);

    const elMenu = document.createElement('div');
    elMenu.setAttribute('class', classNameMenu);
    elMenu.setAttribute('role', 'menu');
    elMenu.setAttribute('aria-label', 'Copy to Clipboard');
    elMenu.setAttribute('tabindex', '0');

    for (let i = 0; i < items.length; i++) {
      elMenu.appendChild(items[i]);
    }
    
    const resPos: IMenuPosition = getPositionMenuByClick(e, items.length);
    if (resPos.className === 'mmd-menu-sm') {
      elMenu.style.left = resPos.left;
      elMenu.style.bottom = "0";
      elMenu.style.position = 'fixed';
      elMenu.style.maxWidth = resPos.maxWidth;
      elMenu.classList.add(resPos.className);
      elPosition.classList.add(`${classNameContextMenu}-overlay`);
    } else {
      elMenu.style.left = resPos.left;
      elMenu.style.top = resPos.top;
    }

    addEventListenerToMenu(elMenu);
    
    elCtxtMenu.appendChild(elMenu);
    
    document.body.appendChild(elCtxtMenu);
    elMenu.focus();
  } catch (err) {
    console.error(err);
  }
};

export const dropContextMenu = (elContextMenu?) => {
  try {
    if (!elContextMenu) {
      elContextMenu = findContextMenuElement();
    }
    if (elContextMenu) {
      removeEventListenerFromMenu();
      document.body.removeChild(elContextMenu);
    }
  } catch (err) {
    console.error(err);
  }
};

export const isOpenContextMenu = () => {
  const elContextMenu = findContextMenuElement();
  return Boolean(elContextMenu);
};

export const toggleMenuOn = (el, e) => {
  const elContextMenu = findContextMenuElement();
  if (!elContextMenu) {
    createContextMenu(el, e);
  } else {
    dropContextMenu(elContextMenu);
    createContextMenu(el, e);
  }
};

export const toggleMenuOff = () => {
  dropContextMenu();
};
