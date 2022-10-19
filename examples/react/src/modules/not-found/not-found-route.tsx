import {ReactRouteData, RouteHandler} from 'ui-router';
import {NotFoundTemplate} from './not-found-template';

export interface NotFoundRouteParams {
}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, ReactRouteData> {
    return () => {
        return {
            react: {
                component: <NotFoundTemplate/>,
            },
            meta: {
                title: 'Not Found'
            }
        };
    };
}
