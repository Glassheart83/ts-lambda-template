import { ValidatedHandler, HttpLambdaHandler, HttpHandler, httpEvent, InvocableLambdaHandler, InvocableHandler, defaultValidatorOptions } from './types';
import { httpDecoratorErrorAdvice } from './errorAdvice';
import { validate, ValidatorOptions } from 'class-validator';
import { FailedValidationError } from '@Common/errors/errors';
import { configureLogger, logger } from '@Common/logs/logger';
import { invocationPayloadFactory } from '@Common/lambda/lambdaInvocationPayload';

/**
 * Lambda function wrapper to manage reachability through http and error management.
 * @param fn inner function executed by the decorator that expose a wrapper object with path and query parameters.
 */
export const httpDecorator = (fn: HttpHandler): HttpLambdaHandler => {

    const handle: HttpLambdaHandler = async (event, context) => {

        configureLogger(context.awsRequestId, context.functionName);

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

/**
 * Lambda function wrapper to manage reachability through lambda invocation.
 * @param fn inner function executed by the decorator that expose the event object.
 */
export const invocationDecorator = (fn: InvocableHandler): InvocableLambdaHandler => {

    const handle: InvocableLambdaHandler = async (event, context) => {

        configureLogger(context.awsRequestId, context.functionName);

        try {
            const result = await fn(event);
            return invocationPayloadFactory.create(result, context).ok();
        } catch (error) {
            return invocationPayloadFactory.create(error, context).notOk();
        }
    };

    return (event = {}, context) => handle(event, context);
};

/**
 * Decorator used to execute object validation with class-validator specifications.
 * @param event the object to be validated (needs to be an instance of a class).
 * @param fn inner function executed if the object has been validated.
 * @param validatorOptions object with options for class-validator. It has a default, can be reconfigured.
 */
export const validationDecorator = async <E>(
    event: E, 
    fn: ValidatedHandler<E>,
    validatorOptions: ValidatorOptions = defaultValidatorOptions()
) => {

    const validationErrors = await validate(event, validatorOptions);
    if (validationErrors.length > 0) {
        const executor = logger.config.functionName;
        throw new FailedValidationError(`Error occurred while validating in ${executor}`, validationErrors);
    }
    return fn(event);
};
