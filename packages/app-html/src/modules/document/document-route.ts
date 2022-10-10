import {HTMLRouteData, RedirectRouteData, RouteHandler} from 'ui-router';
import {renderDocumentTemplate} from './document-template';
import {LoadingIndicator} from '../../common/loading-indicator';

export interface DocumentRouteParams {
    id: string;
}

export interface DocumentRouteDeps {
    loadingIndicator?: LoadingIndicator;
}

export function createDocumentRouteHandler({loadingIndicator}: DocumentRouteDeps): RouteHandler<DocumentRouteParams, HTMLRouteData & RedirectRouteData> {
    return async (params: DocumentRouteParams) => {
        loadingIndicator?.show();
        if (params.id.startsWith('0')) {
            return {
                redirect: `/document/${parseInt(params.id)}`
            };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        loadingIndicator?.hide();
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
