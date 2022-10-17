import {BookRouteParams} from './book-route';
import {BooksRouteParams} from './books-route';

export interface BooksRoutes {
    books: BooksRouteParams;
    book: BookRouteParams;
}