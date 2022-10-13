import {APP_ID} from '../common';
import {createRoot} from 'react-dom/client';

export function getReactRoot() {
    const rootElement = document.getElementById(APP_ID);
    if (!rootElement) {
        throw new Error(`Root element #${APP_ID} was not found`);
    }
    return createRoot(rootElement!);
}
