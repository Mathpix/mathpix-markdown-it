import * as React from 'react';
import { MathpixMarkdownModel as MM } from 'mathpix-markdown-it';
import { data } from "./data";

const options = {
  showToc: true,
};

class ConvertForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: data,
      html: '',
      toc_list: false,
      isEdit: true,
      tocHtml: ''
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
    if (this.state.toc_list !== value) {
      this.rerender(value);
    }
  }

  rerender(toc_list, changeView = false) {
    const html = toc_list
      ? MM.markdownToHTML(this.state.value, options)
      : MM.markdownToHTML(this.state.value,
        Object.assign({}, options, {toc: {
            style: 'summary',
            doNotGenerateParentId: true
          }}));
    const tocHtml = MM.getTocContainerHTML(html, false);
    this.setState({
      html: html,
      tocHtml: tocHtml,
      toc_list: toc_list
    });
    if (changeView) {
      const isEdit = this.state.isEdit;
      this.setState({
        isEdit: !isEdit
      })
    }
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.rerender(this.state.toc_list, true);
  }
  
  componentDidMount() {
    this.rerender(this.state.toc_list);
  }

  render() {
    return (
      <div className="page" 
           style={{
             height: "100%",
             display: "flex",
             flexDirection: "column"
           }}>
        <div className="page-nav"
          style={{ 
            height: "46px",
            borderBottom: "1px solid #e5e6eb"
          }}>
          <div style={{
            maxWidth: "1025px",
            width: "100%",
            height: "100%",
            margin: "0 auto"
          }}>
            <form onSubmit={this.handleSubmit}
                  style={{height: "100%",
                    display: "flex",
                    alignItems: "center"}}
            >
              <input style={{width: "100px"}}
                     className="btn"
                type="submit" value={`${this.state.isEdit ? "Preview" : "Edit"}`} />
              <label style={{marginLeft: "20px"}}>
                <input
                  name="toc_list"
                  type="checkbox"
                  checked={this.state.toc_list}
                  onChange={this.handleInputChange} />
                Show the table of contents as details list
              </label>
            </form>
          </div>
        </div>
        <div className="page-container"
             style={{
               maxWidth: "1375px",
               width: "100%",
               margin: "0 auto",
               height: "calc(100vh - 46px)"
             }}
        >
          {this.state.isEdit
            ?
            <div style={{
              height: "100%", 
              margin: "auto", 
              overflow: "hidden",
              display: "flex",
              justifyContent: "center"
            }}>
              <textarea
                style={{ 
                  height: "100%", width: "100%", padding: "10px", 
                  overflow: "scroll", maxWidth: "1025px",
                  border: "1px solid #e5e6eb",
                  borderTop: "none"
                }}
                value={this.state.value}
                onChange={this.handleChange} />
            </div>
            :
            <div 
              style={{ height: "100%", 
                margin: "auto", 
                overflow: "hidden",
                display: "flex"
              }}>
              <div id="toc" className="toc"
                   style={{width:"30%", minWidth: "350px", borderRight: "1px solid #e5e6eb"}}
                   dangerouslySetInnerHTML={{__html: this.state.tocHtml}}
              />
              <div id="preview"
                   style={{width: "1000%", overflow: "scroll"}}
              >
                <div 
                  id='preview-content'
                  style={{padding: "2.5em 20px"}}
                  dangerouslySetInnerHTML={{__html: this.state.html}}/>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default ConvertForm;

