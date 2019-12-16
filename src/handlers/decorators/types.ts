import { ValidatorOptions } from 'class-validator';
import { Context, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';

export type ParsedBodyEvent = {
    parse: () => object;
};
export type HttpEvent = Readonly<ParsedBodyEvent & APIGatewayProxyEvent>;

export type HttpLambdaHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;
export type HttpHandler = (event: HttpEvent) => Promise<APIGatewayProxyResult>;

export type InvocableLambdaHandler = (event: any, context: Context) => Promise<any>;
export type InvocableHandler = (event: any) => Promise<any>;

export type ValidatedHandler<E> = (event: E) => Promise<any>;

export const httpEvent = (event: APIGatewayProxyEvent): HttpEvent => ({
    ...event,
    parse: () => JSON.parse(event.body)
});

export const defaultValidatorOptions = (): ValidatorOptions => ({
    validationError: {
        target: false
    },
    whitelist: true,
    skipMissingProperties: true
});
