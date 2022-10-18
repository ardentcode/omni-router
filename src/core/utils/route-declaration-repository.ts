import {RouteDeclaration} from '../route';

export interface RouteDeclarationRepository {
    registerRouteDeclaration: <P = unknown, D = unknown>(declaration: RouteDeclaration<P, D>) => void;
    getRouteDeclarations: <P = unknown, D = unknown>() => RouteDeclaration<P, D>[];
    getRouteDeclarationByName: <P = unknown, D = unknown>(name: string) => RouteDeclaration<P, D> | null;
    getRouteDeclarationByPath: <P = unknown, D = unknown>(path: string) => RouteDeclaration<P, D> | null;
}

export interface RouteDeclarationRepositoryOptions {

}

export function createRouteDeclarationRepository({}: RouteDeclarationRepositoryOptions = {}): RouteDeclarationRepository {

    const declarations = new Map<string, RouteDeclaration>();

    const getRouteDeclarations = <P = unknown, D = unknown>(): RouteDeclaration<P, D>[] => {
        return Array.from(declarations.values());
    };

    const registerRouteDeclaration = <P = unknown, D = unknown>(declaration: RouteDeclaration<P, D>): void => {
        declarations.set(declaration.name, declaration);
    };

    const getRouteDeclarationByName = <P = unknown, D = unknown>(name: string): RouteDeclaration<P, D> | null => {
        return declarations.get(name) ?? null;
    };

    const getRouteDeclarationByPath = <P = unknown, D = unknown>(path: string): RouteDeclaration<P, D> | null => {
        return Array.from(declarations.values()).find((declaration: RouteDeclaration): boolean => {
            const urlPattern = new URLPattern({pathname: declaration.path});
            return urlPattern.test({pathname: path.split('?')[0]});
        }) ?? null;
    };

    return {
        registerRouteDeclaration,
        getRouteDeclarations,
        getRouteDeclarationByName,
        getRouteDeclarationByPath
    };

}