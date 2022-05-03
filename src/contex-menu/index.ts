import { toggleMenuOn, toggleMenuOff, isOpenContextMenu } from "./menu";
import { clickInsideElement } from "./menu/helper";
import { classNameMenuItem } from "./menu/consts";
import { chooseItem, clearActiveItem } from "./menu/menu-item-actions";

let isCloseByTouchStart = false;

const handleContextMenu = (e) => {
  let elMath = clickInsideElement( e, 'MathJax' );
  if (elMath && elMath.parentElement) {
    e.preventDefault();
    toggleMenuOn(elMath.parentElement, e);
  } else {
    toggleMenuOff();
  }
};

export const handleTouchStart = (e) => {
  const elItem = clickInsideElement( e, classNameMenuItem );

  isCloseByTouchStart = false;
  if (isOpenContextMenu() && !elItem) {
    e.stopPropagation();
    toggleMenuOff();
    isCloseByTouchStart = true;
  }
};

export const handleClick = (e) => {
  if ("ontouchstart" in document.documentElement) {
    let elMath = clickInsideElement(e, 'MathJax');
    if (elMath) {
      if (isCloseByTouchStart) {
        isCloseByTouchStart = false;
        return;
      }
      e.stopPropagation();
      if (isOpenContextMenu()) {
        toggleMenuOff();
      } else {
        toggleMenuOn(elMath.parentElement, e);
      }
      return;
    }
  }
  
  const elItem = clickInsideElement( e, classNameMenuItem );
  if (elItem) {
    e.stopPropagation();
    clearActiveItem();
    chooseItem(elItem);
  } else {
    toggleMenuOff();
  }
};

export const handleKeyUp = (e) => {
  if (e.key === 'Escape') {
    toggleMenuOff();
  }
};

export const handleResize = () => {
  toggleMenuOff();
};
  
export const addContextMenuListener = () => {
  document.addEventListener( "contextmenu", handleContextMenu);
};

export const removeContextMenuListener = () => {
  document.removeEventListener( "contextmenu", handleContextMenu);
};

export const addClickListener = () => {
  document.addEventListener( "click", handleClick);
};

export const removeClickListener = () => {
  document.removeEventListener( "click", handleClick);
};

export const addKeyUpListener = () => {
  document.addEventListener( "keyup", handleKeyUp);
};

export const removeKeyUpListener = () => {
  document.removeEventListener( "keyup", handleKeyUp);
};

export const addResizeListener = () => {
  document.addEventListener( "resize", handleResize);
};

export const removeResizeListener = () => {
  document.removeEventListener( "resize", handleResize);
};

export const addTouchStartListener = () => {
  document.addEventListener( "touchstart", handleTouchStart);
};

export const removeTouchStartListener = () => {
  document.removeEventListener( "touchstart", handleTouchStart);
};

export const addListenerContextMenuEvents = () => {
  addContextMenuListener();
  addClickListener();
  addKeyUpListener();
  addResizeListener();
  addTouchStartListener();
};

export const removeListenerContextMenuEvents = () => {
  removeContextMenuListener();
  removeClickListener();
  removeKeyUpListener();
  removeResizeListener();
  removeTouchStartListener();
};
