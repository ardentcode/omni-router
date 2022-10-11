import {RouteData} from './route-data';
import {RouteInfo} from './route-info';

export type RouteHandler<P = any, D extends RouteData = any> = (params: P, info: RouteInfo) => Partial<D> | Promise<Partial<D>>;