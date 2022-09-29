import {HTMLRouteChunk, RouteHandler} from 'ui-router';
import {renderHomeTemplate} from './home-template';

export interface HomeRouteParams {

}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, HTMLRouteChunk> {
    return (params: HomeRouteParams) => {
        return {
            htmlText: renderHomeTemplate(params),
            meta: {
                title: `Home`
            }
        };
    };
}