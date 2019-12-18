import * as React from 'react';
import { optionsMathpixMarkdown } from '../../mathpix-markdown-model';
export interface MathpixMarkdownProps extends optionsMathpixMarkdown {
    text: string;
}
declare class MathpixMarkdown extends React.Component<MathpixMarkdownProps> {
    render(): JSX.Element;
}
export default MathpixMarkdown;
