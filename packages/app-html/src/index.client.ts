import './style.css';
import {createClientRouter} from 'ui-router';
import {initAppRouter} from './common';
import {LoadingIndicator} from './common/loading-indicator';

function main() {
    const loadingIndicator = new LoadingIndicator();
    const router = initAppRouter(
        createClientRouter({
            path: window.location.pathname
        }), loadingIndicator
    );
    // @ts-ignore
    window.router = router; // for debugging purpose - to be removed?
}

main();
