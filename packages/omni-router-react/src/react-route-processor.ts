import {RouteProcessor} from '@ardentcode/omni-router';
import {ReactNode} from 'react';
import {Root} from 'react-dom/client';
import {ReactRouteData} from './react-route-data';

export interface ReactRouteProcessorOptions {
    reactRoot: Root;
    renderComponent?: (node: ReactNode) => ReactNode;
    renderError?: (error: unknown) => ReactNode;
}

export function createReactRouteProcessor({}: ReactRouteProcessorOptions): RouteProcessor<ReactRouteData> {
    return {};
}
