import {RouteProcessor} from '../../types';
import {RedirectRouteData} from './redirect-route-data';

export function createRedirectRouteProcessor<M = any>(): RouteProcessor<RedirectRouteData<M>> {
    return {
        async onOpenRouteRedirect({router, route}): Promise<void> {
            if (typeof window === 'undefined' || !route.data.redirect) {
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