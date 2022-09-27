import {RouteIdentity} from '../route-identity';
import {RouteName} from '../route-name';

export interface RedirectRouteChunk<M = any, N extends RouteName<M> = RouteName<M>> {
    redirect: string | RouteIdentity<M, N>;
}

