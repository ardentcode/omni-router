import {RouteProcessor} from '../../core';
import {HTMLRouteData} from './html-route-data';
import {HTMLRouteProcessorOptions} from './html-route-processor';

export function createHTMLRouteProcessor({rootId, fragmentsIds}: HTMLRouteProcessorOptions): RouteProcessor<HTMLRouteData> {
    return {
        async onOpenRouteSuccess({route}): Promise<void> {
            if (!route.data.html) {
                return;
            }
            const rootElement = document.getElementById(rootId);
            if (!rootElement) {
                throw new Error(`Root element #${rootId} was not found`);
            }
            rootElement.innerHTML = route.data.html.content;
            Object.entries(fragmentsIds ?? {}).forEach(([fragmentName, fragmentId]) => {
                const fragmentElement = document.getElementById(fragmentId);
                if (!fragmentElement) {
                    throw new Error(`Fragment element #${fragmentId} was not found`);
                }
                fragmentElement.innerHTML = route.data.html?.fragments?.[fragmentName] ?? '';
            });
        }
    };
}
