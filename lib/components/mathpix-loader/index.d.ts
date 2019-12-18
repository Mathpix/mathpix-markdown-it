import * as React from "react";
export interface PMathpixLoader {
    notScrolling?: boolean;
    textAlignJustify?: boolean;
}
declare class MathpixLoader extends React.Component<PMathpixLoader> {
    /** the state of the component */
    state: {
        isReadyToTypeSet: boolean;
    };
    componentDidMount(): void;
    render(): JSX.Element;
}
export default MathpixLoader;
