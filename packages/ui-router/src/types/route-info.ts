import {Router} from '../router';

export interface RouteInfo {
    router: Router;
    signal: AbortSignal;
}