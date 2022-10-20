import {RouteProcessor} from '../../route';
import {HTMLRouteData} from './html-route-data';

export interface HTMLRouteProcessorOptions {
    rootId: string;
    fragmentsIds?: Record<string, string>;
    renderHTML?: (html: string) => string;
    renderError?: (error: unknown) => string;
}

export function createHTMLRouteProcessor({}: HTMLRouteProcessorOptions): RouteProcessor<HTMLRouteData> {
    return {};
}
