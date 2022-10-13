import {Router} from '../router';
import {RouteDeclaration} from './route-declaration';

export interface GetRouteStartEvent {
    router: Router;
    declaration: RouteDeclaration;
}