import { Token } from 'markdown-it';
import { ParserErrors } from "../../mathpix-markdown-model";

export type TParseError = Array<string>;
export type TParseErrorList = Array<TParseError>;

export var ParseErrorList: TParseErrorList = [];
export var ParseError: TParseError= [];

export const pushError = ( messages: string) => {
  ParseError.push(messages);
};

export const pushParseErrorList = ( messages: TParseError, ln : number) => {
  ParseErrorList[ln] =  messages;
};

export const ClearParseError = () => {
  ParseError = []
};

export const ClearParseErrorList = () => {
  ParseErrorList = []
};


const StatePushDivError = (state, startLine: number, nextLine: number, content: string, ParseError: string[], title: string) => {
  let token: Token;
  state.line = nextLine;
  token = state.push('paragraph_open', 'div', 1);

  if (state.md.options.parserErrors === ParserErrors.show) {
    token.attrs = [['class', 'math-error ']];
  }
  if (state.md.options.parserErrors === ParserErrors.hide) {
    token.attrSet('style', 'display: none;')
  }
  token.map = [startLine, state.line];

  token = state.push('inline', '', 0);
  token.children = [];
  if (state.md.options.parserErrors === ParserErrors.show){
    token.content = title + ParseError.concat('\n');
  }
  token = state.push('text', '', 0);
  token.children = [];
  token.content = content;
  state.push('paragraph_close', 'div', -1);
  ClearParseError();
};



export const CheckParseError = (state, startLine: number, nextLine: number, content: string) => {
  if (ParseError && ParseError.length > 0) {
    StatePushDivError(state, startLine, nextLine, content, ParseError, 'Tabular parse error: ');
    pushParseErrorList(ParseError, startLine);
    return true;
  }
  return false
};
