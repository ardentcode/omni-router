import {Router} from 'ui-router';
import {AppRoutes} from './app-router';
import {INFO_ID} from './config';
import './header-template.css';

export interface HeaderTemplateParams {
    router: Router<AppRoutes>;
    info?: string;
}

export function renderHeaderTemplate({router, info}: HeaderTemplateParams): string {
    return `
        <div class="header">
            <div class="logo">
                <a href="${router.getRouteByName('home')}">&#128206; UI Router</a>
            </div>
            <nav class="menu">
                <a href="${router.getRouteByName('books')}">&#128216; Books</a>
            </nav>      
            <div class="info" id="${INFO_ID}">
                ${info}
            </div>
        </div> 
    `;
}
