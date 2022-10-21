import {HTMLRouteData, MetaRouteData, RedirectRouteData, RouteHandler, RouteInfo} from '@ardentcode/omni-router';
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
}: BookRouteHandlerOptions = {}): RouteHandler<BookRouteParams, HTMLRouteData & MetaRouteData & RedirectRouteData> {
    return async ({id}: BookRouteParams, {router, signal}: RouteInfo) => {
        const book = await bookApi?.getBook({id, signal});
        if (!book) {
            throw new Error(`Book "${id}" does not exist`);
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
