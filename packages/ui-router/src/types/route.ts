export interface Route<P = any, D = any> {
    name: string;
    params: P;
    path: string;
    data: D;
}