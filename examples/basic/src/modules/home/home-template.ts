export interface HomeTemplateParams {

}

export function renderHomeTemplate({}: HomeTemplateParams = {}): string {
    return `
        <h1>\t&#127968; Home</h1>
        <p>
            Welcome to Omni Router!
        </p>
    `;
}
