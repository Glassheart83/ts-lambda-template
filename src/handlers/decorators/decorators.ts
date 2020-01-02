import { ValidatedHandler, HttpLambdaHandler, HttpHandler, httpEvent, InvocableLambdaHandler, InvocableHandler, defaultValidatorOptions } from './types';
import { httpDecoratorErrorAdvice } from './errorAdvice';
import { validate, ValidatorOptions } from 'class-validator';
import { FailedValidationError } from '@Common/errors/errors';
import { loggerProvider, logger } from '@Common/logs/logger';
import { invocationPayloadFactory } from '@Common/lambda/lambdaInvocationPayload';

export const httpDecorator = (fn: HttpHandler): HttpLambdaHandler => {

    const handle: HttpLambdaHandler = async (event, context) => {

        loggerProvider().provide(context.awsRequestId, context.functionName);

        try {
            const body = await fn(httpEvent(event));
            return {
                statusCode: 200,
                body: JSON.stringify(body)
            };
        } catch (error) {
            return httpDecoratorErrorAdvice(error);
        }
    };

    return (event, context) => handle(event, context);
};

export const invocationDecorator = (fn: InvocableHandler): InvocableLambdaHandler => {

    const handle: InvocableLambdaHandler = async (event, context) => {

        loggerProvider().provide(context.awsRequestId, context.functionName);

        try {
            const result = await fn(event);
            return invocationPayloadFactory.create(result, context).ok();
        } catch (error) {
            return invocationPayloadFactory.create(error, context).notOk();
        }
    };

    return (event = {}, context) => handle(event, context);
};

export const validationDecorator = async <E>(
    event: E, 
    fn: ValidatedHandler<E>,
    validatorOptions: ValidatorOptions = defaultValidatorOptions()
) => {

    const validationErrors = await validate(event, validatorOptions);
    if (validationErrors.length > 0) {
        const executor = logger.functionName;
        throw new FailedValidationError(`Error occurred while validating in ${executor}`, validationErrors);
    }
    return fn(event);
};
