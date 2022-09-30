import {createHTMLRouteProcessor, createRedirectRouteProcessor, RouteDeclaration, Router} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from '../modules/document';
import {createHomeRouteHandler, HomeRouteParams} from '../modules/home';
import {ROOT_ID} from './config';
import {createMetaRouteProcessor} from 'ui-router/src/meta';

interface AppRoutes {
    home: HomeRouteParams;
    document: DocumentRouteParams;
}

export function initAppRouter(router: Router<AppRoutes>): Router<AppRoutes> {
    const redirectRouteProcessor = createRedirectRouteProcessor();

    const htmlRouteProcessor = createHTMLRouteProcessor({
        rootId: ROOT_ID
    });

    const metaRouteProcessor = createMetaRouteProcessor();

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
    router.registerProcessor(metaRouteProcessor);
    router.registerRoute(homeRoute);
    router.registerRoute(documentRoute);

    return router;
}
