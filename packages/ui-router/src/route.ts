export interface Route<M = any, N extends keyof M = keyof M> {
    name: N;
    params: M[N];
    path: string;
}