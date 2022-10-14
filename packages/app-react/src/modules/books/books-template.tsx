import React from 'react'
import {Router} from 'ui-router';
import {Book} from './book';
import {BooksRoutes} from './books-routes';

export interface BooksTemplateProps {
    router: Router<BooksRoutes>;
    books: Book[];
}

export function BooksTemplate({books, router}: BooksTemplateProps): JSX.Element {
    const bookItems = books.map(book => (
        <li key={book.id} >
            <a href={router.getRouteByName('book', {id: book.id}).path}>
                {book.title}
            </a>
        </li>
    ));

    return (
        <div>
            <h1>&#128216; Books</h1>
            <ul>
                {bookItems}
                <li key='not-existing-book' >
                    <a href={router.getRouteByName('book', {id: '0'}).path}>
                        Not Existing Book
                    </a>
                </li>
            </ul>
        </div>
    )
}
