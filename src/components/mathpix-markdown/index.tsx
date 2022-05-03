import * as React from 'react';
import {MathpixMarkdownModel as MM, optionsMathpixMarkdown, TMarkdownItOptions} from '../../mathpix-markdown-model';


export interface MathpixMarkdownProps extends optionsMathpixMarkdown{
    text: string;
}

class MathpixMarkdown extends React.Component<MathpixMarkdownProps> {
    render() {
        const { text, alignMathBlock='center', display='block', isCheckFormula=false, showTimeLog=false,isDisableFancy=false,
          isDisableEmoji = false, isDisableEmojiShortcuts = false,
          htmlTags=false, width=0, breaks=true, typographer=false, linkify=false, xhtmlOut=false,
          outMath={}, mathJax={}, htmlSanitize = {}, smiles = {}, openLinkInNewWindow = true,
          enableFileLinks = false,
          accessibility = null
        } = this.props;
        const disableRules = isDisableFancy ? MM.disableFancyArrayDef : this.props.disableRules || [];
        const markdownItOptions: TMarkdownItOptions = {
            isDisableFancy: isDisableFancy,
            isDisableEmoji: isDisableEmoji,
            isDisableEmojiShortcuts: isDisableEmojiShortcuts,
            disableRules: disableRules,
            htmlTags: htmlTags,
            xhtmlOut: xhtmlOut,
            breaks: breaks,
            typographer: typographer,
            linkify: linkify,
            width: width,
            outMath: outMath,
            mathJax: mathJax,
            htmlSanitize: htmlSanitize,
            smiles: smiles,
            openLinkInNewWindow: openLinkInNewWindow,
            enableFileLinks: enableFileLinks,
            accessibility: accessibility
        };

         MM.setOptions(disableRules, isCheckFormula, showTimeLog);
        return (
            <div id='preview' style={{justifyContent: alignMathBlock, padding: '10px', overflowY: 'auto', willChange: 'transform'}}>
                <div id='container-ruller'></div>
                <div id='setText' style={{display: display, justifyContent: 'inherit'}}
                     dangerouslySetInnerHTML={{ __html: MM.convertToHTML(text, markdownItOptions)}}
                />
            </div>
        );
    }
}
export default MathpixMarkdown;
