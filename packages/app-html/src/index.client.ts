import {Router} from 'ui-router';
import {createErrorRouteProcessor, createLoadingIndicatorRouteProcessor} from './client';
import {APP_ID, AppRouteData, AppRoutes, createAppRouter} from './common';
import './common/page-template';
import './common/reset.css';

declare global {
    interface Window {
        router: Router<AppRoutes, AppRouteData>;
    }
}

async function main() {
    const router = createAppRouter();
    router.registerProcessor(createErrorRouteProcessor({rootId: APP_ID}));
    router.registerProcessor(createLoadingIndicatorRouteProcessor());
    window.router = router;
    await router.openRouteByPath(window.location.pathname + window.location.search);
}

main();