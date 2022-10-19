import {LazyRouteHandler, RouteHandler} from './route-handler';

export type RouteDeclaration<P = unknown, D = unknown> = {
    name: string;
    path: string;
    handler: RouteHandler<P, D> | LazyRouteHandler<P, D>;
}