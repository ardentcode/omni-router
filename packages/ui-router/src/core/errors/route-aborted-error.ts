import {Route} from '../route';

export const ROUTE_ABORTED_ERROR_CODE = 'ROUTE_ABORTED';

export interface RouteAbortedErrorDetails {
    route?: Route;
}

export class RouteAbortedError extends Error {

    code = ROUTE_ABORTED_ERROR_CODE;

    route: Route;

    constructor(message: string, details: RouteAbortedErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}