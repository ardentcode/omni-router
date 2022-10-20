import {RouteProcessor} from '../../core';
import {RedirectRouteData} from './redirect-route-data';
import {RedirectRouteProcessorOptions} from './redirect-route-processor';

export function createRedirectRouteProcessor<M = any>({}: RedirectRouteProcessorOptions = {}): RouteProcessor<RedirectRouteData<M>> {
    return {
        async onOpenRouteSuccess({router, route}): Promise<void> {
            if (!route.data.redirect) {
                return;
            }
            if (route.data.redirect.path) {
                await router.openRouteByPath(route.data.redirect.path, route.data.redirect.params, {
                    replace: true
                });
            } else if (route.data.redirect.name) {
                await router.openRouteByName(route.data.redirect.name, route.data.redirect.params, {
                    replace: true
                });
            }
        }
    };
}