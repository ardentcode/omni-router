import {RouteProcessor} from '../../core';
import {HTMLRouteData} from './html-route-data';

export interface HTMLRouteProcessorOptions {
    rootId: string;
    fragmentsIds?: Record<string, string>;
}

export function createHTMLRouteProcessor({}: HTMLRouteProcessorOptions): RouteProcessor<HTMLRouteData> {
    return {};
}
