import {Router} from '@ardentcode/omni-router';
import {ReactNode} from 'react';
import {AppRoutes} from './app-router';
import {APP_ID} from './config';
import {HeaderTemplate} from './header-template';
import './page-template.css';

export interface PageTemplateProps {
    router: Router<AppRoutes>;
    title?: string;
    children?: ReactNode;
}

export function PageTemplate({router, title, children}: PageTemplateProps) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta content="width=device-width, initial-scale=1" name="viewport"/>
            <title>{title}</title>
            <link href="/index.css" rel="stylesheet" type="text/css"/>
        </head>
        <body>
            <HeaderTemplate router={router}/>
            <main id={APP_ID}>
                {children}
            </main>
            <script src="/index.js"></script>
        </body>
        </html>
    );
}
