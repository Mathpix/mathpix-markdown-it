import * as React from 'react';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';

class ConvertForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '\\[\n' +
        'y = \\frac { \\sum _ { i } w _ { i } y _ { i } } { \\sum _ { i } w _ { i } } , i = 1,2 \\ldots k\n' +
        '\\]' +
        '\n' +
        '\n' +
        '\\begin{center}\n' +
        '  \\begin{tabular}{ l | c | r }\n' +
        '    \\hline\n' +
        '    1 & 2 & 3 \\\\ \\hline\n' +
        '    4 & 5 & 6 \\\\ \\hline\n' +
        '    7 & 8 & 9 \\\\\n' +
        '    \\hline\n' +
        '  \\end{tabular}\n' +
        '\\end{center}',
      result: '',
      include_mathml: true,
      include_asciimath: true,
      include_latex: true,
      include_svg: true,
      include_tsv: true,
      include_table_html: true,
      formats: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const options = {
      outMath: {
        include_mathml: this.state.include_mathml,
        include_asciimath: this.state.include_asciimath,
        include_latex: this.state.include_latex,
        include_svg: this.state.include_svg,
        include_tsv: this.state.include_tsv,
        include_table_html: this.state.include_table_html,
      }
    };
    const html = MM.markdownToHTML(this.state.value, options);
    const formats = MM.parseMarkdownByHTML(html);
    this.setState({result: html})
    this.setState({formats: formats})
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h1>Input Text with Latex:</h1>
          <div className='inputs'>
            <textarea value={this.state.value} onChange={this.handleChange} />
            <div className="includes">
              <h4>Includes formats:</h4>
              <label>
                <input
                  name="include_mathml"
                  type="checkbox"
                  checked={this.state.include_mathml}
                  onChange={this.handleInputChange} />
                mathml
              </label>
              <label>
                <input
                  name="include_asciimath"
                  type="checkbox"
                  checked={this.state.include_asciimath}
                  onChange={this.handleInputChange} />
                asciimath
              </label>
              <label>
                <input
                  name="include_latex"
                  type="checkbox"
                  checked={this.state.include_latex}
                  onChange={this.handleInputChange} />
                latex
              </label>
              <label>
                <input
                  name="include_svg"
                  type="checkbox"
                  checked={this.state.include_svg}
                  onChange={this.handleInputChange} />
                svg
              </label>
              <label>
                <input
                  name="include_tsv"
                  type="checkbox"
                  checked={this.state.include_tsv}
                  onChange={this.handleInputChange} />
                tsv
              </label>
              <label>
                <input
                  name="include_table_html"
                  type="checkbox"
                  checked={this.state.include_table_html}
                  onChange={this.handleInputChange} />
                table html
              </label>
            </div>
          </div>

          <input type="submit" value="Convert" />
        </form>
        <div id='preview-content' dangerouslySetInnerHTML={{__html: this.state.result}}/>
        <div className="formats">
          {this.state.formats && this.state.formats.length > 0 &&
            this.state.formats.map((item, index) => {
              return <div className="item">
                <div>{item.type}</div>
                <code>{item.value}</code>
              </div>
            })
          }
        </div>
      </div>
    );
  }
}

export default ConvertForm;

