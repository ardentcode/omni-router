import {HTMLRouteData, RedirectRouteData, RouteHandler} from 'ui-router';
import {LoadingIndicator} from '../../common/loading-indicator';
import {renderDocumentTemplate} from './document-template';

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
                redirect: {
                    path: `/document/${parseInt(params.id)}`
                }
            };
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        loadingIndicator?.hide();
        return {
            html: {
                content: renderDocumentTemplate(params)
            },
            meta: {
                title: `Document #${params.id}`,
                author: 'Author of document',
                keywords: 'HTML, JavaScript',
                description: 'Description of document'
            }
        };
    };
}
