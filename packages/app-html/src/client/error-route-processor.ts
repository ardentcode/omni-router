import {OpenRouteErrorEvent, RouteProcessor} from 'ui-router';
import {renderErrorModalTemplate} from '../common/error-modal-template';
import './loading-indicator-route-processor.css';

export interface ErrorRouteProcessorOptions {
    rootId: string;
}

export function createErrorRouteProcessor({rootId}: ErrorRouteProcessorOptions): RouteProcessor {

    const onOpenRouteError = ({error}: OpenRouteErrorEvent): void => {
        const rootElement = document.getElementById(rootId);
        if (rootElement) {
            rootElement.innerHTML = renderErrorModalTemplate({error: error as any});
        }
    };

    return {
        onOpenRouteError
    };

}