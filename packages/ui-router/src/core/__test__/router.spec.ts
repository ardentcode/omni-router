import {describe, expect, it, jest} from '@jest/globals';
import {HandlerNotFoundError, ParamsMissingError, RouteAbortedError, RouteNotFoundError} from '../errors';
import {createRouter} from '../router';
import {createLazyRouteDeclarationMock, createProcessorMock, createRouteDeclarationMock} from './utils';

describe('getRoutes', () => {

    it('returns registered routes', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(homeRouteDeclaration);
        router.registerRoute(postRouteDeclaration);
        const routes = router.getRoutes();
        expect(routes).toEqual([homeRouteDeclaration, postRouteDeclaration]);
    });

});

describe('getCurrentRoute', () => {

    it('returns correct current route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        await router.openRouteByName('home');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute).not.toBeNull();
        expect(currentRoute.name).toEqual('home');
    });

    it('throws error if there is no current route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        expect(() => router.getCurrentRoute()).toThrow(RouteNotFoundError);
    });

});

describe('getLoadingRoute', () => {

    it('returns correct loading route', async () => {
        const router = createRouter();
        const lazyRouteDeclaration = createLazyRouteDeclarationMock('lazy', '/lazy');
        router.registerRoute(lazyRouteDeclaration);
        const promise = router.openRouteByName('lazy');
        const route = router.getLoadingRoute();
        expect(route).not.toBeNull();
        expect(route?.name).toEqual('lazy');
        await promise;
    });

    it('returns null if there is no loading route', async () => {
        const router = createRouter();
        const lazyRouteDeclaration = createLazyRouteDeclarationMock('lazy', '/lazy');
        router.registerRoute(lazyRouteDeclaration);
        const route = router.getLoadingRoute();
        expect(route).toBeNull();
    });

});

