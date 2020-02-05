import * as React from 'react';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

class ConvertForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '\\[\n' +
        'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
        '\\]',
      result: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({result: MM.markdownToHTML(this.state.value)})
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Input Text with Latex:</h1>
          <textarea value={this.state.value} onChange={this.handleChange} />
          <input type="submit" value="Convert" />
        </form>
        <div id='preview-content' dangerouslySetInnerHTML={{__html: this.state.result}}/>
      </div>
    );
  }
}

export default ConvertForm;

