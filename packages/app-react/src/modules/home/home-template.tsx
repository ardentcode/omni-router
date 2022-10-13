import React from 'react'

export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams = {}): JSX.Element {
    return (
        <div>
            <h1>	&#127968; Home</h1>
            <p>
                Welcome to UI Router!
            </p>
        </div>
    );
}
