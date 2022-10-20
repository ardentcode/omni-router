import {Router} from 'ui-router';
import {createLoadingIndicatorRouteProcessor, createReactRouteProcessor} from './client';
import {APP_ID, AppRouteData, AppRoutes, createAppRouter, ErrorModalTemplate} from './common';
import './common/render-html';
import './common/reset.css';
import {createRoot} from 'react-dom/client';

declare global {
    interface Window {
        router: Router<AppRoutes, AppRouteData>;
    }
}

async function main() {
    const router = createAppRouter();
    router.registerProcessor(getReactRouteProcessor());
    router.registerProcessor(createLoadingIndicatorRouteProcessor());
    window.router = router;
    await router.openRouteByPath(window.location.pathname + window.location.search);
}

main();

function getReactRouteProcessor() {
    const reactRoot = getReactRoot();
    const renderErrorComponentFn = (error: Error) => <ErrorModalTemplate error={error}/>;
    return createReactRouteProcessor({reactRoot, renderErrorComponentFn});
}

function getReactRoot() {
    const rootElement = document.getElementById(APP_ID);
    if (!rootElement) {
        throw new Error(`Root element #${APP_ID} was not found`);
    }
    return createRoot(rootElement!);
}