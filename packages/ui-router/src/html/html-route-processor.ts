import {RouteProcessor} from '../route-processor';
import {Router} from '../router';
import {HTMLRouteChunk} from './html-route-chunk';

interface HTMLRouteProcessorOptions {
    rootId: string;
}

export function createHTMLRouteProcessor({rootId}: HTMLRouteProcessorOptions): RouteProcessor<HTMLRouteChunk> {
    return {
        async process<P>(router: Router, {htmlElement, htmlText}: Partial<HTMLRouteChunk>): Promise<void> {
            if (typeof document === 'undefined') {
                return;
            }
            const rootElement = document.getElementById(rootId);
            if (!rootElement) {
                throw new Error(`Root element #${rootId} was not found`);
            }
            if (htmlElement) {
                while (rootElement.firstChild) {
                    rootElement.firstChild.remove();
                }
                rootElement.appendChild(htmlElement);
            }
            if (htmlText) {
                rootElement.innerHTML = htmlText;
            }
        }
    };
}
