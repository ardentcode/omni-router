import {HTMLRouteData, RouteHandler} from '@ardentcode/omni-router';
import {renderNotFoundTemplate} from './not-found-template';

export interface NotFoundRouteParams {

}

export function createNotFoundRouteHandler(): RouteHandler<NotFoundRouteParams, HTMLRouteData> {
    return (params: NotFoundRouteParams) => {
        return {
            html: {
                content: renderNotFoundTemplate(params)
            },
            meta: {
                title: `Not Found`
            }
        };
    };
}