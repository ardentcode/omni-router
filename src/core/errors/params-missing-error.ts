export const PARAMS_MISSING_ERROR_CODE = 'PARAMS_MISSING';

export interface ParamsMissingErrorDetails {
    path?: string;
    missingParams?: string[];
}

export class ParamsMissingError extends Error {

    code = PARAMS_MISSING_ERROR_CODE;

    path: string;

    missingParams: string[];

    constructor(message: string, details: ParamsMissingErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}