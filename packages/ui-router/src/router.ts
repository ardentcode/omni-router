import {Route} from './route';
import {RouteData} from './route-data';
import {RouteDeclaration} from './route-declaration';
import {RouteInfo} from './route-info';
import {RouteProcessor} from './route-processor';
import {RouteOptions} from './types/route-options';

export interface Router<M = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    registerRoute: (declaration: RouteDeclaration<M>) => void;
    getCurrentRoute: () => Route<M> | null;
    getRouteByPath: (path: string) => Promise<Route<M> | null>;
    getRouteByName: <N extends keyof M & string>(name: N, params?: M[N]) => Promise<Route<M> | null>;
    openRouteByPath: (path: string, options?: RouteOptions) => Promise<Route<M>>;
    openRouteByName: <N extends keyof M & string>(name: N, params?: M[N], options?: RouteOptions) => Promise<Route<M>>;
}

export interface RouterOptions {

}

export function createRouter<M = any>({}: RouterOptions = {}): Router<M> {

    const processors: Set<RouteProcessor> = new Set();
    const declarations: Map<string, RouteDeclaration<M>> = new Map();
    let currentRoute: Route<M> | null = null;
    let abortController: AbortController | null = null;

    const registerProcessor = (processor: RouteProcessor): void => {
        processors.add(processor);
    };

    const registerRoute = (declaration: RouteDeclaration<M>): void => {
        declarations.set(declaration.name, declaration);
    };

    const getCurrentRoute = (): Route<M> | null => {
        return currentRoute;
    };

    const getRouteByPath = async (path: string): Promise<Route<M> | null> => {
        const declaration = getRouteDeclarationByPath(path);
        if (!declaration) {
            return null;
        }
        return await resolveRoute(declaration, path);
    };

    const getRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Promise<Route<M> | null> => {
        const declaration = declarations.get(name);
        if (!declaration) {
            return null;
        }
        const path = buildPathWithParams(declaration.path, params as any);
        return await resolveRoute(declaration, path);
    };

    const openRouteByPath = async (path: string): Promise<Route<M>> => {
        const signal = startLoadingRoute();
        const declaration = getRouteDeclarationByPath(path);
        if (!declaration) {
            throw new Error(`Route with path "${path}" not found`);
        }
        const params = {signal};
        const newRoute = await resolveRoute(declaration, path, params);
        await runProcessors(newRoute.data, params);
        finishLoadingRoute(newRoute, signal);
        // return newRoute;
        return currentRoute as Route<M>;
    };

    const openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Promise<Route<M>> => {
        const signal = startLoadingRoute();
        const declaration = declarations.get(name);
        if (!declaration) {
            throw new Error(`Route with name "${name}" not found`);
        }
        const info = {signal};
        const path = buildPathWithParams(declaration.path, params as any);
        const newRoute = await resolveRoute(declaration, path, info);
        await runProcessors(newRoute.data, {signal});
        finishLoadingRoute(newRoute, signal);
        // return newRoute;
        return currentRoute as Route<M>;
    };

    const startLoadingRoute = () => {
        abortController?.abort();
        abortController = new AbortController();
        return abortController.signal;
    };

    const finishLoadingRoute = (newRoute: Route<M>, signal: AbortSignal) => {
        if (signal.aborted) {
            // throw new Error('Route has been aborted');
        } else {
            currentRoute = newRoute;
        }
    };

    const getRouteDeclarationByPath = (path: string): RouteDeclaration<M> | null => {
        return Array.from(declarations.values()).find((declaration: RouteDeclaration): boolean => {
            const urlPattern = new URLPattern({pathname: declaration.path});
            return urlPattern.test({pathname: path});
        }) ?? null;
    };

    const resolveRoute = async (declaration: RouteDeclaration<M>, path: string, info?: RouteInfo): Promise<Route<M>> => {
        const params = extractParamsFromPath(declaration.path, path);
        const data = info ? await declaration.handler(params, info) : {};
        return {
            name: declaration.name,
            path,
            params,
            data
        };
    };

    const extractParamsFromPath = <P = any>(pattern: string, path: string): P => {
        const urlPattern = new URLPattern({pathname: pattern});
        const urlMatch = urlPattern.exec({pathname: path});
        return (urlMatch?.pathname.groups ?? {}) as P;
    };

    const buildPathWithParams = (path: string, params: Record<string, string> = {}): string => {
        return Object.entries(params).reduce((path: string, [name, value]: [string, string]): string => {
            return path.replace(`:${name}`, value);
        }, path);
    };

    const runProcessors = async (data: RouteData, info: RouteInfo): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.process?.(router, data, info);
        }));
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
