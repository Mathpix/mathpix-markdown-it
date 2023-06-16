export declare const renderInlineTokenBlock: (tokens: any, options: any, env: any, slf: any, isSubTable?: boolean, highlight?: any) => {
    table: string;
    tsv: string;
    tableMd: string;
    align: string;
    csv?: undefined;
} | {
    table: string;
    tsv: any[];
    csv: any[];
    tableMd: any[];
    align: string;
};
export declare const renderTabularInline: (a: any, token: any, options: any, env: any, slf: any) => string;
