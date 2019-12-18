import * as React from "react";
import {MathpixMarkdownModel as MM} from '../../mathpix-markdown-model'

export interface PMathpixLoader {
  notScrolling?: boolean;
  textAlignJustify?: boolean;
}

class MathpixLoader extends React.Component<PMathpixLoader> {
    /** the state of the component */
    state = {
        isReadyToTypeSet: false
    };

    componentDidMount() {
        const {notScrolling = false, textAlignJustify = false } = this.props;
        const isLoad = MM.loadMathJax(notScrolling, textAlignJustify);
        this.setState({isReadyToTypeSet: isLoad});
    }
    render() {
        if (this.state.isReadyToTypeSet) {
            return <div id="content">{this.props.children}</div>
        }
        return <div>Loading</div>;
    }
}

export default MathpixLoader;
