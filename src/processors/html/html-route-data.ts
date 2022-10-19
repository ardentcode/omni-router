export interface HTMLRouteData<F extends string = string> {
    html: {
        content: string;
        fragments?: Record<F, string>;
    };
}
