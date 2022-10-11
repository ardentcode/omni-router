import {createHTMLRouteProcessor, createMetaRouteProcessor, createRedirectRouteProcessor, HTMLRouteData, MetaRouteData, RedirectRouteData, RouteDeclaration, Router} from 'ui-router';
import {createDocumentRouteHandler, DocumentRouteParams} from '../modules/document';
import {createHomeRouteHandler, HomeRouteParams} from '../modules/home';
import {createNotFoundRouteHandler, NotFoundRouteParams} from '../modules/not-found';
import {ROOT_ID} from './config';
import {BookListRouteParams, createBookListRouteHandler} from '../modules/books-list';
import {LoadingIndicator} from './loading-indicator';

interface AppRoutes {
    'home': HomeRouteParams;
    'document': DocumentRouteParams;
    'books-list': BookListRouteParams;
    'not-found': NotFoundRouteParams;
}

interface AppRouteData extends HTMLRouteData, MetaRouteData, RedirectRouteData<AppRoutes> {

}

export function initAppRouter(router: Router<AppRoutes, AppRouteData>, loadingIndicator?: LoadingIndicator): Router<AppRoutes, AppRouteData> {
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
        handler: createDocumentRouteHandler({loadingIndicator})
    };

    const limitedBooksListRoute: RouteDeclaration<AppRoutes> = {
        name: 'books-list',
        path: '/books-list?limit', // actually this does not match with query params
        handler: createBookListRouteHandler({loadingIndicator})
    };

    const booksListRoute: RouteDeclaration<AppRoutes> = {
        name: 'books-list',
        path: '/books-list',
        handler: createBookListRouteHandler({loadingIndicator})
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
    router.registerRoute(limitedBooksListRoute);
    router.registerRoute(booksListRoute);
    router.registerRoute(documentRoute);
    router.registerRoute(notFoundRoute);

    return router;
}
