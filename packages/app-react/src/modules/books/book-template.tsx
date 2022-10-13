import React from 'react'
import {Router} from 'ui-router';
import {Book} from './book';
import {BooksRoutes} from './books-routes';

export interface BookTemplateOptions {
    router: Router<BooksRoutes>;
    book: Book;
}

export function renderBookTemplate({book}: BookTemplateOptions): JSX.Element {
    return (
        <div>
            <h1>&#128214; {book.title}</h1>
            <dl>
                <dt>Authors</dt>
                <dd>{book.authors.join(', ')}</dd>
                <dt>ISBN</dt>
                <dd>{book.isbn}</dd>
                <dt>Pages</dt>
                <dd>{book.numberOfPages}</dd>
            </dl>
        </div>
    );
}
