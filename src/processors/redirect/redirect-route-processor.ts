import {RouteProcessor} from '../../core';
import {RedirectRouteData} from './redirect-route-data';

export interface RedirectRouteProcessorOptions {

}

export function createRedirectRouteProcessor({}: RedirectRouteProcessorOptions = {}): RouteProcessor<RedirectRouteData> {
    return {};
}