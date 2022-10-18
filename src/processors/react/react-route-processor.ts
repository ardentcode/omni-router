import {ReactNode} from 'react';
import {Root} from 'react-dom/client';
import {RouteProcessor} from '../../core';
import {ReactRouteData} from './react-route-data';

export interface ReactRouteProcessorOptions {
    reactRoot: Root;
    renderComponent?: (component: ReactNode) => ReactNode;
    renderError?: (error: unknown) => ReactNode;
}

export function createReactRouteProcessor({}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {};
}
