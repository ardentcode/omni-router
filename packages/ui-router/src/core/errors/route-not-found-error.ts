export const ROUTE_NOT_FOUND_ERROR_CODE = 'ROUTE_NOT_FOUND';

export interface RouteNotFoundErrorDetails {
    name?: string;
    path?: string;
}

export class RouteNotFoundError extends Error {

    code = ROUTE_NOT_FOUND_ERROR_CODE;

    name: string;

    path: string;

    constructor(message: string, details: RouteNotFoundErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}