import {RouteHandler} from 'ui-router';
import {NotFoundTemplate} from './not-found-template';
import {ReactRouteData} from '../../common';

export interface NotFoundRouteParams {
}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, ReactRouteData> {
    return () => {
        return {
            component: <NotFoundTemplate/>,
            meta: {
                title: 'Not Found'
            }
        };
    };
}
