import {HandlerNotFoundError} from '../errors';
import {Route, RouteDeclaration, RouteHandler, RouteInfo} from '../route';
import {createPathParser, PathParser} from './path-parser';

export interface RouteFactory<D = any> {
    createRoute: <P = unknown>(declaration: RouteDeclaration<P, D>, path: string) => Route<P, null>;
    handleRoute: <P = unknown>(declaration: RouteDeclaration<P, D>, route: Route<P, null>, info: RouteInfo) => Promise<Route<P, D>>;
}

export interface RouteFactoryOptions {
    pathParser?: PathParser;
}

export function createRouteFactory<D = unknown>({
    pathParser = createPathParser()
}: RouteFactoryOptions = {}): RouteFactory<D> {

    let routeHandlers: Map<RouteDeclaration<any, D>, RouteHandler<any, D>> = new Map();

    const createRoute = <P = unknown>(declaration: RouteDeclaration<P, D>, path: string): Route<P, null> => {
        return decorateRoute<P, null>({
            name: declaration.name,
            path,
            params: pathParser.extractParamsFromPath<P>(declaration.path, path),
            data: null
        });
    };

    const handleRoute = async <P = unknown>(declaration: RouteDeclaration<P, D>, route: Route<P, null>, info: RouteInfo): Promise<Route<P, D>> => {
        const handler = await getRouteHandler(declaration);
        const data = await handler(route.params, info);
        return decorateRoute({
            ...route,
            data
        });
    };

    const decorateRoute = <P = unknown, D = unknown>(route: Route<P, D>): Route<P, D> => {
        Object.defineProperty(route, Symbol.toPrimitive, {
            enumerable: false,
            value: () => route.path
        });
        return route;
    };

    const getRouteHandler = async <P = unknown>(declaration: RouteDeclaration<P, D>): Promise<RouteHandler<P, D>> => {
        let handler = routeHandlers.get(declaration);
        if (!handler && declaration.handler && typeof declaration.handler === 'function') {
            handler = declaration.handler;
        }
        if (!handler && declaration.handler && typeof declaration.handler === 'object' && 'lazy' in declaration.handler) {
            handler = await declaration.handler.lazy();
        }
        if (typeof handler !== 'function') {
            const handlerType = handler === null ? 'null' : typeof handler;
            throw new HandlerNotFoundError(`Handler for route "${declaration.name}" is not a function (${handlerType})`, {
                name: declaration.name
            });
        }
        routeHandlers.set(declaration, handler);
        return handler;
    };

    return {
        createRoute,
        handleRoute
    };

}