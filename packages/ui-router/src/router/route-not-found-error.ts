export interface RouteNotFoundErrorDetails {
    name?: string;
    path?: string;
}

export class RouteNotFoundError extends Error {

    name: string;

    path: string;

    constructor(message: string, details: RouteNotFoundErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}