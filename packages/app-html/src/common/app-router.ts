import {createHTMLRouteProcessor, createRedirectRouteProcessor, createRouter, Router} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from '../modules/document';
import {createHomeRouteHandler, HomeRouteParams} from '../modules/home';
import {ROOT_ID} from './config';
import {createMetaRouteProcessor} from 'ui-router/src/meta';

interface AppRoutes {
    home: HomeRouteParams;
    document: DocumentRouteParams;
}

export function createAppRouter(): Router<AppRoutes> {
    const router = createRouter<AppRoutes>();

    const redirectRouteProcessor = createRedirectRouteProcessor();

    const htmlRouteProcessor = createHTMLRouteProcessor({
        rootId: ROOT_ID
    });

    const metaRouteProcessor = createMetaRouteProcessor();

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
    router.registerProcessor(metaRouteProcessor);
    router.registerRoute(homeRoute);
    router.registerRoute(documentRoute);

    return router;
}
