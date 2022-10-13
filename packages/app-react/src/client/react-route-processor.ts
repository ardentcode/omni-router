import {Root} from 'react-dom/client';
import {RouteProcessor} from 'ui-router';
import {ReactRouteData} from '../common/react-route-data';

interface ReactRouteProcessorOptions {
    reactRoot: Root;
    fragmentsIds?: Record<string, string>;
}

export function createReactRouteProcessor({reactRoot, fragmentsIds}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {
        async onOpenRouteSuccess({route}): Promise<void> {
            if (!route.data.component) {
                return;
            }

            reactRoot.render(route.data.component);

            Object.entries(fragmentsIds ?? {}).forEach(([fragmentName, fragmentId]) => {
                const fragmentElement = document.getElementById(fragmentId);
                if (!fragmentElement) {
                    throw new Error(`Fragment element #${fragmentId} was not found`);
                }
                fragmentElement.innerHTML = route.data?.fragments?.[fragmentName] ?? '';
            });
        }
    };
}
