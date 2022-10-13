import {Router} from 'ui-router';
import {createErrorRouteProcessor, createLoadingIndicatorRouteProcessor} from './client';
import {AppRouteData, AppRoutes, createAppRouter, INFO_ID} from './common';
import './common/page-template';
import './common/reset.css';
import {getReactRoot} from './client/getReactRoot';
import {createReactRouteProcessor} from './client/react-route-processor';

declare global {
    interface Window {
        router: Router<AppRoutes, AppRouteData>;
    }
}

async function main() {
    const router = createAppRouter();

    const reactRoot = getReactRoot();
    router.registerProcessor(createErrorRouteProcessor({reactRoot}));
    router.registerProcessor(createReactRouteProcessor({
        reactRoot,
        fragmentsIds: {
            info: INFO_ID
        }
    }));
    router.registerProcessor(createLoadingIndicatorRouteProcessor());
    window.router = router;
    await router.openRouteByPath(window.location.pathname + window.location.search);
}

main();
