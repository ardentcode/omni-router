import express, {Request, Response} from 'express';
import {createRouter} from 'ui-router';
import {initAppRouter} from './common';
import {ROOT_ID} from './common/config';
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
        const route = await router.openPath(request.path);
        const content = htmlRenderer.renderHTML(htmlTemplate, {
            TITLE: 'UI Router',
            CONTENT: route?.data.htmlText ?? ''
        });
        response.send(content);
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();