import {Router} from 'ui-router';
import {Book} from './book';
import {BooksRoutes} from './books-routes';

export interface BooksTemplateOptions {
    router: Router<BooksRoutes>;
    books: Book[];
}

export function renderBooksTemplate({books, router}: BooksTemplateOptions): string {
    return `
        <h1>&#128216; Books</h1>
        <ul>
            ${books.map(book => `
                <li>
                    <a href="${router.getRouteByName('book', {id: book.id})}">
                        ${book.title}
                    </a>
                </li>
            `).join('')}
            <li>
                <a href="${router.getRouteByName('book', {id: '0'})}">
                    Not Existing Book
                </a>
            </li>
        </ul>
    `;
}
