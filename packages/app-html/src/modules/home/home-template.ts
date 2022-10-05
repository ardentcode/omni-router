export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams): string {
    return `
        Home<br/>
        <a href="/document/1">Document 1</a><br/>
        <a href="/document/2">Document 2</a><br/>
        <a href="/document/03">Document 03 -> Document 3</a>
    `;
}