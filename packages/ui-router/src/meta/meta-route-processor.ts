import {RouteProcessor} from '../route-processor';
import {Router} from '../router';
import {HTMLRouteChunk} from '../html';

export function createMetaRouteProcessor(): RouteProcessor<HTMLRouteChunk> {
    return {
        async process<P>(router: Router, {meta}: Partial<HTMLRouteChunk>): Promise<void> {
            if (typeof document === 'undefined') {
                return;
            }
            if (meta) {
                if (meta.title) {
                    const titleElement = getTitleElement();
                    if (titleElement) {
                        titleElement.innerText = meta.title;
                    }
                }
                if (meta.description) {
                    setMetaData('description', meta.description);
                } else {
                    removeMetaData('description');
                }
                if (meta.keywords) {
                    setMetaData('keywords', meta.keywords);
                } else {
                    removeMetaData('keywords');
                }
                if (meta.author) {
                    setMetaData('author', meta.author);
                } else {
                    removeMetaData('author');
                }
            }
        }
    };
}

function getTitleElement(): HTMLElement | undefined {
    const headElement = getHeadElement();
    return Array.from(headElement.children).find(
        (child) => child.nodeName.toLowerCase() === 'title'
    ) as HTMLElement;
}

function setMetaData(metaName: string, metaContent: string): void {
    const headElement = getHeadElement();
    const foundMetaElement = Array.from(headElement.children).find(
        (child) =>
            child.getAttribute('name')?.toLowerCase() === metaName.toLowerCase()
    ) as HTMLElement;
    if (foundMetaElement) {
        foundMetaElement.setAttribute('content', metaContent);
    } else {
        const newMetaElement = document.createElement('meta');
        newMetaElement.setAttribute('name', metaName);
        newMetaElement.setAttribute('content', metaContent);
        headElement.appendChild(newMetaElement);
    }
}

function removeMetaData(metaName: string): void {
    const headElement = getHeadElement();
    const foundMetaElement = Array.from(headElement.children).find(
        (child) =>
            child.getAttribute('name')?.toLowerCase() === metaName.toLowerCase()
    ) as HTMLElement;
    if (foundMetaElement) {
        headElement.removeChild(foundMetaElement);
    }
}

function getHeadElement(): HTMLElement {
    return document.getElementsByTagName('head')[0];
}
