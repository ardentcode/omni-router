import {RouteProcessor} from '../route-processor';
import {Router} from '../router';
import {RedirectRouteData} from './redirect-route-data';

export function createRedirectRouteProcessor<M = any>(): RouteProcessor<RedirectRouteData<M>> {
    return {
        async process<P>(router: Router<M>, {redirect}: Partial<RedirectRouteData<M>>): Promise<void> {
            if (!redirect) {
                return;
            }
            if (typeof redirect === 'string') {
                await router.openRouteByPath(redirect, {isRedirection: true});
            } else {
                await router.openRouteByName(redirect.name, redirect.params as any, {isRedirection: true});
            }
        }
    };
}
