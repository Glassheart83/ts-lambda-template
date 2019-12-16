import { Context } from 'aws-lambda';
import { BaseHandler, LambdaOptions, ValidatedHandler } from './types';
import { httpDecoratorErrorAdvice } from './errorAdvice';
import { validate } from 'class-validator';
import { FailedValidationError } from 'common/errors/errors';
import { invocationPayloadFactory } from 'common/lambda/lambdaInvocationPayload';

export const httpDecorator = (fn: BaseHandler) => {

    const handle = async (event: any, context: Context) => {
        try {
            const parsedEvent = JSON.parse(event.body);
            const options = new LambdaOptions(event, context);
            const body = await fn(parsedEvent, options);
            return {
                statusCode: 200,
                body: JSON.stringify(body)
            };
        } catch (error) {
            return httpDecoratorErrorAdvice(error);
        }
    };

    return (event: any = {}, context: Context) => handle(event, context);
};

export const invocationDecorator = (fn: BaseHandler) => {

    const handle = async (event: any, context: Context) => {
        const options = new LambdaOptions(event, context);
        try {
            const result = await fn(event, options);
            return invocationPayloadFactory.create(result, context).ok();
        } catch (error) {
            return invocationPayloadFactory.create(error, context).notOk();
        }
    };

    return (event: any = {}, context: Context) => handle(event, context);
};

export const validationDecorator = async <E>(event: E, options: LambdaOptions, handler: ValidatedHandler<E>) => {

    const validationErrors = await validate(event, options.validation);
    if (validationErrors.length > 0) {
        throw new FailedValidationError(`Error occurred while validating in ${options.request.executor}`, validationErrors);
    }
    return handler(event);
};