import {Route, RouteDeclaration, RouteProcessor} from '../types';
import {RouteInfo} from '../types/route-info';
import {createPathParser, PathParser} from './path-parser';
import {RouteAbortedError} from './route-aborted-error';
import {createRouteDeclarationRepository, RouteDeclarationRepository} from './route-declaration-repository';
import {RouteNotFoundError} from './route-not-found-error';
import {createRouteProcessorRunner, RouteProcessorRunner} from './route-processor-runner';

export interface Router<M = any, D = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    registerRoute: (declaration: RouteDeclaration) => void;
    getCurrentRoute: () => Route<M[any], D> | null;
    getRouteByPath: <N extends keyof M & string>(path: string, params?: M[N]) => Route<M[N], D> | null;
    getRouteByName: <N extends keyof M & string>(name: N, params?: M[N]) => Route<M[N], D> | null;
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
}: RouterOptions = {}): Router<M> {

    let currentRoute: Route | null = null;
    let abortController: AbortController | null = null;

    const registerProcessor = (processor: RouteProcessor): void => {
        routeProcessorRunner.registerProcessor(processor);
    };

    const registerRoute = (declaration: RouteDeclaration): void => {
        routeDeclarationRepository.registerRouteDeclaration(declaration);
    };

    const getCurrentRoute = (): Route<M[any], D> | null => {
        return currentRoute;
    };

    const getRouteByPath = <N extends keyof M & string>(path: string, params: M[N] = {} as M[N]): Route<M[N], D> | null => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByPath(path);
        if (!declaration) {
            return null;
        }
        const defaultParams = pathParser?.extractParamsFromPath(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        routeProcessorRunner.runOnGetRouteStart({router, declaration});
        const route = resolveRoute(declaration, pathWithParams);
        if (route) {
            routeProcessorRunner.runOnGetRouteEnd({router, route});
        }
        return route;
    };

    const getRouteByName = <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Route<M[N], D> | null => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName(name);
        if (!declaration) {
            return null;
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params as any);
        routeProcessorRunner.runOnGetRouteStart({router, declaration});
        const route = resolveRoute(declaration, pathWithParams);
        if (route) {
            routeProcessorRunner.runOnGetRouteEnd({router, route});
        }
        return route;
    };

    const openRouteByPath = async <N extends keyof M & string>(path: string, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByPath(path);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with path "${path}" not found`, {path});
        }
        const defaultParams = pathParser?.extractParamsFromPath(declaration.path, path);
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, {...defaultParams, ...params});
        return await openRouteDeclaration(declaration, pathWithParams);
    };

    const openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N], _options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const declaration = routeDeclarationRepository.getRouteDeclarationByName(name);
        if (!declaration) {
            throw new RouteNotFoundError(`Route with name "${name}" not found`, {name});
        }
        const pathWithParams = pathParser.buildPathWithParams(declaration.path, params as any);
        return await openRouteDeclaration(declaration, pathWithParams);
    };

    const openRouteDeclaration = async (declaration: RouteDeclaration, path: string): Promise<Route> => {
        const signal = await startLoadingRoute();
        await routeProcessorRunner.runOnGetRouteStart({router, declaration});
        const route = await resolveRoute(declaration, path);
        await routeProcessorRunner.runOnGetRouteEnd({router, route});
        await routeProcessorRunner.runOnOpenRouteStart({router, route, signal});
        const handledRoute = await handleRoute(declaration, route, {router, signal});
        await routeProcessorRunner.runOnOpenRouteEnd({router, route: handledRoute, signal});
        await finishLoadingRoute(route, signal);
        await routeProcessorRunner.runOnOpenRouteRedirect({router, route: handledRoute});
        return handledRoute;
    };

    const startLoadingRoute = async (): Promise<AbortSignal> => {
        abortController?.abort();
        abortController = new AbortController();
        return abortController.signal;
    };

    const finishLoadingRoute = async (newRoute: Route, signal: AbortSignal): Promise<void> => {
        if (signal.aborted) {
            throw new RouteAbortedError('Route has been aborted', {route: newRoute});
        } else {
            currentRoute = newRoute;
        }
    };

    const resolveRoute = (declaration: RouteDeclaration, path: string): Route => {
        return {
            name: declaration.name,
            path,
            params: pathParser.extractParamsFromPath(declaration.path, path),
            data: {}
        };
    };

    const handleRoute = async (declaration: RouteDeclaration, route: Route, info: RouteInfo): Promise<Route> => {
        return {
            ...route,
            data: await declaration.handler(route.params, info)
        };
    };

    const router: Router<M> = {
        registerProcessor,
        registerRoute,
        getCurrentRoute,
        getRouteByPath,
        getRouteByName,
        openRouteByPath,
        openRouteByName
    };

    return router;

}
