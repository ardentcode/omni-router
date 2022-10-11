import {default as axios} from 'axios';
import {HTMLRouteData, RouteHandler} from 'ui-router';
import {LoadingIndicator} from '../../common/loading-indicator';
import {renderBookListTemplate} from './books-list-template';

export interface BookListRouteParams {
    limit: number;
}

export interface BookListRouteDeps {
    loadingIndicator?: LoadingIndicator;
}

interface Book {
    name: string;
}

type Books = Array<Book>

export function createBookListRouteHandler({loadingIndicator}: BookListRouteDeps): RouteHandler<BookListRouteParams, HTMLRouteData> {
    return async (params: BookListRouteParams) => {
        loadingIndicator?.show();
        let books: Books = [];
        try {
            books = (await axios.get<Books>('https://www.anapioficeandfire.com/api/books')).data;
        } catch (e) {
            console.log('fetch error: ' + e.message);
        }

        loadingIndicator?.hide();
        return {
            html: {
                content: renderBookListTemplate(books.slice(params.limit - 1))
            },
            meta: {
                title: `Books list`,
                author: 'author of page'
            }
        };
    };
}
