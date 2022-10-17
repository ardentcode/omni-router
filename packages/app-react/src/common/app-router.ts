import {createMetaRouteProcessor, createRedirectRouteProcessor, createRouter, MetaRouteData, RedirectRouteData, RouteDeclaration, Router} from 'ui-router';
import type {BookRouteParams, BooksRouteParams} from '../modules/books';
import type {HomeRouteParams} from '../modules/home';
import type {NotFoundRouteParams} from '../modules/not-found';
import {createDelayRouteProcessor} from './delay-route-processor';
import {ReactRouteData} from './react-route-data';

export interface AppRoutes {
    'home': HomeRouteParams;
    'book': BookRouteParams;
    'books': BooksRouteParams;
    'not-found': NotFoundRouteParams;
}

export interface AppRouteData extends ReactRouteData, MetaRouteData, RedirectRouteData<AppRoutes> {

}

export function createAppRouter(): Router<AppRoutes, AppRouteData> {

    const router = createRouter<AppRoutes, AppRouteData>();

    const redirectRouteProcessor = createRedirectRouteProcessor();

    const metaRouteProcessor = createMetaRouteProcessor();

    const delayRouteProcessor = createDelayRouteProcessor({
        ms: 200
    });

    const homeRoute: RouteDeclaration<HomeRouteParams> = {
        name: 'home',
        path: '/',
        handler: {
            lazy: async () => (await import('../modules/home')).createHomeRouteHandler()
        }
    };

    const booksRoute: RouteDeclaration<BooksRouteParams> = {
        name: 'books',
        path: '/books',
        handler: {
            lazy: async () => (await import('../modules/books')).createBooksRouteHandler()
        }
    };

    const bookRoute: RouteDeclaration<BookRouteParams> = {
        name: 'book',
        path: '/books/:id',
        handler: {
            lazy: async () => (await import('../modules/books')).createBookRouteHandler()
        }
    };

    const notFoundRoute: RouteDeclaration<NotFoundRouteParams> = {
        name: 'not-found',
        path: '/*',
        handler: {
            lazy: async () => (await import('../modules/not-found')).createNotFoundRouteHandler()
        }
    };

    router.registerProcessor(redirectRouteProcessor);
    router.registerProcessor(metaRouteProcessor);
    router.registerProcessor(delayRouteProcessor);
    router.registerRoute(homeRoute);
    router.registerRoute(booksRoute);
    router.registerRoute(bookRoute);
    router.registerRoute(notFoundRoute);

    return router;

}
