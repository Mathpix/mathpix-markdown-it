import { BaseItem, CheckType, StackItem } from '../StackItem.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
export declare class ProofTreeItem extends BaseItem {
    leftLabel: MmlNode[];
    rigthLabel: MmlNode[];
    private innerStack;
    readonly kind: string;
    checkItem(item: StackItem): CheckType;
    toMml(): MmlNode;
}
