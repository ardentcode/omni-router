import {RouteName} from '../../types';

export interface RedirectRouteData<M = any, N extends RouteName<M> = RouteName<M>> {
    redirect: {
        path?: string;
        name?: void;
        params?: M[N];
    } | {
        path?: void;
        name?: N;
        params?: M[N];
    };
}