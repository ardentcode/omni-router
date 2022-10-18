export interface NotFoundTemplateParams {

}

export function renderNotFoundTemplate({}: NotFoundTemplateParams): string {
    return `
        404 Not Found
    `;
}