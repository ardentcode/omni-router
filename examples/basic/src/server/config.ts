import {join} from 'path';

export const APP_PORT = parseInt(process.env.APP_PORT || '') || 3000;
export const PUBLIC_PATH = join(__dirname, 'public');