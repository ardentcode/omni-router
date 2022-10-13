import {HTMLRouteData, RouteHandler, RouteInfo} from 'ui-router';
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
}: BooksRouteHandlerOptions = {}): RouteHandler<BooksRouteParams, HTMLRouteData> {
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