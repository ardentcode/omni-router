import {GetRouteEndEvent, GetRouteStartEvent, OpenRouteAbortEvent, OpenRouteEndEvent, OpenRouteErrorEvent, OpenRouteStartEvent, OpenRouteSuccessEvent, RouteProcessor} from '../route';

export interface RouteProcessorRunner<D = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    runOnGetRouteStart: (event: GetRouteStartEvent) => Promise<void>;
    runOnGetRouteEnd: (event: GetRouteEndEvent) => Promise<void>;
    runOnOpenRouteStart: (event: OpenRouteStartEvent) => Promise<void>;
    runOnOpenRouteEnd: (event: OpenRouteEndEvent<D>) => Promise<void>;
    runOnOpenRouteSuccess: (event: OpenRouteSuccessEvent<D>) => Promise<void>;
    runOnOpenRouteError: (event: OpenRouteErrorEvent<D>) => Promise<void>;
    runOnOpenRouteAbort: (event: OpenRouteAbortEvent<D>) => Promise<void>;
}

export interface RouteProcessorRunnerOptions {

}

export function createRouteProcessorRunner({}: RouteProcessorRunnerOptions = {}): RouteProcessorRunner {

    const processors = new Set<RouteProcessor>();

    const registerProcessor = (processor: RouteProcessor): void => {
        processors.add(processor);
    };

    const runOnGetRouteStart = async <K extends keyof RouteProcessor>(event: GetRouteStartEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onGetRouteStart?.(event);
        }));
    };

    const runOnGetRouteEnd = async <K extends keyof RouteProcessor>(event: GetRouteEndEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onGetRouteEnd?.(event);
        }));
    };

    const runOnOpenRouteStart = async <K extends keyof RouteProcessor>(event: OpenRouteStartEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteStart?.(event);
        }));
    };

    const runOnOpenRouteEnd = async <K extends keyof RouteProcessor>(event: OpenRouteEndEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteEnd?.(event);
        }));
    };

    const runOnOpenRouteSuccess = async <K extends keyof RouteProcessor>(event: OpenRouteSuccessEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteSuccess?.(event);
        }));
    };

    const runOnOpenRouteError = async <K extends keyof RouteProcessor>(event: OpenRouteErrorEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteError?.(event);
        }));
    };

    const runOnOpenRouteAbort = async <K extends keyof RouteProcessor>(event: OpenRouteAbortEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteAbort?.(event);
        }));
    };

    return {
        registerProcessor,
        runOnGetRouteStart,
        runOnGetRouteEnd,
        runOnOpenRouteStart,
        runOnOpenRouteEnd,
        runOnOpenRouteSuccess,
        runOnOpenRouteError,
        runOnOpenRouteAbort
    };

}