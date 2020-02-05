import * as React from 'react';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';
import { data } from './data.js';
import './style.css';

class App extends React.Component {
  componentDidMount() {
    const elStyle = document.getElementById('Mathpix-styles');
    if (!elStyle) {
      const style = document.createElement("style");
      style.setAttribute("id", "Mathpix-styles");
      style.innerHTML = MM.getMathpixFontsStyle() + MM.getMathpixStyle(true);
      document.head.appendChild(style);
    }
  }
  render() {
    const html = MM.render(data);
    return (
      <div className="App">
        <div className="content" dangerouslySetInnerHTML={{__html: html}}></div>
      </div>
    )
  }
}

export default App;