describe('getRouteByPath', () => {

    it('returns correct route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        const route = router.getRouteByPath('/');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
        expect(route?.data).toBeNull();
    });

    it('returns correct route with parameters', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        const route = router.getRouteByPath('/post/10');
        expect(route?.name).not.toBeNull();
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
    });

    it('returns null if there is not matching route', async () => {
        const router = createRouter();
        const route = router.getRouteByPath('/');
        expect(route).toBeNull();
    });

    it('does not run handler', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        router.getRouteByPath('/');
        expect(homeRouteDeclaration.handler).not.toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerProcessor(processor);
        router.registerRoute(homeRouteDeclaration);
        router.getRouteByPath('/');
        expect(processor.onGetRouteStart).toBeCalled();
        expect(processor.onGetRouteEnd).toBeCalled();
        expect(processor.onOpenRouteStart).not.toBeCalled();
        expect(processor.onOpenRouteEnd).not.toBeCalled();
        expect(processor.onOpenRouteSuccess).not.toBeCalled();
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('getRouteByName', () => {

    it('returns correct route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        const route = router.getRouteByName('home');
        expect(route.name).toEqual('home');
        expect(route.path).toEqual('/');
        expect(route.data).toBeNull();
    });

    it('returns correct route with parameters', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        const route = router.getRouteByName('post', {id: '10'});
        expect(route.name).toEqual('post');
        expect(route.path).toEqual('/post/10');
        expect(route.params).toEqual({id: '10'});
    });

    it('throws error if route is not found', async () => {
        const router = createRouter();
        expect(() => router.getRouteByName('home')).toThrow(RouteNotFoundError);
    });

    it('throws error if not all parameters are passed', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        expect(() => router.getRouteByName('post')).toThrow(ParamsMissingError);
    });

    it('does not run handler', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        router.getRouteByName('home');
        expect(homeRouteDeclaration.handler).not.toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerProcessor(processor);
        router.registerRoute(homeRouteDeclaration);
        router.getRouteByName('home');
        expect(processor.onGetRouteStart).toBeCalled();
        expect(processor.onGetRouteEnd).toBeCalled();
        expect(processor.onOpenRouteStart).not.toBeCalled();
        expect(processor.onOpenRouteEnd).not.toBeCalled();
        expect(processor.onOpenRouteSuccess).not.toBeCalled();
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('openRouteByPath', () => {

    it('opens correct route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        const route = await router.openRouteByPath('/');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
        expect(route?.data).not.toBeNull();
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        const route = await router.openRouteByPath('/post/10');
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
        expect(route?.data).not.toBeNull();
    });

    it('throws error if route is not found', async () => {
        const router = createRouter();
        await expect(router.openRouteByPath('/')).rejects.toThrow(RouteNotFoundError);
    });

    it('runs handler', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        expect(homeRouteDeclaration.handler).not.toBeCalled();
        await router.openRouteByPath('/');
        expect(homeRouteDeclaration.handler).toBeCalled();
    });

    it('runs lazy handler', async () => {
        const router = createRouter();
        const lazyRouteDeclaration = createLazyRouteDeclarationMock('lazy', '/lazy');
        router.registerRoute(lazyRouteDeclaration);
        if ('lazy' in lazyRouteDeclaration.handler) {
            expect(lazyRouteDeclaration.handler.lazy).not.toBeCalled();
            await router.openRouteByPath('/lazy');
            expect(lazyRouteDeclaration.handler.lazy).toBeCalled();
        }
    });

    it('throws error if route handler is not found', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        // @ts-ignore
        delete homeRouteDeclaration.handler;
        router.registerRoute(homeRouteDeclaration);
        await expect(router.openRouteByPath('/')).rejects.toThrow(HandlerNotFoundError);
    });

    it('runs correct processor methods', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerProcessor(processor);
        router.registerRoute(homeRouteDeclaration);
        await router.openRouteByPath('/');
        expect(processor.onGetRouteStart).toBeCalled();
        expect(processor.onGetRouteEnd).toBeCalled();
        expect(processor.onOpenRouteStart).toBeCalled();
        expect(processor.onOpenRouteEnd).toBeCalled();
        expect(processor.onOpenRouteSuccess).toBeCalled();
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerRoute(homeRouteDeclaration);
        router.registerProcessor(processor);
        await expect(Promise.all([
            router.openRouteByPath('/'),
            router.openRouteByPath('/')
        ])).rejects.toThrow(RouteAbortedError);
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).toBeCalled();
    });

    it('handles errors', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        homeRouteDeclaration.handler = jest.fn(() => {
            throw new Error('custom');
        });
        router.registerRoute(homeRouteDeclaration);
        router.registerProcessor(processor);
        await expect(router.openRouteByPath('/')).rejects.toThrow('custom');
        expect(processor.onOpenRouteEnd).toBeCalled();
        expect(processor.onOpenRouteSuccess).not.toBeCalled();
        expect(processor.onOpenRouteError).toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('openRouteByName', () => {

    it('opens correct route', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        const route = await router.openRouteByName('home');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
        expect(route?.data).not.toBeNull();
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        const route = await router.openRouteByName('post', {id: '10'});
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
        expect(route?.data).not.toBeNull();
    });

    it('throws error if route is not found', async () => {
        const router = createRouter();
        await expect(router.openRouteByName('home')).rejects.toThrow(RouteNotFoundError);
    });

    it('throws error if not all parameters are passed', async () => {
        const router = createRouter();
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        router.registerRoute(postRouteDeclaration);
        await expect(router.openRouteByName('post')).rejects.toThrow(ParamsMissingError);
    });

    it('runs handler', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        router.registerRoute(homeRouteDeclaration);
        expect(homeRouteDeclaration.handler).not.toBeCalled();
        await router.openRouteByName('home');
        expect(homeRouteDeclaration.handler).toBeCalled();
    });

    it('runs lazy handler', async () => {
        const router = createRouter();
        const lazyRouteDeclaration = createLazyRouteDeclarationMock('lazy', '/lazy');
        router.registerRoute(lazyRouteDeclaration);
        if ('lazy' in lazyRouteDeclaration.handler) {
            expect(lazyRouteDeclaration.handler.lazy).not.toBeCalled();
            await router.openRouteByName('lazy');
            expect(lazyRouteDeclaration.handler.lazy).toBeCalled();
        }
    });

    it('runs correct processor methods', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerProcessor(processor);
        router.registerRoute(homeRouteDeclaration);
        await router.openRouteByName('home');
        expect(processor.onGetRouteStart).toBeCalled();
        expect(processor.onGetRouteEnd).toBeCalled();
        expect(processor.onOpenRouteStart).toBeCalled();
        expect(processor.onOpenRouteEnd).toBeCalled();
        expect(processor.onOpenRouteSuccess).toBeCalled();
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        router.registerRoute(homeRouteDeclaration);
        router.registerProcessor(processor);
        await expect(Promise.all([
            router.openRouteByName('home'),
            router.openRouteByName('home')
        ])).rejects.toThrow(RouteAbortedError);
        expect(processor.onOpenRouteError).not.toBeCalled();
        expect(processor.onOpenRouteAbort).toBeCalled();
    });

    it('handles errors', async () => {
        const router = createRouter();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const processor = createProcessorMock();
        homeRouteDeclaration.handler = jest.fn(() => {
            throw new Error('custom');
        });
        router.registerRoute(homeRouteDeclaration);
        router.registerProcessor(processor);
        await expect(router.openRouteByName('home')).rejects.toThrow('custom');
        expect(processor.onOpenRouteError).toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
        expect(processor.onOpenRouteEnd).toBeCalled();
        expect(processor.onOpenRouteSuccess).not.toBeCalled();
        expect(processor.onOpenRouteError).toBeCalled();
        expect(processor.onOpenRouteAbort).not.toBeCalled();
    });

});