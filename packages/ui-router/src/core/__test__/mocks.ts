import {jest} from '@jest/globals';
import {Mocked} from 'jest-mock';
import {RouteDeclaration, RouteProcessor} from '../route';

export function createRouteDeclarationMock(name: string, path: string): Mocked<RouteDeclaration<any>> {
    return {
        name,
        path,
        handler: jest.fn<any>(() => ({}))
    };
}

export function createLazyRouteDeclarationMock(name: string, path: string): Mocked<RouteDeclaration<any>> {
    return {
        name,
        path,
        handler: {
            lazy: jest.fn<any>(async () => {
                await new Promise(resolve => setTimeout(resolve));
                return () => ({});
            })
        }
    };
}

export function createProcessorMock(): RouteProcessor {
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