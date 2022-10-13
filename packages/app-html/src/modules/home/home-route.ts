import {HTMLRouteData, RouteHandler} from 'ui-router';
import {renderHomeTemplate} from './home-template';

export interface HomeRouteParams {

}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, HTMLRouteData> {
    return (params: HomeRouteParams) => {
        return {
            html: {
                content: renderHomeTemplate(params)
            },
            meta: {
                title: `Home`
            }
        };
    };
}