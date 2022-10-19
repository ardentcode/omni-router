import {ReactRouteData, RouteHandler, RouteInfo} from 'ui-router';
import {HomeTemplate} from './home-template';

export interface HomeRouteParams {
}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, ReactRouteData> {
    return ({}: HomeRouteParams, {}: RouteInfo) => {
        return {
            react: {
                component: <HomeTemplate/>
            },
            meta: {
                title: `Home`
            }
        };
    };
}
