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

let labelsByKey: Map<string, ILabel> = new Map();
let labelsByUuid: Map<string, ILabel> = new Map();

export const addIntoLabelsList = (label: ILabel) => {
  const existing = labelsByKey.get(label.key);
  if (existing) {
    if (existing.tokenUuidInParentBlock
      && existing.tokenUuidInParentBlock !== label.tokenUuidInParentBlock) {
      labelsByUuid.delete(existing.tokenUuidInParentBlock);
    }
    labelsByKey.set(label.key, label);
    if (label.tokenUuidInParentBlock) {
      labelsByUuid.set(label.tokenUuidInParentBlock, label);
    }
    return;
  }
  label = groupLabelIdByUuidFromLabelsList(label);
  labelsByKey.set(label.key, label);
  if (label.tokenUuidInParentBlock) {
    labelsByUuid.set(label.tokenUuidInParentBlock, label);
  }
};

export const clearLabelsList = () => {
  labelsByKey.clear();
  labelsByUuid.clear();
};

export const getLabelByKeyFromLabelsList = (key: string): ILabel => {
  return labelsByKey.get(key) ?? null;
};

export const getLabelByUuidFromLabelsList = (uuid: string): ILabel => {
  return labelsByUuid.get(uuid) ?? null;
};

/** If the theorem has multiple labels, then we add all those labels to the id
 * that will be used to jump to the parent block for all references of those labels */
export const groupLabelIdByUuidFromLabelsList = (label: ILabel): ILabel => {
  if (!label.tokenUuidInParentBlock || labelsByKey.size === 0) {
    return label;
  }
  let lastLabelId = '';
  for (const item of labelsByKey.values()) {
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
  if (labelsByKey.size === 0) {
    return [];
  }
  if (showAllInformation) {
    return Array.from(labelsByKey.values());
  }
  return Array.from(labelsByKey.values()).map((item: ILabel) => ({
    key: item.key,
    tag: item.tag,
    type: item.type,
  }));
};
