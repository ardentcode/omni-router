import {GetRouteEndEvent} from './get-route-end-event';
import {GetRouteStartEvent} from './get-route-start-event';
import {OpenRouteEndEvent} from './open-route-end-event';
import {OpenRouteRedirectEvent} from './open-route-redirect-event';
import {OpenRouteStartEvent} from './open-route-start-event';
import {RouteData} from './route-data';

export interface RouteProcessor<D extends RouteData = RouteData> {
    onGetRouteStart?: (event: GetRouteStartEvent) => void | Promise<void>;
    onGetRouteEnd?: (event: GetRouteEndEvent) => void | Promise<void>;
    onOpenRouteStart?: (event: OpenRouteStartEvent) => void | Promise<void>;
    onOpenRouteEnd?: (event: OpenRouteEndEvent<D>) => void | Promise<void>;
    onOpenRouteRedirect?: (event: OpenRouteRedirectEvent<D>) => void | Promise<void>;
}