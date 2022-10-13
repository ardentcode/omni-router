import express, {Request, Response} from 'express';
import {createAppRouter, renderPageTemplate} from './common';
import {renderErrorModalTemplate} from './common/error-modal-template';
import {APP_PORT, PUBLIC_PATH} from './server';
import {renderToString} from 'react-dom/server';

function main() {
    const app = express();

    app.use(express.static(PUBLIC_PATH));

    app.get('*', async (request: Request, response: Response) => {
        const router = createAppRouter();
        try {
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
            response.send(renderPageTemplate({
                router,
                title: route.data.meta?.title,
                content: route.data.component ? renderToString(route.data.component) : '',
                info: route.data.fragments?.info
            }));
        } catch (error) {
            response.send(renderPageTemplate({
                router,
                title: 'Error',
                content: renderToString(renderErrorModalTemplate({error}))
            }));
        }
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();
