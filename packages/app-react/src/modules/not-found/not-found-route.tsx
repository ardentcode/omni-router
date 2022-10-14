import {RouteHandler} from 'ui-router';
import {NotFoundTemplate} from './not-found-template';
import {ReactRouteData} from '../../common/react-route-data';

export interface NotFoundRouteParams {
}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, ReactRouteData> {
    return (params: NotFoundRouteParams) => {
        return {
            component: <NotFoundTemplate/>,
            meta: {
                title: `Not Found`
            }
        };
    };
}
