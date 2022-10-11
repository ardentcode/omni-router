import {RouteHandler} from './route-handler';

export interface RouteDeclaration<M = any, N extends keyof M & string = keyof M & string> {
    name: N;
    path: string;
    handler: RouteHandler<M[N]>;
}