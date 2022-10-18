import {createRouteProcessorRunner} from '../utils';
import {createProcessorMock} from './mocks';

describe('runOnGetRouteStart', () => {

    it('runs onGetRouteStart method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnGetRouteStart(event);
        expect(processorMock.onGetRouteStart).toBeCalledWith(event);
    });

});

describe('runOnGetRouteEnd', () => {

    it('runs onGetRouteEnd method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnGetRouteEnd(event);
        expect(processorMock.onGetRouteEnd).toBeCalledWith(event);
    });

});

describe('runOnOpenRouteStart', () => {

    it('runs onOpenRouteStart method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnOpenRouteStart(event);
        expect(processorMock.onOpenRouteStart).toBeCalledWith(event);
    });

});

describe('runOnOpenRouteEnd', () => {

    it('runs onOpenRouteEnd method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnOpenRouteEnd(event);
        expect(processorMock.onOpenRouteEnd).toBeCalledWith(event);
    });

});

describe('runOnOpenRouteSuccess', () => {

    it('runs onOpenRouteSuccess method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnOpenRouteSuccess(event);
        expect(processorMock.onOpenRouteSuccess).toBeCalledWith(event);
    });

});

describe('runOnOpenRouteError', () => {

    it('runs onOpenRouteError method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnOpenRouteError(event);
        expect(processorMock.onOpenRouteError).toBeCalledWith(event);
    });

});

describe('runOnOpenRouteAbort', () => {

    it('runs onOpenRouteAbort method on registered processors', async () => {
        const routeProcessorRunner = createRouteProcessorRunner();
        const processorMock = createProcessorMock();
        const event = {} as any;
        routeProcessorRunner.registerProcessor(processorMock);
        await routeProcessorRunner.runOnOpenRouteAbort(event);
        expect(processorMock.onOpenRouteAbort).toBeCalledWith(event);
    });

});