import {createRouter, createHTMLRouteProcessor, createRedirectRouteProcessor, Router} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from './modules/document';
import {createHomeRouteHandler, HomeRouteParams} from './modules/home';

interface AppRoutes {
    home: HomeRouteParams;
    document: DocumentRouteParams;
}

export function createAppRouter(): Router<AppRoutes> {
    const router = createRouter<AppRoutes>();

    const redirectRouteProcessor = createRedirectRouteProcessor();

    const htmlRouteProcessor = createHTMLRouteProcessor({
        rootId: 'app'
    });

    const homeRoute = {
        name: 'home',
        path: '/',
        handler: createHomeRouteHandler()
    };

    const documentRoute = {
        name: 'document',
        path: '/document/:id',
        handler: createDocumentRouteHandler()
    };

    router.registerProcessor(redirectRouteProcessor);
    router.registerProcessor(htmlRouteProcessor);
    router.registerRoute(homeRoute);
    router.registerRoute(documentRoute);

    return router;
}