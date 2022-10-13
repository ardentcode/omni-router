import {Router} from '../router';
import {Route} from './route';

export interface OpenRouteEndEvent<D = any> {
    router: Router;
    route: Route<any, D>;
    signal: AbortSignal;
}