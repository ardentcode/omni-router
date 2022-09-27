export type RouteIdentity<M = any, N extends keyof M = keyof M> = {} extends M[N] ? {
    name: N;
    params?: void | {};
} : {
    name: N;
    params: M[N];
};