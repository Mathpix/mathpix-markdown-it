"use strict";

const {
  isS, isChar: isChar10, isNameStartChar, isNameChar, S_LIST, NAME_RE,
} = require("xmlchars/xml/1.0/ed5");
const { isChar: isChar11 } = require("xmlchars/xml/1.1/ed2");
const { isNCNameStartChar, isNCNameChar, NC_NAME_RE } =
      require("xmlchars/xmlns/1.0/ed3");

const XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
const XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";

const rootNS = {
  __proto__: null,
  xml: XML_NAMESPACE,
  xmlns: XMLNS_NAMESPACE,
};

const XML_ENTITIES = {
  __proto__: null,
  amp: "&",
  gt: ">",
  lt: "<",
  quot: "\"",
  apos: "'",
};

// EOC: end-of-chunk
const EOC = -1;
const NL_LIKE = -2;

const S_BEGIN_WHITESPACE = "sBeginWhitespace"; // leading whitespace
const S_DOCTYPE = "sDoctype"; // <!DOCTYPE
const S_DOCTYPE_QUOTE = "sDoctypeQuote"; // <!DOCTYPE "//blah
const S_DTD = "sDTD"; // <!DOCTYPE "//blah" [ ...
const S_DTD_QUOTED = "sDTDQuoted"; // <!DOCTYPE "//blah" [ "foo
const S_DTD_OPEN_WAKA = "sDTDOpenWaka";
const S_DTD_OPEN_WAKA_BANG = "sDTDOpenWakaBang";
const S_DTD_COMMENT = "sDTDComment"; // <!--
const S_DTD_COMMENT_ENDING = "sDTDCommentEnding"; // <!-- blah -
const S_DTD_COMMENT_ENDED = "sDTDCommentEnded"; // <!-- blah --
const S_DTD_PI = "sDTDPI"; // <?
const S_DTD_PI_ENDING = "sDTDPIEnding"; // <?hi "there" ?
const S_TEXT = "sText"; // general stuff
const S_ENTITY = "sEntity"; // &amp and such
const S_OPEN_WAKA = "sOpenWaka"; // <
const S_OPEN_WAKA_BANG = "sOpenWakaBang"; // <!...
const S_COMMENT = "sComment"; // <!--
const S_COMMENT_ENDING = "sCommentEnding"; // <!-- blah -
const S_COMMENT_ENDED = "sCommentEnded"; // <!-- blah --
const S_CDATA = "sCData"; // <![CDATA[ something
const S_CDATA_ENDING = "sCDataEnding"; // ]
const S_CDATA_ENDING_2 = "sCDataEnding2"; // ]]
const S_PI_FIRST_CHAR = "sPIFirstChar"; // <?hi, first char
const S_PI_REST = "sPIRest"; // <?hi, rest of the name
const S_PI_BODY = "sPIBody"; // <?hi there
const S_PI_ENDING = "sPIEnding"; // <?hi "there" ?
const S_OPEN_TAG = "sOpenTag"; // <strong
const S_OPEN_TAG_SLASH = "sOpenTagSlash"; // <strong /
const S_ATTRIB = "sAttrib"; // <a
const S_ATTRIB_NAME = "sAttribName"; // <a foo
const S_ATTRIB_NAME_SAW_WHITE = "sAttribNameSawWhite"; // <a foo _
const S_ATTRIB_VALUE = "sAttribValue"; // <a foo=
const S_ATTRIB_VALUE_QUOTED = "sAttribValueQuoted"; // <a foo="bar
const S_ATTRIB_VALUE_CLOSED = "sAttribValueClosed"; // <a foo="bar"
const S_ATTRIB_VALUE_UNQUOTED = "sAttribValueUnquoted"; // <a foo=bar
const S_CLOSE_TAG = "sCloseTag"; // </a
const S_CLOSE_TAG_SAW_WHITE = "sCloseTagSawWhite"; // </a   >

// These states are internal to sPIBody
const S_XML_DECL_NAME_START = 1; // <?xml
const S_XML_DECL_NAME = 2; // <?xml foo
const S_XML_DECL_EQ = 3; // <?xml foo=
const S_XML_DECL_VALUE_START = 4; // <?xml foo=
const S_XML_DECL_VALUE = 5; // <?xml foo="bar"

/**
 * The list of supported events.
 */
exports.EVENTS = [
  "text",
  "processinginstruction",
  "doctype",
  "comment",
  "opentagstart",
  "opentag",
  "closetag",
  "cdata",
  "error",
  "end",
  "ready",
];

const TAB = 9;
const NL = 0xA;
const CR = 0xD;
const SPACE = 0x20;
const BANG = 0x21;
const DQUOTE = 0x22;
const AMP = 0x26;
const SQUOTE = 0x27;
const MINUS = 0x2D;
const FORWARD_SLASH = 0x2F;
const SEMICOLON = 0x3B;
const LESS = 0x3C;
const EQUAL = 0x3D;
const GREATER = 0x3E;
const QUESTION = 0x3F;
const OPEN_BRACKET = 0x5B;
const CLOSE_BRACKET = 0x5D;
const NEL = 0x85;
const LS = 0x2028; // Line Separator

function isQuote(c) {
  return c === DQUOTE || c === SQUOTE;
}

const QUOTES = [DQUOTE, SQUOTE];

const DOCTYPE_TERMINATOR = [...QUOTES, OPEN_BRACKET, GREATER];
const DTD_TERMINATOR = [...QUOTES, LESS, CLOSE_BRACKET];
const XML_DECL_NAME_TERMINATOR = [EQUAL, QUESTION, ...S_LIST];
const ATTRIB_VALUE_UNQUOTED_TERMINATOR = [...S_LIST, GREATER, AMP, LESS];

function nsPairCheck(parser, prefix, uri) {
  switch (prefix) {
  case "xml":
    if (uri !== XML_NAMESPACE) {
      parser.fail(`xml prefix must be bound to ${XML_NAMESPACE}.`);
    }
    break;
  case "xmlns":
    if (uri !== XMLNS_NAMESPACE) {
      parser.fail(`xmlns prefix must be bound to ${XMLNS_NAMESPACE}.`);
    }
    break;
  default:
  }

  switch (uri) {
  case XMLNS_NAMESPACE:
    parser.fail(prefix === "" ?
                `the default namespace may not be set to ${uri}.` :
                `may not assign a prefix (even "xmlns") to the URI \
${XMLNS_NAMESPACE}.`);
    break;
  case XML_NAMESPACE:
    switch (prefix) {
    case "xml":
      // Assinging the XML namespace to "xml" is fine.
      break;
    case "":
      parser.fail(`the default namespace may not be set to ${uri}.`);
      break;
    default:
      parser.fail("may not assign the xml namespace to another prefix.");
    }
    break;
  default:
  }
}


function nsMappingCheck(parser, mapping) {
  for (const local of Object.keys(mapping)) {
    nsPairCheck(parser, local, mapping[local]);
  }
}

function isNCName(name) {
  return NC_NAME_RE.test(name);
}

function isName(name) {
  return NAME_RE.test(name);
}

const FORBIDDEN_START = 0;
const FORBIDDEN_BRACKET = 1;
const FORBIDDEN_BRACKET_BRACKET = 2;

/**
 * Data structure for an XML tag.
 *
 * @typedef {object} SaxesTag
 *
 * @property {string} name The tag's name. This is the combination of prefix and
 * global name. For instance ``<a:b>`` would have ``"a:b"`` for ``name``.
 *
 * @property {string} prefix The tag's prefix. For instance ``<a:b>`` would have
 * ``"a"`` for ``prefix``. Undefined if we do not track namespaces.
 *
 * @property {string} local The tag's local name. For instance ``<a:b>`` would
 * have ``"b"`` for ``local``. Undefined if we do not track namespaces.
 *
 * @property {string} uri The namespace URI of this tag. Undefined if we do not
 * track namespaces.
 *
 * @property {Object.<string, SaxesAttribute> | Object.<string, string>}
 * attributes A map of attribute name to attributes. If namespaces are tracked,
 * the values in the map are {@link SaxesAttribute SaxesAttribute}
 * objects. Otherwise, they are strings.
 *
 * @property {Object.<string, string>} ns The namespace bindings in effect.
 *
 * @property {boolean} isSelfClosing Whether the tag is
 * self-closing (e.g. ``<foo/>``).
 *
 */

