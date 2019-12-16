import { ErrorCode } from './errorCodes';
import { HttpStatus } from './httpStatus';
import { ValidationError } from 'class-validator';

export class ApplicationError extends Error {

    message: string;
    code: ErrorCode;
    httpStatus: HttpStatus;

    constructor(
        message: string,
        code: ErrorCode = ErrorCode.GENERIC_ERROR,
        httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR
    ) {
        super();
        this.message = message;
        this.code = code;
        this.httpStatus = httpStatus;
    }

    toJSON() {
        return { ...this, httpStatus: undefined };
    }
}

export class LambdaInvocationError extends ApplicationError {

    error: ApplicationError;

    constructor(message: string, error: ApplicationError) {
        super(message, ErrorCode.INVOCATION_ERROR);
        this.error = error;
    }
}

export class FailedValidationError extends ApplicationError {

    errors: ValidationError[];

    constructor(message: string, errors: ValidationError[]) {
        super(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST);
        this.errors = errors;
    }
}