export interface DocumentTemplateParams {
    id: string;
}

export function renderDocumentTemplate({id}: DocumentTemplateParams): string {
    return `
        <a href="/">Home page</a>
        <h1>Document #${id}</h1> <br/>
    `;
}
