import {default as axios} from 'axios';
import {HTMLRouteData, RouteHandler} from 'ui-router';
import {LoadingIndicator} from '../../common/loading-indicator';
import {renderBookListTemplate} from './books-list-template';

export interface BookListRouteParams {
    limit: number;
    delay_sec: number;
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

        if(params.delay_sec != null) {
            await new Promise(resolve => setTimeout(resolve, params.delay_sec * 1000));
        }

        loadingIndicator?.hide();
        return {
            html: {
                content: renderBookListTemplate(books.slice(0, params.limit))
            },
            meta: {
                title: `Books list`,
                author: 'author of page'
            }
        };
    };
}
