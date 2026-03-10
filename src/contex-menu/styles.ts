import { heightMenuItem, paddingMenu, paddingMenuBottomSmall, maxWidthMenu } from "./menu/consts";
import {
  COLOR_BODY_TEXT, COLOR_MENU_BORDER, COLOR_MENU_SHADOW,
  COLOR_MENU_ITEM_ACTIVE_BG, COLOR_MENU_ITEM_VALUE,
  COLOR_MENU_OVERLAY, COLOR_DARK_MENU_TITLE, COLOR_DARK_MENU_BG,
} from "../styles/colors";

export const menuStyle = () => {
  return `
.mmd-menu {
  max-width: ${maxWidthMenu}px;
  position: absolute;
  background-color: white;
  color: black;
  width: auto;
  padding: ${paddingMenu}px 0;
  border: 1px solid ${COLOR_MENU_BORDER};
  margin: 0;
  cursor: default;
  font: menu;
  text-align: left;
  text-indent: 0;
  text-transform: none;
  line-height: normal;
  letter-spacing: normal;
  word-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  float: none;
  z-index: 201;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  -khtml-border-radius: 5px;
  box-shadow: 0 10px 20px ${COLOR_MENU_SHADOW};
  -webkit-box-shadow: 0 10px 20px ${COLOR_MENU_SHADOW};
  -moz-box-shadow: 0 10px 20px ${COLOR_MENU_SHADOW};
  -khtml-box-shadow: 0 10px 20px ${COLOR_MENU_SHADOW};
}
.mmd-menu:focus { outline: none; }
.mmd-menu.mmd-menu-sm {
  max-width: 100vw;
  padding-bottom: ${paddingMenuBottomSmall}px;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -khtml-border-radius: 0;
}
.mmd-menu-item-icon {
  color: ${COLOR_BODY_TEXT};
  margin-left: auto;
  align-items: center;
  display: none;
  flex-shrink: 0;
}
.mmd-menu-item {
  padding: 8px 1.25rem;
  display: flex;
  background: transparent;
  height: ${heightMenuItem}px;
  max-height: ${heightMenuItem}px;
}
.mmd-menu-item:focus { outline: none; }
.mmd-menu-item.active {
  background-color: ${COLOR_MENU_ITEM_ACTIVE_BG};
}
.mmd-menu-item.active .mmd-menu-item-icon {
  display: flex;
}
.mmd-menu-item-container {
  overflow: hidden;
}
.mmd-menu-item-title {
  color: ${COLOR_BODY_TEXT};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 14px;
  line-height: 20px;
}
.mmd-menu-item-value {
  color: ${COLOR_MENU_ITEM_VALUE};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
  line-height: 16px;
}
html[data-theme="dark"] .mmd-menu-item-title {
  color: ${COLOR_DARK_MENU_TITLE};
}
html[data-theme="dark"] .mmd-menu-item.active .mmd-menu-item-title {
  color: ${COLOR_BODY_TEXT};
}
html[data-theme="dark"] .mmd-menu {
  background-color: ${COLOR_DARK_MENU_BG};
}
.mmd-context-menu-overlay {
  background: ${COLOR_MENU_OVERLAY};
}
`
};
