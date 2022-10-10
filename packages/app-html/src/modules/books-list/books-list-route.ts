import {HTMLRouteData, RouteHandler} from 'ui-router';
import {renderBookListTemplate} from './books-list-template';
import {LoadingIndicator} from '../../common/loading-indicator';

export interface BookListRouteParams {
    limit: number;
}

export interface BookListRouteDeps {
    loadingIndicator?: LoadingIndicator;
}

export function createBookListRouteHandler({loadingIndicator}: BookListRouteDeps): RouteHandler<BookListRouteParams, HTMLRouteData> {
    return async (params: BookListRouteParams) => {
        loadingIndicator?.show();
        let books = [];
        try {
            books = await fetch('https://www.anapioficeandfire.com/api/books', {
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return [];
                }
            });
        } catch (e) {
            console.log('fetch error');
        }

        loadingIndicator?.hide();
        return {
            htmlText: renderBookListTemplate(books.slice(params.limit - 1)),
            meta: {
                title: `Books list`,
                author: 'author of page'
            }
        };
    };
}
