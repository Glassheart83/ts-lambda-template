import { LambdaInvocationError, ApplicationError } from 'common/errors/errors';
import { AWSError } from 'aws-sdk/lib/error';
import { Context } from 'aws-lambda';

export class LambdaInvocationPayload {

    requestId: string;
    functionName: string;
    result: any;
    isOK: boolean;

    constructor(fields: Partial<LambdaInvocationPayload>) {
        Object.assign(this, fields);
    }

    error(): LambdaInvocationError {
        const error = this.result as ApplicationError;
        return new LambdaInvocationError(error.message, error);
    }

    ok(): LambdaInvocationPayload {
        this.isOK = true;
        return this;
    }

    notOk(): LambdaInvocationPayload {
        this.isOK = false;
        return this;
    }
}

export const invocationPayloadFactory = {
    create: (result: any, context: Context) => new LambdaInvocationPayload({
        result,
        requestId: context.awsRequestId,
        functionName: context.functionName
    }),
    fromJson: (json: any) => new LambdaInvocationPayload({ ...json }),
    fromAWSError: (error: AWSError) => new LambdaInvocationPayload({
        result: error,
        requestId: error.requestId,
        functionName: '' // TODO Add function name
    })
};
