import {OpenRouteStartEvent, RouteProcessor} from 'ui-router';
import './loading-indicator-route-processor.css';

export function createLoadingIndicatorRouteProcessor(): RouteProcessor {

    const createElement = (): HTMLElement => {
        const element = document.createElement('div');
        element.className = 'loading-indicator';
        element.style.display = 'none';
        document.body.appendChild(element);
        return element;
    };

    const element: HTMLElement = createElement();

    const onOpenRouteStart = ({router}: OpenRouteStartEvent): void => {
        try {
            router.getCurrentRoute();
            element.style.display = 'inline-block';
        } catch {
        }
    };

    const onOpenRouteEnd = (): void => {
        element.style.display = 'none';
    };

    return {
        onOpenRouteStart,
        onOpenRouteEnd
    };

}