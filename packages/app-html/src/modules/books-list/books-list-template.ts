export function renderBookListTemplate(books: Array<any>): string {
    const booksTitles = books.map(book => `<p>${book.name}</p>`).join('');

    return `
        <a href="/">Home page</a>
        <h1>Book list</h1>
        <p></p>
        ${booksTitles}
    `;
}
