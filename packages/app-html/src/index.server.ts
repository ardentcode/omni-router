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
        const route = await router.openRouteByPath(request.path, request.query);
        if (route.data.redirect) {
            let redirectPath: string | undefined;
            if (route.data.redirect.path) {
                redirectPath = router.getRouteByPath(route.data.redirect.path, route.data.redirect.params)?.path;
            } else if (route.data.redirect.name) {
                redirectPath = router.getRouteByName(route.data.redirect.name, route.data.redirect.params)?.path;
            }
            if (redirectPath) {
                response.redirect(redirectPath);
                return;
            }
        }
        const content = htmlRenderer.renderHTML(htmlTemplate, {
            TITLE: route.data.meta?.title ?? '',
            CONTENT: route.data.html?.content ?? ''
        });
        response.send(content);
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();
