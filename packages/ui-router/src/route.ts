export interface Route<M = any, N extends keyof M = keyof M> {
    name: N | null;
    params: M[N];
    path: string;
    data: any;
}