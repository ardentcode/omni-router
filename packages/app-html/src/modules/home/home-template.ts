export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams): string {
    return `
        <h1>Home page</h1>
        <a href="/document/1">Document 1</a><br/>
        <a href="/document/02">Document 02 -> Document 2</a><br/>
        <a href="/books-list">Book list with all titles</a><br/>
        <a href="/books-list?limit=5">Book list - only 5 titles</a><br/>
    `;
}
