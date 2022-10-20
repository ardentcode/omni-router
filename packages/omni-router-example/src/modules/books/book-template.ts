import {Router} from '@ardentcode/omni-router';
import {Book} from './book';
import {BooksRoutes} from './books-routes';

export interface BookTemplateOptions {
    router: Router<BooksRoutes>;
    book: Book;
}

export function renderBookTemplate({book}: BookTemplateOptions): string {
    return `
        <h1>&#128214; ${book.title}</h1>
        <dl>
            <dt>Authors</dt>
            <dd>${book.authors.join(', ')}</dd>
            <dt>ISBN</dt>
            <dd>${book.isbn}</dd>
            <dt>Pages</dt>
            <dd>${book.numberOfPages}</dd>
        </dl>
    `;
}
