import {Route} from './route';
import {Router} from './router';

export interface RouterEvent<M = any> {
    router: Router<M>;
    currentRoute: Route | null;
    newRoute: Route | null;
}