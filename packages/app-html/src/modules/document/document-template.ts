export interface DocumentTemplateParams {
    id: string;
}

export function renderDocumentTemplate({id}: DocumentTemplateParams): string {
    return `
        Document #${id}
    `;
}