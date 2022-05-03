import {
  classNameMenu,
  classNameContextMenu,
  SMALL_SCREEN_BREAKPOINT, 
  heightMenuItem,
  paddingMenu,
  maxWidthMenu,
  paddingMenuBottomSmall
} from "./consts";
import { IMenuPosition } from "./interfaces";

export const getPosition = (e) => {
  let posX = 0;
  let posY = 0;

  if (!e) {
    e = window.event;
  }

  if (e.pageX || e.pageY) {
    posX = e.pageX;
    posY = e.pageY;
  } else if (e.clientX || e.clientY) {
    posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return {
    x: posX,
    y: posY
  }
};

export const getMenuElement = () => {
  return document.querySelector(`.${classNameMenu}`);
};

export const getContextMenuElement = () => {
  return document.querySelector(`.${classNameContextMenu}`);
};

export const positionMenu = (e) => {
  const elMenu: any = getMenuElement();
  if (!elMenu) {
    return;
  }
  const clickCoords = getPosition(e);
  const clickCoordsX = clickCoords.x;
  const clickCoordsY = clickCoords.y;

  const menuWidth = elMenu.offsetWidth + 4;
  const menuHeight = elMenu.offsetHeight + 4;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  if (windowWidth <= SMALL_SCREEN_BREAKPOINT) {
    elMenu.style.left = 0;
    elMenu.style.bottom = 0;
    elMenu.style.maxWidth = '100vw';
    elMenu.classList.add('mmd-menu-sm');

    const elContextMenu = getContextMenuElement();
    if (elContextMenu && !elContextMenu.classList.contains(`${classNameContextMenu}-overlay`)) {
      elContextMenu.classList.add(`${classNameContextMenu}-overlay`);
    }
    return;
  } 
  if ( (windowWidth - clickCoordsX) < menuWidth ) {
    elMenu.style.left = windowWidth - menuWidth + "px";
  } else {
    elMenu.style.left = clickCoordsX + "px";
  }

  if ( (windowHeight - clickCoordsY) < menuHeight ) {
    elMenu.style.top = windowHeight - menuHeight + "px";
  } else {
    elMenu.style.top = clickCoordsY + "px";
  }
};

export const getPositionMenuByClick = (e, itemsLength): IMenuPosition => {
  const clickCoords = getPosition(e);
  const clickCoordsX = clickCoords.x;
  const clickCoordsY = clickCoords.y;

  let menuHeight = heightMenuItem * itemsLength + paddingMenu + 2;
  const menuWidth = maxWidthMenu + 4;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
  const res: IMenuPosition = {};
  
  if (windowWidth <= SMALL_SCREEN_BREAKPOINT) {
    menuHeight += paddingMenuBottomSmall;
    res.left = "0px";
    res.top = windowHeight + scrollTop - menuHeight + "px";
    res.maxWidth = '100vw';
    res.className = 'mmd-menu-sm';
    return res;
  }

  menuHeight += paddingMenu;
  if ( (windowWidth - clickCoordsX) < menuWidth ) {
    res.left = windowWidth - menuWidth + "px";
  } else {
    res.left = clickCoordsX + "px";
  }

  if ( (windowHeight + scrollTop - clickCoordsY) < menuHeight ) {
    res.top = windowHeight + scrollTop - menuHeight + "px";
  } else {
    res.top = clickCoordsY + "px";
  }
  return res
};

export const clickInsideElement = ( e, className ) => {
  let el = e.target;
  if ( el.classList.contains(className) ) {
    return el;
  } else {
    while ( el = el.parentNode ) {
      if ( el.classList && el.classList.contains(className) ) {
        return el;
      }
    }
  }

  return null;
};
