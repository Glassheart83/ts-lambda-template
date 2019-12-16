import { ValidatorOptions } from 'class-validator';
import { Context } from 'aws-lambda';

export type BaseHandler = (event: any, options: LambdaOptions) => Promise<any>;
export type ValidatedHandler<E> = (event: E) => Promise<any>;

export type Request = {
    headers: object;
    executor: string;
};

export const defaultValidatorOptions = (): ValidatorOptions => ({
    validationError: {
        target: false
    },
    whitelist: true,
    skipMissingProperties: true
});

export class LambdaOptions {

    validation: ValidatorOptions;
    request: Request;

    constructor(event: any, context: Context) {
        this.validation = defaultValidatorOptions();
        this.request = {
            headers: event.headers,
            executor: context.functionName
        };
    }
}
