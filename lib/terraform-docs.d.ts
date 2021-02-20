export interface Options {
    tocLevel?: number;
    actionFile?: string;
    updateReadme?: boolean;
    readmeFile?: string;
}
interface DefaultOptions {
    tocLevel: number;
    actionFile: string;
    updateReadme: boolean;
    readmeFile: string;
}
export declare const defaultOptions: DefaultOptions;
export declare function generateActionMarkdownDocs(inputOptions?: Options): Promise<string>;
export {};
