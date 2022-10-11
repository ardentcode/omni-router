import {describe, expect, it, jest} from '@jest/globals';
import '../polyfills';
import {RouteDeclaration, RouteProcessor} from '../types';
import {createRouter} from './router';

interface TestRoutes {
    'home': HomeRouteParams;
    'post': PostRouteParams;
}

interface HomeRouteParams {

}

interface PostRouteParams {
    id: string;
}

function createHomeRoute(): RouteDeclaration<TestRoutes, 'home'> {
    return {
        name: 'home',
        path: '/',
        handler: jest.fn()
    } as RouteDeclaration<TestRoutes, 'home'>;
}

function createPostRoute(): RouteDeclaration<TestRoutes, 'post'> {
    return {
        name: 'post',
        path: '/post/:id',
        handler: jest.fn()
    } as RouteDeclaration<TestRoutes, 'post'>;
}

function createMockProcessor(): RouteProcessor {
    return {
        onGetRouteStart: jest.fn<any>(),
        onGetRouteEnd: jest.fn<any>(),
        onOpenRouteStart: jest.fn<any>(),
        onOpenRouteEnd: jest.fn<any>(),
        onOpenRouteRedirect: jest.fn<any>()
    };
}

describe('getRouteByPath', () => {

    it('returns correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = router.getRouteByPath('/');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
    });

    it('returns correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        const route = router.getRouteByPath('/post/10');
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
    });

    it('does not run handler', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        router.getRouteByPath('/');
        expect(homeRoute.handler).not.toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerProcessor(mockProcessor);
        router.registerRoute(homeRoute);
        router.getRouteByPath('/');
        expect(mockProcessor.onGetRouteStart).toBeCalled();
        expect(mockProcessor.onGetRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteStart).not.toBeCalled();
        expect(mockProcessor.onOpenRouteEnd).not.toBeCalled();
        expect(mockProcessor.onOpenRouteRedirect).not.toBeCalled();
    });

});

describe('getRouteByName', () => {

    it('returns correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = router.getRouteByName('home');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
    });

    it('returns correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        const route = router.getRouteByName('post', {id: '10'});
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
    });

    it('does not run handler', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        router.getRouteByName('home');
        expect(homeRoute.handler).not.toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerProcessor(mockProcessor);
        router.registerRoute(homeRoute);
        router.getRouteByName('home');
        expect(mockProcessor.onGetRouteStart).toBeCalled();
        expect(mockProcessor.onGetRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteStart).not.toBeCalled();
        expect(mockProcessor.onOpenRouteEnd).not.toBeCalled();
        expect(mockProcessor.onOpenRouteRedirect).not.toBeCalled();
    });

});

describe('openRouteByPath', () => {

    it('opens correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        await router.openRouteByPath('/');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute?.name).toEqual('home');
        expect(currentRoute?.path).toEqual('/');
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        await router.openRouteByPath('/post/10');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute?.name).toEqual('post');
        expect(currentRoute?.path).toEqual('/post/10');
        expect(currentRoute?.params).toEqual({id: '10'});
    });

    it('runs handler', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        expect(homeRoute.handler).not.toBeCalled();
        await router.openRouteByPath('/');
        expect(homeRoute.handler).toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerProcessor(mockProcessor);
        router.registerRoute(homeRoute);
        await router.openRouteByPath('/');
        expect(mockProcessor.onGetRouteStart).toBeCalled();
        expect(mockProcessor.onGetRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteStart).toBeCalled();
        expect(mockProcessor.onOpenRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteRedirect).toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        await expect(Promise.all([
            router.openRouteByPath('/'),
            router.openRouteByPath('/')
        ])).rejects.toThrow();
    });

});

describe('openRouteByName', () => {

    it('opens correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        expect(router.getCurrentRoute()).toBeNull();
        await router.openRouteByName('home');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute?.name).toEqual('home');
        expect(currentRoute?.path).toEqual('/');
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        expect(router.getCurrentRoute()).toBeNull();
        await router.openRouteByName('post', {id: '10'});
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute?.name).toEqual('post');
        expect(currentRoute?.path).toEqual('/post/10');
        expect(currentRoute?.params).toEqual({id: '10'});
    });

    it('runs handler', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        expect(homeRoute.handler).not.toBeCalled();
        await router.openRouteByName('home');
        expect(homeRoute.handler).toBeCalled();
    });

    it('runs correct processor methods', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerProcessor(mockProcessor);
        router.registerRoute(homeRoute);
        await router.openRouteByName('home');
        expect(mockProcessor.onGetRouteStart).toBeCalled();
        expect(mockProcessor.onGetRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteStart).toBeCalled();
        expect(mockProcessor.onOpenRouteEnd).toBeCalled();
        expect(mockProcessor.onOpenRouteRedirect).toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        await expect(Promise.all([
            router.openRouteByName('home'),
            router.openRouteByName('home')
        ])).rejects.toThrow();
    });

});