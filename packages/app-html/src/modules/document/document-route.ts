import {HTMLRouteData, RedirectRouteData, RouteHandler} from 'ui-router';
import {LoadingIndicator} from '../../common/loading-indicator';
import {renderDocumentTemplate} from './document-template';

export interface DocumentRouteParams {
    id: string;
    delay_sec: number;
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
        if(params.delay_sec != null) {
            await new Promise(resolve => setTimeout(resolve, params.delay_sec * 1000));
        }
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
