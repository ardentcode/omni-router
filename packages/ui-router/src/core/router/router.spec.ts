import {describe, expect, it, jest} from '@jest/globals';
import '../../polyfills';
import {RouteDeclaration, RouteProcessor} from '../route';
import {createRouter} from './router';

interface TestRoutes {
    'home': HomeRouteParams;
    'post': PostRouteParams;
    'lazy': LazyRouteParams;
}

interface HomeRouteParams {

}

interface PostRouteParams {
    id: string;
}

interface LazyRouteParams {

}

function createHomeRoute(): RouteDeclaration<HomeRouteParams> {
    return {
        name: 'home',
        path: '/',
        handler: jest.fn<any>(() => ({}))
    };
}

function createPostRoute(): RouteDeclaration<PostRouteParams> {
    return {
        name: 'post',
        path: '/post/:id',
        handler: jest.fn<any>(() => ({}))
    };
}

function createMockProcessor(): RouteProcessor {
    return {
        onGetRouteStart: jest.fn<any>(),
        onGetRouteEnd: jest.fn<any>(),
        onOpenRouteStart: jest.fn<any>(),
        onOpenRouteEnd: jest.fn<any>(),
        onOpenRouteSuccess: jest.fn<any>(),
        onOpenRouteError: jest.fn<any>(),
        onOpenRouteAbort: jest.fn<any>()
    };
}

describe('getRoutes', () => {

    it('returns registered routes', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const postRoute = createPostRoute();
        router.registerRoute(homeRoute);
        router.registerRoute(postRoute);
        const routes = router.getRoutes();
        expect(routes).toEqual([homeRoute, postRoute]);
    });

});

describe('getCurrentRoute', () => {

    it('throws error if there is no current route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        expect(() => router.getCurrentRoute()).toThrow();
    });

    it('returns correct current route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        await router.openRouteByName('home');
        const currentRoute = router.getCurrentRoute();
        expect(currentRoute).not.toBeNull();
        expect(currentRoute.name).toEqual('home');
    });

});

describe('getRouteByPath', () => {

    it('returns correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = router.getRouteByPath('/');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
        expect(route?.data).toBeNull();
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
        expect(mockProcessor.onOpenRouteSuccess).not.toBeCalled();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('getRouteByName', () => {

    it('returns correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = router.getRouteByName('home');
        expect(route.name).toEqual('home');
        expect(route.path).toEqual('/');
        expect(route.data).toBeNull();
    });

    it('returns correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        const route = router.getRouteByName('post', {id: '10'});
        expect(route.name).toEqual('post');
        expect(route.path).toEqual('/post/10');
        expect(route.params).toEqual({id: '10'});
    });

    it('throws error if route is not found', async () => {
        const router = createRouter<TestRoutes>();
        expect(() => router.getRouteByName('home')).toThrow();
    });

    it('throws error if not all parameters are passed', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        expect(() => router.getRouteByName('post')).toThrow();
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
        expect(mockProcessor.onOpenRouteSuccess).not.toBeCalled();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('openRouteByPath', () => {

    it('opens correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = await router.openRouteByPath('/');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        const route = await router.openRouteByPath('/post/10');
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
    });

    it('throws error if route is not found', async () => {
        const router = createRouter<TestRoutes>();
        await expect(router.openRouteByPath('/')).rejects.toThrow();
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
        expect(mockProcessor.onOpenRouteSuccess).toBeCalled();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerRoute(homeRoute);
        router.registerProcessor(mockProcessor);
        await expect(Promise.all([
            router.openRouteByPath('/'),
            router.openRouteByPath('/')
        ])).rejects.toThrow();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).toBeCalled();
    });

    it('handles errors', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        homeRoute.handler = jest.fn(() => {
            throw new Error();
        });
        router.registerRoute(homeRoute);
        router.registerProcessor(mockProcessor);
        await expect(router.openRouteByPath('/')).rejects.toThrow();
        expect(mockProcessor.onOpenRouteError).toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

});

describe('openRouteByName', () => {

    it('opens correct route', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        router.registerRoute(homeRoute);
        const route = await router.openRouteByName('home');
        expect(route?.name).toEqual('home');
        expect(route?.path).toEqual('/');
    });

    it('opens correct route with parameters', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        const route = await router.openRouteByName('post', {id: '10'});
        expect(route?.name).toEqual('post');
        expect(route?.path).toEqual('/post/10');
        expect(route?.params).toEqual({id: '10'});
    });

    it('throws error if route is not found', async () => {
        const router = createRouter<TestRoutes>();
        await expect(router.openRouteByName('home')).rejects.toThrow();
    });

    it('throws error if not all parameters are passed', async () => {
        const router = createRouter<TestRoutes>();
        const postRoute = createPostRoute();
        router.registerRoute(postRoute);
        await expect(router.openRouteByName('post')).rejects.toThrow();
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
        expect(mockProcessor.onOpenRouteSuccess).toBeCalled();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

    it('aborts previous route if needed', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        router.registerRoute(homeRoute);
        router.registerProcessor(mockProcessor);
        await expect(Promise.all([
            router.openRouteByName('home'),
            router.openRouteByName('home')
        ])).rejects.toThrow();
        expect(mockProcessor.onOpenRouteError).not.toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).toBeCalled();
    });

    it('handles errors', async () => {
        const router = createRouter<TestRoutes>();
        const homeRoute = createHomeRoute();
        const mockProcessor = createMockProcessor();
        homeRoute.handler = jest.fn(() => {
            throw new Error();
        });
        router.registerRoute(homeRoute);
        router.registerProcessor(mockProcessor);
        await expect(router.openRouteByName('home')).rejects.toThrow();
        expect(mockProcessor.onOpenRouteError).toBeCalled();
        expect(mockProcessor.onOpenRouteAbort).not.toBeCalled();
    });

});