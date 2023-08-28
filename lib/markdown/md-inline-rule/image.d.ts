import { RuleInline } from 'markdown-it';
/** Process ![image](<src> "title")
 * Replace image inline rule:
 * Process:
 *   ![image](<src> "title")
 *   ![image](<src> "title"){width=50%}
 *   ![image](<src> "title"){width="10px"}
 *   ![image](<src> "title"){width="20px",height="20px"}
 *   ![image](<src> "title"){width="20px",height="20px",right}
 * */
export declare const imageWithSize: RuleInline;
export declare const renderRuleImage: (tokens: any, idx: any, options: any, env: any, slf: any) => any;
