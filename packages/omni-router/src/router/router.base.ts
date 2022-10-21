import {ROUTE_ABORTED_ERROR_CODE, RouteAbortedError, RouteNotFoundError} from '../errors';
import {Route, RouteDeclaration, RouteProcessor} from '../route';
import {createPathParser, createRouteDeclarationRepository, createRouteFactory, createRouteProcessorRunner} from '../utils';
import {OpenRouteOptions, Router, RouterOptions} from './router';

export function createBaseRouter<M = any, D = any>({
    pathParser = createPathParser(),
    routeDeclarationRepository = createRouteDeclarationRepository(),
    routeFactory = createRouteFactory(),
    routeProcessorRunner = createRouteProcessorRunner()
}: RouterOptions = {}): Router<M, D> {

    let loadingRoute: Route<any, null> | null = null;
    let currentRoute: Route<any, D> | null = null;
    let abortController: AbortController | null = null;

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
        const defaultParams = pathParser.extractParamsFromPath<M[N]>(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        return createRoute(declaration, pathWithParams);
    };

    const getRouteByName = <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Route<M[N], null> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName<M[N], D>(name);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with name "${name}" not found`, {name});
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params);
        return createRoute(declaration, pathWithParams);
    };

    const openRouteByPath = async <N extends keyof M & string>(path: string, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByPath<M[N], D>(path);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with path "${path}" not found`, {path});
        }
        const defaultParams = pathParser.extractParamsFromPath<M[N]>(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        const route = createRoute(declaration, pathWithParams);
        return await openRoute(declaration, route);
    };

    const openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName<M[N], D>(name);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with name "${name}" not found`, {name});
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params);
        const route = createRoute(declaration, pathWithParams);
        return await openRoute(declaration, route);
    };

    const openRoute = async <P = unknown>(declaration: RouteDeclaration<P, D>, route: Route<P, null>): Promise<Route<P, D>> => {
        const signal = startLoadingRoute(route);
        try {
            await routeProcessorRunner.runOnOpenRouteStart({router, route, signal});
            checkLoadingRoute(route, signal);
            const handledRoute = await routeFactory.handleRoute(declaration, route, {router, signal});
            checkLoadingRoute(route, signal);
            await routeProcessorRunner.runOnOpenRouteEnd({router, route, signal});
            checkLoadingRoute(route, signal);
            finishLoadingRoute(handledRoute);
            await routeProcessorRunner.runOnOpenRouteSuccess({router, route: handledRoute});
            return handledRoute;
        } catch (error) {
            finishLoadingRoute();
            await routeProcessorRunner.runOnOpenRouteEnd({router, route, signal});
            if (error && error.code === ROUTE_ABORTED_ERROR_CODE) {
                await routeProcessorRunner.runOnOpenRouteAbort({router, route});
            } else {
                await routeProcessorRunner.runOnOpenRouteError({router, route, error});
            }
            throw error;
        }
    };

    const createRoute = <P = unknown>(declaration: RouteDeclaration<P, D>, path: string): Route<P, null> => {
        routeProcessorRunner.runOnGetRouteStart({router, declaration});
        const route = routeFactory.createRoute(declaration, path);
        routeProcessorRunner.runOnGetRouteEnd({router, route});
        return route;
    };

    const startLoadingRoute = (route: Route<unknown, null>): AbortSignal => {
        loadingRoute = route;
        abortController?.abort();
        abortController = new AbortController();
        return abortController.signal;
    };

    const checkLoadingRoute = (route: Route<unknown, null>, signal: AbortSignal): void => {
        if (signal.aborted) {
            loadingRoute = null;
            throw new RouteAbortedError(`Route "${route.name}" has been aborted`, {route});
        }
    };

    const finishLoadingRoute = (route?: Route<unknown, D>): void => {
        loadingRoute = null;
        if (route) {
            currentRoute = route;
        }
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
