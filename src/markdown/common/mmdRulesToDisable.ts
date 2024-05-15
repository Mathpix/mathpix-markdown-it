import { MarkdownIt, Core, ParserBlock, ParserInline, Ruler } from 'markdown-it';
import { RenderOptions } from "../../mathpix-markdown-model";
import { eMmdRuleType, eRule, IMmdRule, mmdRuleList } from "./mmdRules";
import { renderOptionsDef } from "./consts";

const findRule = (md, rule: IMmdRule): boolean => {
  const mdBlock: ParserBlock = md.block;
  const mdInline: ParserInline = md.inline;
  const mdCore: Core = md.core;
  const blockRuler: Ruler = mdBlock.ruler;
  const inlineRuler: Ruler = mdInline.ruler;
  const inlineRuler2: Ruler = mdInline.ruler2;
  const coreRuler: Ruler = mdCore.ruler;
  switch (rule.rule) {
    case eRule.block:
      return blockRuler.__find__(rule.name) >= 0;
    case eRule.inline:
      return inlineRuler.__find__(rule.name) >= 0;
    case eRule.inline2:
      return inlineRuler2.__find__(rule.name) >= 0;
    case eRule.core:
      return coreRuler.__find__(rule.name) >= 0;
    default:
      return false
  }
}

export const getDisableRuleTypes = (renderOptions: RenderOptions): eMmdRuleType[] => {
  const {
    disableRulesGroup = null,
    enable_markdown= true,
    enable_latex = true,
    enable_markdown_mmd_extensions = true,
  } = renderOptions;
  let disableRuleTypes: eMmdRuleType[] = [];
  if (!enable_markdown) {
    disableRuleTypes = [
      eMmdRuleType.markdown,
      eMmdRuleType.chem,
      eMmdRuleType.html,
      eMmdRuleType.asciiMath,
      eMmdRuleType.mathML
    ];
  } else {
    if (!enable_markdown_mmd_extensions) {
      disableRuleTypes = [
        eMmdRuleType.chem,
        eMmdRuleType.asciiMath,
        eMmdRuleType.mathML
      ]
    }
  }
  if (!enable_latex) {
    disableRuleTypes.push(eMmdRuleType.latex);
    disableRuleTypes.push(eMmdRuleType.math);
    disableRuleTypes.push(eMmdRuleType.simpleMath);
  }
  if (disableRulesGroup) {
    if (disableRulesGroup.chem && disableRuleTypes.indexOf(eMmdRuleType.chem) === -1) {
      disableRuleTypes.push(eMmdRuleType.chem);
    }
    if (disableRulesGroup.html && disableRuleTypes.indexOf(eMmdRuleType.html) === -1) {
      disableRuleTypes.push(eMmdRuleType.html);
    }
    if (disableRulesGroup.asciiMath && disableRuleTypes.indexOf(eMmdRuleType.asciiMath) === -1) {
      disableRuleTypes.push(eMmdRuleType.asciiMath);
    }
    if (disableRulesGroup.math && disableRuleTypes.indexOf(eMmdRuleType.math) === -1) {
      disableRuleTypes.push(eMmdRuleType.math);
      disableRuleTypes.push(eMmdRuleType.simpleMath);
    }
    if (disableRulesGroup.simpleMath && disableRuleTypes.indexOf(eMmdRuleType.simpleMath) === -1) {
      disableRuleTypes.push(eMmdRuleType.simpleMath);
    }
    if (disableRulesGroup.mathML && disableRuleTypes.indexOf(eMmdRuleType.mathML) === -1) {
      disableRuleTypes.push(eMmdRuleType.mathML);
    }
  }
  return disableRuleTypes;
}
export const getListRulesToDisable = (md, renderOptions: RenderOptions): string[] => {
  const rules: string[] = [];
  const disableRuleTypes: eMmdRuleType[] = getDisableRuleTypes(renderOptions);
  if (!disableRuleTypes?.length) {
    return rules;
  }
  for (let i: number = 0; i < mmdRuleList.length; i++) {
    const rule: IMmdRule = mmdRuleList[i];
    if (!findRule(md, rule)) {
      continue;
    }
    if (disableRuleTypes.includes(rule.type)){
      rules.push(rule.name);
    }
  }
  return rules;
}

const getMmdRuleByName = (name: string): IMmdRule => {
  return mmdRuleList?.find((item: IMmdRule) => item.name === name);
}

export const applyRulesToDisableRules = (md, rules: string[], disableRules: string[]): string[] => {
  for (let i: number = 0; i < rules.length; i++) {
    let rule: IMmdRule = getMmdRuleByName(rules[i]);
    if (rule && findRule(md, rule)) {
      if (disableRules.indexOf(rule.name) === -1) {
        disableRules.push(rule.name)
      }
    }
  }
  return disableRules;
}
export const applyRefRulesToDisableRules = (md, disableRules: string[]): string[] => {
  const refRules: string[] = ['refs', 'refsInline'];
  return applyRulesToDisableRules(md, refRules, disableRules);
}

export const applyFootnoteRulesToDisableRules = (md, disableRules: string[]): string[] => {
  const footnoteRules: string[] = [
    'mmd_footnote_tail',
    'latex_footnote_block',
    'latex_footnotetext_block',
    'latex_footnote',
    'latex_footnotemark',
    'latex_footnotetext',
    'grab_footnote_ref',
    'footnote_tail',
    'footnote_def',
    'footnote_inline',
    'footnote_ref'
  ];
  return applyRulesToDisableRules(md, footnoteRules, disableRules);
}

export const getListToDisableByOptions = (md: MarkdownIt, options): string[] => {
  let { renderOptions = null, isDisableRefs = false, isDisableFootnotes = false } = options;
  renderOptions = Object.assign({}, renderOptionsDef, renderOptions);
  let disableRules: string[] = [];
  if (renderOptions) {
    disableRules = getListRulesToDisable(md, renderOptions);
  }
  if (isDisableRefs) {
    disableRules = applyRefRulesToDisableRules(md, disableRules);
  }
  if (isDisableFootnotes) {
    disableRules = applyFootnoteRulesToDisableRules(md, disableRules);
  }
  return disableRules;
}

