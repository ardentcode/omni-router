import {Router} from 'ui-router';
import {AppRoutes} from './app-router';
import {APP_ID} from './config';
import {HeaderTemplate} from './header-template';
import './page-template.css';
import {renderToString} from 'react-dom/server';

export interface RenderHtmlOptions {
    router: Router<AppRoutes>;
    title?: string;
    content?: JSX.Element;
}

export function renderHtml({router, title, content}: RenderHtmlOptions): string {
    const html = (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta content="width=device-width, initial-scale=1" name="viewport"/>
            <title>${title ?? ''}</title>
            <link href="/index.css" rel="stylesheet" type="text/css"/>
        </head>
        <body>
        <HeaderTemplate router={router}/>
        <main id={APP_ID}>
            {content ?? ''}
        </main>
        <script src="/index.js"></script>
        </body>
        </html>
    );

    return `<!doctype html>\n${renderToString(html)}`;
}
