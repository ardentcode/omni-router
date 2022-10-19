import {Route, RouteDeclaration, RouteProcessor} from '../route';
import {PathParser, RouteDeclarationRepository, RouteFactory, RouteProcessorRunner} from '../utils';
import {createBaseRouter} from './router.base';

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
    routeDeclarationRepository?: RouteDeclarationRepository;
    routeFactory?: RouteFactory;
    routeProcessorRunner?: RouteProcessorRunner;
}

export interface OpenRouteOptions {
    replace?: boolean;
}

export function createRouter<M = any, D = any>(options: RouterOptions = {}): Router<M, D> {
    return createBaseRouter(options);
}
