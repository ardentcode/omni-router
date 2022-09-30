import {createClientRouter} from 'ui-router';
import {initAppRouter} from './common';

function main() {
    const router = initAppRouter(
        createClientRouter({
            path: window.location.pathname
        })
    );
    // @ts-ignore
    window.router = router;
}

main();