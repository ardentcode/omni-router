import {Router} from '@ardentcode/omni-router';
import {createReactRouteProcessor} from '@ardentcode/omni-router-react';
import {ReactNode, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createLoadingIndicatorRouteProcessor} from './client';
import {APP_ID, AppRouteData, AppRoutes, createAppRouter, ErrorTemplate} from './common';
import './common/page-template.css';
import './common/reset.css';

declare global {
    interface Window {
        router: Router<AppRoutes, AppRouteData>;
    }
}

async function main() {
    const router = createAppRouter();
    const reactRoot = getReactRoot();
    router.registerProcessor(createReactRouteProcessor({reactRoot, renderComponent, renderError}));
    router.registerProcessor(createLoadingIndicatorRouteProcessor());
    window.router = router;
    await router.openRouteByPath(window.location.pathname + window.location.search);
}

function getReactRoot() {
    const rootElement = document.getElementById(APP_ID);
    if (!rootElement) {
        throw new Error(`Root element #${APP_ID} was not found`);
    }
    return createRoot(rootElement);
}

function renderComponent(component: ReactNode) {
    return <StrictMode>{component}</StrictMode>;
}

function renderError(error: Error) {
    return <ErrorTemplate error={error}/>;
}


main();