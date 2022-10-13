import './error-modal-template.css';

export interface ErrorModalTemplateOptions {
    error: Error;
}

export function renderErrorModalTemplate({error}: ErrorModalTemplateOptions): string {
    return `
        <h1>
            Something went wrong
        </h1>
        <p>
            ${error.message}
        </p>
    `;
}