import {RouteProcessor} from '../../core';
import {ReactRouteData} from './react-route-data';
import {ReactRouteProcessorOptions} from './react-route-processor';

export function createReactRouteProcessor({reactRoot, renderComponent, renderError}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {
        async onOpenRouteSuccess({route}): Promise<void> {
            if (!route.data.react?.component) {
                return;
            }
            const component = renderComponent ? renderComponent(route.data.react.component) : route.data.react.component;
            reactRoot.render(component);
        },
        async onOpenRouteError({error}): Promise<void> {
            if (!renderError) {
                return;
            }
            const component = renderError(error);
            reactRoot.render(component);
        }
    };
}