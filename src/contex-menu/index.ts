import { toggleMenuOn, toggleMenuOff } from "./menu";
import { positionMenu, clickInsideElement } from "./menu/helper";
import { classNameMenuItem } from "./menu/consts";

const handleContextMenu = (e) => {
  let elMath = clickInsideElement( e, 'MathJax' );
  
  if (elMath && elMath.parentElement) {
    e.preventDefault();
    toggleMenuOn(elMath.parentElement);
    positionMenu(e);
  } else {
    toggleMenuOff();
  }
};

export const handleClick = (e) => {
  const elItem = clickInsideElement( e, classNameMenuItem );
  if (!elItem) {
    toggleMenuOff();
  }
};

export const handleKeyUp = (e) => {
  console.log('handleKeyUp=>e=>', e);
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

export const addListenerContextMenuEvents = () => {
  addContextMenuListener();
  addClickListener();
  addKeyUpListener();
  addResizeListener();
};

export const removeListenerContextMenuEvents = () => {
  removeContextMenuListener();
  removeClickListener();
  removeKeyUpListener();
  removeResizeListener();
};
