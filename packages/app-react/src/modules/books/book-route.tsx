import {RedirectRouteData, RouteHandler, RouteInfo} from 'ui-router';
import {BookApi, createBookApi} from './book-api';
import {BookTemplate} from './book-template';
import {ReactRouteData} from '../../common/react-route-data';

export interface BookRouteParams {
    id: string;
}

export interface BookRouteHandlerOptions {
    bookApi?: BookApi;
}

export function createBookRouteHandler({
    bookApi = createBookApi()
}: BookRouteHandlerOptions = {}): RouteHandler<BookRouteParams, ReactRouteData & RedirectRouteData> {
    return async ({id}: BookRouteParams, {signal}: RouteInfo) => {
        const book = await bookApi?.getBook({id, signal});
        if (!book) {
            throw new Error(`Book "${id}" does not exist`);
        }
        return {
            component: <BookTemplate book={book}/>,
            meta: {
                title: book.title
            }
        };
    };
}
