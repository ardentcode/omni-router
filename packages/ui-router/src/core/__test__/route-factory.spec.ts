import {describe, expect, it} from '@jest/globals';
import {HandlerNotFoundError, PathNotMatchingError} from '../errors';
import {createRouteFactory} from '../utils';
import {createLazyRouteDeclarationMock, createRouteDeclarationMock} from './utils';

describe('createRoute', () => {

    it('returns correct route', () => {
        const routeFactory = createRouteFactory();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const homeRoute = routeFactory.createRoute(homeRouteDeclaration, '/');
        expect(homeRoute).toEqual({
            name: 'home',
            path: '/',
            params: {},
            data: null
        });
    });

    it('returns correct route with parameters', () => {
        const routeFactory = createRouteFactory();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        const postRoute = routeFactory.createRoute(postRouteDeclaration, '/post/1');
        expect(postRoute).toEqual({
            name: 'post',
            path: '/post/1',
            params: {id: '1'},
            data: null
        });
    });

    it('serializes to path', () => {
        const routeFactory = createRouteFactory();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        const postRoute = routeFactory.createRoute(postRouteDeclaration, '/post/1');
        expect('' + postRoute).toEqual('/post/1');
    });

    it('throws error if path does not match pattern', () => {
        const routeFactory = createRouteFactory();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        expect(() => {
            routeFactory.createRoute(postRouteDeclaration, '/posts/1');
        }).toThrow(PathNotMatchingError);
    });

});

describe('handleRoute', () => {

    it('handles the route correctly', async () => {
        const routeFactory = createRouteFactory();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        const postRoute = {
            name: 'post',
            path: '/post/1',
            params: {id: '1'},
            data: null
        };
        const info = {} as any;
        const handledPostRoute = await routeFactory.handleRoute(postRouteDeclaration, postRoute, info);
        expect(postRouteDeclaration.handler).toBeCalledWith(postRoute.params, info);
        expect(handledPostRoute).toEqual({
            name: 'post',
            path: '/post/1',
            params: {id: '1'},
            data: {}
        });
    });

    it('handles the route with lazy handler correctly', async () => {
        const routeFactory = createRouteFactory();
        const lazyRouteDeclaration = createLazyRouteDeclarationMock('lazy', '/lazy');
        const lazyRoute = {
            name: 'lazy',
            path: '/lazy',
            params: {},
            data: null
        };
        const info = {} as any;
        const handledLazyRoute = await routeFactory.handleRoute(lazyRouteDeclaration, lazyRoute, info);
        expect((lazyRouteDeclaration.handler as any).lazy).toBeCalled();
        expect(handledLazyRoute).toEqual({
            name: 'lazy',
            path: '/lazy',
            params: {},
            data: {}
        });
    });

    it('throws error if handler is invalid', async () => {
        const routeFactory = createRouteFactory();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const homeRoute = {
            name: 'home',
            path: '/',
            params: {},
            data: null
        };
        const info = {} as any;
        // @ts-ignore
        homeRouteDeclaration.handler = null;
        const handledHomeRoutePromise = routeFactory.handleRoute(homeRouteDeclaration, homeRoute, info);
        await expect(handledHomeRoutePromise).rejects.toThrow(HandlerNotFoundError);
    });

});