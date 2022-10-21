import {OpenRouteErrorEvent, OpenRouteSuccessEvent, RouteProcessor} from '../../route';
import {HTMLRouteData} from './html-route-data';
import {HTMLRouteProcessorOptions} from './html-route-processor';

export function createHTMLRouteProcessor({rootId, fragmentsIds, renderHTML, renderError}: HTMLRouteProcessorOptions): RouteProcessor<HTMLRouteData> {

    const onOpenRouteSuccess = async ({route}: OpenRouteSuccessEvent<HTMLRouteData>): Promise<void> => {
        if (!route.data.html) {
            return;
        }
        const rootElement = getRootElement();
        rootElement.innerHTML = renderHTML ? renderHTML(route.data.html.content) : route.data.html.content;
        Object.entries(fragmentsIds ?? {}).forEach(([fragmentName, fragmentId]) => {
            getFragmentElement(fragmentId).innerHTML = route.data.html?.fragments?.[fragmentName] ?? '';
        });
    };

    const onOpenRouteError = async ({error}: OpenRouteErrorEvent): Promise<void> => {
        if (!renderError) {
            return;
        }
        const rootElement = getRootElement();
        rootElement.innerHTML = renderError(error);
        Object.entries(fragmentsIds ?? {}).forEach(([_fragmentName, fragmentId]) => {
            getFragmentElement(fragmentId).innerHTML = '';
        });
    };

    const getRootElement = (): HTMLElement => {
        const rootElement = document.getElementById(rootId);
        if (!rootElement) {
            throw new Error(`Root element #${rootId} was not found`);
        }
        return rootElement;
    };

    const getFragmentElement = (fragmentId: string): HTMLElement => {
        const fragmentElement = document.getElementById(fragmentId);
        if (!fragmentElement) {
            throw new Error(`Fragment element #${fragmentId} was not found`);
        }
        return fragmentElement;
    };

    return {
        onOpenRouteSuccess,
        onOpenRouteError
    };

}
