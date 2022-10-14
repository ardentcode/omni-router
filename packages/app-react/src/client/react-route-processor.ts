import {Root} from 'react-dom/client';
import {RouteProcessor} from 'ui-router';
import {ReactRouteData} from '../common/react-route-data';
import {OpenRouteErrorEvent} from 'ui-router/src';

export interface ReactRouteProcessorOptions {
    reactRoot: Root;
    renderErrorComponentFn: (error: unknown) => JSX.Element;
}

export function createReactRouteProcessor({
    reactRoot,
    renderErrorComponentFn
}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {
        async onOpenRouteSuccess({route}): Promise<void> {
            if (!route.data.component) {
                return;
            }

            reactRoot.render(route.data.component);
        },
        async onOpenRouteError({error}: OpenRouteErrorEvent): Promise<void> {
            reactRoot.render(renderErrorComponentFn({error}));
        }
    };
}
