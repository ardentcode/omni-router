import {RouteProcessor} from '../route-processor';
import {Router} from '../router';
import {RedirectRouteChunk} from './redirect-route-chunk';

export function createRedirectRouteProcessor<M = any>(): RouteProcessor<RedirectRouteChunk<M>> {
    return {
        async process<P>(router: Router<M>, {redirect}: Partial<RedirectRouteChunk<M>>): Promise<void> {
            if (!redirect) {
                return;
            }
            if (typeof redirect === 'string') {
                await router.openPath(redirect);
            } else {
                // TODO: fix typings
                // @ts-ignore
                await router.openRoute(redirect.name, redirect.params);
            }
        }
    };
}