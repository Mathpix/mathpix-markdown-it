export interface IYamlParserResult {
    content: string;
    metadata: any;
    error?: string;
    contentStartLine: number;
}
export declare const yamlParser: (text: string, isAddYamlToHtml?: boolean) => IYamlParserResult;
