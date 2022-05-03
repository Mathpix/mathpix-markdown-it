import * as React from 'react';
import { MathpixMarkdown, MathpixLoader, MathpixLoaderAccessibility } from 'mathpix-markdown-it';
import {
  addListenerContextMenuEvents,
  removeListenerContextMenuEvents,
} from "mathpix-markdown-it/lib/contex-menu";
import { loadSre } from "mathpix-markdown-it/lib/sre/sre-browser";

const outMath = {
  include_svg: true,
  // Show in context menu:
  include_smiles: true,
  include_asciimath: true,
  include_latex: true,
  include_mathml: true,
  include_mathml_word: true,
};

let accessibility = {
  assistiveMml: true,
  sre: loadSre()
};


function App() {
  const [loading, setLoading] = React.useState(true);

  /** In order for the math to be accessibility, need to make sure that the sre module is loaded */
  React.useEffect(() => {
    accessibility.sre.engineReady()
      .finally(()=>{
        setLoading(false);
      })
    },[]);
  
  React.useEffect(() => {
    addListenerContextMenuEvents();
    return () => {
      removeListenerContextMenuEvents();
    };
  }, []);
  
  if (loading) {
    return <div className="App">Loading..</div>
  }
  return (
    <div className="App">
      <MathpixLoader>
        <MathpixMarkdown text="\\(ax^2 + bx + c = 0\\)"
                         outMath={outMath}
                         accessibility={accessibility}
        />
        <MathpixMarkdown text="$x = \frac { - b \pm \sqrt { b ^ { 2 } - 4 a c } } { 2 a }$"
                         outMath={outMath}
                         accessibility={accessibility}
        />
      </MathpixLoader>
    </div>
  );
}

export default App;
