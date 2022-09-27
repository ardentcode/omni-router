import {RouteChunk} from './route-chunk';
import {Router} from './router';

export interface RouteProcessor<C extends RouteChunk = RouteChunk> {
    process?: (router: Router, chunk: Partial<C>) => void | Promise<void>;
}