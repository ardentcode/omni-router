import {RouteProcessor} from '../route-processor';
import {Router} from '../router';
import {MetaRouteChunk} from './meta-route-chunk';

interface MetaRouteProcessorOptions {
    
}

export function createMetaRouteProcessor({}: MetaRouteProcessorOptions): RouteProcessor<MetaRouteChunk> {
    return {
        async process<P>(router: Router, {meta}: Partial<MetaRouteChunk>): Promise<void> {
            // TODO
        }
    };
}