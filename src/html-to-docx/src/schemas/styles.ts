import { namespaces } from '../helpers';

const generateStylesXML = (font = 'Times New Roman', fontSize = 22, complexScriptFontSize = 22) => {
  return `
    <?xml version="1.0" encoding="UTF-8" standalone="yes"?>

    <w:styles
      xmlns:w="${namespaces.w}"
      xmlns:r="${namespaces.r}" >
        <w:docDefaults>
          <w:rPrDefault>
            <w:rPr>
              <w:rFonts w:ascii="${font}" w:eastAsiaTheme="minorHAnsi" w:hAnsiTheme="minorHAnsi" w:cstheme="minorBidi" />
              <w:sz w:val="${fontSize}"/>
              <w:szCs w:val="${complexScriptFontSize}"/>
              <w:lang w:val="en-US" w:eastAsia="en-US" w:bidi="ar-SA"/>
            </w:rPr>
          </w:rPrDefault>
          <w:pPrDefault>
            <w:pPr>
              <w:spacing w:after="120" w:line="240" w:lineRule="atLeast"/>
            </w:pPr>
          </w:pPrDefault>
        </w:docDefaults>
    </w:styles>
  `;
};

export default generateStylesXML;
