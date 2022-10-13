import {HTMLRouteData, RedirectRouteData, RouteHandler, RouteInfo} from 'ui-router';
import {BookApi, createBookApi} from './book-api';
import {renderBookTemplate} from './book-template';

export interface BookRouteParams {
    id: string;
}

export interface BookRouteHandlerOptions {
    bookApi?: BookApi;
}

export function createBookRouteHandler({
    bookApi = createBookApi()
}: BookRouteHandlerOptions = {}): RouteHandler<BookRouteParams, HTMLRouteData & RedirectRouteData> {
    return async ({id}: BookRouteParams, {router, signal}: RouteInfo) => {
        const book = await bookApi?.getBook({id, signal});
        if (!book) {
            return {
                redirect: {
                    name: 'books'
                }
            };
        }
        return {
            html: {
                content: renderBookTemplate({book, router})
            },
            meta: {
                title: book.title
            }
        };
    };
}
