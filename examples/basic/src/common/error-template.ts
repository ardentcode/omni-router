export interface ErrorTemplateOptions {
    error: Error;
}

export function renderErrorTemplate({error}: ErrorTemplateOptions): string {
    return `
        <h1>
            Something went wrong
        </h1>
        <p>
            ${error.message}
        </p>
    `;
}