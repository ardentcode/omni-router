import {ParamsMissingError} from '../errors';

export interface PathParser {
    extractParamsNames: <N extends string = string>(pattern: string) => N[];
    extractParamsFromPath: <P = unknown>(pattern: string, path: string) => P;
    buildPathWithParams: <P = unknown>(path: string, params: P) => string;
}

export interface PathParserOptions {

}

const NAMED_PARAMS_REGEXP = /:([a-z_][a-z_0-9]*)/gi;
const WILDCARD_PARAMS_REGEXP = /\*/gi;

export function createPathParser({}: PathParserOptions = {}): PathParser {

    const extractParamsNames = <N extends string = string>(pattern: string): N[] => {
        const namedParams = pattern.match(NAMED_PARAMS_REGEXP)?.map((param: string): string => {
            return param.replace(':', '');
        }) ?? [];
        const wildcardParams = pattern.match(WILDCARD_PARAMS_REGEXP)?.map((_: string, index: number) => {
            return index.toString();
        }) ?? [];
        return [
            ...namedParams,
            ...wildcardParams
        ] as N[];
    };

    const extractParamsFromPath = <P = unknown>(pattern: string, path: string): P => {
        const urlPattern = new URLPattern({pathname: pattern});
        const [pathname, search] = path.split('?');
        const urlMatch = urlPattern.exec({pathname, search});
        return urlMatch ? {
            ...urlMatch.pathname.groups,
            ...Object.fromEntries(new URLSearchParams(urlMatch.search.input))
        } as P : {} as P;
    };

    const buildPathWithParams = <P = unknown>(path: string, params: P = {} as P): string => {
        const pathWithParams = Object.entries(params as {}).reduce((path: string, [name, value]: [string, string]): string => {
            if (path.includes('*') && !isNaN(parseInt(name))) {
                return path.replace('*', value);
            } else if (path.includes(`:${name}`)) {
                return path.replace(`:${name}`, value);
            } else {
                const separator = path.includes('?') ? '&' : '?';
                const parameter = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
                return path + separator + parameter;
            }
        }, path);
        checkMissingParams(pathWithParams);
        return pathWithParams;
    };

    const checkMissingParams = (path: string): void => {
        const missingParams = extractParamsNames(path);
        if (missingParams.length) {
            throw new ParamsMissingError(`Missing parameters (${missingParams.join(', ')}) in path ${path}`, {
                path,
                missingParams
            });
        }
    };

    return {
        extractParamsNames,
        extractParamsFromPath,
        buildPathWithParams
    };

}