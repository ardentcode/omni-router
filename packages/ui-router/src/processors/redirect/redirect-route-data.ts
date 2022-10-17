export interface RedirectRouteData<M = any, N extends keyof M & string = keyof M & string> {
    redirect: {
        path?: string;
        name?: void;
        params?: M[N];
    } | {
        path?: void;
        name?: N;
        params?: M[N];
    };
}