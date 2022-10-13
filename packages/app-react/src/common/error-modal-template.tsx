import React from 'react';
import './error-modal-template.css';

export interface ErrorModalTemplateOptions {
    error: Error;
}

export function renderErrorModalTemplate({error}: ErrorModalTemplateOptions): JSX.Element {
    return (
        <div>
            <h1>
                Something went wrong
            </h1>
            <p>
                {error.message}
            </p>
        </div>
    )
}
