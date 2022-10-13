import { RouteHandler} from 'ui-router';
import {renderNotFoundTemplate} from './not-found-template';
import {ReactRouteData} from '../../common/react-route-data';

export interface NotFoundRouteParams {

}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, ReactRouteData> {
    return (params: NotFoundRouteParams) => {
        return {
            component: renderNotFoundTemplate(params),
            meta: {
                title: `Not Found`
            }
        };
    };
}
