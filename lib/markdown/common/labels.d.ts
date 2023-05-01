/**
 * In LaTeX, we can easily reference almost anything that can be numbered,
 * and have LaTeX automatically updating the numbering for we whenever necessary.
 * The objects which can be referenced include
 *   sections, subsections, subsubsections, footnotes, theorems, equations, figures and tables
 * */
export declare enum eLabelType {
    equation = "equation",
    figure = "figure",
    footnote = "footnote",
    table = "table",
    theorem = "theorem",
    section = "section",
    subsection = "subsection",
    subsubsection = "subsubsection"
}
export interface ILabel {
    key: string; /** label key specified in \label{key}. It should be unique */
    id?: string; /** id of the label to follow the reference. This value can be not unique, as can be multiple labels in a math equation */
    tag: string; /** tag of label (number or tag) */
    tagId?: string;
    tagChildrenTokens?: any; /** parsed tag content */
    type: eLabelType;
    tokenUuidInParentBlock?: string; /** uuid of parent block */
}
export declare let labelsList: Array<ILabel>;
export declare const addIntoLabelsList: (label: ILabel) => void;
export declare const clearLabelsList: () => void;
export declare const getLabelByKeyFromLabelsList: (key: string) => ILabel;
export declare const getLabelByUuidFromLabelsList: (uuid: string) => ILabel;
/** If the theorem has multiple labels, then we add all those labels to the id
 * that will be used to jump to the parent block for all references of those labels */
export declare const groupLabelIdByUuidFromLabelsList: (label: ILabel) => ILabel;
export declare const getLabelsList: (showAllInformation?: boolean) => {
    key: string;
    tag: string;
    type: eLabelType;
}[];
