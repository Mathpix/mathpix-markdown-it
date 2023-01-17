/**
 * In LaTeX, we can easily reference almost anything that can be numbered,
 * and have LaTeX automatically updating the numbering for we whenever necessary.
 * The objects which can be referenced include
 *   sections, subsections, subsubsections, footnotes, theorems, equations, figures and tables
 * */
export enum eLabelType {
  equation = 'equation',
  figure = 'figure',
  footnote = 'footnote',
  table = 'table',
  theorem = 'theorem',
  section = 'section',
  subsection = 'subsection',
  subsubsection = 'subsubsection',
}

export interface ILabel {
  key: string, /** label key specified in \label{key}. It should be unique */
  id?: string, /** id of the label to follow the reference. This value can be not unique, as can be multiple labels in a math equation */
  tag: string, /** tag of label (number or tag) */
  tagId?: string,
  tagChildrenTokens?: any, /** parsed tag content */
  type: eLabelType,
  tokenUuidInParentBlock?: string /** uuid of parent block */
}

export let labelsList: Array<ILabel> = [];

export const addIntoLabelsList = (label: ILabel) => {
  /** Label key should be unique */
  const index = labelsList?.length
    ? labelsList.findIndex(item => item.key === label.key)
    : -1;
  /** If the list already has a label with this key, 
   * it will be replaced by a new one (like in Overleaf) */
  if (index !== -1) {
    labelsList[index] = label;
    return;
  }
  /** If the theorem has multiple labels, then we add all those labels to the id
   * that will be used to jump to the parent block for all references of those labels */
  label = groupLabelIdByUuidFromLabelsList(label);
  labelsList.push(label);
};

export const clearLabelsList = () => {
  labelsList = [];
};

export const getLabelByKeyFromLabelsList = (key: string): ILabel => {
  return labelsList?.length
    ? labelsList.find(item => item.key === key)
    : null;
};

export const getLabelByUuidFromLabelsList = (uuid: string): ILabel => {
  return labelsList?.length
    ? labelsList.find((item: ILabel) => item.tokenUuidInParentBlock === uuid)
    : null;
};
/** If the theorem has multiple labels, then we add all those labels to the id 
 * that will be used to jump to the parent block for all references of those labels */
export const groupLabelIdByUuidFromLabelsList = (label: ILabel): ILabel => {
  if (!label.tokenUuidInParentBlock || !labelsList.length) {
    return label;
  }
  let lastLabelId = '';
  for (let i = 0; i < labelsList.length; i++) {
    const item: ILabel = labelsList[i];
    if (item.tokenUuidInParentBlock !== label.tokenUuidInParentBlock) {
      continue;
    }
    item.id += '_' + label.id;
    lastLabelId = item.id;
  }
  if (lastLabelId) {
    label.id = lastLabelId
  }
  return label;
};

export const getLabelsList = (showAllInformation = false) => {
  /** Get all information including auxiliary fields like tagChildrenTokens */
  if (showAllInformation) {
    return [...labelsList]
  }
  return labelsList?.length 
    ? labelsList.map((item: ILabel) =>  { 
      return {
        key: item.key, /** label key specified in \label{key}. It should be unique */
        tag: item.tag, /** tag of label (number or tag) */
        type: item.type
      }
    })
    : [];
};
