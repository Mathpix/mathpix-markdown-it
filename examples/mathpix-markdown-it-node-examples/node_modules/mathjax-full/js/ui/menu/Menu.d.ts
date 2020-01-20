import { MathItem } from '../../core/MathItem.js';
import { OutputJax } from '../../core/OutputJax.js';
import { OptionList } from '../../util/Options.js';
import { MJContextMenu } from './MJContextMenu.js';
import { MmlVisitor } from './MmlVisitor.js';
import { SelectableInfo } from './SelectableInfo.js';
import { MenuMathDocument } from './MenuHandler.js';
export interface MenuSettings {
    texHints: boolean;
    semantics: boolean;
    zoom: string;
    zscale: string;
    renderer: string;
    alt: boolean;
    cmd: boolean;
    ctrl: boolean;
    shift: boolean;
    scale: string;
    autocollapse: boolean;
    collapsible: boolean;
    inTabOrder: boolean;
    backgroundColor: string;
    braille: boolean;
    explorer: boolean;
    foregroundColor: string;
    highlight: string;
    infoPrefix: boolean;
    infoRole: boolean;
    infoType: boolean;
    magnification: string;
    magnify: string;
    speech: boolean;
    speechRules: string;
    subtitles: boolean;
    treeColoring: boolean;
    viewBraille: boolean;
}
export declare type HTMLMATHITEM = MathItem<HTMLElement, Text, Document>;
export declare class Menu {
    static MENU_STORAGE: string;
    static OPTIONS: OptionList;
    protected static loading: number;
    protected static loadingPromises: Map<string, Promise<void>>;
    protected static _loadingPromise: Promise<void>;
    protected static _loadingOK: Function;
    protected static _loadingFailed: Function;
    options: OptionList;
    settings: MenuSettings;
    defaultSettings: MenuSettings;
    menu: MJContextMenu;
    MmlVisitor: MmlVisitor<HTMLElement, Text, Document>;
    protected document: MenuMathDocument;
    protected jax: {
        [name: string]: OutputJax<HTMLElement, Text, Document>;
    };
    protected rerenderStart: number;
    readonly isLoading: boolean;
    readonly loadingPromise: Promise<void>;
    protected about: ContextMenu.Info;
    protected help: ContextMenu.Info;
    protected mathmlCode: SelectableInfo;
    protected originalText: SelectableInfo;
    protected annotationText: SelectableInfo;
    protected zoomBox: ContextMenu.Info;
    constructor(document: MenuMathDocument, options?: OptionList);
    protected initSettings(): void;
    protected initMenu(): void;
    protected checkLoadableItems(): void;
    protected enableExplorerItems(enable: boolean): void;
    protected mergeUserSettings(): void;
    protected saveUserSettings(): void;
    protected setA11y(options: {
        [key: string]: any;
    }): void;
    protected getA11y(options: string): any;
    protected setScale(scale: string): void;
    protected setRenderer(jax: string): void;
    protected setOutputJax(jax: string): void;
    protected setTabOrder(tab: boolean): void;
    protected setExplorer(explore: boolean): void;
    protected setCollapsible(collapse: boolean): void;
    protected scaleAllMath(): void;
    protected resetDefaults(): void;
    checkComponent(name: string): void;
    protected loadComponent(name: string, callback: () => void): void;
    loadA11y(component: string): void;
    protected transferMathList(document: MenuMathDocument): void;
    protected formatSource(text: string): string;
    protected toMML(math: HTMLMATHITEM): any;
    protected zoom(event: MouseEvent, type: string, math: HTMLMATHITEM): void;
    protected isZoomEvent(event: MouseEvent, zoom: string): boolean;
    protected rerender(start?: number): void;
    protected copyMathML(): void;
    protected copyOriginal(): void;
    copyAnnotation(): void;
    protected copyToClipboard(text: string): void;
    addMenu(math: HTMLMATHITEM): void;
    clear(): void;
    variable<T extends (string | boolean)>(name: keyof MenuSettings, action?: (value: T) => void): {
        name: "subtitles" | "semantics" | "scale" | "speech" | "magnification" | "highlight" | "explorer" | "braille" | "viewBraille" | "shift" | "backgroundColor" | "alt" | "texHints" | "zoom" | "zscale" | "renderer" | "cmd" | "ctrl" | "autocollapse" | "collapsible" | "inTabOrder" | "foregroundColor" | "infoPrefix" | "infoRole" | "infoType" | "magnify" | "speechRules" | "treeColoring";
        getter: () => string | boolean;
        setter: (value: T) => void;
    };
    a11yVar<T extends (string | boolean)>(name: keyof MenuSettings): {
        name: "subtitles" | "semantics" | "scale" | "speech" | "magnification" | "highlight" | "explorer" | "braille" | "viewBraille" | "shift" | "backgroundColor" | "alt" | "texHints" | "zoom" | "zscale" | "renderer" | "cmd" | "ctrl" | "autocollapse" | "collapsible" | "inTabOrder" | "foregroundColor" | "infoPrefix" | "infoRole" | "infoType" | "magnify" | "speechRules" | "treeColoring";
        getter: () => any;
        setter: (value: T) => void;
    };
    submenu(id: string, content: string, entries?: any[], disabled?: boolean): {
        type: string;
        id: string;
        content: string;
        menu: {
            items: Object[];
        };
        disabled: boolean;
    };
    command(id: string, content: string, action: () => void, other?: Object): {
        type: string;
        id: string;
        content: string;
        action: () => void;
    } & Object;
    checkbox(id: string, content: string, variable: string, other?: Object): {
        type: string;
        id: string;
        content: string;
        variable: string;
    } & Object;
    radioGroup(variable: string, radios: string[][]): ({
        type: string;
        id: string;
        content: string;
        variable: string;
    } & Object)[];
    radio(id: string, content: string, variable: string, other?: Object): {
        type: string;
        id: string;
        content: string;
        variable: string;
    } & Object;
    label(id: string, content: string): {
        type: string;
        id: string;
        content: string;
    };
    rule(): {
        type: string;
    };
}
