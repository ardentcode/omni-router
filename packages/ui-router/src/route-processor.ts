import {RouteData} from './route-data';
import {RouteInfo} from './route-info';
import {Router} from './router';

export interface RouteProcessor<D extends RouteData = RouteData> {
    process?: (router: Router, data: Partial<D>, info: RouteInfo) => void | Promise<void>;
}
