import {RouteInfo} from './route-info';

export type RouteHandler<P = unknown, D = unknown> = (params: P, info: RouteInfo) => Partial<D> | Promise<Partial<D>>;

export type LazyRouteHandler<P = unknown, D = unknown> = {
    lazy: () => Promise<RouteHandler<P, D>>;
};