import { InvocationResponse } from 'aws-sdk/clients/lambda';
import { invocationPayloadFactory, LambdaInvocationPayload } from './lambdaInvocationPayload';
import Lambda = require('aws-sdk/clients/lambda');

export enum InvocationType {
    Event = 'Event',
    RequestResponse = 'RequestResponse'
}

export class LambdaInvoker {

    lambda: Lambda;

    constructor(lambda?: Lambda) {
        if (!lambda) {
            lambda = new Lambda({
                apiVersion: '2015-03-31',
                region: process.env.AWS_REGION,
                endpoint: process.env.IS_OFFLINE ? process.env.LAMBDA_ENDPOINT : undefined
            });
        }
        this.lambda = lambda;
    }

    async invoke(functionName: string, request: any = {}, invocationType = InvocationType.RequestResponse): Promise<LambdaInvocationPayload> {

        const buildFunctionName = () => `${process.env.SERVICE_NAME}-${process.env.STAGE}-${functionName}`;
        const doInvocation = async (): Promise<LambdaInvocationPayload> => {
            try {

                const response: InvocationResponse = await this.lambda.invoke({
                    FunctionName: buildFunctionName(),
                    Payload: JSON.stringify(request),
                    InvocationType: invocationType
                }).promise();

                const json = JSON.parse(response.Payload.toString());
                return invocationPayloadFactory.fromJson(json);

            } catch (error) {
                const payload = invocationPayloadFactory.fromAWSError(error).notOk();
                this.throw(payload);
            }
        };

        const payload = await doInvocation();
        if (payload.isOK) {
            return payload;
        }
        this.throw(payload);
    }

    throw(payload: LambdaInvocationPayload): void {
        throw payload.error();
    }
}

export const lambdaInvoker = new LambdaInvoker();