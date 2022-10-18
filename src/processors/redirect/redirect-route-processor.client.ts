import {RouteProcessor} from '../../core';
import {RedirectRouteData} from './redirect-route-data';
import {RedirectRouteProcessorOptions} from './redirect-route-processor';

export function createRedirectRouteProcessor({}: RedirectRouteProcessorOptions = {}): RouteProcessor<RedirectRouteData> {
    return {
        async onOpenRouteSuccess({router, route}): Promise<void> {
            if (!route.data.redirect) {
                return;
            }
            await router.openRouteByPath(route.data.redirect.path, {}, {
                replace: true
            });
        }
    };
}