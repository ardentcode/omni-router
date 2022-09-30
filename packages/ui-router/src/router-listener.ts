import {RouterEvent} from './router-event';

export type RouterListener<M = any> = (event: RouterEvent<M>) => void;