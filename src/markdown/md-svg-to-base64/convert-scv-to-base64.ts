import base64 from "./base64";

const convertSvgToBase64 = (svgString: string = '') => {
  const PREFIX = 'data:image/svg+xml;base64,';
  const base64Encode = PREFIX + base64.encode(svgString);
  return '<img class="imgSvg" src=\"' + base64Encode + '\"/>';
};

export default convertSvgToBase64;
