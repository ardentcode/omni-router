import {Mocked} from 'jest-mock';
import {RouteDeclaration, RouteProcessor} from '../route';

export function createRouteDeclarationMock(name: string, path: string): Mocked<RouteDeclaration> {
    return {
        name,
        path,
        handler: jest.fn(() => ({}))
    };
}

export function createLazyRouteDeclarationMock(name: string, path: string): Mocked<RouteDeclaration> {
    return {
        name,
        path,
        handler: {
            lazy: jest.fn(async () => {
                await new Promise(resolve => setTimeout(resolve));
                return () => ({});
            })
        }
    };
}

export function createProcessorMock(): RouteProcessor {
    return {
        onGetRouteStart: jest.fn(),
        onGetRouteEnd: jest.fn(),
        onOpenRouteStart: jest.fn(),
        onOpenRouteEnd: jest.fn(),
        onOpenRouteSuccess: jest.fn(),
        onOpenRouteError: jest.fn(),
        onOpenRouteAbort: jest.fn()
    };
}