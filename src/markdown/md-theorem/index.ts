import { MarkdownIt } from 'markdown-it';
import { theoremEnvironments, getTheoremEnvironmentIndex } from "./helper";
import { ILabel, getLabelByUuidFromLabelsList } from "../common/labels";

const renderTheoremOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envNumber = token.envNumber;
  const envStyle = token.envStyle;
  /**
   * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
   * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
   * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
   * */
  let styleBody = "";
  switch (envStyle) {
    case "definition":
      styleBody = "font-style: normal;";
      break;    
    case "plain":
      styleBody = "font-style: italic;";
      break;    
    case "remark":
      styleBody = "font-style: normal;";
      break;
  }
  styleBody += " padding: 10px 0;";
  const label: ILabel = token.uuid ? getLabelByUuidFromLabelsList(token.uuid) : null;
  const labelRef = label ? label.id : '';
  return labelRef 
    ? `<div id="${labelRef}" class="theorem" number="${envNumber}" style="${styleBody}">`
    : `<div class="theorem" style="${styleBody}">`;
};

const renderTheoremPrintOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envStyle = token.envStyle;
  let styleTile = "";
  /**
   * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
   * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
   * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
   * */
  switch (envStyle) {
    case "definition":
      styleTile = "font-weight: bold; font-style: normal;";
      break;
    case "plain":
      styleTile = "font-weight: bold; font-style: normal;";
      break;
    case "remark":
      styleTile = "font-style: italic;";
      break;
  }
  if (options.forDocx) {
    styleTile += 'display: inline;'
    return`<div style="${styleTile}" class="theorem-title">`;
  }
  return`<span style="${styleTile}" class="theorem-title">`;
};

const renderTheoremPrintClose = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envName = token.environment;
  const envDescription = token.envDescription;
  const envNumber = token.envNumber;
  const envStyle = token.envStyle;
  const envIndex = envName
    ? getTheoremEnvironmentIndex(envName)
    : -1;
  if (envIndex !== -1) {
    const envItem = theoremEnvironments[envIndex];
    let htmlPrint = envItem.isNumbered
      ? ' ' + envNumber
      : '';
    htmlPrint += envStyle === "plain" ? '.' : envDescription ? '' : '.';
    htmlPrint += options.forDocx ? `</div>` : `</span>`;
    const htmlSpaceMin = options.forDocx
      ? '<span>&nbsp;</span>'
      : '<span style="margin-right: 10px"></span>';
    const htmlSpace = options.forDocx
      ? '<span>&nbsp;&nbsp;</span>'
      : '<span style="margin-right: 16px"></span>';
    htmlPrint += envDescription ? htmlSpaceMin : htmlSpace;
    return htmlPrint;
  }
  return options.forDocx ? `</div>` : `</span>`;
};

const renderTheoremDescriptionOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envStyle = token.envStyle;
  let styleDescription = "";
  /**
   * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
   * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
   * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
   * */
  switch (envStyle) {
    case "definition":
      styleDescription = "font-style: normal;";
      break;
    case "plain":
      styleDescription = "font-weight: bold; font-style: normal;";
      break;
    case "remark":
      styleDescription = "font-style: normal;";
      break;
  }
  return `<span style="${styleDescription}">(`
};

const renderTheoremDescriptionClose = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envStyle = token.envStyle;
  const envDescription = token.envDescription;
  const point = envDescription && envStyle === "plain" ? '' : '.';
  const htmlSpace = options.forDocx
    ? '<span>&nbsp;&nbsp;</span>'
    : '<span style="margin-right: 16px"></span>';
  return  ')' + point + '</span>' + htmlSpace;
};

const renderProofOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const label: ILabel = token.uuid ? getLabelByUuidFromLabelsList(token.uuid) : null;
  const labelRef = label ? label.id : '';
  const styleTile = "font-style: italic;";
  const styleBody = "font-style: normal; padding: 10px 0;";
  let htmlTitle = `<span style="${styleTile}">Proof.</span>`;
  const htmlSpaceMin = options.forDocx 
  ? '<span>&nbsp;</span>'
  : '<span style="margin-right: 10px"></span>';
  htmlTitle += htmlSpaceMin;

  return labelRef
    ? `<div id="${labelRef}" class="proof" style="${styleBody}">` + htmlTitle
    : `<div class="proof" style="${styleBody}">` + htmlTitle;
};

export const mappingTheorems = {
  newtheorem: "newtheorem",
  theoremstyle: "theoremstyle",
  theorem_open: "theorem_open",
  theorem_close: "theorem_close",
  proof_open: "proof_open",
  proof_close: "proof_close",
  qedsymbol: "qedsymbol",
  qedsymbol_open: "qedsymbol_open",
  qedsymbol_close: "qedsymbol_close",
  renewcommand_qedsymbol: "renewcommand_qedsymbol",
  theorem_description_open: "theorem_description_open",
  theorem_description_close: "theorem_description_close",
  theorem_print_open: "theorem_print_open",
  theorem_print_close: "theorem_print_close",
  theorem_setcounter: "theorem_setcounter",
};

export const renderTheorems = (md: MarkdownIt) => {
  Object.keys(mappingTheorems).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env = {}, slf) => {
      switch (tokens[idx].type) {
        case "newtheorem":
        case "theoremstyle":
        case "renewcommand_qedsymbol":
        case "theorem_setcounter":
          return '';
        case "theorem_open":
          return renderTheoremOpen(tokens, idx, options, env, slf);         
        case "proof_open":
          return renderProofOpen(tokens, idx, options, env, slf);
        case "theorem_close":
        case "proof_close":
          return "</div>";        
        case "qedsymbol_open":
          return `<span style="float: right">`;        
        case "qedsymbol_close":
          return "</span>";
        case "theorem_print_open":
          return renderTheoremPrintOpen(tokens, idx, options, env, slf);        
        case "theorem_print_close":
          return renderTheoremPrintClose(tokens, idx, options, env, slf);        
        case "theorem_description_open":
          return renderTheoremDescriptionOpen(tokens, idx, options, env, slf);        
        case "theorem_description_close":
          return renderTheoremDescriptionClose(tokens, idx, options, env, slf);
        default:
          return '';
      }
    }
  })
};
