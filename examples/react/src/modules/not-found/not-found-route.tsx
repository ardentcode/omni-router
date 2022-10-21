import {MetaRouteData, RouteHandler} from '@ardentcode/omni-router';
import {ReactRouteData} from '@ardentcode/omni-router-react';
import {NotFoundTemplate} from './not-found-template';

export interface NotFoundRouteParams {
}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, ReactRouteData & MetaRouteData> {
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
