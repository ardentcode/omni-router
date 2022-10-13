import {Root} from 'react-dom/client';
import {OpenRouteErrorEvent, RouteProcessor} from 'ui-router';
import {renderErrorModalTemplate} from '../common/error-modal-template';
import './loading-indicator-route-processor.css';

export interface ErrorRouteProcessorOptions {
    reactRoot: Root;
}

export function createErrorRouteProcessor({reactRoot}: ErrorRouteProcessorOptions): RouteProcessor {

    const onOpenRouteError = ({error}: OpenRouteErrorEvent): void => {
        reactRoot.render(renderErrorModalTemplate({error: error as any}))
    };

    return {
        onOpenRouteError
    };

}
