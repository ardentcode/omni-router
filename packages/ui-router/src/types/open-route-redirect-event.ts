import {Router} from '../router';
import {Route} from './route';

export interface OpenRouteRedirectEvent<D = any> {
    router: Router;
    route: Route<any, D>;
}