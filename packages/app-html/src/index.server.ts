import express, {Request, Response} from 'express';
import {APP_PORT, PUBLIC_PATH} from './server';

function main() {
    const app = express();

    app.use(express.static(PUBLIC_PATH));

    app.get('/', (request: Request, response: Response) => {
        response.send('Home');
    });

    app.get('/document/:id', (request: Request, response: Response) => {
        response.send(`Document #${request.params.id}`);
    });

    app.listen(APP_PORT, () => {
        console.log(`Application has started on http://localhost:${APP_PORT}/`);
    });
}

main();