export interface ErrorTemplateProps {
    error: Error;
}

export function ErrorTemplate({error}: ErrorTemplateProps): JSX.Element {
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
