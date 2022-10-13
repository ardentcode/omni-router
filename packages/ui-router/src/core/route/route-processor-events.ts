import {Route, RouteDeclaration} from '../route';
import {Router} from '../router';

export interface GetRouteStartEvent {
    router: Router;
    declaration: RouteDeclaration;
}

export interface GetRouteEndEvent {
    router: Router;
    route: Route<unknown, null>;
}

export interface OpenRouteStartEvent {
    router: Router;
    route: Route<unknown, null>;
    signal: AbortSignal;
}

export interface OpenRouteEndEvent<D = unknown> {
    router: Router;
    route: Route<unknown, D>;
    signal: AbortSignal;
}

export interface OpenRouteSuccessEvent<D = unknown> {
    router: Router;
    route: Route<unknown, D>;
}

export interface OpenRouteErrorEvent<D = unknown> {
    router: Router;
    route: Route<unknown, null>;
    error: unknown;
}

export interface OpenRouteAbortEvent<D = unknown> {
    router: Router;
    route: Route<unknown, null>;
}