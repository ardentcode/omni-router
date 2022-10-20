import {RouteHandler, RouteInfo} from '@ardentcode/omni-router';
import {ReactRouteData} from '@ardentcode/omni-router-react';
import {BookApi, createBookApi} from './book-api';
import {BooksTemplate} from './books-template';

export interface BooksRouteParams {
    limit?: number;
}

export interface BooksRouteHandlerOptions {
    bookApi?: BookApi;
}

export function createBooksRouteHandler({
    bookApi = createBookApi()
}: BooksRouteHandlerOptions = {}): RouteHandler<BooksRouteParams, ReactRouteData> {
    return async ({limit = 10}: BooksRouteParams, {router, signal}: RouteInfo) => {
        const books = await bookApi.getBooks({limit, signal});
        return {
            react: {
                component: <BooksTemplate books={books}
                                          router={router}/>
            },
            meta: {
                title: `Books`
            }
        };
    };
}
