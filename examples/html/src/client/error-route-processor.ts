import {OpenRouteErrorEvent, RouteProcessor} from 'ui-router';
import {renderErrorTemplate} from '../common';

export interface ErrorRouteProcessorOptions {
    rootId: string;
}

export function createErrorRouteProcessor({rootId}: ErrorRouteProcessorOptions): RouteProcessor {

    const onOpenRouteError = ({error}: OpenRouteErrorEvent): void => {
        const rootElement = document.getElementById(rootId);
        if (rootElement) {
            rootElement.innerHTML = renderErrorTemplate({error: error as any});
        }
    };

    return {
        onOpenRouteError
    };

}