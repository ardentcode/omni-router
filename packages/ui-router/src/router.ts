import {Route} from './route';
import {RouteDeclaration} from './route-declaration';
import {RouteProcessor} from './route-processor';
import {createRouteUrlParser, RouteUrlParser} from './route-url-parser';

export interface Router<M = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    registerRoute: (declaration: RouteDeclaration) => void;
    getCurrentRoute: () => Route | null;
    openPath: (path: string) => Promise<void>;
    openRoute: <N extends keyof M & string>(name: N, ...params: {} extends M[N] ? [] : [M[N]]) => Promise<void>;
}

export interface RouterDeps {
    routeUrlParser?: RouteUrlParser;
}

export function createRouter<M = any>({
    routeUrlParser = createRouteUrlParser()
}: RouterDeps = {}): Router<M> {

    const processors: Set<RouteProcessor> = new Set();
    const routes: Map<string, RouteDeclaration> = new Map();
    let currentRoute: Route | null = null;

    const registerProcessor = (processor: RouteProcessor): void => {
        processors.add(processor);
    };

    const registerRoute = (declaration: RouteDeclaration): void => {
        routes.set(declaration.name, declaration);
    };

    const getCurrentRoute = (): Route | null => {
        return currentRoute;
    };

    const openPath = async (path: string): Promise<void> => {
        const route = getRouteByPath(path);
        if (route) {
            // TODO
        }
    };

    const openRoute = async <N extends keyof M & string>(name: N, ...params: {} extends M[N] ? [] : [M[N]]): Promise<void> => {
        const route = routes.get(name);
        if (route) {
            const chunk = await route.handler(params);
            await Promise.all(Array.from(processors).map((processor) => {
                // TODO: fix typings
                // @ts-ignore
                return processor.process(router, chunk);
            }));
            // currentRoute = route;
        }
    };

    const getRouteByPath = (_path: string): RouteDeclaration | null => {
        // TODO
        return null;
    };

    const router = {
        registerProcessor,
        registerRoute,
        getCurrentRoute,
        openPath,
        openRoute
    };

    return router;

}