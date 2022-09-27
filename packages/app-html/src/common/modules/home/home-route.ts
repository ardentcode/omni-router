import {HTMLRouteChunk, RouteHandler} from 'ui-router';

export interface HomeRouteParams {

}

export function createHomeRouteHandler(): RouteHandler<HomeRouteParams, HTMLRouteChunk> {
    return (_params: HomeRouteParams) => {
        const htmlElement = document.createElement('div');
        htmlElement.innerText = 'Home';
        return {
            htmlElement
        };
    };
}