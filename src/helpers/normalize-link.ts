import * as mdurl from 'mdurl';
import * as punycode from 'punycode';
const RECODE_HOSTNAME_FOR = [ 'http:', 'https:', 'mailto:' ];

/**
 * normalizeLink(url) -> String
 *
 * Function used to encode link url to a machine-readable format,
 * which includes url-encoding, punycode, etc.
 **/
export const normalizeLink = (url) => {
  const parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch (er) { /**/ }
    }
  }

  return mdurl.encode(mdurl.format(parsed));
};
