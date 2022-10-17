import {GetRouteEndEvent, GetRouteStartEvent, OpenRouteAbortEvent, OpenRouteEndEvent, OpenRouteErrorEvent, OpenRouteStartEvent, OpenRouteSuccessEvent} from './route-processor-events';

export interface RouteProcessor<D = any> {
    onGetRouteStart?: (event: GetRouteStartEvent) => void | Promise<void>;
    onGetRouteEnd?: (event: GetRouteEndEvent) => void | Promise<void>;
    onOpenRouteStart?: (event: OpenRouteStartEvent) => void | Promise<void>;
    onOpenRouteEnd?: (event: OpenRouteEndEvent<D>) => void | Promise<void>;
    onOpenRouteSuccess?: (event: OpenRouteSuccessEvent<D>) => void | Promise<void>;
    onOpenRouteError?: (event: OpenRouteErrorEvent<D>) => void | Promise<void>;
    onOpenRouteAbort?: (event: OpenRouteAbortEvent<D>) => void | Promise<void>;
}