import * as React from 'react';
import {MathpixMarkdownModel as MM, optionsMathpixMarkdown} from '../../mathpix-markdown-model';


export interface MathpixMarkdownProps extends optionsMathpixMarkdown{
    text: string;
}

class MathpixMarkdown extends React.Component<MathpixMarkdownProps> {

    render() {
        const { text, alignMathBlock='center', display='block', isCheckFormula=false, showTimeLog=false,isDisableFancy=false,
          htmlTags=false, width=0, breaks=true, typographer=false} = this.props;
        const disableRules = isDisableFancy ? MM.disableFancyArrayDef : this.props.disableRules;
        MM.setOptions(disableRules, isCheckFormula, showTimeLog);

        return (
            <div id='preview' style={{justifyContent: alignMathBlock, padding: '10px', overflowY: 'auto', willChange: 'transform'}}>
                <div id='container-ruller'></div>
                <div id='setText' style={{display: display, justifyContent: 'inherit'}}
                     dangerouslySetInnerHTML={{ __html: MM.convertToHTML(text,
                         {htmlTags: htmlTags, breaks: breaks, typographer: typographer, width: width}) }}
                />
            </div>
        );
    }
}
export default MathpixMarkdown;
