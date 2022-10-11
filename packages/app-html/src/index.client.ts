import './style.css';
import {createClientRouter} from 'ui-router';
import {initAppRouter} from './common';
import {LoadingIndicator} from './common/loading-indicator';

async function main() {
    const loadingIndicator = new LoadingIndicator();
    const router = initAppRouter(createClientRouter(), loadingIndicator);
    await router.openRouteByPath(window.location.pathname + window.location.search);
    // @ts-ignore
    window.router = router; // for debugging purpose - to be removed?
}

main();