/**
 * Data structure for an XML attribute
 *
 * @typedef {object} SaxesAttribute
 *
 * @property {string} name The attribute's name. This is the combination of
 * prefix and local name. For instance ``a:b="c"`` would have ``a:b`` for name.
 *
 * @property {string} prefix The attribute's prefix. For instance ``a:b="c"``
 * would have ``"a"`` for ``prefix``.
 *
 * @property {string} local The attribute's local name. For instance ``a:b="c"``
 * would have ``"b"`` for ``local``.
 *
 * @property {string} uri The namespace URI of this attribute.
 *
 * @property {string} value The attribute's value.
 */

/**
 * @typedef XMLDecl
 *
 * @property {string} [version] The version specified by the XML declaration.
 *
 * @property {string} [encoding] The encoding specified by the XML declaration.
 *
 * @property {string} [standalone] The value of the standalone parameter
 * specified by the XML declaration.
 */

/**
 * @callback ResolvePrefix
 *
 * @param {string} prefix The prefix to check.
 *
 * @returns {string|undefined} The URI corresponding to the prefix, if any.
 */

/**
 * @typedef SaxesOptions
 *
 * @property {boolean} [xmlns] Whether to track namespaces. Unset means
 * ``false``.
 *
 * @property {boolean} [fragment] Whether to accept XML fragments. Unset means
 * ``false``.
 *
 * @property {boolean} [additionalNamespaces] A plain object whose key, value
 * pairs define namespaces known before parsing the XML file. It is not legal
 * to pass bindings for the namespaces ``"xml"`` or ``"xmlns"``.
 *
 * @property {ResolvePrefix} [resolvePrefix] A function that will be used if the
 * parser cannot resolve a namespace prefix on its own.
 *
 * @property {boolean} [position] Whether to track positions. Unset means
 * ``true``.
 *
 * @property {string} [fileName] A file name to use for error reporting. "File
 * name" is a loose concept. You could use a URL to some resource, or any
 * descriptive name you like.
 *
 * @property {"1.0" | "1.1"} [defaultXMLVersion] The default XML version to
 * use. If unspecified, and there is no XML encoding declaration, the default
 * version is "1.0".
 *
 * @property {boolean} [forceXMLVersion] A flag indicating whether to force the
 * XML version used for parsing to the value of ``defaultXMLVersion``. When this
 * flag is ``true``, ``defaultXMLVersion`` must be specified. If unspecified,
 * the default value of this flag is ``false``.
 */

class SaxesParser {
  /**
   * @param {SaxesOptions} opt The parser options.
   */
  constructor(opt) {
    this._init(opt);
  }

  /**
   * Reset the parser state.
   *
   * @private
   */
  _init(opt) {
    this.openWakaBang = "";
    this.text = "";
    this.name = "";
    this.piTarget = "";
    this.entity = "";
    this.xmlDeclName = "";

    /**
     * The options passed to the constructor of this parser.
     *
     * @type {SaxesOptions}
     */
    this.opt = opt || {};

    /**
     * Indicates whether or not the parser is closed. If ``true``, wait for
     * the ``ready`` event to write again.
     *
     * @type {boolean}
     */
    this.closed = false;

    /**
     * The XML declaration for this document.
     *
     * @type {XMLDecl}
     */
    this.xmlDecl = {
      version: undefined,
      encoding: undefined,
      standalone: undefined,
    };

    this.q = null;
    this.tags = [];
    this.tag = null;
    this.chunk = "";
    this.chunkPosition = 0;
    this.i = 0;
    //
    // We use prevI to allow "ungetting" the previously read code point. Note
    // however, that it is not safe to unget everything and anything. In
    // particular ungetting EOL characters will screw positioning up.
    //
    // Practically, you must not unget a code which has any side effect beyond
    // updating ``this.i`` and ``this.prevI``. Only EOL codes have such side
    // effects.
    //
    this.prevI = 0;
    this.carriedFromPrevious = undefined;
    this.forbiddenState = FORBIDDEN_START;
    /**
     * A map of entity name to expansion.
     *
     * @type {Object.<string, string>}
     */
    this.ENTITIES = Object.create(XML_ENTITIES);
    this.attribList = [];

    // The logic is organized so as to minimize the need to check
    // this.opt.fragment while parsing.

    const fragmentOpt = this.fragmentOpt = !!this.opt.fragment;
    this.state = fragmentOpt ? S_TEXT : S_BEGIN_WHITESPACE;
    // We want these to be all true if we are dealing with a fragment.
    this.reportedTextBeforeRoot = this.reportedTextAfterRoot = this.closedRoot =
      this.sawRoot = fragmentOpt;
    // An XML declaration is intially possible only when parsing whole
    // documents.
    this.xmlDeclPossible = !fragmentOpt;

    this.piIsXMLDecl = false;
    this.xmlDeclState = S_XML_DECL_NAME_START;
    this.xmlDeclExpects = ["version"];
    this.requiredSeparator = false;
    this.entityReturnState = undefined;
    const xmlnsOpt = this.xmlnsOpt = !!this.opt.xmlns;

    if (xmlnsOpt) {
      // This is the function we use to perform name checks on PIs and entities.
      // When namespaces are used, colons are not allowed in PI target names or
      // entity names. So the check depends on whether namespaces are used. See:
      //
      // https://www.w3.org/XML/xml-names-19990114-errata.html
      // NE08
      //
      this.nameStartCheck = isNCNameStartChar;
      this.nameCheck = isNCNameChar;
      this.isName = isNCName;
      this.processAttribs = this.processAttribsNS;

      this.ns = { __proto__: null, ...rootNS };
      const additional = this.opt.additionalNamespaces;
      if (additional) {
        nsMappingCheck(this, additional);
        Object.assign(this.ns, additional);
      }
    }
    else {
      this.nameStartCheck = isNameStartChar;
      this.nameCheck = isNameChar;
      this.isName = isName;
      this.processAttribs = this.processAttribsPlain;
    }

    let { defaultXMLVersion } = this.opt;
    const { forceXMLVersion } = this.opt;
    if (defaultXMLVersion === undefined) {
      if (forceXMLVersion) {
        throw new Error("forceXMLVersion set but defaultXMLVersion is not set");
      }
      defaultXMLVersion = "1.0";
    }
    this.setXMLVersion(defaultXMLVersion);

    this.trackPosition = this.opt.position !== false;
    /** The line number the parser is  currently looking at. */
    this.line = 1;

    /** The column the parser is currently looking at. */
    this.positionAtNewLine = 0;

    this.fileName = this.opt.fileName;
    this.onready();
  }

  /** The stream position the parser is currently looking at. */
  get position() {
    return this.chunkPosition + this.i;
  }

  get column() {
    return this.position - this.positionAtNewLine;
  }

  /* eslint-disable class-methods-use-this */
  /**
   * Event handler for text data. The default implementation is a no-op.
   *
   * @param {string} text The text data encountered by the parser.
   *
   */
  ontext() {}

  /**
   * Event handler for processing instructions. The default implementation is a
   * no-op.
   *
   * @param {{target: string, body: string}} data The target and body of
   * the processing instruction.
   */
  onprocessinginstruction() {}

  /**
   * Event handler for doctype. The default implementation is a no-op.
   *
   * @param {string} doctype The doctype contents.
   */
  ondoctype() {}

  /**
   * Event handler for comments. The default implementation is a no-op.
   *
   * @param {string} comment The comment contents.
   */
  oncomment() {}

  /**
   * Event handler for the start of an open tag. This is called as soon as we
   * have a tag name. The default implementation is a no-op.
   *
   * @param {SaxesTag} tag The tag.
   */
  onopentagstart() {}

  /**
   * Event handler for an open tag. This is called when the open tag is
   * complete. (We've encountered the ">" that ends the open tag.) The default
   * implementation is a no-op.
   *
   * @param {SaxesTag} tag The tag.
   */
  onopentag() {}

