import {Route} from '../route';
import {OpenRouteOptions, Router, RouterOptions} from './router';
import {createBaseRouter} from './router.base';

const NAVIGATION_FROM_ROUTER = Symbol('Navigation From Router');

export function createRouter<M = any, D = any>(options: RouterOptions = {}): Router<M, D> {

    const router = createBaseRouter<M, D>(options);
    const originalOpenRouteByPath = router.openRouteByPath;
    const originalOpenRouteByName = router.openRouteByName;

    const navigateToPath = (path: string, options: OpenRouteOptions = {}): void => {
        window.navigation.navigate(path, {
            info: NAVIGATION_FROM_ROUTER,
            history: options.replace ? 'replace' : 'auto'
        });
    };

    router.openRouteByPath = async <N extends keyof M & string>(path: string, params: M[N] = {} as M[N], options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const route = await originalOpenRouteByPath<N>(path);
        if (route) {
            navigateToPath(route.path, options);
        }
        return route;
    };

    router.openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N], options: OpenRouteOptions = {}): Promise<Route<M[N], D>> => {
        const route = await originalOpenRouteByName<N>(name, params);
        if (route) {
            navigateToPath(route.path, options);
        }
        return route;
    };

    window.navigation.addEventListener('navigate', async (event: NavigateEvent) => {
        if (!event.canIntercept || event.hashChange || event.downloadRequest !== null) {
            return;
        }
        if (event.info === NAVIGATION_FROM_ROUTER) {
            event.intercept();
        } else {
            event.intercept({
                handler: async () => {
                    const url = new URL(event.destination.url);
                    await originalOpenRouteByPath(url.pathname + url.search);
                }
            });
        }
    });

    return router;

}
