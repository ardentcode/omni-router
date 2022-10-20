import {Router} from '@ardentcode/omni-router';
import {AppRoutes} from './app-router';
import './header-template.css';

export interface HeaderTemplateProps {
    router: Router<AppRoutes>;
}

export function HeaderTemplate({router}: HeaderTemplateProps): JSX.Element {
    return (
        <div className="header">
            <div className="logo">
                <a href={router.getRouteByName('home').path}>&#128206; Omni Router</a>
            </div>
            <nav className="menu">
                <a href={router.getRouteByName('books').path}>&#128216; Books</a>
            </nav>
        </div>
    );
}
