import {RouteProcessor} from '../../route';
import {MetaRouteData} from './meta-route-data';

export interface MetaRouteProcessorOptions {
    defaults?: Record<string, string>;
    modifier?: (name: string, content: string) => string;
}

export function createMetaRouteProcessor({}: MetaRouteProcessorOptions = {}): RouteProcessor<MetaRouteData> {
    return {};
}