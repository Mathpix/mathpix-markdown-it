import { RuleInline } from 'markdown-it';
/**
 * \theoremstyle{definition} | \theoremstyle{plain} | \theoremstyle{remark}
 * The command \theoremstyle{ } sets the styling for the numbered environment defined right below it
 *   {definition} - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
 *   {plain} - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
 *   {remark} - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
 * */
export declare const theoremStyle: RuleInline;
/**
 * \newtheorem{name}{print}[numbered]
 *   {name} - is the name of the environment
 *   {print} is the word to be shown in the document
 *   [numbered] - is the sectional unit based on which the environments is to be numbered (this is optional
 * */
export declare const newTheorem: RuleInline;
export declare const setCounterTheorem: RuleInline;
/**
 * \renewcommand\qedsymbol{$\blacksquare$}
 * \renewcommand\qedsymbol{QED}
 */
export declare const newCommandQedSymbol: RuleInline;
export declare const labelLatex: RuleInline;
export declare const captionLatex: RuleInline;
export declare const centeringLatex: RuleInline;
