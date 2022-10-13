import {HandlerNotFoundError, RouteAbortedError, RouteNotFoundError} from '../errors';
import {Route, RouteDeclaration, RouteHandler, RouteInfo, RouteProcessor} from '../route';
import {createPathParser, createRouteDeclarationRepository, createRouteProcessorRunner, PathParser, RouteDeclarationRepository, RouteProcessorRunner} from '../utils';

export interface Router<M = any, D = any> {
    registerProcessor: (processor: RouteProcessor<D>) => void;
    registerRoute: (declaration: RouteDeclaration<M[keyof M], D>) => void;
    getRoutes: () => RouteDeclaration<M[keyof M], D>[];
    getCurrentRoute: () => Route<M[keyof M], D>;
    getLoadingRoute: () => Route<M[keyof M], null> | null;
    getRouteByPath: <N extends keyof M & string>(path: string, params?: M[N]) => Route<M[N], D> | null;
    getRouteByName: <N extends keyof M & string>(name: N, params?: M[N]) => Route<M[N], D>;
    openRouteByPath: <N extends keyof M & string>(path: string, params?: M[N], options?: OpenRouteOptions) => Promise<Route<M[N], D>>;
    openRouteByName: <N extends keyof M & string>(name: N, params?: M[N], options?: OpenRouteOptions) => Promise<Route<M[N], D>>;
}

export interface RouterOptions {
    pathParser?: PathParser;
    routeProcessorRunner?: RouteProcessorRunner;
    routeDeclarationRepository?: RouteDeclarationRepository;
}

export interface OpenRouteOptions {
    replace?: boolean;
}

export function createRouter<M = any, D = any>({
    pathParser = createPathParser(),
    routeProcessorRunner = createRouteProcessorRunner(),
    routeDeclarationRepository = createRouteDeclarationRepository()
}: RouterOptions = {}): Router<M, D> {

    let loadingRoute: Route<any, null> | null = null;
    let currentRoute: Route<any, D> | null = null;
    let abortController: AbortController | null = null;
    let routeHandlers: Map<RouteDeclaration<any, D>, RouteHandler<any, D>> = new Map();

    const registerProcessor = (processor: RouteProcessor<D>): void => {
        routeProcessorRunner.registerProcessor(processor);
    };

    const registerRoute = (declaration: RouteDeclaration<M[keyof M], D>): void => {
        routeDeclarationRepository.registerRouteDeclaration(declaration);
    };

    const getRoutes = (): RouteDeclaration<M[keyof M], D>[] => {
        return routeDeclarationRepository.getRouteDeclarations();
    };

    const getCurrentRoute = (): Route<M[keyof M], D> => {
        if (!currentRoute) {
            throw new RouteNotFoundError('Current route not found', {});
        }
        return currentRoute;
    };

    const getLoadingRoute = (): Route<M[keyof M], null> | null => {
        return loadingRoute;
    };

    const getRouteByPath = <N extends keyof M & string>(path: string, params: M[N] = {} as M[N]): Route<M[N], null> | null => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByPath<M[N], D>(path);
        if (!declaration) {
            return null;
        }
        const defaultParams = pathParser?.extractParamsFromPath<M[N]>(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        return resolveRoute(declaration, pathWithParams);
    };

    const getRouteByName = <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Route<M[N], null> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName<M[N], D>(name);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with name "${name}" not found`, {name});
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params);
        return resolveRoute(declaration, pathWithParams);
    };

    const openRouteByPath = async <N extends keyof M & string>(path: string, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByPath<M[N], D>(path);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with path "${path}" not found`, {path});
        }
        const defaultParams = pathParser?.extractParamsFromPath<M[N]>(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        const route = await resolveRoute(declaration, pathWithParams);
        return await openRoute(declaration, route);
    };

    const openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName<M[N], D>(name);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with name "${name}" not found`, {name});
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params);
        const route = await resolveRoute(declaration, pathWithParams);
        return await openRoute(declaration, route);
    };

    const openRoute = async <P = unknown>(declaration: RouteDeclaration<P, D>, route: Route<P, null>): Promise<Route<P, D>> => {
        const signal = await startLoadingRoute(route);
        await routeProcessorRunner.runOnOpenRouteStart({router, route, signal});
        await checkLoadingRoute(route, signal);
        const handledRoute = await handleRoute(declaration, route, {router, signal});
        await checkLoadingRoute(route, signal);
        await routeProcessorRunner.runOnOpenRouteEnd({router, route: handledRoute, signal});
        await checkLoadingRoute(route, signal);
        await finishLoadingRoute(handledRoute);
        await routeProcessorRunner.runOnOpenRouteSuccess({router, route: handledRoute});
        return handledRoute;
    };

    const resolveRoute = <P = unknown>(declaration: RouteDeclaration<P, D>, path: string): Route<P, null> => {
        routeProcessorRunner.runOnGetRouteStart({router, declaration});
        const route = decorateRoute<P, null>({
            name: declaration.name,
            path,
            params: pathParser.extractParamsFromPath<P>(declaration.path, path),
            data: null
        });
        routeProcessorRunner?.runOnGetRouteEnd({router, route});
        return route;
    };

    const handleRoute = async <P = unknown>(declaration: RouteDeclaration<P, D>, route: Route<P, null>, info: RouteInfo): Promise<Route<P, D>> => {
        try {
            const handler = await getRouteHandler(declaration);
            const data = await handler!(route.params, info);
            return decorateRoute({
                ...route,
                data
            });
        } catch (error) {
            loadingRoute = null;
            await checkLoadingRoute(route, info.signal);
            await routeProcessorRunner.runOnOpenRouteError({router, route, error});
            throw error;
        }
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
        if (!handler) {
            throw new HandlerNotFoundError(`Handler for route "${declaration.name}" not found`, {name: declaration.name});
        }
        routeHandlers.set(declaration, handler);
        return handler;
    };

    const startLoadingRoute = async (route: Route<unknown, null>): Promise<AbortSignal> => {
        loadingRoute = route;
        abortController?.abort();
        abortController = new AbortController();
        return abortController.signal;
    };

    const checkLoadingRoute = async (route: Route<unknown, null>, signal: AbortSignal): Promise<void> => {
        if (signal.aborted) {
            loadingRoute = null;
            await routeProcessorRunner.runOnOpenRouteAbort({router, route});
            throw new RouteAbortedError(`Route "${route.name}" has been aborted`, {route});
        }
    };

    const finishLoadingRoute = async (route: Route<unknown, D>): Promise<void> => {
        currentRoute = route;
        loadingRoute = null;
    };

    const router: Router<M> = {
        registerProcessor,
        registerRoute,
        getRoutes,
        getCurrentRoute,
        getLoadingRoute,
        getRouteByPath,
        getRouteByName,
        openRouteByPath,
        openRouteByName
    };

    return router;

}
