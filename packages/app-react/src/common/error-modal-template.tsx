import './error-modal-template.css';

export interface ErrorModalTemplateProps {
    error: Error;
}

export function ErrorModalTemplate({error}: ErrorModalTemplateProps): JSX.Element {
    return (
        <div>
            <h1>
                Something went wrong
            </h1>
            <p>
                {error.message}
            </p>
        </div>
    );
}
