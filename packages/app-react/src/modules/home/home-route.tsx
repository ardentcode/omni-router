import {RouteHandler, RouteInfo} from 'ui-router';
import {HomeTemplate} from './home-template';
import {ReactRouteData} from '../../common';

export interface HomeRouteParams {
}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, ReactRouteData> {
    return ({}: HomeRouteParams, {}: RouteInfo) => {
        return {
            component: <HomeTemplate/>,
            meta: {
                title: `Home`
            }
        };
    };
}
