
import * as React from 'react';
import { MathpixMarkdownModel as MM, optionsMathpixMarkdown, TMarkdownItOptions, ParserErrors } from '../../mathpix-markdown-model';
import { eMmdRuleType } from "../../markdown/common/mmdRules";
import { getDisableRuleTypes } from "../../markdown/common/mmdRulesToDisable";

export interface MathpixMarkdownProps extends optionsMathpixMarkdown {
    text: string;
}

const MathpixMarkdown: React.FC<MathpixMarkdownProps> = ({
    text,
    alignMathBlock = 'center',
    display = 'block',
    isCheckFormula = false,
    showTimeLog = false,
    isDisableFancy = false,
    disableRules,
    renderOptions,
    ...rest
}) => {
    const effectiveDisableRules = isDisableFancy ? MM.disableFancyArrayDef : disableRules || [];
    const disableRuleTypes: eMmdRuleType[] = renderOptions ? getDisableRuleTypes(renderOptions) : [];

    const markdownItOptions: TMarkdownItOptions = {
        isDisableFancy,
        disableRules: effectiveDisableRules,
        htmlTags: rest.htmlTags && !disableRuleTypes.includes(eMmdRuleType.html),
        renderOptions,
        ...rest
    };

    MM.setOptions(effectiveDisableRules, isCheckFormula, showTimeLog);

    return (
        <div id='preview' style={{justifyContent: alignMathBlock, padding: '10px', overflowY: 'auto', willChange: 'transform'}}>
            <div id='container-ruller' />
            <div 
                id='setText' 
                style={{display, justifyContent: 'inherit'}}
                dangerouslySetInnerHTML={{ __html: MM.convertToHTML(text, markdownItOptions) }}
            />
        </div>
    );
};

export default MathpixMarkdown;
