export interface HandlerNotFoundErrorDetails {
    name?: string;
}

export class HandlerNotFoundError extends Error {

    name: string;

    constructor(message: string, details: HandlerNotFoundErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}