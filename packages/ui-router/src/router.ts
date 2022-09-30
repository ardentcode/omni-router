import {Route} from './route';
import {RouteChunk} from './route-chunk';
import {RouteDeclaration} from './route-declaration';
import {RouteProcessor} from './route-processor';
import {RouterEvent} from './router-event';
import {RouterListener} from './router-listener';

export interface Router<M = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    registerRoute: (declaration: RouteDeclaration<M>) => void;
    getCurrentRoute: () => Route<M> | null;
    openPath: (path: string) => Promise<Route<M> | null>;
    openRoute: <N extends keyof M & string>(name: N, params?: M[N]) => Promise<Route<M> | null>;
    addListener: (listener: RouterListener<M>) => void;
    removeListener: (listener: RouterListener<M>) => void;
}

export interface RouterOptions {

}

export function createRouter<M = any>({}: RouterOptions = {}): Router<M> {

    const processors: Set<RouteProcessor> = new Set();
    const declarations: Map<string, RouteDeclaration<M>> = new Map();
    const listeners: Set<RouterListener<M>> = new Set();
    let currentRoute: Route<M> | null = null;

    const registerProcessor = (processor: RouteProcessor): void => {
        processors.add(processor);
    };

    const registerRoute = (declaration: RouteDeclaration<M>): void => {
        declarations.set(declaration.name, declaration);
    };

    const getCurrentRoute = (): Route<M> | null => {
        return currentRoute;
    };

    const openPath = async (path: string): Promise<Route<M> | null> => {
        const declaration = getRouteDeclarationByPath(path);
        if (!declaration) {
            return null;
        }
        if (path === currentRoute?.path) {
            return currentRoute;
        }
        const newRoute = await openRouteDeclaration(declaration, path);
        runListeners({
            router,
            currentRoute,
            newRoute
        });
        currentRoute = newRoute;
        return newRoute;
    };

    const openRoute = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Promise<Route<M> | null> => {
        const declaration = declarations.get(name);
        if (!declaration) {
            return null;
        }
        const path = resolvePath(declaration.path, params as any);
        if (path === currentRoute?.path) {
            return currentRoute;
        }
        const newRoute = await openRouteDeclaration(declaration, path);
        runListeners({
            router,
            currentRoute,
            newRoute
        });
        currentRoute = newRoute;
        return newRoute;
    };

    const addListener = (listener: RouterListener): void => {
        listeners.add(listener);
    };

    const removeListener = (listener: RouterListener): void => {
        listeners.delete(listener);
    };

    const runListeners = (event: RouterEvent<M>): void => {
        listeners.forEach((listener: RouterListener): void => {
            listener(event);
        });
    };

    const getRouteDeclarationByPath = (path: string): RouteDeclaration<M> | null => {
        return Array.from(declarations.values()).find((declaration: RouteDeclaration): boolean => {
            const urlPattern = new URLPattern({pathname: declaration.path});
            return urlPattern.test({pathname: path});
        }) ?? null;
    };

    const openRouteDeclaration = async (declaration: RouteDeclaration<M>, path: string): Promise<Route<M>> => {
        const params = getParamsFromPath(declaration.path, path);
        const data = await declaration.handler(params);
        await runProcessors(data);
        return {
            name: declaration.name,
            path,
            params,
            data
        };
    };

    const getParamsFromPath = <P = any>(pattern: string, path: string): P => {
        const urlPattern = new URLPattern({pathname: pattern});
        const urlMatch = urlPattern.exec({pathname: path});
        return (urlMatch?.pathname.groups ?? {}) as P;
    };

    const resolvePath = (path: string, params: Record<string, string> = {}): string => {
        return Object.entries(params).reduce((path: string, [name, value]: [string, string]): string => {
            return path.replace(`:${name}`, value);
        }, path);
    };

    const runProcessors = async (data: RouteChunk): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.process?.(router, data);
        }));
    };

    const router: Router<M> = {
        registerProcessor,
        registerRoute,
        getCurrentRoute,
        openPath,
        openRoute,
        addListener,
        removeListener
    };

    return router;

}