  /**
   * Event handler for a close tag. Note that for self-closing tags, this is
   * called right after ``onopentag``. The default implementation is a no-op.
   *
   * @param {SaxesTag} tag The tag.
   */
  onclosetag() {}

  /**
   * Event handler for a CDATA section. This is called when ending the
   * CDATA section. The default implementation is a no-op.
   *
   * @param {string} cdata The contents of the CDATA section.
   */
  oncdata() {}

  /**
   * Event handler for the stream end. This is called when the stream has been
   * closed with ``close`` or by passing ``null`` to ``write``. The default
   * implementation is a no-op.
   */
  onend() {}

  /**
   * Event handler indicating parser readiness . This is called when the parser
   * is ready to parse a new document.  The default implementation is a no-op.
   */
  onready() {}

  /**
   * Event handler indicating an error. The default implementation throws the
   * error. Override with a no-op handler if you don't want this.
   *
   * @param {Error} err The error that occurred.
   */
  onerror(err) {
    throw new Error(err);
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Report a parsing error. This method is made public so that client code may
   * check for issues that are outside the scope of this project and can report
   * errors.
   *
   * @param {string} er The error to report.
   *
   * @returns this
   */
  fail(er) {
    let message = this.fileName || "";
    if (this.trackPosition) {
      if (message.length > 0) {
        message += ":";
      }
      message += `${this.line}:${this.column}`;
    }
    if (message.length > 0) {
      message += ": ";
    }
    message += er;
    this.onerror(new Error(message));
    return this;
  }

  /**
   * Write a XML data to the parser.
   *
   * @param {string} chunk The XML data to write.
   *
   * @returns this
   */
  write(chunk) {
    if (this.closed) {
      return this.fail("cannot write after close; assign an onready handler.");
    }

    let end = false;
    if (chunk === null) {
      end = true;
      chunk = "";
    }

    if (typeof chunk === "object") {
      chunk = chunk.toString();
    }

    // We checked if performing a pre-decomposition of the string into an array
    // of single complete characters (``Array.from(chunk)``) would be faster
    // than the current repeated calls to ``charCodeAt``. As of August 2018, it
    // isn't. (There may be Node-specific code that would perform faster than
    // ``Array.from`` but don't want to be dependent on Node.)

    if (this.carriedFromPrevious !== undefined) {
      // The previous chunk had char we must carry over.
      chunk = `${this.carriedFromPrevious}${chunk}`;
      this.carriedFromPrevious = undefined;
    }

    let limit = chunk.length;
    const lastCode = chunk.charCodeAt(limit - 1);
    if (!end &&
        // A trailing CR or surrogate must be carried over to the next
        // chunk.
        (lastCode === CR || (lastCode >= 0xD800 && lastCode <= 0xDBFF))) {
      // The chunk ends with a character that must be carried over. We cannot
      // know how to handle it until we get the next chunk or the end of the
      // stream. So save it for later.
      this.carriedFromPrevious = chunk[limit - 1];
      limit--;
      chunk = chunk.slice(0, limit);
    }

    this.chunk = chunk;
    this.i = 0;
    while (this.i < limit) {
      this[this.state]();
    }
    this.chunkPosition += limit;

    return end ? this.end() : this;
  }

  /**
   * Close the current stream. Perform final well-formedness checks and reset
   * the parser tstate.
   *
   * @returns this
   */
  close() {
    return this.write(null);
  }

  /**
   * Get a single code point out of the current chunk. This updates the current
   * position if we do position tracking.
   *
   * This is the algorithm to use for XML 1.0.
   *
   * @private
   *
   * @returns {number} The character read.
   */
  getCode10() {
    const { chunk, i } = this;
    this.prevI = i;
    // Yes, we do this instead of doing this.i++. Doing it this way, we do not
    // read this.i again, which is a bit faster.
    this.i = i + 1;

    if (i >= chunk.length) {
      return EOC;
    }

    // Using charCodeAt and handling the surrogates ourselves is faster
    // than using codePointAt.
    const code = chunk.charCodeAt(i);

    if (code < 0xD800) {
      if (code >= SPACE || code === TAB) {
        return code;
      }

      switch (code) {
      case NL:
        this.line++;
        this.positionAtNewLine = this.position;
        return NL;
      case CR:
        // We may get NaN if we read past the end of the chunk, which is fine.
        if (chunk.charCodeAt(i + 1) === NL) {
          // A \r\n sequence is converted to \n so we have to skip over the next
          // character. We already know it has a size of 1 so ++ is fine here.
          this.i = i + 2;
        }
        // Otherwise, a \r is just converted to \n, so we don't have to skip
        // ahead.

        // In either case, \r becomes \n.
        this.line++;
        this.positionAtNewLine = this.position;
        return NL_LIKE;
      default:
        // If we get here, then code < SPACE and it is not NL CR or TAB.
        this.fail("disallowed character.");
        return code;
      }
    }

    if (code > 0xDBFF) {
      // This is a specialized version of isChar10 that takes into account
      // that in this context code > 0xDBFF and code <= 0xFFFF. So it does not
      // test cases that don't need testing.
      if (!(code >= 0xE000 && code <= 0xFFFD)) {
        this.fail("disallowed character.");
      }

      return code;
    }

    const final = 0x10000 + ((code - 0xD800) * 0x400) +
          (chunk.charCodeAt(i + 1) - 0xDC00);
    this.i = i + 2;

    // This is a specialized version of isChar10 that takes into account that in
    // this context necessarily final >= 0x10000.
    if (final > 0x10FFFF) {
      this.fail("disallowed character.");
    }

    return final;
  }


  /**
   * Get a single code point out of the current chunk. This updates the current
   * position if we do position tracking.
   *
   * This is the algorithm to use for XML 1.1.
   *
   * @private
   *
   * @returns {number} The character read.
   */
  getCode11() {
    const { chunk, i } = this;
    this.prevI = i;
    // Yes, we do this instead of doing this.i++. Doing it this way, we do not
    // read this.i again, which is a bit faster.
    this.i = i + 1;

    if (i >= chunk.length) {
      return EOC;
    }

    // Using charCodeAt and handling the surrogates ourselves is faster
    // than using codePointAt.
    const code = chunk.charCodeAt(i);

    if (code < 0xD800) {
      if ((code > 0x1F && code < 0x7F) || (code > 0x9F && code !== LS) ||
          code === TAB) {
        return code;
      }

      switch (code) {
      case NL: // 0xA
        this.line++;
        this.positionAtNewLine = this.position;
        return NL;
      case CR: { // 0xD
        // We may get NaN if we read past the end of the chunk, which is
        // fine.
        const next = chunk.charCodeAt(i + 1);
        if (next === NL || next === NEL) {
          // A CR NL or CR NEL sequence is converted to NL so we have to skip over
          // the next character. We already know it has a size of 1.
          this.i = i + 2;
        }
        // Otherwise, a CR is just converted to NL, no skip.
      }
        /* yes, fall through */
      case NEL: // 0x85
      case LS: // Ox2028
        this.line++;
        this.positionAtNewLine = this.position;
        return NL_LIKE;
      default:
        this.fail("disallowed character.");
        return code;
      }
    }

    if (code > 0xDBFF) {
      // This is a specialized version of isCharAndNotRestricted that takes into
      // account that in this context code > 0xDBFF and code <= 0xFFFF. So it
      // does not test cases that don't need testing.
      if (!(code >= 0xE000 && code <= 0xFFFD)) {
        this.fail("disallowed character.");
      }

      return code;
    }

    const final = 0x10000 + ((code - 0xD800) * 0x400) +
          (chunk.charCodeAt(i + 1) - 0xDC00);
    this.i = i + 2;

    // This is a specialized version of isCharAndNotRestricted that takes into
    // account that in this context necessarily final >= 0x10000.
    if (final > 0x10FFFF) {
      this.fail("disallowed character.");
    }

    return final;
  }

  /**
   * Like ``getCode`` but with the return value normalized so that ``NL`` is
   * returned for ``NL_LIKE``.
   *
   * @private
   */
  getCodeNorm() {
    const c = this.getCode();
    return c === NL_LIKE ? NL : c;
  }

  /**
   * @callback CharacterTest
   *
   * @private
   *
   * @param {string} c The character to test.
   *
   * @returns {boolean} ``true`` if the method should continue capturing text,
   * ``false`` otherwise.
   */

  /**
   * Capture characters into a buffer until encountering one of a set of
   * characters.
   *
   * @private
   *
   * @param {number[]} chars An array of codepoints. Encountering a character in
   * the array ends the capture. (``chars`` may safely contain ``NL``.)
   *
   * @return {number} The character code that made the capture end, or ``EOC``
   * if we hit the end of the chunk. The return value cannot be NL_LIKE: NL is
   * returned instead.
   */
  captureTo(chars) {
    let { i: start } = this;
    const { chunk } = this;
    while (true) {
      const c = this.getCode();
      const isNLLike = c === NL_LIKE;
      const final = isNLLike ? NL : c;
      if (final === EOC || chars.includes(final)) {
        this.text += chunk.slice(start, this.prevI);
        return final;
      }

      if (isNLLike) {
        this.text += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
      }
    }
  }

  /**
   * Capture characters into a buffer until encountering a character.
   *
   * @private
   *
   * @param {number} char The codepoint that ends the capture. **NOTE ``char``
   * MAY NOT CONTAIN ``NL``.** Passing ``NL`` will result in buggy behavior.
   *
   * @return {boolean} ``true`` if we ran into the character. Otherwise, we ran
   * into the end of the current chunk.
   */
  captureToChar(char) {
    let { i: start } = this;
    const { chunk } = this;
    while (true) {
      let c = this.getCode();
      switch (c) {
      case NL_LIKE:
        this.text += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
        c = NL;
        break;
      case EOC:
        this.text += chunk.slice(start);
        return false;
      default:
      }

      if (c === char) {
        this.text += chunk.slice(start, this.prevI);
        return true;
      }
    }
  }

  /**
   * Capture characters that satisfy ``isNameChar`` into the ``name`` field of
   * this parser.
   *
   * @private
   *
   * @return {number} The character code that made the test fail, or ``EOC`` if
   * we hit the end of the chunk. The return value cannot be NL_LIKE: NL is
   * returned instead.
   */
  captureNameChars() {
    const { chunk, i: start } = this;
    while (true) {
      const c = this.getCode();
      if (c === EOC) {
        this.name += chunk.slice(start);
        return EOC;
      }

      // NL is not a name char so we don't have to test specifically for it.
      if (!isNameChar(c)) {
        this.name += chunk.slice(start, this.prevI);
        return c === NL_LIKE ? NL : c;
      }
    }
  }

  /**
   * Capture characters into a buffer while ``this.nameCheck`` run on the
   * character read returns true.
   *
   * @private
   *
   * @param {string} buffer The name of the buffer to save into.
   *
   * @return {number} The character code that made the test fail, or ``EOC`` if
   * we hit the end of the chunk.  The return value cannot be NL_LIKE: NL is
   * returned instead.
   */
  captureWhileNameCheck(buffer) {
    const { chunk, i: start } = this;
    while (true) {
      const c = this.getCode();
      if (c === EOC) {
        this[buffer] += chunk.slice(start);
        return EOC;
      }

      // NL cannot satisfy this.nameCheck so we don't have to test
      // specifically for it.
      if (!this.nameCheck(c)) {
        this[buffer] += chunk.slice(start, this.prevI);
        return c === NL_LIKE ? NL : c;
      }
    }
  }

  /**
   * Skip white spaces.
   *
   * @private
   *
   * @return {number} The character that ended the skip, or ``EOC`` if we hit
   * the end of the chunk. The return value cannot be NL_LIKE: NL is returned
   * instead.
   */
  skipSpaces() {
    while (true) {
      const c = this.getCodeNorm();
      if (c === EOC || !isS(c)) {
        return c;
      }
    }
  }

  /** @private */
  setXMLVersion(version) {
    if (version === "1.0") {
      this.isChar = isChar10;
      this.getCode = this.getCode10;
      this.pushAttrib =
        this.xmlnsOpt ? this.pushAttribNS10 : this.pushAttribPlain;
    }
    else {
      this.isChar = isChar11;
      this.getCode = this.getCode11;
      this.pushAttrib =
        this.xmlnsOpt ? this.pushAttribNS11 : this.pushAttribPlain;
    }
  }

  // STATE HANDLERS

  /** @private */
  sBeginWhitespace() {
    // We are essentially peeking at the first character of the chunk. Since
    // S_BEGIN_WHITESPACE can be in effect only when we start working on the
    // first chunk, the index at which we must look is necessarily 0. Note also
    // that the following test does not depend on decoding surrogates.

    // If the initial character is 0xFEFF, ignore it.
    if (this.chunk.charCodeAt(0) === 0xFEFF) {
      this.i++;
    }

    // This initial loop is a specialized version of skipSpaces. We need to know
    // whether we've encountered spaces or not because as soon as we run into a
    // space, an XML declaration is no longer possible. Rather than slow down
    // skipSpaces even in places where we don't care whether it skipped anything
    // or not, we use a specialized loop here.
    let c;
    let sawSpace = false;
    while (true) {
      c = this.getCodeNorm();
      if (c === EOC || !isS(c)) {
        break;
      }

      sawSpace = true;
    }

    if (sawSpace) {
      this.xmlDeclPossible = false;
    }

    switch (c) {
    case LESS:
      this.state = S_OPEN_WAKA;
      // We could naively call closeText but in this state, it is not normal
      // to have text be filled with any data.
      if (this.text.length !== 0) {
        throw new Error("no-empty text at start");
      }
      break;
    case EOC:
      break;
    default:
      // have to process this as a text node.
      // weird, but happens.
      if (!this.reportedTextBeforeRoot) {
        this.fail("text data outside of root node.");
        this.reportedTextBeforeRoot = true;
      }
      this.i = this.prevI;
      this.state = S_TEXT;
      this.xmlDeclPossible = false;
    }
  }

  /** @private */
  sText() {
    //
    // We did try a version of saxes where the S_TEXT state was split in two
    // states: one for text inside the root element, and one for text
    // outside. This was avoiding having to test this.tags.length to decide what
    // implementation to actually use.
    //
    // Peformance testing on gigabyte-size files did not show any advantage to
    // using the two states solution instead of the current one. Conversely, it
    // made the code a bit more complicated elsewhere. For instance, a comment
    // can appear before the root element so when a comment ended it was
    // necessary to determine whether to return to the S_TEXT state or to the
    // new text-outside-root state.
    //
    if (this.tags.length !== 0) {
      this.handleTextInRoot();
    }
    else {
      this.handleTextOutsideRoot();
    }
  }

  /** @private */
  handleTextInRoot() {
    // This is essentially a specialized version of captureTo which is optimized
    // for performing the ]]> check. A previous version of this code, checked
    // ``this.text`` for the presence of ]]>. It simplified the code but was
    // very costly when character data contained a lot of entities to be parsed.
    //
    // Since we are using a specialized loop, we also keep track of the presence
    // of ]]> in text data. The sequence ]]> is forbidden to appear as-is.
    //
    let { i: start, forbiddenState } = this;
    const { chunk } = this;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    scanLoop:
    while (true) {
      switch (this.getCode()) {
      case LESS: {
        this.state = S_OPEN_WAKA;
        const { text } = this;
        const slice = chunk.slice(start, this.prevI);
        if (text.length !== 0) {
          this.ontext(text + slice);
          this.text = "";
        }
        else if (slice.length !== 0) {
          this.ontext(slice);
        }
        forbiddenState = FORBIDDEN_START;
        // eslint-disable-next-line no-labels
        break scanLoop;
      }
      case AMP:
        this.state = S_ENTITY;
        this.entityReturnState = S_TEXT;
        this.text += chunk.slice(start, this.prevI);
        forbiddenState = FORBIDDEN_START;
        // eslint-disable-next-line no-labels
        break scanLoop;
      case CLOSE_BRACKET:
        switch (forbiddenState) {
        case FORBIDDEN_START:
          forbiddenState = FORBIDDEN_BRACKET;
          break;
        case FORBIDDEN_BRACKET:
          forbiddenState = FORBIDDEN_BRACKET_BRACKET;
          break;
        case FORBIDDEN_BRACKET_BRACKET:
          break;
        default:
          throw new Error("impossible state");
        }
        break;
      case GREATER:
        if (forbiddenState === FORBIDDEN_BRACKET_BRACKET) {
          this.fail("the string \"]]>\" is disallowed in char data.");
        }
        forbiddenState = FORBIDDEN_START;
        break;
      case NL_LIKE:
        this.text += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
        forbiddenState = FORBIDDEN_START;
        break;
      case EOC:
        this.text += chunk.slice(start);
        // eslint-disable-next-line no-labels
        break scanLoop;
      default:
        forbiddenState = FORBIDDEN_START;
      }
    }
    this.forbiddenState = forbiddenState;
  }

  /** @private */
  handleTextOutsideRoot() {
    // This is essentially a specialized version of captureTo which is optimized
    // for a specialized task. We keep track of the presence of non-space
    // characters in the text since these are errors when appearing outside the
    // document root element.
    let { i: start } = this;
    const { chunk } = this;
    let nonSpace = false;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    outRootLoop:
    while (true) {
      const code = this.getCode();
      switch (code) {
      case LESS: {
        this.state = S_OPEN_WAKA;
        const { text } = this;
        const slice = chunk.slice(start, this.prevI);
        if (text.length !== 0) {
          this.ontext(text + slice);
          this.text = "";
        }
        else if (slice.length !== 0) {
          this.ontext(slice);
        }
        // eslint-disable-next-line no-labels
        break outRootLoop;
      }
      case AMP:
        this.state = S_ENTITY;
        this.entityReturnState = S_TEXT;
        this.text += chunk.slice(start, this.prevI);
        nonSpace = true;
        // eslint-disable-next-line no-labels
        break outRootLoop;
      case NL_LIKE:
        this.text += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
        break;
      case EOC:
        this.text += chunk.slice(start);
        // eslint-disable-next-line no-labels
        break outRootLoop;
      default:
        if (!isS(code)) {
          nonSpace = true;
        }
      }
    }

    if (!nonSpace) {
      return;
    }

    // We use the reportedTextBeforeRoot and reportedTextAfterRoot flags
    // to avoid reporting errors for every single character that is out of
    // place.
    if (!this.sawRoot && !this.reportedTextBeforeRoot) {
      this.fail("text data outside of root node.");
      this.reportedTextBeforeRoot = true;
    }

    if (this.closedRoot && !this.reportedTextAfterRoot) {
      this.fail("text data outside of root node.");
      this.reportedTextAfterRoot = true;
    }
  }

  /** @private */
  sOpenWaka() {
    // Reminder: a state handler is called with at least one character
    // available in the current chunk. So the first call to get code inside of
    // a state handler cannot return ``EOC``. That's why we don't test
    // for it.
    const c = this.getCode();
    // either a /, ?, !, or text is coming next.
    if (isNameStartChar(c)) {
      this.state = S_OPEN_TAG;
      this.i = this.prevI;
      this.xmlDeclPossible = false;
    }
    else {
      switch (c) {
      case FORWARD_SLASH:
        this.state = S_CLOSE_TAG;
        this.xmlDeclPossible = false;
        break;
      case BANG:
        this.state = S_OPEN_WAKA_BANG;
        this.openWakaBang = "";
        this.xmlDeclPossible = false;
        break;
      case QUESTION:
        this.state = S_PI_FIRST_CHAR;
        break;
      default:
        this.fail("disallowed character in tag name");
        this.state = S_TEXT;
        this.xmlDeclPossible = false;
      }
    }
  }

  /** @private */
  sOpenWakaBang() {
    this.openWakaBang += String.fromCodePoint(this.getCodeNorm());
    switch (this.openWakaBang) {
    case "[CDATA[":
      if (!this.sawRoot && !this.reportedTextBeforeRoot) {
        this.fail("text data outside of root node.");
        this.reportedTextBeforeRoot = true;
      }

      if (this.closedRoot && !this.reportedTextAfterRoot) {
        this.fail("text data outside of root node.");
        this.reportedTextAfterRoot = true;
      }
      this.state = S_CDATA;
      this.openWakaBang = "";
      break;
    case "--":
      this.state = S_COMMENT;
      this.openWakaBang = "";
      break;
    case "DOCTYPE":
      this.state = S_DOCTYPE;
      if (this.doctype || this.sawRoot) {
        this.fail("inappropriately located doctype declaration.");
      }
      this.openWakaBang = "";
      break;
    default:
      // 7 happens to be the maximum length of the string that can possibly
      // match one of the cases above.
      if (this.openWakaBang.length >= 7) {
        this.fail("incorrect syntax.");
      }
    }
  }

  /** @private */
  sDoctype() {
    const c = this.captureTo(DOCTYPE_TERMINATOR);
    switch (c) {
    case GREATER:
      this.ondoctype(this.text);
      this.text = "";
      this.state = S_TEXT;
      this.doctype = true; // just remember that we saw it.
      break;
    case EOC:
      break;
    default:
      this.text += String.fromCodePoint(c);
      if (c === OPEN_BRACKET) {
        this.state = S_DTD;
      }
      else if (isQuote(c)) {
        this.state = S_DOCTYPE_QUOTE;
        this.q = c;
      }
    }
  }

  /** @private */
  sDoctypeQuote() {
    const { q } = this;
    if (this.captureToChar(q)) {
      this.text += String.fromCodePoint(q);
      this.q = null;
      this.state = S_DOCTYPE;
    }
  }

  /** @private */
  sDTD() {
    const c = this.captureTo(DTD_TERMINATOR);
    if (c === EOC) {
      return;
    }

    this.text += String.fromCodePoint(c);
    if (c === CLOSE_BRACKET) {
      this.state = S_DOCTYPE;
    }
    else if (c === LESS) {
      this.state = S_DTD_OPEN_WAKA;
    }
    else if (isQuote(c)) {
      this.state = S_DTD_QUOTED;
      this.q = c;
    }
  }

  /** @private */
  sDTDQuoted() {
    const { q } = this;
    if (this.captureToChar(q)) {
      this.text += String.fromCodePoint(q);
      this.state = S_DTD;
      this.q = null;
    }
  }

  /** @private */
  sDTDOpenWaka() {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    switch (c) {
    case BANG:
      this.state = S_DTD_OPEN_WAKA_BANG;
      this.openWakaBang = "";
      break;
    case QUESTION:
      this.state = S_DTD_PI;
      break;
    default:
      this.state = S_DTD;
    }
  }

  /** @private */
  sDTDOpenWakaBang() {
    const char = String.fromCodePoint(this.getCodeNorm());
    const owb = this.openWakaBang += char;
    this.text += char;
    if (owb !== "-") {
      this.state = owb === "--" ? S_DTD_COMMENT : S_DTD;
      this.openWakaBang = "";
    }
  }

  /** @private */
  sDTDComment() {
    if (this.captureToChar(MINUS)) {
      this.text += "-";
      this.state = S_DTD_COMMENT_ENDING;
    }
  }

  /** @private */
  sDTDCommentEnding() {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    this.state = c === MINUS ? S_DTD_COMMENT_ENDED : S_DTD_COMMENT;
  }

  /** @private */
  sDTDCommentEnded() {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    if (c === GREATER) {
      this.state = S_DTD;
    }
    else {
      this.fail("malformed comment.");
      // <!-- blah -- bloo --> will be recorded as
      // a comment of " blah -- bloo "
      this.state = S_DTD_COMMENT;
    }
  }

  /** @private */
  sDTDPI() {
    if (this.captureToChar(QUESTION)) {
      this.text += "?";
      this.state = S_DTD_PI_ENDING;
    }
  }

  /** @private */
  sDTDPIEnding() {
    const c = this.getCodeNorm();
    this.text += String.fromCodePoint(c);
    if (c === GREATER) {
      this.state = S_DTD;
    }
  }

  /** @private */
  sComment() {
    if (this.captureToChar(MINUS)) {
      this.state = S_COMMENT_ENDING;
    }
  }

  /** @private */
  sCommentEnding() {
    const c = this.getCodeNorm();
    if (c === MINUS) {
      this.state = S_COMMENT_ENDED;
      this.oncomment(this.text);
      this.text = "";
    }
    else {
      this.text += `-${String.fromCodePoint(c)}`;
      this.state = S_COMMENT;
    }
  }

  /** @private */
  sCommentEnded() {
    const c = this.getCodeNorm();
    if (c !== GREATER) {
      this.fail("malformed comment.");
      // <!-- blah -- bloo --> will be recorded as
      // a comment of " blah -- bloo "
      this.text += `--${String.fromCodePoint(c)}`;
      this.state = S_COMMENT;
    }
    else {
      this.state = S_TEXT;
    }
  }

  /** @private */
  sCData() {
    if (this.captureToChar(CLOSE_BRACKET)) {
      this.state = S_CDATA_ENDING;
    }
  }

  /** @private */
  sCDataEnding() {
    const c = this.getCodeNorm();
    if (c === CLOSE_BRACKET) {
      this.state = S_CDATA_ENDING_2;
    }
    else {
      this.text += `]${String.fromCodePoint(c)}`;
      this.state = S_CDATA;
    }
  }

  /** @private */
  sCDataEnding2() {
    const c = this.getCodeNorm();
    switch (c) {
    case GREATER:
      this.oncdata(this.text);
      this.text = "";
      this.state = S_TEXT;
      break;
    case CLOSE_BRACKET:
      this.text += "]";
      break;
    default:
      this.text += `]]${String.fromCodePoint(c)}`;
      this.state = S_CDATA;
    }
  }

  /** @private */
  sPIFirstChar() {
    const c = this.getCodeNorm();
    if (this.nameStartCheck(c)) {
      this.piTarget += String.fromCodePoint(c);
      this.state = S_PI_REST;
    }
    else if (c === QUESTION || isS(c)) {
      this.fail("processing instruction without a target.");
      this.state = c === QUESTION ? S_PI_ENDING : S_PI_BODY;
    }
    else {
      this.fail("disallowed character in processing instruction name.");
      this.piTarget += String.fromCodePoint(c);
      this.state = S_PI_REST;
    }
  }

  /** @private */
  sPIRest() {
    const c = this.captureWhileNameCheck("piTarget");
    if (c === QUESTION || isS(c)) {
      this.piIsXMLDecl = this.piTarget === "xml";
      if (this.piIsXMLDecl && !this.xmlDeclPossible) {
        this.fail("an XML declaration must be at the start of the document.");
      }
      this.state = c === QUESTION ? S_PI_ENDING : S_PI_BODY;
    }
    else if (c !== EOC) {
      this.fail("disallowed character in processing instruction name.");
      this.piTarget += String.fromCodePoint(c);
    }
  }

  /** @private */
  sPIBody() {
    let c;
    if (this.piIsXMLDecl) {
      switch (this.xmlDeclState) {
      case S_XML_DECL_NAME_START: {
        c = this.getCodeNorm();
        if (isS(c)) {
          c = this.skipSpaces();
        }
        else if (this.requiredSeparator && c !== QUESTION) {
          this.fail("whitespace required.");
        }
        this.requiredSeparator = false;

        // The question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        if (c === QUESTION) {
          this.state = S_PI_ENDING;
          return;
        }

        if (c !== EOC) {
          this.xmlDeclState = S_XML_DECL_NAME;
          this.xmlDeclName = String.fromCodePoint(c);
        }
        break;
      }
      case S_XML_DECL_NAME:
        c = this.captureTo(XML_DECL_NAME_TERMINATOR);
        // The question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        if (c === QUESTION) {
          this.state = S_PI_ENDING;
          this.text = "";
          return;
        }
        if (isS(c) || c === EQUAL) {
          this.xmlDeclName += this.text;
          this.text = "";
          if (!this.xmlDeclExpects.includes(this.xmlDeclName)) {
            switch (this.xmlDeclName.length) {
            case 0:
              this.fail("did not expect any more name/value pairs.");
              break;
            case 1:
              this.fail(`expected the name ${this.xmlDeclExpects[0]}.`);
              break;
            default:
              this.fail(`expected one of ${this.xmlDeclExpects.join(", ")}`);
            }
          }

          this.xmlDeclState = (c === EQUAL) ? S_XML_DECL_VALUE_START :
            S_XML_DECL_EQ;
        }
        break;
      case S_XML_DECL_EQ:
        c = this.getCodeNorm();
        // The question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        if (c === QUESTION) {
          this.state = S_PI_ENDING;
          return;
        }

        if (!isS(c)) {
          if (c !== EQUAL) {
            this.fail("value required.");
          }
          this.xmlDeclState = S_XML_DECL_VALUE_START;
        }
        break;
      case S_XML_DECL_VALUE_START:
        c = this.getCodeNorm();
        // The question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        if (c === QUESTION) {
          this.state = S_PI_ENDING;
          return;
        }

