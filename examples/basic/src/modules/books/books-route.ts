import {HTMLRouteData, MetaRouteData, RouteHandler, RouteInfo} from '@ardentcode/omni-router';
import {BookApi, createBookApi} from './book-api';
import {renderBooksTemplate} from './books-template';

export interface BooksRouteParams {
    limit?: number;
}

export interface BooksRouteHandlerOptions {
    bookApi?: BookApi;
}

export function createBooksRouteHandler({
    bookApi = createBookApi()
}: BooksRouteHandlerOptions = {}): RouteHandler<BooksRouteParams, HTMLRouteData & MetaRouteData> {
    return async ({limit = 10}: BooksRouteParams, {router, signal}: RouteInfo) => {
        const books = await bookApi.getBooks({limit, signal});
        return {
            html: {
                content: renderBooksTemplate({books, router})
            },
            meta: {
                title: `Books`
            }
        };
    };
}
