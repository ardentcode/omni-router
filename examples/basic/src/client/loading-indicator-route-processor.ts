import {OpenRouteStartEvent, RouteProcessor, Router} from '@ardentcode/omni-router';
import './loading-indicator-route-processor.css';

export function createLoadingIndicatorRouteProcessor(): RouteProcessor {

    let element: HTMLElement;

    const onOpenRouteStart = ({router}: OpenRouteStartEvent): void => {
        if (!isInitialRender(router)) {
            element?.remove();
            element = createElement();
        }
    };

    const onOpenRouteEnd = (): void => {
        element?.remove();
    };

    const createElement = (): HTMLElement => {
        const element = document.createElement('div');
        element.className = 'loading-indicator';
        document.body.appendChild(element);
        return element;
    };

    const isInitialRender = (router: Router): boolean => {
        try {
            router.getCurrentRoute();
            return false;
        } catch {
            return true;
        }
    };

    return {
        onOpenRouteStart,
        onOpenRouteEnd
    };

}