import {Router} from 'ui-router';
import {AppRoutes} from './app-router';
import {APP_ID} from './config';
import {renderHeaderTemplate} from './header-template';
import './page-template.css';

export interface PageTemplateOptions {
    router: Router<AppRoutes>;
    title?: string;
    content?: string;
    info?: string;
}

export function renderPageTemplate({router, title, content, info}: PageTemplateOptions): string {
    return `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <title>${title}</title>
            <link href="/index.css" rel="stylesheet" type="text/css">
        </head>
        <body>
            ${renderHeaderTemplate({router, info})}
            <main id="${APP_ID}">
                ${content}
            </main>
            <script src="/index.js"></script>
        </body>
        </html>
    `;
}