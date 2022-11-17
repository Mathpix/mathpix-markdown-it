const isSpace = require('markdown-it/lib/common/utils').isSpace;
const normalizeReference = require('markdown-it/lib/common/utils').normalizeReference;
const percentageRegex = /([\d.]+)%/i;
const sizeRegex = /([\d.]+)(px|pt|em|cm|mm|in)/i;

interface IParseImageParams {
  attr: Array<Array<string>>, 
  align: string,
  latex: string
}

const getSizeValue = (strVal: string, latexLength: string = '\\textwidth'): {latex: string, val: string} => {
  let latex = '';
  let val = '';
  let match = strVal.match(percentageRegex);
  if (match) {
    latex = (Number(match[1])/100).toString() + latexLength;
    val = match[0];
  } else {
    match = strVal.match(sizeRegex);
    if (match) {
      latex = match[0];
      val = match[0];
    }
  }
  return {
    latex: latex,
    val: val
  }
};

const parseImageParams = (str: string, align: string=''): IParseImageParams| null => {
  if (!str) { 
    return null;
  }
  let params = [];
  let style: string = '';
  let latex = '';
  const res = [];
  let size: {latex: string, val: string} = null;
  str = str.replace(/ /g, '');
  if (str) {
    params = str.split(',')
  }
  for (let i = 0; i < params.length; i++) {
    const param = params[i].split('=');
    if ( ['left', 'right', 'center'].indexOf(param[0]) >= 0) {
      align = param[0];
    }
    let val = param[1] 
      ? param[1].replace(/"/g, '').replace(/'/g, '')
      : '';
    val = val ? val.trim() : '';
    if (!val) {
      continue;
    }
    switch (param[0]) {
      case 'width':
        size = getSizeValue(val, '\\textwidth');
        if (size?.val) {
          style += `${param[0]}: ${val};`;
          res.push(['width', val]);
        }
        if(size?.latex){
          latex += latex ? ', ' : '';
          latex += 'width=';
          latex += size.latex;
        }
        break;
      case 'height':
        size = getSizeValue(val, '\\textheight');
        if (size?.val) {
          style += `${param[0]}: ${val};`;
          res.push(['height', val]);
        }
        if(size?.latex){
          latex += latex ? ', ' : '';
          latex += 'height=';
          latex += size.latex;
        }
        break;      
      case 'align':
        align = val;
        break;
      default:
        break;
    }
  }
  if (align) {
    res.push(['data-align', align]);
  }
  res.push(['style', style]);
  latex += align ? latex ? ', ' + align : align : '';
  return style || res
    ? { attr: res,  align: align, latex: latex }
    : null;
};

/** Process ![image](<src> "title") 
 * Replace image inline rule:
 * Process:
 *   ![image](<src> "title")
 *   ![image](<src> "title"){width=50%}
 *   ![image](<src> "title"){width="10px"}
 *   ![image](<src> "title"){width="20px",height="20px"}
 *   ![image](<src> "title"){width="20px",height="20px",right}
 * */
export const imageWithSize = (state, silent) => {
  var
    attrs,
    code,
    content,
    label,
    labelEnd,
    labelStart,
    pos,
    ref,
    res,
    title,
    token,
    tokens,
    start,
    href = '',
    oldPos = state.pos,
    max = state.posMax;
  let attrsStyles = [];
  let params: IParseImageParams = null;

  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 2;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
    
    /** customize image width, height, align */
    let oldPosParam = pos;
    let strParams = '';
    let hasCloseBranch = false;
    // [link](  <href>  "title"  ) {width=50%}
    //                            ^^ skipping these spaces
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max || state.src.charCodeAt(pos) !== 123/* { */) {
      state.pos = oldPosParam;
    } else {
      oldPosParam = pos;
      if (state.src.charCodeAt(pos) === 123/* { */) {
        for (; pos < max; pos++) {
          code = state.src.charCodeAt(pos);
          if (oldPosParam < pos && state.src.charCodeAt(pos) === 123/* { */){
            strParams = '';
            break;
          }
          strParams += state.src[pos];
          if (code === 125/* } */) {
            pos++;
            hasCloseBranch = true;
            break;
          }
        }
      }
    }
    // parser params failed to find '}', so it's not a valid params
    if (!hasCloseBranch) {
      pos = oldPosParam;
    } else {
      if (strParams?.trim()) {
        strParams = strParams
          .replace('{', '')
          .replace('}', '');
        strParams = strParams ? strParams.trim() :'';
        if (state.md.options.centerImages) {
          params = parseImageParams(strParams, 'center');
        } else {
          params = parseImageParams(strParams, '');
        }
        if (params) {
          attrsStyles = attrsStyles.concat(params.attr);
        }
      }
    }
  } else {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);

    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens = []
    );

    token          = state.push('image', 'img', 0);
    attrs = [ [ 'src', href ], [ 'alt', '' ] ];
    if (attrsStyles?.length) {
      attrs = attrs.concat(attrsStyles);
    }
    token.attrs = attrs;
    token.children = tokens;
    token.content  = content;
    if (params?.latex) {
      token.latex = params.latex;
    }

    if (title) {
      attrs.push([ 'title', title ]);
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};

export const renderRuleImage = (tokens, idx, options, env, slf) => {
  let token = tokens[idx];
  let tokenBeforeType = idx - 1 >= 0 
    ? tokens[idx-1].type
    : '';
  let tokenAfterType = idx + 1 < tokens.length 
    ? tokens[idx+1].type 
    : null;

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    slf.renderInlineAsText(token.children, options, env);

  const canBeBlock = tokens.length === 1 
    || (tokenBeforeType === 'softbreak' && !tokenAfterType)
    || (tokenAfterType === 'softbreak' && !tokenBeforeType)
    || (tokenBeforeType === 'softbreak' && tokenAfterType=== 'softbreak');
  let align = token.attrGet('data-align');
  if (!canBeBlock && align) {
    token.attrSet('data-align', '');
  }
  
  if (canBeBlock) {
    if (!align && options.centerImages) {
      align = 'center';
    }
    let res = align 
      ? `<figure style="text-align: ${align}">` 
      : '<figure>';
    res += slf.renderToken(tokens, idx, options);
    res += res = '</figure>';
    return res;
  }
  return slf.renderToken(tokens, idx, options);
};
