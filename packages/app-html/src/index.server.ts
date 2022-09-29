import express, {Request, Response} from 'express';
import {ROOT_ID} from './common/config';
import {renderDocumentTemplate} from './modules/document/document-template';
import {renderHomeTemplate} from './modules/home/home-template';
import {APP_PORT, createHTMLRenderer, htmlTemplate, PUBLIC_PATH} from './server';

function main() {
    const app = express();
    const htmlRenderer = createHTMLRenderer({
        commonData: {
            ROOT_ID
        }
    });

    app.use(express.static(PUBLIC_PATH));

    // TODO: replace express routing with ui-router

    app.get('/', (request: Request, response: Response) => {
        const params = {};
        const content = htmlRenderer.renderHTML(htmlTemplate, {
            TITLE: 'Home',
            CONTENT: renderHomeTemplate(params)
        });
        response.send(content);
    });

    app.get('/document/:id', (request: Request, response: Response) => {
        const params = {id: request.params.id};
        const content = htmlRenderer.renderHTML(htmlTemplate, {
            TITLE: `Document ${params.id}`,
            CONTENT: renderDocumentTemplate(params)
        });
        response.send(content);
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();