import {RouteChunk} from './route-chunk';

export type RouteHandler<P = any, C extends RouteChunk = any> = (params: P) => Partial<C> | Promise<Partial<C>>;