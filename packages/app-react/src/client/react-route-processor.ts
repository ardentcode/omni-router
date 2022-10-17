import {Root} from 'react-dom/client';
import {OpenRouteErrorEvent, RouteProcessor} from 'ui-router';
import {ReactRouteData} from '../common';

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
