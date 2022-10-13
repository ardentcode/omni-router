export interface ParamsMissingErrorDetails {
    path?: string;
    missingParams?: string[];
}

export class ParamsMissingError extends Error {

    path: string;

    missingParams: string[];

    constructor(message: string, details: ParamsMissingErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}