import React from 'react';

export interface NotFoundTemplateProps {
}

export function renderNotFoundTemplate({}: NotFoundTemplateProps): JSX.Element {
    return (
        <div>
            404 Not Found
        </div>
    );
}
