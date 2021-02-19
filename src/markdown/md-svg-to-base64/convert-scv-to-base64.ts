import base64 from "./base64";

const convertSvgToBase64 = (svgString: string = '', id: string = '') => {
  const PREFIX = 'data:image/svg+xml;base64,';
  const base64Encode = PREFIX + base64.encode(svgString);
  return id
    ? '<img class="imgSvg" id = \"' + id + '\" src=\"' + base64Encode + '\"/>'
    : '<img class="imgSvg" src=\"' + base64Encode + '\"/>';
};

export default convertSvgToBase64;
