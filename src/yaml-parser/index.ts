import * as yaml from 'js-yaml';

export interface IYamlParserResult {
  content: string,
  metadata: any,
  error?: string,
  contentStartLine: number
}

export const yamlParser = (text: string, isAddYamlToHtml = false): IYamlParserResult => {
  if (typeof text !== 'string') {
    throw new TypeError('Markdown source text must be a string.')
  }
  text = text.trim();

  const YAML_START = /^-+(\r|\n)/;
  const YAML_END = /(\r|\n)-+(\r|\n)/;
  const YAMKL_FILE_END = /(\r|\n)-+/;

  let result: IYamlParserResult = {
    content: text,
    metadata: null,
    contentStartLine: 0
  };

  try {
    if (YAML_START.test(text)) {
      let match = text.match(YAML_END);

      if (match) {
        const endIndex = match.index + match[0].length;
        const metadata = text.substring(0, match.index);

        const content = text.substring(endIndex);

        result = {
          metadata: metadata,
          content: content.trim(),
          contentStartLine: 0
        };

      }

      if (!result.metadata) {
        let match = text.match(YAMKL_FILE_END);
        if (match) {
          const metadata = text.substring(0, match.index);
          
          result = {
            metadata: metadata,
            content: '',
            contentStartLine: 0
          };
        }
      }

      if (result.metadata) {
        result = {
          ...result,
          metadata: result.metadata.replace(YAML_START, '').trim()
        }
      }

      if (result.metadata) {
        const arr = result.metadata.split('\n');
        result.contentStartLine = arr.length + 3;
      }
      
      if (result.metadata) {
        let parseResult = null;
        try {
          parseResult = yaml.load(result.metadata);
        } catch (err) {
          console.error(err);
          result.error = 'Can not parse yaml data';
        }

        result = {
          ...result,
          metadata: parseResult
        }
      }

      if (isAddYamlToHtml) {
        if (result.metadata) {
          let mmdTitle = '';
          let mmdAuthor = '';
          if (result.metadata.authors && result.metadata.authors.length) {
            if (Array.isArray(result.metadata.authors)) {
              result.metadata.authors.map(item => {
                let author = item.toString().trim();
                author = author.replace(/\r|\n|,/g, '\\\\');
                mmdAuthor += `\\author{${author}}`;
                mmdAuthor += '\n\n';
              });
            } else {
              let author = result.metadata.authors.trim();
              author = author.replace(/\r|\n|,/g, '\\\\');
              mmdAuthor = `\\author{${author}}`;
              mmdAuthor += '\n\n';
            }
          }

          if (!mmdAuthor && result.metadata.author && result.metadata.author.trim()) {
            let author = result.metadata.author.trim();
            author = author.replace(/\r|\n|,/g, '\\\\');
            mmdAuthor = `\\author{${author}}`;
            mmdAuthor += '\n\n';
          }

          if (result.metadata.title && result.metadata.title.trim()) {
            mmdTitle = `\\title{${result.metadata.title}}`;
            mmdTitle += '\n\n' ;
          }

          result.content = mmdAuthor + result.content;
          result.content = mmdTitle + result.content;
        }
      }

    }


    return result
  } catch (err) {
    console.error(err);
    result.error = 'Can not parse yaml data';
    return result
  }
};
