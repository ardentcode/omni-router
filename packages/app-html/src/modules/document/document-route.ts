import {HTMLRouteData, RedirectRouteData, RouteHandler} from 'ui-router';
import {renderDocumentTemplate} from './document-template';

export interface DocumentRouteParams {
    id: string;
}

export function createDocumentRouteHandler(): RouteHandler<DocumentRouteParams, HTMLRouteData & RedirectRouteData> {
    return async (params: DocumentRouteParams) => {
        if (params.id.startsWith('0')) {
            return {
                redirect: `/document/${parseInt(params.id)}`
            };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            htmlText: renderDocumentTemplate(params),
            meta: {
                title: `Document #${params.id}`,
                author: 'Author of document',
                keywords: 'HTML, JavaScript',
                description: 'Description of document'
            }
        };
    };
}
