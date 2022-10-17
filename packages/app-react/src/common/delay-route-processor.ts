import {RouteProcessor} from 'ui-router';

export interface DelayRouteProcessorOptions {
    ms: number;
}

export function createDelayRouteProcessor({ms}: DelayRouteProcessorOptions): RouteProcessor {
    return {
        async onOpenRouteStart() {
            await new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
    };
}