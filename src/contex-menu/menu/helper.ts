import { classNameMenu, SMALL_SCREEN_BREAKPOINT } from './consts';

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
    elMenu.style.maxWidth = '100vw';
  } else {
    if ( (windowWidth - clickCoordsX) < menuWidth ) {
      elMenu.style.left = windowWidth - menuWidth + "px";
    } else {
      elMenu.style.left = clickCoordsX + "px";
    }
  }

  if ( (windowHeight - clickCoordsY) < menuHeight ) {
    elMenu.style.top = windowHeight - menuHeight + "px";
  } else {
    elMenu.style.top = clickCoordsY + "px";
  }
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
