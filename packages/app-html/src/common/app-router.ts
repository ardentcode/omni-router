import {createHTMLRouteProcessor, createRedirectRouteProcessor, RouteDeclaration, Router} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from '../modules/document';
import {createHomeRouteHandler, HomeRouteParams} from '../modules/home';
import {ROOT_ID} from './config';

interface AppRoutes {
    home: HomeRouteParams;
    document: DocumentRouteParams;
}

export function initAppRouter(router: Router<AppRoutes>): Router<AppRoutes> {
    const redirectRouteProcessor = createRedirectRouteProcessor();

    const htmlRouteProcessor = createHTMLRouteProcessor({
        rootId: ROOT_ID
    });

    const homeRoute: RouteDeclaration<AppRoutes> = {
        name: 'home',
        path: '/',
        handler: createHomeRouteHandler()
    };

    const documentRoute: RouteDeclaration<AppRoutes> = {
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