import {RouteHandler} from './route-handler';

export interface RouteDeclaration<P = any> {
    name: string;
    path: string;
    handler: RouteHandler<P>;
}