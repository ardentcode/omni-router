import {RouteProcessor} from '../../route';
import {RedirectRouteData} from './redirect-route-data';

export interface RedirectRouteProcessorOptions {

}

export function createRedirectRouteProcessor({}: RedirectRouteProcessorOptions = {}): RouteProcessor<RedirectRouteData> {
    return {};
}