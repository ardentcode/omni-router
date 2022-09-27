import {RouteUrl} from './route-url';

export interface RouteUrlParser {
    parseUrl: (url: string) => RouteUrl;
}

export function createRouteUrlParser(): RouteUrlParser {

    const parseUrl = (_url: string): RouteUrl => {
        return {
            path: '',
            hash: '',
            search: '',
            hashParams: {},
            searchParams: {}
        };
    };

    return {
        parseUrl
    };

}