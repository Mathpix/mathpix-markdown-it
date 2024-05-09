import { MarkdownIt, ParserBlock, ParserInline, Core, Ruler } from 'markdown-it';
import { RenderOptions } from "../mathpix-markdown-model";
import {
  eMmdRuleType,
  mmdBlockRulesList,
  mmdCoreRuleList,
  mmdInlineRule2List,
  mmdInlineRuleList
} from "./common/mmdRulesList";

export const getListBlockRulesToDisable = (md, renderOptions: RenderOptions) => {
  const rules: string[] = [];
  const mdBlock: ParserBlock = md.block;
  const blockRuler: Ruler = mdBlock.ruler;
  for (let i = 0; i < mmdBlockRulesList.length; i++) {
    let rule = mmdBlockRulesList[i];
    if (blockRuler.__find__(rule.name) === -1) {
      continue;
    }
    if (rule.type === eMmdRuleType.common) {
      continue;
    }
    if (rule.type === eMmdRuleType.markdown && renderOptions?.disableMarkdown) {
      rules.push(rule.name);
    }
  }
  return rules;
}

export const getListInlineRulesToDisable = (md, renderOptions: RenderOptions) => {
  const rules: string[] = [];
  const mdInline: ParserInline = md.inline;
  const inlineRuler: Ruler = mdInline.ruler;
  for (let i = 0; i < mmdInlineRuleList.length; i++) {
    let rule = mmdInlineRuleList[i];
    if (inlineRuler.__find__(rule.name) === -1) {
      continue;
    }
    if (rule.type === eMmdRuleType.common) {
      continue;
    }
    if (rule.type === eMmdRuleType.markdown && renderOptions?.disableMarkdown) {
      rules.push(rule.name);
    }
  }
  return rules;
}

export const getListInlineRules2ToDisable = (md, renderOptions: RenderOptions) => {
  const rules: string[] = [];
  const mdInline: ParserInline = md.inline;
  const inlineRuler2: Ruler = mdInline.ruler2;
  for (let i = 0; i < mmdInlineRule2List.length; i++) {
    let rule = mmdInlineRule2List[i];
    if (inlineRuler2.__find__(rule.name) === -1) {
      continue;
    }
    if (rule.type === eMmdRuleType.common) {
      continue;
    }
    if (rule.type === eMmdRuleType.markdown && renderOptions?.disableMarkdown) {
      rules.push(rule.name);
    }
  }
  return rules;
}

export const getListCoreRulesToDisable = (md, renderOptions: RenderOptions) => {
  const rules: string[] = [];
  const mdCore: Core = md.core;
  const coreRuler: Ruler = mdCore.ruler;
  for (let i = 0; i < mmdCoreRuleList.length; i++) {
    let rule = mmdCoreRuleList[i];
    if (coreRuler.__find__(rule.name) === -1) {
      continue;
    }
    if (rule.type === eMmdRuleType.common) {
      continue;
    }
    if (rule.type === eMmdRuleType.markdown && renderOptions?.disableMarkdown) {
      rules.push(rule.name);
    }
  }
  return rules;
}

export default (md: MarkdownIt, renderOptions: RenderOptions) => {
  const blockRules: string[] = getListBlockRulesToDisable(md, renderOptions);
  const inlineRules: string[] = getListInlineRulesToDisable(md, renderOptions);
  const inlineRules2: string[] = getListInlineRules2ToDisable(md, renderOptions);
  const coreRules: string[] = getListCoreRulesToDisable(md, renderOptions);

  let disableRules = [];
  if (blockRules?.length) {
    disableRules = disableRules.concat([...blockRules])
  }
  if (inlineRules?.length) {
    disableRules = disableRules.concat([...inlineRules])
  }
  if (inlineRules2?.length) {
    disableRules = disableRules.concat([...inlineRules2])
  }
  if (coreRules?.length) {
    disableRules = disableRules.concat([...coreRules])
  }
  if (disableRules?.length) {
    md.disable(disableRules);
  }
}