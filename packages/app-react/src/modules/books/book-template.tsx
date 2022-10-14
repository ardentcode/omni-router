import React from 'react';
import {Book} from './book';

export interface BookTemplateProps {
    book: Book;
}

export function renderBookTemplate({book}: BookTemplateProps): JSX.Element {
    return <BookTemplate book={book}/>;
}

function BookTemplate({book}: BookTemplateProps): JSX.Element {
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
