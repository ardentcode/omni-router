import {RouteDeclaration} from '../types';

export interface RouteDeclarationRepository {
    registerRouteDeclaration: (declaration: RouteDeclaration) => void;
    getRouteDeclarationByName: (name: string) => RouteDeclaration | null;
    getRouteDeclarationByPath: (path: string) => RouteDeclaration | null;
}

export interface RouteDeclarationRepositoryOptions {

}

export function createRouteDeclarationRepository({}: RouteDeclarationRepositoryOptions = {}): RouteDeclarationRepository {

    const declarations = new Map<string, RouteDeclaration>();

    const registerRouteDeclaration = (declaration: RouteDeclaration): void => {
        declarations.set(declaration.name, declaration);
    };

    const getRouteDeclarationByName = (name: string): RouteDeclaration | null => {
        return declarations.get(name) ?? null;
    };

    const getRouteDeclarationByPath = (path: string): RouteDeclaration | null => {
        return Array.from(declarations.values()).find((declaration: RouteDeclaration): boolean => {
            const urlPattern = new URLPattern({pathname: declaration.path});
            return urlPattern.test({pathname: path.split('?')[0]});
        }) ?? null;
    };

    return {
        registerRouteDeclaration,
        getRouteDeclarationByName,
        getRouteDeclarationByPath
    };

}