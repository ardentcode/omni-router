import {createRouteDeclarationRepository} from '../utils';
import {createRouteDeclarationMock} from './mocks';

describe('getRouteDeclarations', () => {

    it('returns empty array if there is no registered routes', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const routes = routeDeclarationRepository.getRouteDeclarations();
        expect(routes).toEqual([]);
    });

    it('returns registered routes', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        routeDeclarationRepository.registerRouteDeclaration(homeRouteDeclaration);
        routeDeclarationRepository.registerRouteDeclaration(postRouteDeclaration);
        const routes = routeDeclarationRepository.getRouteDeclarations();
        expect(routes).toEqual([homeRouteDeclaration, postRouteDeclaration]);
    });

});

describe('getRouteDeclarationByName', () => {

    it('returns correct route', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        routeDeclarationRepository.registerRouteDeclaration(homeRouteDeclaration);
        routeDeclarationRepository.registerRouteDeclaration(postRouteDeclaration);
        const route = routeDeclarationRepository.getRouteDeclarationByName('post');
        expect(route).toEqual(postRouteDeclaration);
    });

    it('returns null if route is not registered', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        routeDeclarationRepository.registerRouteDeclaration(homeRouteDeclaration);
        routeDeclarationRepository.registerRouteDeclaration(postRouteDeclaration);
        const route = routeDeclarationRepository.getRouteDeclarationByName('not-found');
        expect(route).toBeNull();
    });

});

describe('getRouteDeclarationByPath', () => {

    it('returns correct route', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        routeDeclarationRepository.registerRouteDeclaration(homeRouteDeclaration);
        routeDeclarationRepository.registerRouteDeclaration(postRouteDeclaration);
        const route = routeDeclarationRepository.getRouteDeclarationByPath('/post/10');
        expect(route).toEqual(postRouteDeclaration);
    });

    it('returns null if route is not registered', () => {
        const routeDeclarationRepository = createRouteDeclarationRepository();
        const homeRouteDeclaration = createRouteDeclarationMock('home', '/');
        const postRouteDeclaration = createRouteDeclarationMock('post', '/post/:id');
        routeDeclarationRepository.registerRouteDeclaration(homeRouteDeclaration);
        routeDeclarationRepository.registerRouteDeclaration(postRouteDeclaration);
        const route = routeDeclarationRepository.getRouteDeclarationByPath('/not-found');
        expect(route).toBeNull();
    });

});