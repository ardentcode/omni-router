export interface HTMLRenderer {
    renderHTML: (html: string, data?: Record<string, string>) => string;
}

export interface HTMLRendererOptions {
    commonData?: Record<string, string>;
    prefix?: string;
    suffix?: string;
}

export function createHTMLRenderer({commonData = {}, prefix = '__', suffix = '__'}: HTMLRendererOptions = {}): HTMLRenderer {

    const renderHTML = (html: string, data: Record<string, string> = {}): string => {
        return Object.entries({...data, ...commonData}).reduce((result: string, [name, value]: [string, string]): string => {
            return result.replace(prefix + name + suffix, value);
        }, html);
    };

    return {
        renderHTML
    };

}