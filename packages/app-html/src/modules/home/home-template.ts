export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams): string {
    return `
        <h1>Home page</h1>
        <a href="/document/1">Document 1</a><br/>
        <a href="/document/2">Document 2</a><br/>
        <a href="/document/03">Document 03 -> Document 3</a><br/>
        <a href="/document/5?redTitle=true">Document with red title</a><br/>
        <a href="/books-list">Book list</a><br/>
    `;
}
