export const PATH_NOT_MATChING_ERROR_CODE = 'PATH_NOT_MATCHING';

export interface PathNotMatchingErrorDetails {
    pattern?: string;
    path?: string;
}

export class PathNotMatchingError extends Error {

    code = PATH_NOT_MATChING_ERROR_CODE;

    pattern: string;

    path: string;

    constructor(message: string, details: PathNotMatchingErrorDetails) {
        super(message);
        Object.assign(this, details);
    }

}