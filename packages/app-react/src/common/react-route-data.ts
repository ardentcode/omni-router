export interface ReactRouteData<F extends string = string> {
    component: JSX.Element;
    fragments?: Record<F, string>;
}
