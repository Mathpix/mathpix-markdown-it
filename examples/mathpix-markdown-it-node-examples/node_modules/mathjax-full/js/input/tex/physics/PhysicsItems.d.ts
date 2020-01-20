import { CheckType, BaseItem, StackItem } from '../StackItem.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
export declare class AutoOpen extends BaseItem {
    readonly kind: string;
    readonly isOpen: boolean;
    toMml(): MmlNode;
    checkItem(item: StackItem): CheckType;
}
