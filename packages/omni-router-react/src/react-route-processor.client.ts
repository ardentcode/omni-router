import {OpenRouteErrorEvent, OpenRouteSuccessEvent, RouteProcessor} from '@ardentcode/omni-router';
import {ReactRouteData} from './react-route-data';
import {ReactRouteProcessorOptions} from './react-route-processor';

export function createReactRouteProcessor({reactRoot, renderComponent, renderError}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {

    const onOpenRouteSuccess = async ({route}: OpenRouteSuccessEvent<ReactRouteData>): Promise<void> => {
        if (!route.data.react?.component) {
            return;
        }
        const component = renderComponent ? renderComponent(route.data.react.component) : route.data.react.component;
        reactRoot.render(component);
    };

    const onOpenRouteError = async ({error}: OpenRouteErrorEvent): Promise<void> => {
        if (!renderError) {
            return;
        }
        const component = renderError(error);
        reactRoot.render(component);
    };

    return {
        onOpenRouteSuccess,
        onOpenRouteError
    };

}