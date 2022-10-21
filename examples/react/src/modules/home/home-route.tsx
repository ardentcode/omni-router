import {MetaRouteData, RouteHandler, RouteInfo} from '@ardentcode/omni-router';
import {ReactRouteData} from '@ardentcode/omni-router-react';
import {HomeTemplate} from './home-template';

export interface HomeRouteParams {
}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, ReactRouteData & MetaRouteData> {
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
