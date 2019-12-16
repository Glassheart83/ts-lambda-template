import { ApplicationError } from 'common/errors/errors';

type HttpDecoratorResponse = {
    statusCode: number;
    body: string;
}

export const httpDecoratorErrorAdvice = (error: Error): HttpDecoratorResponse => {

    const buildResponse = (statusCode: number, body: object) => ({
        statusCode,
        body: JSON.stringify(body)
    });

    const withoutAdvice = (error: Error) => buildResponse(500, {
        code: error.name,
        message: error.message,
        stack: error.stack?.split(/\n/)
    });

    const withAdvice = (error: ApplicationError) => buildResponse(error.httpStatus, error);

    return 'code' in error ? withAdvice(error) : withoutAdvice(error);
};