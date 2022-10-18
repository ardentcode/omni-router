import {describe, expect, it} from '@jest/globals';
import {ParamsMissingError, PathNotMatchingError} from '../errors';
import {createPathParser} from '../utils';

describe('extractParamsNames', () => {

    it('returns empty array if there is no parameters', () => {
        const pathParser = createPathParser();
        const noParams = pathParser.extractParamsNames('/');
        expect(noParams).toEqual([]);
    });

    it('returns correct named parameters', () => {
        const pathParser = createPathParser();
        const oneParam = pathParser.extractParamsNames('/one/:one');
        const twoParams = pathParser.extractParamsNames('/one/:one/two/:two');
        expect(oneParam).toEqual(['one']);
        expect(twoParams).toEqual(['one', 'two']);
    });

    it('returns correct wildcard parameters', () => {
        const pathParser = createPathParser();
        const oneParam = pathParser.extractParamsNames('/one/*');
        const twoParams = pathParser.extractParamsNames('/one/*/two/*');
        expect(oneParam).toEqual(['0']);
        expect(twoParams).toEqual(['0', '1']);
    });

});

describe('extractParamsFromPath', () => {

    it('returns empty object if there is no parameters', () => {
        const pathParser = createPathParser();
        const noParams = pathParser.extractParamsFromPath('/', '/');
        expect(noParams).toEqual({});
    });

    it('returns correct named parameters', () => {
        const pathParser = createPathParser();
        const oneParam = pathParser.extractParamsFromPath('/one/:one', '/one/1');
        const twoParams = pathParser.extractParamsFromPath('/one/:one/two/:two', '/one/1/two/2');
        expect(oneParam).toEqual({one: '1'});
        expect(twoParams).toEqual({one: '1', two: '2'});
    });

    it('returns correct wildcard parameters', () => {
        const pathParser = createPathParser();
        const oneParam = pathParser.extractParamsFromPath('/one/*', '/one/1');
        const twoParams = pathParser.extractParamsFromPath('/one/*/two/*', '/one/1/two/2');
        expect(oneParam).toEqual({0: '1'});
        expect(twoParams).toEqual({0: '1', 1: '2'});
    });

    it('throws error if path does not match the pattern', () => {
        const pathParser = createPathParser();
        expect(() => {
            pathParser.extractParamsFromPath('/one/*', '/two/2');
        }).toThrow(PathNotMatchingError);
    });

});

describe('buildPathWithParams', () => {

    it('returns same path in no parameters are provided', () => {
        const pathParser = createPathParser();
        const pathWithNoParams = pathParser.buildPathWithParams('/', {});
        expect(pathWithNoParams).toEqual('/');
    });

    it('correctly injects named parameters to the path', () => {
        const pathParser = createPathParser();
        const pathWithOneParam = pathParser.buildPathWithParams('/one/:one', {one: '1'});
        const pathWithTwoParams = pathParser.buildPathWithParams('/one/:one/two/:two', {one: '1', two: '2'});
        expect(pathWithOneParam).toEqual('/one/1');
        expect(pathWithTwoParams).toEqual('/one/1/two/2');
    });

    it('correctly injects wildcard parameters to the path', () => {
        const pathParser = createPathParser();
        const pathWithOneParam = pathParser.buildPathWithParams('/one/*', {0: '1'});
        const pathWithTwoParams = pathParser.buildPathWithParams('/one/*/two/*', {0: '1', 1: '2'});
        expect(pathWithOneParam).toEqual('/one/1');
        expect(pathWithTwoParams).toEqual('/one/1/two/2');
    });

    it('correctly injects query parameters to the path', () => {
        const pathParser = createPathParser();
        const pathWithQueryParam = pathParser.buildPathWithParams('/one/:one', {one: '1', two: '2'});
        const pathWithQueryParams = pathParser.buildPathWithParams('/one/:one', {one: '1', two: '2', three: '3'});
        expect(pathWithQueryParam).toEqual('/one/1?two=2');
        expect(pathWithQueryParams).toEqual('/one/1?two=2&three=3');
    });

    it('throws error if parameter is missing', () => {
        const pathParser = createPathParser();
        expect(() => {
            pathParser.buildPathWithParams('/one/:one', {});
        }).toThrow(ParamsMissingError);
    });

});