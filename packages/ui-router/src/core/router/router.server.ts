// @ts-ignore
import {createRouter as createBaseRouter, Router, RouterOptions} from './router.ts';

export interface ServerRouterOptions extends RouterOptions {

}

export function createRouter<M = any, D = any>({...options}: ServerRouterOptions = {}): Router<M, D> {
    return createBaseRouter<M>(options);
}
