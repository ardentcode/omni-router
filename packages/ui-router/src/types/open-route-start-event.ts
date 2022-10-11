import {Router} from '../router';
import {Route} from './route';

export interface OpenRouteStartEvent {
    router: Router;
    route: Route<{}>;
    signal: AbortSignal;
}