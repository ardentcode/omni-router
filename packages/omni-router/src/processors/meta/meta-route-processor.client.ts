import {OpenRouteSuccessEvent, RouteProcessor} from '../../route';
import {MetaRouteData} from './meta-route-data';
import {MetaRouteProcessorOptions} from './meta-route-processor';

export function createMetaRouteProcessor({defaults, modifier}: MetaRouteProcessorOptions = {}): RouteProcessor<MetaRouteData> {

    const onOpenRouteSuccess = async ({route}: OpenRouteSuccessEvent<MetaRouteData>): Promise<void> => {
        clearMetaData();
        if (route.data.meta) {
            Object.entries(route.data.meta).forEach(([name, content]: [string, string]) => {
                setMetaData(name, modifier ? modifier(name, content) : content);
            });
        }
        if (defaults) {
            Object.entries(defaults).forEach(([name, content]: [string, string]) => {
                if (!route.data.meta || !route.data.meta[name]) {
                    setMetaData(name, content);
                }
            });
        }
    };

    const clearMetaData = (): void => {
        document.title = '';
        Array.from(document.querySelectorAll('meta[name]')).forEach(element => {
            element.remove();
        });
    };

    const setMetaData = (name: string, content: string): void => {
        if (name === 'title') {
            document.title = content ?? '';
            return;
        }
        const metaElement = document.querySelector(`meta[name="${name}"]`);
        if (metaElement) {
            metaElement.setAttribute('content', content);
        } else {
            const newMetaElement = document.createElement('meta');
            newMetaElement.setAttribute('name', name);
            newMetaElement.setAttribute('content', content);
            document.head.appendChild(newMetaElement);
        }
    };

    return {
        onOpenRouteSuccess
    };

}