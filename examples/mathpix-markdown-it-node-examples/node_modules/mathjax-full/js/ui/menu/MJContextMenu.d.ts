import { MathItem } from '../../core/MathItem.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { SelectableInfo } from './SelectableInfo.js';
export declare class MJContextMenu extends ContextMenu.ContextMenu {
    static DynamicSubmenus: Map<string, (menu: MJContextMenu, sub: ContextMenu.Submenu) => ContextMenu.SubMenu>;
    mathItem: MathItem<HTMLElement, Text, Document>;
    annotation: string;
    showAnnotation: SelectableInfo;
    copyAnnotation: () => void;
    annotationTypes: {
        [type: string]: string[];
    };
    post(x?: any, y?: number): void;
    unpost(): void;
    findID(...names: string[]): ContextMenu.Item;
    protected getAnnotationMenu(): void;
    protected getSemanticNode(): MmlNode;
    protected getAnnotations(node: MmlNode): [string, string][];
    protected annotationMatch(child: MmlNode): string;
    protected createAnnotationMenu(id: string, annotations: [string, string][], action: () => void): void;
    dynamicSubmenus(): void;
}
