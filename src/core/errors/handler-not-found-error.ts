export const HANDLER_NOT_FOUND_ERROR_CODE = 'HANDLER_NOT_FOUND';

export interface HandlerNotFoundErrorDetails {
    name?: string;
}

export class HandlerNotFoundError extends Error {

    code = HANDLER_NOT_FOUND_ERROR_CODE;

    name: string;

    constructor(message: string, details: HandlerNotFoundErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}