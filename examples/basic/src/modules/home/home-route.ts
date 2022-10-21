import {HTMLRouteData, RouteHandler, RouteInfo} from '@ardentcode/omni-router';
import {renderHomeTemplate} from './home-template';

export interface HomeRouteParams {

}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, HTMLRouteData> {
    return ({}: HomeRouteParams, {}: RouteInfo) => {
        return {
            html: {
                content: renderHomeTemplate(),
                fragments: {
                    info: '!'
                }
            },
            meta: {
                title: `Home`
            }
        };
    };
}