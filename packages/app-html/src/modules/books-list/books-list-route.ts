import {HTMLRouteData, RouteHandler} from 'ui-router';
import {renderBookListTemplate} from './books-list-template';

export interface BookListRouteParams {
}

export function createBookListRouteHandler(): RouteHandler<BookListRouteParams, HTMLRouteData> {
    return async (params: BookListRouteParams) => {
        let books = [];
        try {
            books = await fetch('https://www.anapioficeandfire.com/api/books', {
                headers: {'Content-Type': 'application/json'},
                method: 'GET'
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return [];
                }
            });
        } catch (e) {
            console.log('fetch error');
        }

        return {
            htmlText: renderBookListTemplate(books),
            meta: {
                title: `Books list`,
                author: 'author of page'
            }
        };
    };
}
