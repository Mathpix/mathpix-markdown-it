import { mathMenuItems } from "./menu-items";
import { chooseItem, clearActiveItem, chooseNextItem, choosePreviousItem } from "./menu-item-actions";
import { clickInsideElement } from "./helper";
import { classNameMenu, classNameContextMenu, classNameMenuItem } from "./consts";

const handleClickMenuItem = (e) => {
  const el = clickInsideElement(e, classNameMenuItem);
  if (el) {
    e.preventDefault();
    clearActiveItem();
    chooseItem(el);
  }
};

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
  elMenu.addEventListener("click", handleClickMenuItem);
  elMenu.addEventListener('keydown', handleKeyDownMenuItem);
};

const removeEventListenerFromMenu = () => {
  const elMenu = document.querySelector(`.${classNameMenu}`);
  if (!elMenu) {
    return;
  }
  elMenu.removeEventListener("click", handleClickMenuItem);
  elMenu.removeEventListener('keydown', handleKeyDownMenuItem);
};

const findContextMenuElement = () => {
  return document.querySelector(`.${classNameContextMenu}`);
};

export const createContextMenu = (el) => {
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
    elMenu.setAttribute('tabindex', '0');

    for (let i = 0; i < items.length; i++) {
      elMenu.appendChild(items[i]);
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

export const toggleMenuOn = (el) => {
  const elContextMenu = findContextMenuElement();
  if (!elContextMenu) {
    createContextMenu(el);
  } else {
    dropContextMenu(elContextMenu);
    createContextMenu(el);
  }
};

export const toggleMenuOff = () => {
  dropContextMenu();
};
