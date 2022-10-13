import {OpenRouteEndEvent, OpenRouteStartEvent, RouteProcessor} from '../types';
import {GetRouteEndEvent} from '../types/get-route-end-event';
import {GetRouteStartEvent} from '../types/get-route-start-event';
import {OpenRouteRedirectEvent} from '../types/open-route-redirect-event';

export interface RouteProcessorRunner<D = any> {
    registerProcessor: (processor: RouteProcessor) => void;
    runOnGetRouteStart: (event: GetRouteStartEvent) => Promise<void>;
    runOnGetRouteEnd: (event: GetRouteEndEvent) => Promise<void>;
    runOnOpenRouteStart: (event: OpenRouteStartEvent) => Promise<void>;
    runOnOpenRouteEnd: (event: OpenRouteEndEvent<D>) => Promise<void>;
    runOnOpenRouteRedirect: (event: OpenRouteRedirectEvent<D>) => Promise<void>;
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

    const runOnOpenRouteRedirect = async <K extends keyof RouteProcessor>(event: OpenRouteRedirectEvent): Promise<void> => {
        await Promise.all(Array.from(processors).map((processor) => {
            return processor.onOpenRouteRedirect?.(event);
        }));
    };

    return {
        registerProcessor,
        runOnGetRouteStart,
        runOnGetRouteEnd,
        runOnOpenRouteStart,
        runOnOpenRouteEnd,
        runOnOpenRouteRedirect
    };

}