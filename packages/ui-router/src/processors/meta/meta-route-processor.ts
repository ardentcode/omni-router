import {RouteProcessor} from '../../types';
import {MetaRouteData} from './meta-route-data';

interface MetaRouteProcessorOptions {

}

export function createMetaRouteProcessor({}: MetaRouteProcessorOptions = {}): RouteProcessor<MetaRouteData> {
    return {
        async onOpenRouteEnd({route}): Promise<void> {
            if (typeof document === 'undefined') {
                return;
            }
            if (route.data.meta) {
                document.title = route.data.meta.title ?? '';
                setMetaData('description', route.data.meta.description);
                setMetaData('keywords', route.data.meta.keywords);
                setMetaData('author', route.data.meta.author);
            }
        }
    };
}

function setMetaData(metaName: string, metaContent: string | undefined): void {
    const metaElement = document.querySelector(`meta[name="${metaName}"]`);
    if (metaElement) {
        if (metaContent) {
            metaElement.setAttribute('content', metaContent);
        } else {
            metaElement.remove();
        }
    } else if (metaContent) {
        const newMetaElement = document.createElement('meta');
        newMetaElement.setAttribute('name', metaName);
        newMetaElement.setAttribute('content', metaContent);
        document.head.appendChild(newMetaElement);
    }
}