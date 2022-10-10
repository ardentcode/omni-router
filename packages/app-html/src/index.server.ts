import './server/polyfills';
import express, {Request, Response} from 'express';
import {createRouter} from 'ui-router';
import {initAppRouter, ROOT_ID} from './common';
import {APP_PORT, createHTMLRenderer, htmlTemplate, PUBLIC_PATH} from './server';

function main() {
    const app = express();
    const htmlRenderer = createHTMLRenderer({
        commonData: {
            ROOT_ID
        }
    });

    app.use(express.static(PUBLIC_PATH));

    app.get('*', async (request: Request, response: Response) => {
        const router = initAppRouter(createRouter());
        const route = await router.openRouteByPath(request.path);
        const content = htmlRenderer.renderHTML(htmlTemplate, {
            TITLE: route?.data.meta?.title ?? '',
            CONTENT: route?.data.htmlText ?? ''
        });
        response.send(content);
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();
