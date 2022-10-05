import {
    createHTMLRouteProcessor,
    createMetaRouteProcessor,
    createRedirectRouteProcessor,
    RouteDeclaration,
    Router
} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from '../modules/document';
import {createHomeRouteHandler, HomeRouteParams} from '../modules/home';
import {createNotFoundRouteHandler, NotFoundRouteParams} from '../modules/not-found';
import {ROOT_ID} from './config';

interface AppRoutes {
    'home': HomeRouteParams;
    'document': DocumentRouteParams;
    'not-found': NotFoundRouteParams;
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

    const notFoundRoute: RouteDeclaration<AppRoutes> = {
        name: 'not-found',
        path: '/*',
        handler: createNotFoundRouteHandler()
    };

    router.registerProcessor(redirectRouteProcessor);
    router.registerProcessor(htmlRouteProcessor);
    router.registerProcessor(metaRouteProcessor);
    router.registerRoute(homeRoute);
    router.registerRoute(documentRoute);
    router.registerRoute(notFoundRoute);

    return router;
}
