import {RouteHandler, RouteInfo} from 'ui-router';
import {BookApi, createBookApi} from './book-api';
import {BooksTemplate} from './books-template';
import {ReactRouteData} from '../../common/react-route-data';

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
            component: <BooksTemplate books={books} router={router}/>,
            meta: {
                title: `Books`
            }
        };
    };
}
