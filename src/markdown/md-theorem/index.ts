import { MarkdownIt } from 'markdown-it';
import { theoremEnvironments, getTheoremEnvironmentIndex } from "./helper";

const renderTheoremOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envName = token.environment;
  const envDescription = token.envDescription;
  const envLabel = token.envLabel;
  const envNumber = token.envNumber;
  const envStyle = token.envStyle;
  const envIndex = envName 
    ? getTheoremEnvironmentIndex(envName) 
    : -1;
  
  /**
   * definition - boldface title, Roman body. Commonly used in definitions, conditions, problems and examples.
   * plain - boldface title, italicized body. Commonly used in theorems, lemmas, corollaries, propositions and conjectures.
   * remark - italicized title, Roman body. Commonly used in remarks, notes, annotations, claims, cases, acknowledgments and conclusions.
   * */
  let styleTile = "";
  let styleDescription = "";
  let styleBody = "";
  switch (envStyle) {
    case "definition":
      styleTile = "font-weight: bold; font-style: normal;";
      styleDescription = "font-style: normal;";
      styleBody = "font-style: normal;";
      break;    
    case "plain":
      styleTile = "font-weight: bold; font-style: normal;";
      styleDescription = "font-weight: bold; font-style: normal;";
      styleBody = "font-style: italic;";
      break;    
    case "remark":
      styleTile = "font-style: italic;";
      styleDescription = "font-style: normal;";
      styleBody = "font-style: normal;";
      break;
  }
  styleBody += " padding: 10px 0;";
  
  if (envIndex !== -1) {
    const envItem = theoremEnvironments[envIndex];
    const labelRef = envLabel ? encodeURIComponent(envLabel) : '';
    let textTitle = envItem.isNumbered 
      ? envItem.print + ' ' + envNumber
      : envItem.print;
    let textDescription = envDescription 
      ? `(${envDescription})` 
      : '';
    textTitle += envStyle === "plain" ? '.' : textDescription ? '' : '.';
    textDescription += textDescription && envStyle === "plain" ? '' : '.';
    
    let htmlDescription = envDescription ? `<span style="${styleDescription}">${textDescription}</span>` : '';
    let htmlPrint = `<span style="${styleTile}" class="theorem-title">${textTitle}</span>`;
    const htmlSpaceMin = options.forDocx 
      ? '<span>&nbsp;</span>'
      : '<span style="margin-right: 10px"></span>';
    const htmlSpace = options.forDocx 
      ? '<span>&nbsp;&nbsp;</span>'
      : '<span style="margin-right: 16px"></span>';
    htmlPrint += envDescription ? htmlSpaceMin : htmlSpace;
    htmlDescription += envDescription ? htmlSpace : '';
    const htmlTitle = htmlPrint + htmlDescription;
    
    return labelRef 
      ? `<div id="${labelRef}" class="theorem" style="${styleBody}">` + htmlTitle
      : `<div class="theorem" style="${styleBody}">` + htmlTitle;
  }
  return `<div class="theorem" style="${styleBody}">`;
};

const renderProofOpen = (tokens, idx, options, env, slf) => {
  const token = tokens[idx];
  const envLabel = token.envLabel;

  const labelRef = envLabel ? encodeURIComponent(envLabel) : '';
  const styleTile = "font-style: italic;";
  const styleBody = "font-style: normal; padding: 10px 0;";
  let htmlTitle = `<span style="${styleTile}">Proof.</span>`;
  const htmlSpaceMin = options.forDocx 
  ? '<span>&nbsp;</span>'
  : '<span style="margin-right: 10px"></span>';
  htmlTitle += htmlSpaceMin;

  return labelRef
    ? `<div id="${labelRef}" class="proof" style="${styleBody}">` + htmlTitle
    : '<div class="proof" style="${styleBody}">' + htmlTitle;
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
};

export const renderTheorems = (md: MarkdownIt) => {
  Object.keys(mappingTheorems).forEach(key => {
    md.renderer.rules[key] = (tokens, idx, options, env = {}, slf) => {
      switch (tokens[idx].type) {
        case "newtheorem":
        case "theoremstyle":
        case "renewcommand_qedsymbol":
          return '';
        case "theorem_open":
          return renderTheoremOpen(tokens, idx, options, env, slf);         
        case "proof_open":
          return renderProofOpen(tokens, idx, options, env, slf);         
        // case "qedsymbol":
        //   return renderQEDSymbol(tokens, idx, options, env, slf);        
        case "theorem_close":
        case "proof_close":
          return "</div>";        
        case "qedsymbol_open":
          return `<span style="float: right">`;        
        case "qedsymbol_close":
          return "</span>";
        default:
          return '';
      }
    }
  })
};
