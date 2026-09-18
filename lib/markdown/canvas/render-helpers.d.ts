export interface ICanvasListStyles {
    marker: string;
    item: string;
    itemCustom: string;
}
/** Canvas takes no stylesheet, so a list carries its own indentation and spacing. */
export declare const canvasListRootStyle: (options: any, paddingInlineStyle: string, nested: boolean) => string;
/** A custom marker only stays put if its item positions it, so both carry a style. */
export declare const canvasListStyles: (options: any) => ICanvasListStyles;
/** An empty marker span is a placeholder TinyMCE removes on save, so Canvas gets none. */
export declare const skipEmptyMarker: (options: any, dataAttr: string) => boolean;
/** Canvas deletes <svg> with its contents, so a structure is carried as its source instead. */
export declare const smilesSourceForCanvas: (smiles: string) => string;
