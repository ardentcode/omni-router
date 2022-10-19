import {default as axios} from 'axios';
import {Book} from './book';

export interface BookApi {
    getBooks: (params: GetBooksParams) => Promise<Book[]>;
    getBook: (params: GetBookParams) => Promise<Book | null>;
}

interface GetBooksParams {
    limit?: number;
    signal?: AbortSignal;
}

interface GetBookParams {
    id: string;
    signal?: AbortSignal;
}

type BookItem = Omit<Book, 'id' | 'title'> & {
    url: string;
    name: string;
};

export function createBookApi(): BookApi {

    const getBooks = async ({limit = 10, signal}: GetBooksParams): Promise<Book[]> => {
        try {
            const apiUrl = `https://www.anapioficeandfire.com/api/books?pageSize=${limit}`;
            const bookItems = (await axios.get<BookItem[]>(apiUrl, {signal})).data;
            return bookItems.map(bookItem => convertToBook(bookItem));
        } catch (error) {
            if (signal?.aborted) {
                throw error;
            }
            return [];
        }
    };

    const getBook = async ({id, signal}: GetBookParams): Promise<Book | null> => {
        try {
            const apiUrl = `https://www.anapioficeandfire.com/api/books/${id}`;
            const bookItem = (await axios.get<BookItem>(apiUrl, {signal})).data;
            return convertToBook(bookItem);
        } catch (error) {
            if (signal?.aborted) {
                throw error;
            }
            return null;
        }
    };

    const convertToBook = (bookItem: BookItem): Book => {
        return {
            id: bookItem.url.match(/\d+$/)?.[0] ?? '0',
            title: bookItem.name,
            authors: bookItem.authors,
            isbn: bookItem.isbn,
            numberOfPages: bookItem.numberOfPages
        };
    };

    return {
        getBooks,
        getBook
    };

}