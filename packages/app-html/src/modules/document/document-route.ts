import {HTMLRouteChunk, RouteHandler} from 'ui-router';
import {renderDocumentTemplate} from './document-template';

export interface DocumentRouteParams {
    id: string;
}

export function createDocumentRouteHandler(): RouteHandler<DocumentRouteParams, HTMLRouteChunk> {
    return (params: DocumentRouteParams) => {
        return {
            htmlText: renderDocumentTemplate(params),
            meta: {
                title: `Document #${params.id}`
            }
        };
    };
}