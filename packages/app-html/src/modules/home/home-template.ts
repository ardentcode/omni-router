export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams): string {
    return `
        Home
        <a href="/document/10">Document 10</a>
    `;
}