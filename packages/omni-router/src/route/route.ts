export interface Route<P = unknown, D = unknown> {
    name: string;
    params: P;
    path: string;
    data: Partial<D>;
}