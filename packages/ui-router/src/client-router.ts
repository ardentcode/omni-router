import {Route} from './route';
import {createRouter, Router, RouterOptions} from './router';

export interface ClientRouterOptions extends RouterOptions {

}

const NAVIGATION_FROM_ROUTER = Symbol('Navigation From Router');

export function createClientRouter<M = any>({...deps}: ClientRouterOptions = {}): Router<M> {

    const router = createRouter<M>(deps);
    const originalOpenRouteByPath = router.openRouteByPath;
    const originalOpenRouteByName = router.openRouteByName;

    router.openRouteByPath = async (path: string): Promise<Route<M>> => {
        const route = await originalOpenRouteByPath(path);
        if (route) {
            window.navigation.navigate(route.path, {
                info: NAVIGATION_FROM_ROUTER
            });
        }
        return route as Route<M>;
    };

    router.openRouteByName = async <N extends keyof M & string>(name: N, params: M[N] = {} as M[N]): Promise<Route<M>> => {
        const route = await originalOpenRouteByName(name, params);
        if (route) {
            window.navigation.navigate(route.path, {
                info: NAVIGATION_FROM_ROUTER
            });
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