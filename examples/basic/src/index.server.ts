import express, {Request, Response} from 'express';
import {createAppRouter, renderErrorTemplate, renderPageTemplate} from './common';
import {APP_PORT, PUBLIC_PATH} from './server';

function main() {
    const app = express();

    app.use(express.static(PUBLIC_PATH));

    app.get('*', async (request: Request, response: Response) => {
        const router = createAppRouter();
        try {
            const route = await router.openRouteByPath(request.path, request.query);
            if (route.data.redirect) {
                response.redirect(route.data.redirect.temporary ? 302 : 301, route.data.redirect.path);
                return;
            }
            response.send(renderPageTemplate({
                router,
                title: route.data.meta?.title,
                content: route.data.html?.content,
                info: route.data.html?.fragments?.info
            }));
        } catch (error) {
            response.send(renderPageTemplate({
                router,
                title: 'Error',
                content: renderErrorTemplate({error})
            }));
        }
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();
