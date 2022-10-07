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
import {BookListRouteParams, createBookListRouteHandler} from '../modules/books-list';

interface AppRoutes {
    'home': HomeRouteParams;
    'document': DocumentRouteParams;
    'books-list': BookListRouteParams;
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

    const booksListRoute: RouteDeclaration<AppRoutes> = {
        name: 'books-list',
        path: '/books-list',
        handler: createBookListRouteHandler()
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
    router.registerRoute(booksListRoute);
    router.registerRoute(documentRoute);
    router.registerRoute(notFoundRoute);

    return router;
}
