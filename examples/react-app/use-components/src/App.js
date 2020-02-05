import * as React from 'react';
import {MathpixMarkdown, MathpixLoader} from 'mathpix-markdown-it';

function App() {
  return (
    <div className="App">
      <MathpixLoader>
        <MathpixMarkdown text="\\(ax^2 + bx + c = 0\\)"/>
        <MathpixMarkdown text="$x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }$"/>
      </MathpixLoader>
    </div>
  );
}

export default App;
