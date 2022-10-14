import {Root} from 'react-dom/client';
import {RouteProcessor} from 'ui-router';
import {ReactRouteData} from '../common/react-route-data';

interface ReactRouteProcessorOptions {
    reactRoot: Root;
}

export function createReactRouteProcessor({reactRoot}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {
        async onOpenRouteSuccess({route}): Promise<void> {
            if (!route.data.component) {
                return;
            }

            reactRoot.render(route.data.component);
        }
    };
}
