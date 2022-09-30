import {createRouter, Router, RouterOptions} from './router';
import {RouterEvent} from './router-event';

export interface ClientRouterOptions extends RouterOptions {

}

const NAVIGATION_FROM_ROUTER = Symbol('Navigation From Router');

export function createClientRouter<M = any>({...deps}: ClientRouterOptions = {}): Router<M> {

    const router = createRouter(deps);

    const registerRouterListener = (): void => {
        router.addListener((event: RouterEvent): void => {
            if (event.newRoute) {
                window.navigation.navigate(event.newRoute.path, {
                    info: NAVIGATION_FROM_ROUTER
                });
            }
        });
    };

    const registerNavigationListeners = (): void => {
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
                        await router.openPath(path);
                    }
                });
            }
        });
    };

    registerRouterListener();
    registerNavigationListeners();

    return router;

}