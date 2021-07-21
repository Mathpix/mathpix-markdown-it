const BAD_PROTO_RE = /^(vbscript|javascript|data):/;
const GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

export const validateLinkEnableFile = (url) => {
  // url should be normalized at this point, and existing entities are decoded
  const str = url.trim().toLowerCase();
  return BAD_PROTO_RE.test(str)
    ? GOOD_DATA_RE.test(str)
      ? true
      : false
    : true;
};
