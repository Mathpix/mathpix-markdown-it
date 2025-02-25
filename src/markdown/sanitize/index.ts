const sanitizeHtml = require('./sanitize-html');

import { //allowedTags, allowedAttributes,
  generateAllowedTagsAndAttrs,
  allowedClasses, allowedSchemes, allowedSchemesFile } from './consts';

export const sanitize = (html: string, options = {}) => {
  let config;
  if (options) {
    config = Object.assign({}, getSanitizerConfig(options), options)
  } else {
    config = getSanitizerConfig(options)
  }

  if (config.skipCloseTag
    && html.charCodeAt(0) === 0x3C/* < */
    && html.charCodeAt(1) === 0x2F/* / */) {
    //close tag
    const closeTag = html.slice(2).slice(0, -1);

    if (!closeTag) {
      return '';
    }
    return config.allowedTags.indexOf(closeTag.toLowerCase()) !== -1
        ? html
        : config.disallowedTagsMode === 'recursiveEscape'
          ? escapeHtml(html, true)
          : '';
  } else {
    return sanitizeHtml(html, config);
  }
};

function escapeHtml(s, quote) {
  if (typeof (s) !== 'string') {
    s = s + '';
  }
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;');
  if (quote) {
    s = s.replace(/\"/g, '&quot;');
  }
  // TODO: this is inadequate because it will pass `&0;`. This approach
  // will not work, each & must be considered with regard to whether it
  // is followed by a 100% syntactically valid entity or not, and escaped
  // if it is not. If this bothers you, don't set parser.decodeEntities
  // to false. (The default is true.)
  s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, '&amp;') // Match ampersands not part of existing HTML entity
    .replace(/</g, '&lt;')
    .replace(/\>/g, '&gt;');
  if (quote) {
    s = s.replace(/\"/g, '&quot;');
  }
  return s;
}

const getSanitizerConfig = (options: any = {}, addprefixHTMLids = false) => {
  const data = generateAllowedTagsAndAttrs();
  const transformTags = {
    'a': getNofollowSanitize(options),
    'td': sanitizeCellStyle,
    'th': sanitizeCellStyle,
  };
  if ( addprefixHTMLids ) {
    transformTags['*'] = prefixHTMLids;
  }
  return {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(data.allowedTags),
    allowedClasses: allowedClasses,
    allowedAttributes: data.allowedAttributes,
    allowedSchemes: options.enableFileLinks ? allowedSchemesFile : allowedSchemes,
    transformTags: transformTags
  }
};

function getNofollowSanitize (options) {
  return options.nofollow ? sanitizeAnchorNofollow : sanitizeIdentity
}

function sanitizeIdentity (tagName, attribs) {
  return {
    tagName: tagName,
    attribs: attribs
  }
}

function sanitizeAnchorNofollow (tagName, attribs) {
  if (attribs.href) {
    attribs.rel = 'nofollow'
  }
  return sanitizeIdentity(tagName, attribs)
}

// Allow table cell alignment
function sanitizeCellStyle (tagName, attribs) {
  // if we don't add the 'style' to the allowedAttributes above, it will be
  // stripped out by the time we get here, so we have to filter out
  // everything but `text-align` in case something else tries to sneak in
  function cell (alignment?) {
    var attributes = attribs
    if (alignment) {
      attributes.style = 'text-align:' + alignment
    } else {
      delete attributes.style
    }
    return {
      tagName: tagName,
      attribs: attributes
    }
  }

  // look for CSS `text-align` directives
  var alignmentRegEx = /text-align\s*:\s*(left|center|right)[\s;$]*/igm
  var result = alignmentRegEx.exec(attribs.style || '')
  return result ? cell(result[1]) : cell()
}

function prefixHTMLids (tagName, attribs) {
  if (attribs.id && !isAlreadyPrefixed(attribs.id, 'user-content-')) {
    attribs.id = 'user-content-' + attribs.id
  }
  return {
    tagName: tagName,
    attribs: attribs
  }
}

function isAlreadyPrefixed (id, prefix) {
  return id.includes(prefix) && id.length > prefix.length
}

