import MarkdownIt, { RuleBlock } from "markdown-it";
/**
 * Returns terminator rules for the MathML block excluding the current rule (selfRule).
 * The base list is cached at the MarkdownIt instance level.
 */
export declare function collectTerminatorRules(md: MarkdownIt, selfRule: RuleBlock, altGroup?: string): RuleBlock[];
export declare const mathMLBlock: RuleBlock;
