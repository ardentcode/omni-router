import {createAppRouter} from './common';

function main() {
    const router = createAppRouter();
    router.openRoute('document', {id: '123'});
    router.openRoute('home');
}

main();
