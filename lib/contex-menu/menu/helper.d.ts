import { IMenuPosition } from "./interfaces";
export declare const getPosition: (e: any) => {
    x: number;
    y: number;
};
export declare const getMenuElement: () => Element;
export declare const getContextMenuElement: () => Element;
export declare const positionMenu: (e: any) => void;
export declare const getPositionMenuByClick: (e: any, itemsLength: any) => IMenuPosition;
export declare const findClassInElement: (el: any, classNamesList: any) => string;
export declare const clickInsideElement: (e: any, classNamesList: any) => any;
