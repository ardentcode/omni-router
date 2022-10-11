import {Router} from '../router';
import {Route} from './route';

export interface GetRouteEndEvent {
    router: Router;
    route: Route<{}>;
}