import {RouteHandler, RouteInfo} from '@ardentcode/omni-router';
import {ReactRouteData} from '@ardentcode/omni-router-react';
import {BookApi, createBookApi} from './book-api';
import {BookTemplate} from './book-template';

export interface BookRouteParams {
    id: string;
}

export interface BookRouteHandlerOptions {
    bookApi?: BookApi;
}

export function createBookRouteHandler({
    bookApi = createBookApi()
}: BookRouteHandlerOptions = {}): RouteHandler<BookRouteParams, ReactRouteData> {
    return async ({id}: BookRouteParams, {signal}: RouteInfo) => {
        const book = await bookApi?.getBook({id, signal});
        if (!book) {
            throw new Error(`Book "${id}" does not exist`);
        }
        return {
            react: {
                component: <BookTemplate book={book}/>
            },
            meta: {
                title: book.title
            }
        };
    };
}
