import * as React from 'react';
import './style.css';
import {MathpixMarkdownModel as MM} from "mathpix-markdown-it";
import ConvertForm from "./form";


class App extends React.Component {
  componentDidMount() {
    const isLoad = MM.loadMathJax();
    if (isLoad) {
      console.log('STYLE is loading')
    } else {
      console.log('STYLE is NOT loading')
    }
  }
  render() {
    return (
      <div className="App">
        <ConvertForm />
      </div>
    )
  }
}

export default App;
