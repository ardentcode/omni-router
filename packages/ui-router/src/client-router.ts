import {Route} from './route';
import {createRouter, Router, RouterOptions} from './router';
import {RouteOptions} from './types/route-options';

export interface ClientRouterOptions extends RouterOptions {

}

const NAVIGATION_FROM_ROUTER = Symbol('Navigation From Router');

export function createClientRouter<M = any>({...deps}: ClientRouterOptions = {}): Router<M> {

    const router = createRouter<M>(deps);
    const originalOpenRouteByPath = router.openRouteByPath;
    const originalOpenRouteByName = router.openRouteByName;

    router.openRouteByPath = async (path: string, options?: RouteOptions): Promise<Route<M>> => {
        const route = await originalOpenRouteByPath(path);
        if (route) {
            const navigateOptions: NavigationNavigateOptions = {
                info: NAVIGATION_FROM_ROUTER
            };
            if (options?.isRedirection) {
                navigateOptions.history = 'replace';
            }
            window.navigation.navigate(route.path, navigateOptions);
        }
        return route as Route<M>;
    };

    router.openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N], options: RouteOptions = {}): Promise<Route<M>> => {
        const route = await originalOpenRouteByName(name, params);
        if (route) {
            const navigateOptions: NavigationNavigateOptions = {
                info: NAVIGATION_FROM_ROUTER
            };
            if (options.isRedirection) {
                navigateOptions.history = 'replace';
            }

            window.navigation.navigate(route.path, navigateOptions);
        }
        return route as Route<M>;
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
                    const path = new URL(event.destination.url).pathname;
                    await originalOpenRouteByPath(path);
                }
            });
        }
    });

    return router;

}