        if (!isS(c)) {
          if (!isQuote(c)) {
            this.fail("value must be quoted.");
            this.q = SPACE;
          }
          else {
            this.q = c;
          }
          this.xmlDeclState = S_XML_DECL_VALUE;
        }
        break;
      case S_XML_DECL_VALUE:
        c = this.captureTo([this.q, QUESTION]);

        // The question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        if (c === QUESTION) {
          this.state = S_PI_ENDING;
          this.text = "";
          return;
        }

        if (c !== EOC) {
          const value = this.text;
          this.text = "";
          switch (this.xmlDeclName) {
          case "version": {
            this.xmlDeclExpects = ["encoding", "standalone"];
            const version = value;
            this.xmlDecl.version = version;
            // This is the test specified by XML 1.0 but it is fine for XML 1.1.
            if (!/^1\.[0-9]+$/.test(version)) {
              this.fail("version number must match /^1\\.[0-9]+$/.");
            }
            // When forceXMLVersion is set, the XML declaration is ignored.
            else if (!this.opt.forceXMLVersion) {
              this.setXMLVersion(version);
            }
            break;
          }
          case "encoding":
            if (!/^[A-Za-z][A-Za-z0-9._-]*$/.test(value)) {
              this.fail("encoding value must match \
/^[A-Za-z0-9][A-Za-z0-9._-]*$/.");
            }
            this.xmlDeclExpects = ["standalone"];
            this.xmlDecl.encoding = value;
            break;
          case "standalone":
            if (value !== "yes" && value !== "no") {
              this.fail("standalone value must match \"yes\" or \"no\".");
            }
            this.xmlDeclExpects = [];
            this.xmlDecl.standalone = value;
            break;
          default:
            // We don't need to raise an error here since we've already
            // raised one when checking what name was expected.
          }
          this.xmlDeclName = "";
          this.xmlDeclState = S_XML_DECL_NAME_START;
          this.requiredSeparator = true;
        }
        break;
      default:
        throw new Error(this,
                        `Unknown XML declaration state: ${this.xmlDeclState}`);
      }
    }
    else if (this.text.length === 0) {
      c = this.getCodeNorm();
      if (c === QUESTION) {
        this.state = S_PI_ENDING;
      }
      else if (!isS(c)) {
        this.text = String.fromCodePoint(c);
      }
    }
    // The question mark character is not valid inside any of the XML
    // declaration name/value pairs.
    else if (this.captureToChar(QUESTION)) {
      this.state = S_PI_ENDING;
    }
  }

  /** @private */
  sPIEnding() {
    const c = this.getCodeNorm();
    if (this.piIsXMLDecl) {
      if (c === GREATER) {
        if (this.piTarget !== "xml") {
          this.fail("processing instructions are not allowed before root.");
        }
        else if (this.xmlDeclState !== S_XML_DECL_NAME_START) {
          this.fail("XML declaration is incomplete.");
        }
        else if (this.xmlDeclExpects.includes("version")) {
          this.fail("XML declaration must contain a version.");
        }
        this.xmlDeclName = "";
        this.requiredSeparator = false;
        this.piTarget = this.text = "";
        this.state = S_TEXT;
      }
      else {
        // We got here because the previous character was a ?, but the
        // question mark character is not valid inside any of the XML
        // declaration name/value pairs.
        this.fail(
          "The character ? is disallowed anywhere in XML declarations.");
      }
    }
    else if (c === GREATER) {
      if (this.piTarget.trim().toLowerCase() === "xml") {
        this.fail("the XML declaration must appear at the start of the document.");
      }
      this.onprocessinginstruction({
        target: this.piTarget,
        body: this.text,
      });
      this.piTarget = this.text = "";
      this.state = S_TEXT;
    }
    else if (c === QUESTION) {
      // We ran into ?? as part of a processing instruction. We initially
      // took the first ? as a sign that the PI was ending, but it is
      // not. So we have to add it to the body but we take the new ? as a
      // sign that the PI is ending.
      this.text += "?";
    }
    else {
      this.text += `?${String.fromCodePoint(c)}`;
      this.state = S_PI_BODY;
    }
    this.xmlDeclPossible = false;
  }

  /** @private */
  sOpenTag() {
    const c = this.captureNameChars();
    if (c === EOC) {
      return;
    }

    const tag = this.tag = {
      name: this.name,
      attributes: Object.create(null),
    };
    this.name = "";

    if (this.xmlnsOpt) {
      tag.ns = Object.create(null);
    }

    this.onopentagstart(tag);
    this.sawRoot = true;
    if (!this.fragmentOpt && this.closedRoot) {
      this.fail("documents may contain only one root.");
    }

    switch (c) {
    case GREATER:
      this.openTag();
      break;
    case FORWARD_SLASH:
      this.state = S_OPEN_TAG_SLASH;
      break;
    default:
      if (!isS(c)) {
        this.fail("disallowed character in tag name.");
      }
      this.state = S_ATTRIB;
    }
  }

  /** @private */
  sOpenTagSlash() {
    const c = this.getCode();
    if (c === GREATER) {
      this.openSelfClosingTag();
    }
    else {
      this.fail("forward-slash in opening tag not followed by >.");
      this.state = S_ATTRIB;
    }
  }

  /** @private */
  sAttrib() {
    const c = this.skipSpaces();
    if (c === EOC) {
      return;
    }
    if (isNameStartChar(c)) {
      this.i = this.prevI;
      this.state = S_ATTRIB_NAME;
    }
    else if (c === GREATER) {
      this.openTag();
    }
    else if (c === FORWARD_SLASH) {
      this.state = S_OPEN_TAG_SLASH;
    }
    else {
      this.fail("disallowed character in attribute name.");
    }
  }

  /** @private */
  pushAttribNS10(name, value) {
    const { prefix, local } = this.qname(name);
    this.attribList.push({ name, prefix, local, value, uri: undefined });
    if (prefix === "xmlns") {
      const trimmed = value.trim();
      if (trimmed === "") {
        this.fail("invalid attempt to undefine prefix in XML 1.0");
      }
      this.tag.ns[local] = trimmed;
      nsPairCheck(this, local, trimmed);
    }
    else if (name === "xmlns") {
      const trimmed = value.trim();
      this.tag.ns[""] = trimmed;
      nsPairCheck(this, "", trimmed);
    }
  }

  pushAttribNS11(name, value) {
    const { prefix, local } = this.qname(name);
    this.attribList.push({ name, prefix, local, value, uri: undefined });
    if (prefix === "xmlns") {
      const trimmed = value.trim();
      this.tag.ns[local] = trimmed;
      nsPairCheck(this, local, trimmed);
    }
    else if (name === "xmlns") {
      const trimmed = value.trim();
      this.tag.ns[""] = trimmed;
      nsPairCheck(this, "", trimmed);
    }
  }

  /** @private */
  pushAttribPlain(name, value) {
    this.attribList.push({ name, value });
  }

  /** @private */
  sAttribName() {
    const c = this.captureNameChars();
    if (c === EQUAL) {
      this.state = S_ATTRIB_VALUE;
    }
    else if (isS(c)) {
      this.state = S_ATTRIB_NAME_SAW_WHITE;
    }
    else if (c === GREATER) {
      this.fail("attribute without value.");
      this.pushAttrib(this.name, this.name);
      this.name = this.text = "";
      this.openTag();
    }
    else if (c !== EOC) {
      this.fail("disallowed character in attribute name.");
    }
  }

  /** @private */
  sAttribNameSawWhite() {
    const c = this.skipSpaces();
    switch (c) {
    case EOC:
      return;
    case EQUAL:
      this.state = S_ATTRIB_VALUE;
      break;
    default:
      this.fail("attribute without value.");
      this.tag.attributes[this.name] = "";
      this.text = "";
      this.name = "";
      if (c === GREATER) {
        this.openTag();
      }
      else if (isNameStartChar(c)) {
        this.i = this.prevI;
        this.state = S_ATTRIB_NAME;
      }
      else {
        this.fail("disallowed character in attribute name.");
        this.state = S_ATTRIB;
      }
    }
  }

  /** @private */
  sAttribValue() {
    const c = this.getCodeNorm();
    if (isQuote(c)) {
      this.q = c;
      this.state = S_ATTRIB_VALUE_QUOTED;
    }
    else if (!isS(c)) {
      this.fail("unquoted attribute value.");
      this.state = S_ATTRIB_VALUE_UNQUOTED;
      this.i = this.prevI;
    }
  }

  /** @private */
  sAttribValueQuoted() {
    // We deliberately do not use captureTo here. The specialized code we use
    // here is faster than using captureTo.
    const { q } = this;
    let { i: start } = this;
    const { chunk } = this;
    while (true) {
      const code = this.getCode();
      switch (code) {
      case q:
        this.pushAttrib(this.name, this.text + chunk.slice(start, this.prevI));
        this.name = this.text = "";
        this.q = null;
        this.state = S_ATTRIB_VALUE_CLOSED;
        return;
      case AMP:
        this.text += chunk.slice(start, this.prevI);
        this.state = S_ENTITY;
        this.entityReturnState = S_ATTRIB_VALUE_QUOTED;
        return;
      case NL:
      case NL_LIKE:
      case TAB:
        this.text += `${chunk.slice(start, this.prevI)} `;
        start = this.i;
        break;
      case LESS:
        this.text += chunk.slice(start, this.prevI);
        this.fail("disallowed character.");
        return;
      case EOC:
        this.text += chunk.slice(start);
        return;
      default:
      }
    }
  }

  /** @private */
  sAttribValueClosed() {
    const c = this.getCodeNorm();
    if (isS(c)) {
      this.state = S_ATTRIB;
    }
    else if (c === GREATER) {
      this.openTag();
    }
    else if (c === FORWARD_SLASH) {
      this.state = S_OPEN_TAG_SLASH;
    }
    else if (isNameStartChar(c)) {
      this.fail("no whitespace between attributes.");
      this.i = this.prevI;
      this.state = S_ATTRIB_NAME;
    }
    else {
      this.fail("disallowed character in attribute name.");
    }
  }

  /** @private */
  sAttribValueUnquoted() {
    // We don't do anything regarding EOL or space handling for unquoted
    // attributes. We already have failed by the time we get here, and the
    // contract that saxes upholds states that upon failure, it is not safe to
    // rely on the data passed to event handlers (other than
    // ``onerror``). Passing "bad" data is not a problem.
    const c = this.captureTo(ATTRIB_VALUE_UNQUOTED_TERMINATOR);
    switch (c) {
    case AMP:
      this.state = S_ENTITY;
      this.entityReturnState = S_ATTRIB_VALUE_UNQUOTED;
      break;
    case LESS:
      this.fail("disallowed character.");
      break;
    case EOC:
      break;
    default:
      if (this.text.includes("]]>")) {
        this.fail("the string \"]]>\" is disallowed in char data.");
      }
      this.pushAttrib(this.name, this.text);
      this.name = this.text = "";
      if (c === GREATER) {
        this.openTag();
      }
      else {
        this.state = S_ATTRIB;
      }
    }
  }

  /** @private */
  sCloseTag() {
    const c = this.captureNameChars();
    if (c === GREATER) {
      this.closeTag();
    }
    else if (isS(c)) {
      this.state = S_CLOSE_TAG_SAW_WHITE;
    }
    else if (c !== EOC) {
      this.fail("disallowed character in closing tag.");
    }
  }

  /** @private */
  sCloseTagSawWhite() {
    switch (this.skipSpaces()) {
    case GREATER:
      this.closeTag();
      break;
    case EOC:
      break;
    default:
      this.fail("disallowed character in closing tag.");
    }
  }

  /** @private */
  sEntity() {
    // This is essentially a specialized version of captureToChar(SEMICOLON...)
    let { i: start } = this;
    const { chunk } = this;
    // eslint-disable-next-line no-labels, no-restricted-syntax
    loop:
    while (true) {
      switch (this.getCode()) {
      case NL_LIKE:
        this.entity += `${chunk.slice(start, this.prevI)}\n`;
        start = this.i;
        break;
      case SEMICOLON:
        this.entity += chunk.slice(start, this.prevI);
        this.state = this.entityReturnState;
        if (this.entity === "") {
          this.fail("empty entity name.");
          this.text += "&;";
          return;
        }
        this.text += this.parseEntity(this.entity);
        this.entity = "";
        // eslint-disable-next-line no-labels
        break loop;
      case EOC:
        this.entity += chunk.slice(start);
        // eslint-disable-next-line no-labels
        break loop;
      default:
      }
    }
  }

  // END OF STATE HANDLERS

  /**
   * End parsing. This performs final well-formedness checks and resets the
   * parser to a clean state.
   *
   * @private
   *
   * @returns this
   */
  end() {
    if (!this.sawRoot) {
      this.fail("document must contain a root element.");
    }
    const { tags } = this;
    while (tags.length > 0) {
      const tag = tags.pop();
      this.fail(`unclosed tag: ${tag.name}`);
    }
    if ((this.state !== S_BEGIN_WHITESPACE) &&
        (this.state !== S_TEXT)) {
      this.fail("unexpected end.");
    }
    const { text } = this;
    if (text.length !== 0) {
      this.ontext(text);
      this.text = "";
    }
    this.closed = true;
    this.onend();
    this._init(this.opt);
    return this;
  }

  /**
   * Resolve a namespace prefix.
   *
   * @param {string} prefix The prefix to resolve.
   *
   * @returns {string|undefined} The namespace URI or ``undefined`` if the
   * prefix is not defined.
   */
  resolve(prefix) {
    let uri = this.tag.ns[prefix];
    if (uri !== undefined) {
      return uri;
    }

    const { tags } = this;
    for (let index = tags.length - 1; index >= 0; index--) {
      uri = tags[index].ns[prefix];
      if (uri !== undefined) {
        return uri;
      }
    }

    uri = this.ns[prefix];
    if (uri) {
      return uri;
    }

    const { resolvePrefix } = this.opt;
    return resolvePrefix ? resolvePrefix(prefix) : undefined;
  }

  /**
   * Parse a qname into its prefix and local name parts.
   *
   * @private
   *
   * @param {string} name The name to parse
   *
   * @returns {{prefix: string, local: string}}
   */
  qname(name) {
    // This is faster than using name.split(":").
    const colon = name.indexOf(":");
    if (colon === -1) {
      return { prefix: "", local: name };
    }

    const local = name.slice(colon + 1);
    const prefix = name.slice(0, colon);
    if (prefix === "" || local === "" || local.includes(":")) {
      this.fail(`malformed name: ${name}.`);
    }

    return { prefix, local };
  }

  /** @private */
  processAttribsNS() {
    const { tag, attribList } = this;

    {
      // add namespace info to tag
      const { prefix, local } = this.qname(tag.name);
      tag.prefix = prefix;
      tag.local = local;
      const uri = tag.uri = this.resolve(prefix) || "";

      if (prefix) {
        if (prefix === "xmlns") {
          this.fail("tags may not have \"xmlns\" as prefix.");
        }

        if (!uri) {
          this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
          tag.uri = prefix;
        }
      }
    }

    if (attribList.length === 0) {
      return;
    }

    const { attributes } = tag;
    const seen = new Set();
    // Note: do not apply default ns to attributes:
    //   http://www.w3.org/TR/REC-xml-names/#defaulting
    for (const attr of attribList) {
      const { name, prefix, local } = attr;
      let uri;
      let eqname;
      if (prefix === "") {
        uri = name === "xmlns" ? XMLNS_NAMESPACE : "";
        eqname = name;
      }
      else {
        uri = this.resolve(prefix);
        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (!uri) {
          this.fail(`unbound namespace prefix: ${JSON.stringify(prefix)}.`);
          uri = prefix;
        }
        eqname = `{${uri}}${local}`;
      }

      if (seen.has(eqname)) {
        this.fail(`duplicate attribute: ${eqname}.`);
      }
      seen.add(eqname);

      attr.uri = uri;
      attributes[name] = attr;
    }

    this.attribList = [];
  }

  /** @private */
  processAttribsPlain() {
    const { attribList, tag: { attributes } } = this;
    for (const { name, value } of attribList) {
      if (attributes[name]) {
        this.fail(`duplicate attribute: ${name}.`);
      }
      attributes[name] = value;
    }

    this.attribList = [];
  }

  /**
   * Handle a complete open tag. This parser code calls this once it has seen
   * the whole tag. This method checks for well-formeness and then emits
   * ``onopentag``.
   *
   * @private
   */
  openTag() {
    this.processAttribs();

    const { tag, tags } = this;
    tag.isSelfClosing = false;

    // There cannot be any pending text here due to the onopentagstart that was
    // necessarily emitted before we get here. So we do not check text.
    this.onopentag(tag);
    tags.push(tag);
    this.state = S_TEXT;
    this.name = "";
  }

  /**
   * Handle a complete self-closing tag. This parser code calls this once it has
   * seen the whole tag. This method checks for well-formeness and then emits
   * ``onopentag`` and ``onclosetag``.
   *
   * @private
   */
  openSelfClosingTag() {
    this.processAttribs();

    const { tag, tags } = this;
    tag.isSelfClosing = true;

    // There cannot be any pending text here due to the onopentagstart that was
    // necessarily emitted before we get here. So we do not check text.
    this.onopentag(tag);
    this.onclosetag(tag);
    const top = this.tag = tags[tags.length - 1];
    if (!top) {
      this.closedRoot = true;
    }
    this.state = S_TEXT;
    this.name = "";
  }

  /**
   * Handle a complete close tag. This parser code calls this once it has seen
   * the whole tag. This method checks for well-formeness and then emits
   * ``onclosetag``.
   *
   * @private
   */
  closeTag() {
    const { tags, name } = this;

    // Our state after this will be S_TEXT, no matter what, and we can clear
    // tagName now.
    this.state = S_TEXT;
    this.name = "";

    if (!name) {
      this.fail("weird empty close tag.");
      this.text += "</>";
      return;
    }

    let l = tags.length;
    while (l-- > 0) {
      const tag = this.tag = tags.pop();
      this.onclosetag(tag);
      if (tag.name === name) {
        break;
      }
      this.fail("unexpected close tag.");
    }

    if (l === 0) {
      this.closedRoot = true;
    }
    else if (l < 0) {
      this.fail(`unmatched closing tag: ${name}.`);
      this.text += `</${name}>`;
    }
  }

  /**
   * Resolves an entity. Makes any necessary well-formedness checks.
   *
   * @private
   *
   * @param {string} entity The entity to resolve.
   *
   * @returns {string} The parsed entity.
   */
  parseEntity(entity) {
    if (entity[0] !== "#") {
      const defined = this.ENTITIES[entity];
      if (defined) {
        return defined;
      }

      this.fail(this.isName(entity) ? "undefined entity." :
               "disallowed character in entity name.");
      return `&${entity};`;
    }

    let num = NaN;
    if (entity[1] === "x" && /^#x[0-9a-f]+$/i.test(entity)) {
      num = parseInt(entity.slice(2), 16);
    }
    else if (/^#[0-9]+$/.test(entity)) {
      num = parseInt(entity.slice(1), 10);
    }

    // The character reference is required to match the CHAR production.
    if (!this.isChar(num)) {
      this.fail("malformed character entity.");
      return `&${entity};`;
    }

    return String.fromCodePoint(num);
  }
}

exports.SaxesParser = SaxesParser;
