export interface IYamlParserResult {
    content: string;
    metadata: any;
    error?: string;
}
export declare const yamlParser: (text: string, isAddYamlToHtml?: boolean) => IYamlParserResult;
