import {HTMLRouteChunk, RouteHandler} from 'ui-router';

export interface DocumentRouteParams {
    id: string;
}

export function createDocumentRouteHandler(): RouteHandler<DocumentRouteParams, HTMLRouteChunk> {
    return (params: DocumentRouteParams) => {
        const htmlElement = document.createElement('div');
        htmlElement.innerText = `Document #${params.id}`;
        return {
            htmlElement
        };
    };
}