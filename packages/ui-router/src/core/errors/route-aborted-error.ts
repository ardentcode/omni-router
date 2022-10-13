import {Route} from '../route';

export interface RouteAbortedErrorDetails {
    route?: Route;
}

export class RouteAbortedError extends Error {

    route: Route;

    constructor(message: string, details: RouteAbortedErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}