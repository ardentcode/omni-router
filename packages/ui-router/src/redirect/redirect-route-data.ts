import {RouteIdentity} from '../route-identity';
import {RouteName} from '../route-name';

export interface RedirectRouteData<M = any, N extends RouteName<M> = RouteName<M>> {
    redirect: string | RouteIdentity<M, N>;
}