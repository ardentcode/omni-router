import {RouteName} from '../../types';

export interface RedirectRouteData<M = any, N extends RouteName<M> = RouteName<M>> {
    redirect: {
        path?: string;
        name?: N;
        params?: M[N];
    };
}