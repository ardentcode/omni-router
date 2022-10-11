export interface PathParser {
    extractParamsFromPath: <P = any>(pattern: string, path: string) => P;
    buildPathWithParams: (path: string, params: Record<string, string>) => string;
}

export interface PathParserOptions {

}

export function createPathParser({}: PathParserOptions = {}): PathParser {

    const extractParamsFromPath = <P = any>(pattern: string, path: string): P => {
        const urlPattern = new URLPattern({pathname: pattern});
        const [pathname, search] = path.split('?');
        const urlMatch = urlPattern.exec({pathname, search});
        return urlMatch ? {
            ...urlMatch.pathname.groups,
            ...Object.fromEntries(new URLSearchParams(urlMatch.search.input))
        } as P : {} as P;
    };

    const buildPathWithParams = (path: string, params: Record<string, string> = {}): string => {
        return Object.entries(params).reduce((path: string, [name, value]: [string, string]): string => {
            if (path.includes(`:${name}`)) {
                return path.replace(`:${name}`, value);
            } else {
                const separator = path.includes('?') ? '&' : '?';
                const parameter = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
                return path + separator + parameter;
            }
        }, path);
    };

    return {
        extractParamsFromPath,
        buildPathWithParams
    };

}