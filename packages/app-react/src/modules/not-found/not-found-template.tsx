import React from "react";

export interface NotFoundTemplateParams {

}

export function renderNotFoundTemplate({}: NotFoundTemplateParams): JSX.Element {
    return (
        <div>
            404 Not Found
        </div>
    );
}
