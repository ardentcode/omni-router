import {Route} from './route';
import {RouteChunk} from './route-chunk';
import {RouteDeclaration} from './route-declaration';
import {RouteProcessor} from './route-processor';

export interface Router<M = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    registerRoute: (declaration: RouteDeclaration) => void;
    getCurrentRoute: () => Route | null;
    openPath: (path: string) => Promise<void>;
    openRoute: <N extends keyof M & string>(name: N, ...params: {} extends M[N] ? [] : [M[N]]) => Promise<void>;
}

export interface RouterDeps {

}

const NAVIGATION_FROM_ROUTER = Symbol('Navigation From Router');

export function createRouter<M = any>({}: RouterDeps = {}): Router<M> {

    const routeProcessors: Set<RouteProcessor> = new Set();
    const routeDeclarations: Map<string, RouteDeclaration> = new Map();
    let currentRoute: Route | null = null;

    const registerProcessor = (processor: RouteProcessor): void => {
        routeProcessors.add(processor);
    };

    const registerRoute = (declaration: RouteDeclaration): void => {
        routeDeclarations.set(declaration.name, declaration);
    };

    const getCurrentRoute = (): Route | null => {
        return currentRoute;
    };

    const openPath = async (path: string): Promise<void> => {
        const routeDeclaration = getRouteDeclarationByPath(path);
        if (routeDeclaration) {
            await openRouteDeclaration(routeDeclaration, path);
            navigateToPath(path);
        }
    };

    const openRoute = async <N extends keyof M & string>(name: N, ...params: {} extends M[N] ? [] : [M[N]]): Promise<void> => {
        const routeDeclaration = routeDeclarations.get(name);
        if (routeDeclaration) {
            const path = resolvePath(routeDeclaration.path, params?.[0] ?? {});
            await openRouteDeclaration(routeDeclaration, path);
            navigateToPath(path);
        }
    };

    const getRouteDeclarationByPath = (path: string): RouteDeclaration | null => {
        return Array.from(routeDeclarations.values()).find((routeDeclaration: RouteDeclaration): boolean => {
            const urlPattern = new URLPattern({pathname: routeDeclaration.path});
            return urlPattern.test({pathname: path});
        }) ?? null;
    };

    const openRouteDeclaration = async (routeDeclaration: RouteDeclaration, path: string): Promise<void> => {
        const params = getParamsFromPath(routeDeclaration.path, path);
        const chunk = await routeDeclaration.handler(params);
        await runProcessors(chunk);
        currentRoute = {
            name: routeDeclaration.name,
            path,
            params
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

    const runProcessors = async (chunk: RouteChunk): Promise<void> => {
        await Promise.all(Array.from(routeProcessors).map((processor) => {
            // TODO: fix typings
            // @ts-ignore
            return processor.process(router, chunk);
        }));
    };

    const navigateToPath = (path: string): void => {
        window.navigation.navigate(path, {
            info: NAVIGATION_FROM_ROUTER
        });
    };
    
    window.navigation.addEventListener('navigate', async (event) => {
        if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) {
            return;
        }
        if (event.info === NAVIGATION_FROM_ROUTER) {
            event.intercept();
        } else {
            event.intercept({
                handler: async () => {
                    const path = new URL(event.destination.url).pathname;
                    const routeDeclaration = getRouteDeclarationByPath(path);
                    if (routeDeclaration) {
                        await openRouteDeclaration(routeDeclaration, path);
                    }
                }
            });
        }
    });

    const router = {
        registerProcessor,
        registerRoute,
        getCurrentRoute,
        openPath,
        openRoute
    };

    return router;

}
