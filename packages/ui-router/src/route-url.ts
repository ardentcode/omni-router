export interface RouteUrl {
    path: string;
    search: string;
    searchParams: Record<string, string>;
    hash: string;
    hashParams: Record<string, string>;
}