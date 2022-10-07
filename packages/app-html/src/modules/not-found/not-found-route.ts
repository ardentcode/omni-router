import {HTMLRouteData, RouteHandler} from 'ui-router';
import {renderNotFoundTemplate} from './not-found-template';

export interface NotFoundRouteParams {

}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, HTMLRouteData> {
    return (params: NotFoundRouteParams) => {
        return {
            htmlText: renderNotFoundTemplate(params),
            meta: {
                title: `Not Found`
            }
        };
    };
}