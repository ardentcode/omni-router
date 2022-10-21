import {OpenRouteSuccessEvent, RouteProcessor} from '../../route';
import {RedirectRouteData} from './redirect-route-data';
import {RedirectRouteProcessorOptions} from './redirect-route-processor';

export function createRedirectRouteProcessor({}: RedirectRouteProcessorOptions = {}): RouteProcessor<RedirectRouteData> {

    const onOpenRouteSuccess = async ({router, route}: OpenRouteSuccessEvent<RedirectRouteData>): Promise<void> => {
        if (!route.data.redirect) {
            return;
        }
        await router.openRouteByPath(route.data.redirect.path, {}, {
            replace: true
        });
    };

    return {
        onOpenRouteSuccess
    };

}