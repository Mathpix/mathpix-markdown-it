import { ISmilesOptionsDef } from "./smiles-drawer/src/Drawer";
export interface ISmilesOptions extends ISmilesOptionsDef {
    theme?: string;
    stretch?: boolean;
    scale?: number;
    fontSize?: number;
}
declare const _default: (md: any, options: any) => void;
export default _default;
